from __future__ import annotations

import math
import os
import sys
import traceback
from pathlib import Path

import bpy
from mathutils import Euler, Matrix, Vector


ROOT = Path(__file__).resolve().parents[2]
CHAR_DIR = (
    ROOT
    / "video-pipeline"
    / "asset-library"
    / "05-characters"
    / "CHAR_HUNYUAN_RIGHT2_GOLD_001"
)
SOURCE = CHAR_DIR / "RIGHT2_GOLD_RIGGED_UPPER_BODY_v1.blend"
OUTPUT = CHAR_DIR / "RIGHT2_GOLD_JEWELRY_MOTION_VALIDATION_v1.blend"
RIG_NAME = "RIG_RIGHT2_GOLD_UPPER_BODY"
ACTION_NAME = "ACT_JEWELRY_TOUCH_EARRING_LEFT_001"
AUTHOR_ACTION_NAME = "TMP_AUTHOR_TOUCH_EARRING_LEFT"
ANCHOR_NAME = "ANCHOR_RIGHT2_EAR_LEFT"
TARGET_NAME = "TMP_RIGHT2_LEFT_WRIST_TARGET"
POLE_NAME = "TMP_RIGHT2_LEFT_ELBOW_POLE"
CAMERA_NAME = "CAM_VALIDATION_JEWELRY_TOUCH_EARRING_LEFT"
FOCUS_NAME = "FOCUS_VALIDATION_JEWELRY_TOUCH_EARRING_LEFT"

BONE_ORDER = (
    "root",
    "pelvis",
    "spine_01",
    "spine_02",
    "chest",
    "neck",
    "head",
    "clavicle.L",
    "upper_arm.L",
    "forearm.L",
    "hand.L",
    "clavicle.R",
    "upper_arm.R",
    "forearm.R",
    "hand.R",
)

BEATS = {
    1: {
        "wrist": (0.154, 0.000, 0.440),
        "pole": (0.430, -0.330, 0.650),
        "head_y": 0.0,
    },
    12: {
        "wrist": (0.154, 0.000, 0.440),
        "pole": (0.430, -0.330, 0.650),
        "head_y": 0.0,
    },
    24: {
        "wrist": (0.195, -0.055, 0.555),
        "pole": (0.480, -0.340, 0.700),
        "head_y": math.radians(0.5),
    },
    36: {
        "wrist": (0.285, -0.105, 0.720),
        "pole": (0.540, -0.350, 0.750),
        "head_y": math.radians(0.9),
    },
    44: {
        "wrist": (0.235, -0.100, 0.825),
        "pole": (0.535, -0.325, 0.790),
        "head_y": math.radians(1.4),
    },
    52: {
        "wrist": (0.145, -0.060, 0.900),
        "pole": (0.500, -0.300, 0.810),
        "head_y": math.radians(1.8),
    },
    60: {
        "wrist": (0.145, -0.060, 0.900),
        "pole": (0.500, -0.300, 0.810),
        "head_y": math.radians(1.8),
    },
    61: {
        "wrist": (0.145, -0.060, 0.900),
        "pole": (0.500, -0.300, 0.810),
        "head_y": math.radians(1.8),
    },
    72: {
        "wrist": (0.145, -0.060, 0.900),
        "pole": (0.500, -0.300, 0.810),
        "head_y": math.radians(1.8),
    },
}


def remove_object(name):
    obj = bpy.data.objects.get(name)
    if obj is not None:
        bpy.data.objects.remove(obj, do_unlink=True)


def reset_pose(rig):
    for bone in rig.pose.bones:
        bone.rotation_mode = "XYZ"
        bone.location = (0.0, 0.0, 0.0)
        bone.rotation_euler = (0.0, 0.0, 0.0)
        bone.scale = (1.0, 1.0, 1.0)


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


def clamp_action_curves(action):
    for curve in iter_action_fcurves(action):
        for point in curve.keyframe_points:
            point.interpolation = "BEZIER"
            point.handle_left_type = "AUTO_CLAMPED"
            point.handle_right_type = "AUTO_CLAMPED"


def create_empty(name, display_type, display_size):
    remove_object(name)
    obj = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(obj)
    obj.empty_display_type = display_type
    obj.empty_display_size = display_size
    obj.hide_render = True
    return obj


def left_arm_fragment_indices(mesh):
    left_group_indices = {
        mesh.vertex_groups[name].index
        for name in ("clavicle.L", "upper_arm.L", "forearm.L", "hand.L")
        if name in mesh.vertex_groups
    }
    remove_indices = []
    for vertex in mesh.data.vertices:
        left_arm_weight = sum(
            element.weight
            for element in vertex.groups
            if element.group in left_group_indices
        )
        if left_arm_weight >= 0.15:
            remove_indices.append(vertex.index)
    return remove_indices


def hide_source_left_arm_fragments(mesh):
    remove_indices = left_arm_fragment_indices(mesh)
    bpy.ops.object.select_all(action="DESELECT")
    mesh.select_set(True)
    bpy.context.view_layer.objects.active = mesh
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="DESELECT")
    bpy.ops.object.mode_set(mode="OBJECT")
    for index in remove_indices:
        mesh.data.vertices[index].select = True
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.delete(type="VERT")
    bpy.ops.object.mode_set(mode="OBJECT")
    mesh["left_arm_source_fragments_hidden"] = len(remove_indices)


def proxy_skin_material():
    material = bpy.data.materials.get("MAT_RIGHT2_VALIDATION_PROXY_SKIN")
    if material is None:
        material = bpy.data.materials.new("MAT_RIGHT2_VALIDATION_PROXY_SKIN")
        material.diffuse_color = (0.52, 0.20, 0.14, 1.0)
        material.use_nodes = True
        principled = next(
            node
            for node in material.node_tree.nodes
            if node.type == "BSDF_PRINCIPLED"
        )
        principled.inputs["Base Color"].default_value = (0.52, 0.20, 0.14, 1.0)
        principled.inputs["Roughness"].default_value = 0.48
    return material


def create_proxy_segment(rig, material, name, bone_name, head, tail, radius):
    head = Vector(head)
    tail = Vector(tail)
    direction = tail - head
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=20)
    obj = bpy.context.object
    obj.name = name
    obj.location = (head + tail) * 0.5
    obj.rotation_mode = "QUATERNION"
    obj.rotation_quaternion = direction.to_track_quat("Z", "Y")
    obj.scale = (radius, radius * 0.90, direction.length * 0.61)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    obj.data.materials.append(material)
    for polygon in obj.data.polygons:
        polygon.use_smooth = True
    group = obj.vertex_groups.new(name=bone_name)
    group.add(range(len(obj.data.vertices)), 1.0, "REPLACE")
    modifier = obj.modifiers.new("RIGHT2_PROXY_ARMATURE", "ARMATURE")
    modifier.object = rig
    modifier.use_vertex_groups = True
    obj["validation_proxy_only"] = True
    return obj


def create_validation_proxy_left_arm(mesh, rig):
    hide_source_left_arm_fragments(mesh)
    material = proxy_skin_material()
    segments = [
        (
            "RIGHT2_PROXY_LEFT_SHOULDER",
            "upper_arm.L",
            (0.090, 0.000, 0.805),
            (0.135, 0.000, 0.755),
            0.036,
        ),
        (
            "RIGHT2_PROXY_LEFT_UPPER_ARM",
            "upper_arm.L",
            (0.105, 0.000, 0.800),
            (0.145, 0.000, 0.620),
            0.031,
        ),
        (
            "RIGHT2_PROXY_LEFT_FOREARM",
            "forearm.L",
            (0.145, 0.000, 0.620),
            (0.154, 0.000, 0.440),
            0.026,
        ),
        (
            "RIGHT2_PROXY_LEFT_HAND",
            "hand.L",
            (0.154, 0.000, 0.450),
            (0.157, -0.004, 0.370),
            0.024,
        ),
    ]
    for name, bone_name, head, tail, radius in segments:
        create_proxy_segment(rig, material, name, bone_name, head, tail, radius)
    rig["left_arm_validation_mode"] = "clean_proxy_arm_v1"


def create_authoring_setup(rig):
    target = create_empty(TARGET_NAME, "SPHERE", 0.025)
    pole = create_empty(POLE_NAME, "CUBE", 0.035)
    forearm = rig.pose.bones["forearm.L"]
    constraint = forearm.constraints.new("IK")
    constraint.name = "TMP_JEWELRY_LEFT_ARM_IK"
    constraint.target = target
    constraint.pole_target = pole
    constraint.chain_count = 2
    constraint.use_tail = True
    constraint.use_stretch = False
    constraint.pole_angle = 0.0

    old = bpy.data.actions.get(AUTHOR_ACTION_NAME)
    if old:
        bpy.data.actions.remove(old)
    author_action = bpy.data.actions.new(AUTHOR_ACTION_NAME)
    rig.animation_data_create()
    rig.animation_data.action = author_action

    for frame, pose in BEATS.items():
        target.location = pose["wrist"]
        target.keyframe_insert(data_path="location", frame=frame)
        pole.location = pose["pole"]
        pole.keyframe_insert(data_path="location", frame=frame)

        rig.pose.bones["chest"].rotation_euler = Euler(
            (0.0, pose["head_y"] * 0.28, 0.0), "XYZ"
        )
        rig.pose.bones["neck"].rotation_euler = Euler(
            (0.0, pose["head_y"] * 0.44, 0.0), "XYZ"
        )
        rig.pose.bones["head"].rotation_euler = Euler(
            (0.0, pose["head_y"], 0.0), "XYZ"
        )
        for name in ("chest", "neck", "head"):
            rig.pose.bones[name].keyframe_insert(
                data_path="rotation_euler", frame=frame, group=name
            )

    for animated_id in (target, pole, rig):
        action = animated_id.animation_data.action
        clamp_action_curves(action)
    return target, pole, constraint, author_action


def sample_visual_pose(rig, scene):
    samples = {}
    for frame in range(1, 73):
        scene.frame_set(frame)
        bpy.context.view_layer.update()
        samples[frame] = {
            name: rig.pose.bones[name].matrix.copy() for name in BONE_ORDER
        }
    return samples


def create_release_action(rig, samples):
    old = bpy.data.actions.get(ACTION_NAME)
    if old:
        bpy.data.actions.remove(old)
    action = bpy.data.actions.new(ACTION_NAME)
    action["name_zh"] = "左手轻触左耳饰"
    action["source_motion_id"] = ACTION_NAME
    action["validation_character_id"] = "CHAR_HUNYUAN_RIGHT2_GOLD_001"
    action["paired_camera_id"] = "CAM_JEWELRY_EARRING_TOUCH_LEFT_ARC_85MM_001"
    action["status"] = "prototype_validation"
    action["baked_fk"] = True
    rig.animation_data_create()
    rig.animation_data.action = action
    reset_pose(rig)

    for frame in range(1, 73):
        bpy.context.scene.frame_set(frame)
        for name in BONE_ORDER:
            bone = rig.pose.bones[name]
            bone.rotation_mode = "QUATERNION"
            bone.matrix = samples[frame][name]
            bone.keyframe_insert(data_path="location", frame=frame, group=name)
            bone.keyframe_insert(
                data_path="rotation_quaternion", frame=frame, group=name
            )
            bone.keyframe_insert(data_path="scale", frame=frame, group=name)
    clamp_action_curves(action)
    try:
        action.asset_mark()
        action.asset_data.description = (
            "左手从自然位单向抬起，轻触左耳饰后稳定保持；右二金色礼服角色验证版。"
        )
    except (AttributeError, RuntimeError):
        pass
    return action


def cleanup_authoring(rig, constraint, author_action):
    rig.pose.bones["forearm.L"].constraints.remove(constraint)
    rig.animation_data.action = None
    remove_object(TARGET_NAME)
    remove_object(POLE_NAME)
    if author_action.users == 0:
        bpy.data.actions.remove(author_action)


def create_anchor():
    anchor = create_empty(ANCHOR_NAME, "SPHERE", 0.018)
    anchor.location = (0.105, -0.045, 0.985)
    anchor["target_type"] = "ear_left"
    anchor["validation_only"] = True
    return anchor


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


def create_validation_camera():
    remove_object(CAMERA_NAME)
    remove_object(FOCUS_NAME)
    data = bpy.data.cameras.new(f"{CAMERA_NAME}_DATA")
    camera = bpy.data.objects.new(CAMERA_NAME, data)
    bpy.context.scene.collection.objects.link(camera)
    camera.rotation_mode = "XYZ"
    data.sensor_width = 36.0
    data.dof.use_dof = True
    data.dof.aperture_fstop = 3.2
    data.dof.aperture_blades = 9
    focus = create_empty(FOCUS_NAME, "SPHERE", 0.018)
    focus.location = (0.065, -0.015, 0.920)
    data.dof.focus_object = focus
    key_camera(camera, 1, (0.44, -1.56, 0.88), (0.03, 0.0, 0.86), 72.0)
    key_camera(camera, 72, (0.39, -1.48, 0.90), (0.05, 0.0, 0.91), 78.0)
    for animated_id in (camera, data):
        clamp_action_curves(animated_id.animation_data.action)
    camera["validation_only"] = True
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
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = False
    try:
        scene.render.engine = "BLENDER_EEVEE_NEXT"
    except TypeError:
        pass
    for marker in list(scene.timeline_markers):
        if marker.name.startswith("JEWELRY_TOUCH_LEFT_"):
            scene.timeline_markers.remove(marker)
    for frame, name in {
        1: "JEWELRY_TOUCH_LEFT_START",
        24: "JEWELRY_TOUCH_LEFT_ANTICIPATION",
        52: "JEWELRY_TOUCH_LEFT_CONTACT",
        61: "JEWELRY_TOUCH_LEFT_FINAL_HOLD",
    }.items():
        scene.timeline_markers.new(name, frame=frame)


def build_retired_proxy_validation():
    bpy.ops.wm.open_mainfile(filepath=str(SOURCE))
    scene = bpy.context.scene
    rig = bpy.data.objects[RIG_NAME]
    rig.animation_data_clear()
    reset_pose(rig)
    bpy.context.view_layer.update()
    create_validation_proxy_left_arm(bpy.data.objects["node_0"], rig)

    target, pole, constraint, author_action = create_authoring_setup(rig)
    samples = sample_visual_pose(rig, scene)
    cleanup_authoring(rig, constraint, author_action)
    action = create_release_action(rig, samples)
    rig.animation_data.action = action
    create_anchor()
    camera = create_validation_camera()
    configure_scene(camera)
    scene.frame_set(1)
    bpy.ops.wm.save_as_mainfile(filepath=str(OUTPUT))
    print(f"RIGHT2_JEWELRY_VALIDATION_BLEND_CREATED={OUTPUT}")


def main():
    raise RuntimeError(
        "This proxy-arm validator is retired because the fragmented RIGHT2 mesh "
        "cannot provide anatomical motion validation. Use "
        "build_jewelry_motion_makehuman_validation.py until RIGHT2 has clean "
        "topology and production skin weights."
    )


if __name__ == "__main__":
    try:
        main()
    except Exception:
        traceback.print_exc()
        sys.stderr.flush()
        os._exit(1)
