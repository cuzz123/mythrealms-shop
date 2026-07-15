from __future__ import annotations

import math
import os
import sys
import traceback
from pathlib import Path

import bpy
from mathutils import Matrix, Vector


ROOT = Path(__file__).resolve().parents[2]
CHAR_DIR = (
    ROOT
    / "video-pipeline"
    / "asset-library"
    / "05-characters"
    / "CHAR_MAKEHUMAN_FEMALE_BASE_001"
)
SOURCE = CHAR_DIR / "Preview.blend"
MASTER_RIG = (
    ROOT
    / "video-pipeline"
    / "asset-library"
    / "05-characters"
    / "CHAR_HUMAN_MASTER_RIG_001"
    / "HumanMasterRig.blend"
)
OUTPUT = CHAR_DIR / "MakeHuman_JewelryMotionValidation_v1.blend"
BODY_NAME = "MH_FemaleBody"
HAIR_NAME = "MH_LongHair"
RIG_SOURCE_NAME = "HumanMasterRig"
RIG_NAME = "HumanMasterRig_Fitted"
ACTION_NAME = "ACT_JEWELRY_TOUCH_EARRING_LEFT_001"
ANCHOR_NAME = "ANCHOR_MH_EAR_LEFT"
CAMERA_NAME = "CAM_VALIDATION_MH_TOUCH_EARRING_LEFT"
FOCUS_NAME = "FOCUS_VALIDATION_MH_TOUCH_EARRING_LEFT"

def remove_object(name):
    obj = bpy.data.objects.get(name)
    if obj is not None:
        bpy.data.objects.remove(obj, do_unlink=True)


def append_master_rig():
    remove_object(RIG_NAME)
    with bpy.data.libraries.load(str(MASTER_RIG), link=False) as (source, target):
        if RIG_SOURCE_NAME not in source.objects:
            raise RuntimeError(f"Missing {RIG_SOURCE_NAME} in {MASTER_RIG}")
        target.objects = [RIG_SOURCE_NAME]
    rig = target.objects[0]
    rig.name = RIG_NAME
    rig.data.name = f"{RIG_NAME}_DATA"
    bpy.context.scene.collection.objects.link(rig)
    rig.animation_data_clear()
    rig["source_rig_id"] = "CHAR_HUMAN_MASTER_RIG_001"
    rig["fit_target"] = "CHAR_MAKEHUMAN_FEMALE_BASE_001"
    return rig


def set_edit_bone(edit_bones, name, head, tail):
    bone = edit_bones[name]
    bone.head = head
    bone.tail = tail


def fit_armature_to_makehuman(rig):
    bpy.ops.object.select_all(action="DESELECT")
    rig.select_set(True)
    bpy.context.view_layer.objects.active = rig
    bpy.ops.object.mode_set(mode="EDIT")
    bones = rig.data.edit_bones
    for side, sign in (("L", 1.0), ("R", -1.0)):
        clavicle_head = (0.0, 0.0, 1.420)
        shoulder = (0.180 * sign, -0.005, 1.420)
        elbow = (0.350 * sign, -0.015, 1.230)
        wrist = (0.490 * sign, -0.080, 1.050)
        hand_tip = (0.540 * sign, -0.200, 0.980)
        set_edit_bone(bones, f"clavicle.{side}", clavicle_head, shoulder)
        set_edit_bone(bones, f"upperarm.{side}", shoulder, elbow)
        set_edit_bone(bones, f"lowerarm.{side}", elbow, wrist)
        set_edit_bone(bones, f"hand.{side}", wrist, hand_tip)
        set_edit_bone(bones, f"CTRL_hand_ik.{side}", wrist, hand_tip)
        pole_head = (elbow[0], -0.415, elbow[2])
        pole_tail = (elbow[0], -0.415, elbow[2] + 0.120)
        set_edit_bone(bones, f"CTRL_elbow_pole.{side}", pole_head, pole_tail)

    for bone in bones:
        if any(
            token in bone.name
            for token in ("thumb_", "index_", "middle_", "ring_", "pinky_", "jaw", "eye.")
        ):
            bone.use_deform = False
    bpy.ops.object.mode_set(mode="OBJECT")

    for side in ("L", "R"):
        constraint = next(
            item
            for item in rig.pose.bones[f"lowerarm.{side}"].constraints
            if item.type == "IK"
        )
        constraint.chain_count = 2
        constraint.use_stretch = False
        constraint.pole_angle = math.radians(90.0 if side == "L" else -90.0)


def reset_pose(rig):
    for bone in rig.pose.bones:
        bone.rotation_mode = "XYZ"
        bone.location = (0.0, 0.0, 0.0)
        bone.rotation_euler = (0.0, 0.0, 0.0)
        bone.scale = (1.0, 1.0, 1.0)


def bind_mesh_automatically(mesh, rig):
    for modifier in list(mesh.modifiers):
        if modifier.type == "ARMATURE":
            mesh.modifiers.remove(modifier)
    while mesh.vertex_groups:
        mesh.vertex_groups.remove(mesh.vertex_groups[0])
    mesh_world = mesh.matrix_world.copy()
    mesh.parent = None
    mesh.matrix_world = mesh_world
    bpy.ops.object.select_all(action="DESELECT")
    mesh.select_set(True)
    rig.select_set(True)
    bpy.context.view_layer.objects.active = rig
    bpy.ops.object.parent_set(type="ARMATURE_AUTO")
    required = {"upperarm.L", "lowerarm.L", "hand.L"}
    populated = {
        group.name
        for group in mesh.vertex_groups
        if any(
            element.group == group.index and element.weight > 0.01
            for vertex in mesh.data.vertices
            for element in vertex.groups
        )
    }
    missing = required - populated
    if missing:
        raise RuntimeError(f"Automatic weights missing required groups: {sorted(missing)}")


def bind_hair_to_head(hair, rig):
    for modifier in list(hair.modifiers):
        if modifier.type == "ARMATURE":
            hair.modifiers.remove(modifier)
    while hair.vertex_groups:
        hair.vertex_groups.remove(hair.vertex_groups[0])
    group = hair.vertex_groups.new(name="head")
    group.add(range(len(hair.data.vertices)), 1.0, "REPLACE")
    modifier = hair.modifiers.new("MH_HAIR_HEAD_BIND", "ARMATURE")
    modifier.object = rig
    hair.parent = rig


def create_empty(name, location, display_type="SPHERE", size=0.025):
    remove_object(name)
    empty = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(empty)
    empty.location = location
    empty.empty_display_type = display_type
    empty.empty_display_size = size
    empty.hide_render = True
    return empty


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


def remove_pose_constraints(rig):
    for bone in rig.pose.bones:
        for constraint in list(bone.constraints):
            bone.constraints.remove(constraint)


def interpolate_pose(frame):
    progress = max(0.0, min(1.0, (frame - 1) / (58 - 1)))
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
            (0.490, -0.080, 1.050),
            (0.505, -0.150, 1.175),
            (0.335, -0.220, 1.400),
            (0.190, -0.145, 1.430),
        )
    )
    elbow_hint = cubic_bezier(
        (
            (0.350, -0.015, 1.230),
            (0.405, -0.050, 1.280),
            (0.430, -0.105, 1.325),
            (0.390, -0.090, 1.310),
        )
    )
    return {
        "elbow": tuple(elbow_hint),
        "wrist": tuple(wrist),
        "head_y": math.radians(1.8) * progress,
    }


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


def solve_fk_points(rig, anchor, pose):
    shoulder = rig.data.bones["upperarm.L"].head_local.copy()
    upper_length = rig.data.bones["upperarm.L"].length
    lower_length = rig.data.bones["lowerarm.L"].length
    hand_length = rig.data.bones["hand.L"].length
    elbow_hint = Vector(pose["elbow"])
    wrist = Vector(pose["wrist"])
    shoulder_to_wrist = wrist - shoulder
    reach = shoulder_to_wrist.length
    if not abs(upper_length - lower_length) < reach < upper_length + lower_length:
        raise RuntimeError(
            f"Unreachable wrist target {tuple(round(v, 4) for v in wrist)}"
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
        raise RuntimeError("Elbow hint is collinear with the shoulder-wrist axis")
    elbow = circle_center + hint_direction.normalized() * radius
    hand_target = Vector(anchor.location)
    hand_tip = wrist + (hand_target - wrist).normalized() * hand_length
    return shoulder, elbow, wrist, hand_tip


def verify_fk_playback(rig, anchor):
    scene = bpy.context.scene
    worst = (0.0, None, None, None)
    for frame in range(1, 73):
        scene.frame_set(frame)
        bpy.context.view_layer.update()
        _, expected_elbow, expected_wrist, _ = solve_fk_points(
            rig, anchor, interpolate_pose(frame)
        )
        actual_elbow = rig.pose.bones["lowerarm.L"].head.copy()
        actual_wrist = rig.pose.bones["hand.L"].head.copy()
        error = max(
            (actual_elbow - expected_elbow).length,
            (actual_wrist - expected_wrist).length,
        )
        if error > worst[0]:
            worst = (error, frame, actual_wrist.copy(), expected_wrist.copy())
    if worst[0] > 0.001:
        raise RuntimeError(
            "FK playback diverges from authored joints: "
            f"frame={worst[1]} error={worst[0]:.4f} "
            f"actual_wrist={tuple(round(v, 4) for v in worst[2])} "
            f"expected_wrist={tuple(round(v, 4) for v in worst[3])}"
        )


def create_fk_release_action(rig, anchor):
    old = bpy.data.actions.get(ACTION_NAME)
    if old:
        bpy.data.actions.remove(old)
    action = bpy.data.actions.new(ACTION_NAME)
    action["name_zh"] = "\u5de6\u624b\u8f7b\u89e6\u5de6\u8033\u9970"
    action["validation_character_id"] = "CHAR_MAKEHUMAN_FEMALE_BASE_001"
    action["source_motion_id"] = ACTION_NAME
    action["anatomy_validation"] = "shoulder_elbow_wrist_v1"
    action["paired_camera_id"] = "CAM_JEWELRY_EARRING_TOUCH_LEFT_ARC_85MM_001"
    action["status"] = "prototype_validation"
    rig.animation_data_create()
    rig.animation_data.action = action
    reset_pose(rig)

    scene = bpy.context.scene
    for frame in range(1, 73):
        scene.frame_set(frame)
        pose = interpolate_pose(frame)
        shoulder, elbow, wrist, hand_tip = solve_fk_points(rig, anchor, pose)

        upperarm = orient_pose_bone(rig, "upperarm.L", shoulder, elbow - shoulder)
        bpy.context.view_layer.update()
        key_pose_bone(upperarm, frame)
        lowerarm = orient_pose_bone(rig, "lowerarm.L", elbow, wrist - elbow)
        bpy.context.view_layer.update()
        key_pose_bone(lowerarm, frame)
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
        action.asset_data.description = "Anatomically validated left-ear touch motion."
    except (AttributeError, RuntimeError):
        pass
    return action


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
    data.dof.aperture_fstop = 3.5
    focus = create_empty(FOCUS_NAME, (0.08, -0.04, 1.46), size=0.02)
    data.dof.focus_object = focus
    key_camera(camera, 1, (0.72, -2.15, 1.42), (0.08, -0.02, 1.38), 70.0)
    key_camera(camera, 72, (0.64, -2.05, 1.45), (0.08, -0.02, 1.44), 74.0)
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
    body = bpy.data.objects[BODY_NAME]
    hair = bpy.data.objects[HAIR_NAME]
    rig = append_master_rig()
    fit_armature_to_makehuman(rig)
    reset_pose(rig)
    bpy.context.view_layer.update()
    bind_mesh_automatically(body, rig)
    bind_hair_to_head(hair, rig)

    anchor = create_empty(ANCHOR_NAME, (0.085, -0.070, 1.550), size=0.018)
    remove_pose_constraints(rig)
    release_action = create_fk_release_action(rig, anchor)
    rig.animation_data.action = release_action
    camera = create_camera()
    configure_scene(camera)
    bpy.context.scene.frame_set(1)
    bpy.ops.wm.save_as_mainfile(filepath=str(OUTPUT))
    print(f"MAKEHUMAN_JEWELRY_VALIDATION_BLEND_CREATED={OUTPUT}")


if __name__ == "__main__":
    try:
        main()
    except Exception:
        traceback.print_exc()
        sys.stderr.flush()
        os._exit(1)
