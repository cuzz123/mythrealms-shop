from __future__ import annotations

import math
import os
import sys
import traceback
from pathlib import Path

import bmesh
import bpy
from mathutils import Matrix, Vector


ROOT = Path(__file__).resolve().parents[2]
CHAR_DIR = (
    ROOT
    / "video-pipeline"
    / "asset-library"
    / "05-characters"
    / "CHAR_HUNYUAN_RIGHT2_GOLD_001"
)
SOURCE = CHAR_DIR / "RIGHT2_GOLD_RIGGED_UPPER_BODY_v1.blend"
OUTPUT = CHAR_DIR / "RIGHT2_GOLD_JEWELRY_MOTION_CAGE_v1.blend"
RIG_NAME = "RIG_RIGHT2_GOLD_UPPER_BODY"
SOURCE_MESH_NAME = "node_0"
CAGE_NAME = "RIGHT2_GOLD_DEFORMATION_CAGE"
ACTION_NAME = "ACT_JEWELRY_TOUCH_EARRING_LEFT_001"
ANCHOR_NAME = "ANCHOR_RIGHT2_EAR_LEFT"
CAMERA_NAME = "CAM_VALIDATION_RIGHT2_CAGE_TOUCH_EARRING_LEFT"
FOCUS_NAME = "FOCUS_VALIDATION_RIGHT2_CAGE_TOUCH_EARRING_LEFT"
SURFACE_MODIFIER_NAME = "RIGHT2_GOLD_CAGE_SURFACE_DEFORM"


def remove_object(name):
    obj = bpy.data.objects.get(name)
    if obj is not None:
        bpy.data.objects.remove(obj, do_unlink=True)


def make_active(obj):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj


def apply_object_rotation(source):
    source_world = source.matrix_world.copy()
    source.parent = None
    source.matrix_world = source_world
    make_active(source)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)


def reset_pose(rig):
    rig.animation_data_clear()
    for bone in rig.pose.bones:
        for constraint in list(bone.constraints):
            bone.constraints.remove(constraint)
        bone.rotation_mode = "XYZ"
        bone.location = (0.0, 0.0, 0.0)
        bone.rotation_euler = (0.0, 0.0, 0.0)
        bone.scale = (1.0, 1.0, 1.0)


def remove_source_deformers(source):
    for modifier in list(source.modifiers):
        if modifier.type in {"ARMATURE", "SURFACE_DEFORM", "MESH_DEFORM"}:
            source.modifiers.remove(modifier)


def transfer_source_weights(source, cage):
    for group in source.vertex_groups:
        cage.vertex_groups.new(name=group.name)

    modifier = cage.modifiers.new("RIGHT2_GOLD_TRANSFER_SOURCE_WEIGHTS", "DATA_TRANSFER")
    modifier.object = source
    modifier.use_vert_data = True
    modifier.data_types_verts = {"VGROUP_WEIGHTS"}
    modifier.vert_mapping = "POLYINTERP_NEAREST"
    modifier.layers_vgroup_select_src = "ALL"
    modifier.layers_vgroup_select_dst = "NAME"
    make_active(cage)
    bpy.ops.object.modifier_apply(modifier=modifier.name)


def create_voxel_cage(source, rig):
    remove_object(CAGE_NAME)
    cage = source.copy()
    cage.data = source.data.copy()
    cage.name = CAGE_NAME
    cage.data.name = f"{CAGE_NAME}_MESH"
    bpy.context.scene.collection.objects.link(cage)
    cage.animation_data_clear()
    cage.parent = None
    cage.matrix_world = source.matrix_world.copy()
    for modifier in list(cage.modifiers):
        cage.modifiers.remove(modifier)
    while cage.vertex_groups:
        cage.vertex_groups.remove(cage.vertex_groups[0])
    cage.data.materials.clear()

    make_active(cage)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    cage.data.remesh_voxel_size = 0.016
    cage.data.remesh_voxel_adaptivity = 0.0
    bpy.ops.object.voxel_remesh()
    if len(cage.data.vertices) < 1_000:
        raise RuntimeError("Voxel cage is unexpectedly sparse")
    edit_mesh = bmesh.new()
    edit_mesh.from_mesh(cage.data)
    bmesh.ops.triangulate(edit_mesh, faces=list(edit_mesh.faces))
    edit_mesh.to_mesh(cage.data)
    edit_mesh.free()
    cage.data.update()

    transfer_source_weights(source, cage)
    cage.parent = rig
    cage.matrix_parent_inverse = rig.matrix_world.inverted()
    armature_modifier = cage.modifiers.new(
        "RIGHT2_GOLD_CAGE_ARMATURE", "ARMATURE"
    )
    armature_modifier.object = rig
    armature_modifier.use_vertex_groups = True
    armature_modifier.use_deform_preserve_volume = True

    required = {"upper_arm.L", "forearm.L", "hand.L"}
    available = {group.name for group in cage.vertex_groups}
    missing = required - available
    if missing:
        raise RuntimeError(f"Cage is missing arm groups: {sorted(missing)}")

    cage.display_type = "WIRE"
    cage.hide_render = True
    cage.show_in_front = True
    cage["deformation_cage_for"] = "CHAR_HUNYUAN_RIGHT2_GOLD_001"
    cage["render_visible"] = False
    cage["weight_source"] = "transferred_from_validated_RIGHT2_groups"
    return cage


def bind_source_to_cage(source, cage):
    modifier = source.modifiers.new(SURFACE_MODIFIER_NAME, "SURFACE_DEFORM")
    modifier.target = cage
    modifier.falloff = 4.0
    make_active(source)
    bpy.ops.object.surfacedeform_bind(modifier=modifier.name)
    if not modifier.is_bound:
        raise RuntimeError("Surface Deform failed to bind RIGHT2 to its cage")
    source.hide_render = False
    source["source_character_id"] = "CHAR_HUNYUAN_RIGHT2_GOLD_001"
    source["deformation_mode"] = "hidden_cage_surface_deform_v1"
    return modifier


def iter_action_fcurves(action):
    if hasattr(action, "fcurves"):
        yield from action.fcurves
        return
    for layer in action.layers:
        for strip in layer.strips:
            for slot in action.slots:
                channelbag = strip.channelbag(slot, ensure=False)
                if channelbag:
                    yield from channelbag.fcurves


def set_curve_interpolation(action, interpolation):
    for curve in iter_action_fcurves(action):
        for point in curve.keyframe_points:
            point.interpolation = interpolation
            if interpolation == "BEZIER":
                point.handle_left_type = "AUTO_CLAMPED"
                point.handle_right_type = "AUTO_CLAMPED"


def interpolate_pose(frame):
    progress = max(0.0, min(1.0, (frame - 1) / (64 - 1)))
    progress = progress * progress * (3.0 - 2.0 * progress)

    def cubic_bezier(points):
        p0, p1, p2, p3 = (Vector(point) for point in points)
        inverse = 1.0 - progress
        return (
            p0 * inverse**3
            + p1 * 3.0 * inverse * inverse * progress
            + p2 * 3.0 * inverse * progress * progress
            + p3 * progress**3
        )

    wrist = cubic_bezier(
        (
            (0.154, 0.000, 0.440),
            (0.195, -0.050, 0.555),
            (0.270, -0.150, 0.790),
            (0.190, -0.120, 0.880),
        )
    )
    elbow_hint = cubic_bezier(
        (
            (0.145, 0.000, 0.620),
            (0.245, -0.050, 0.680),
            (0.330, -0.130, 0.775),
            (0.300, -0.100, 0.790),
        )
    )
    return {
        "elbow": tuple(elbow_hint),
        "wrist": tuple(wrist),
        "head_y": math.radians(1.5) * progress,
    }


def solve_fk_points(rig, anchor, pose):
    shoulder = rig.data.bones["upper_arm.L"].head_local.copy()
    upper_length = rig.data.bones["upper_arm.L"].length
    lower_length = rig.data.bones["forearm.L"].length
    hand_length = rig.data.bones["hand.L"].length
    elbow_hint = Vector(pose["elbow"])
    wrist = Vector(pose["wrist"])
    shoulder_to_wrist = wrist - shoulder
    reach = shoulder_to_wrist.length
    if not abs(upper_length - lower_length) < reach < upper_length + lower_length:
        raise RuntimeError(
            f"Unreachable RIGHT2 wrist target {tuple(round(v, 4) for v in wrist)}"
        )
    axis = shoulder_to_wrist.normalized()
    along = (
        upper_length * upper_length
        - lower_length * lower_length
        + reach * reach
    ) / (2.0 * reach)
    radius = math.sqrt(max(upper_length * upper_length - along * along, 0.0))
    circle_center = shoulder + axis * along
    hint_direction = elbow_hint - circle_center
    hint_direction -= axis * hint_direction.dot(axis)
    if hint_direction.length < 1e-6:
        raise RuntimeError("RIGHT2 elbow hint is collinear with the arm axis")
    elbow = circle_center + hint_direction.normalized() * radius
    hand_target = Vector(anchor.location)
    hand_tip = wrist + (hand_target - wrist).normalized() * hand_length
    return shoulder, elbow, wrist, hand_tip


def orient_pose_bone(rig, bone_name, head, direction):
    bone = rig.pose.bones[bone_name]
    bone.rotation_mode = "QUATERNION"
    rotation = Vector(direction).normalized().to_track_quat("Y", "Z")
    bone.matrix = Matrix.LocRotScale(
        Vector(head), rotation, Vector((1.0, 1.0, 1.0))
    )
    return bone


def key_pose_bone(bone, frame):
    bone.keyframe_insert(data_path="location", frame=frame, group=bone.name)
    bone.keyframe_insert(
        data_path="rotation_quaternion", frame=frame, group=bone.name
    )
    bone.keyframe_insert(data_path="scale", frame=frame, group=bone.name)


def verify_fk_playback(rig, anchor):
    scene = bpy.context.scene
    worst = (0.0, None)
    for frame in range(1, 73):
        scene.frame_set(frame)
        bpy.context.view_layer.update()
        _, expected_elbow, expected_wrist, _ = solve_fk_points(
            rig, anchor, interpolate_pose(frame)
        )
        actual_elbow = rig.pose.bones["forearm.L"].head.copy()
        actual_wrist = rig.pose.bones["hand.L"].head.copy()
        error = max(
            (actual_elbow - expected_elbow).length,
            (actual_wrist - expected_wrist).length,
        )
        if error > worst[0]:
            worst = (error, frame)
    if worst[0] > 0.001:
        raise RuntimeError(
            f"RIGHT2 FK playback diverges at frame {worst[1]} by {worst[0]:.4f} m"
        )


def create_release_action(rig, anchor):
    old = bpy.data.actions.get(ACTION_NAME)
    if old:
        bpy.data.actions.remove(old)
    action = bpy.data.actions.new(ACTION_NAME)
    action["name_zh"] = "\u5de6\u624b\u8f7b\u89e6\u5de6\u8033\u9970"
    action["validation_character_id"] = "CHAR_HUNYUAN_RIGHT2_GOLD_001"
    action["source_motion_id"] = ACTION_NAME
    action["anatomy_validation"] = "shoulder_elbow_wrist_v1"
    action["deformation_mode"] = "hidden_cage_surface_deform_v1"
    action["paired_camera_id"] = "CAM_JEWELRY_EARRING_TOUCH_LEFT_ARC_85MM_001"
    action["status"] = "prototype_validation"
    rig.animation_data_create()
    rig.animation_data.action = action

    scene = bpy.context.scene
    for frame in range(1, 73):
        scene.frame_set(frame)
        pose = interpolate_pose(frame)
        shoulder, elbow, wrist, hand_tip = solve_fk_points(rig, anchor, pose)
        upperarm = orient_pose_bone(rig, "upper_arm.L", shoulder, elbow - shoulder)
        bpy.context.view_layer.update()
        key_pose_bone(upperarm, frame)
        forearm = orient_pose_bone(rig, "forearm.L", elbow, wrist - elbow)
        bpy.context.view_layer.update()
        key_pose_bone(forearm, frame)
        hand = orient_pose_bone(rig, "hand.L", wrist, hand_tip - wrist)
        bpy.context.view_layer.update()
        key_pose_bone(hand, frame)

        head = rig.pose.bones["head"]
        head.rotation_mode = "XYZ"
        head.rotation_euler = (0.0, pose["head_y"], 0.0)
        head.keyframe_insert(data_path="rotation_euler", frame=frame, group="head")

    set_curve_interpolation(action, "LINEAR")
    verify_fk_playback(rig, anchor)
    try:
        action.asset_mark()
        action.asset_data.description = (
            "RIGHT2 original Hunyuan mesh driven by a hidden anatomical cage."
        )
    except (AttributeError, RuntimeError):
        pass
    return action


def create_empty(name, location, size=0.018):
    remove_object(name)
    empty = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(empty)
    empty.location = location
    empty.empty_display_type = "SPHERE"
    empty.empty_display_size = size
    empty.hide_render = True
    return empty


def key_camera(camera, frame, location, target, lens):
    location = Vector(location)
    target = Vector(target)
    camera.matrix_world = Matrix.LocRotScale(
        location,
        (target - location).to_track_quat("-Z", "Y").to_euler(),
        Vector((1.0, 1.0, 1.0)),
    )
    camera.keyframe_insert(data_path="location", frame=frame)
    camera.keyframe_insert(data_path="rotation_euler", frame=frame)
    camera.data.lens = lens
    camera.data.keyframe_insert(data_path="lens", frame=frame)


def create_camera():
    remove_object(CAMERA_NAME)
    remove_object(FOCUS_NAME)
    data = bpy.data.cameras.new(f"{CAMERA_NAME}_DATA")
    camera = bpy.data.objects.new(CAMERA_NAME, data)
    bpy.context.scene.collection.objects.link(camera)
    camera.rotation_mode = "XYZ"
    data.sensor_width = 36.0
    data.dof.use_dof = True
    data.dof.aperture_fstop = 3.8
    data.dof.aperture_blades = 9
    focus = create_empty(FOCUS_NAME, (0.06, -0.015, 0.91), size=0.015)
    data.dof.focus_object = focus
    key_camera(camera, 1, (0.42, -2.00, 0.82), (0.05, 0.0, 0.75), 58.0)
    key_camera(camera, 72, (0.38, -1.95, 0.85), (0.06, 0.0, 0.82), 62.0)
    for animated_id in (camera, data):
        set_curve_interpolation(animated_id.animation_data.action, "BEZIER")
    return camera


def configure_scene(camera):
    scene = bpy.context.scene
    scene.camera = camera
    scene.frame_start = 1
    scene.frame_end = 72
    scene.render.fps = 24
    scene.render.resolution_x = 1280
    scene.render.resolution_y = 720
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.film_transparent = False
    try:
        scene.render.engine = "BLENDER_EEVEE_NEXT"
    except TypeError:
        pass


def main():
    bpy.ops.wm.open_mainfile(filepath=str(SOURCE))
    source = bpy.data.objects[SOURCE_MESH_NAME]
    rig = bpy.data.objects[RIG_NAME]
    reset_pose(rig)
    bpy.context.view_layer.update()
    remove_source_deformers(source)
    apply_object_rotation(source)
    cage = create_voxel_cage(source, rig)
    bind_source_to_cage(source, cage)
    anchor = create_empty(ANCHOR_NAME, (0.105, -0.045, 0.985))
    action = create_release_action(rig, anchor)
    rig.animation_data.action = action
    camera = create_camera()
    configure_scene(camera)
    bpy.context.scene.frame_set(1)
    bpy.ops.wm.save_as_mainfile(filepath=str(OUTPUT))
    print(f"RIGHT2_CAGE_JEWELRY_BLEND_CREATED={OUTPUT}")


if __name__ == "__main__":
    try:
        main()
    except Exception:
        traceback.print_exc()
        sys.stderr.flush()
        os._exit(1)
