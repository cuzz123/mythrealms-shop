from __future__ import annotations

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
OUTPUT = CHAR_DIR / "RIGHT2_GOLD_JEWELRY_POSE_v1.blend"
RIG_NAME = "RIG_RIGHT2_GOLD_UPPER_BODY"
MESH_NAME = "node_0"
ACTION_NAME = "ACT_RIGHT2_GOLD_JEWELRY_POISE_01"
CAMERA_NAME = "CAM_RIGHT2_GOLD_JEWELRY_POISE_01"
FOCUS_NAME = "FOCUS_RIGHT2_GOLD_JEWELRY_POISE_01"


POSES = (
    {
        "frame": 1,
        "rotations": {
            "chest": (0.000, -0.012, 0.004),
            "neck": (-0.018, -0.035, 0.005),
            "head": (-0.055, -0.085, 0.010),
            "clavicle.L": (0.000, 0.000, -0.006),
            "clavicle.R": (0.000, 0.000, 0.004),
        },
    },
    {
        "frame": 12,
        "rotations": {
            "chest": (0.000, -0.012, 0.004),
            "neck": (-0.018, -0.035, 0.005),
            "head": (-0.055, -0.085, 0.010),
            "clavicle.L": (0.000, 0.000, -0.006),
            "clavicle.R": (0.000, 0.000, 0.004),
        },
    },
    {
        "frame": 28,
        "rotations": {
            "chest": (0.004, -0.005, 0.002),
            "neck": (-0.005, -0.018, 0.003),
            "head": (-0.020, -0.040, 0.006),
            "clavicle.L": (0.000, 0.000, -0.0055),
            "clavicle.R": (0.000, 0.000, 0.0038),
        },
    },
    {
        "frame": 44,
        "rotations": {
            "chest": (0.010, 0.002, -0.001),
            "neck": (0.015, 0.003, -0.001),
            "head": (0.035, 0.010, -0.002),
            "clavicle.L": (0.000, 0.000, -0.0050),
            "clavicle.R": (0.000, 0.000, 0.0035),
        },
    },
    {
        "frame": 56,
        "rotations": {
            "chest": (0.012, 0.008, -0.002),
            "neck": (0.022, 0.015, -0.003),
            "head": (0.070, 0.055, -0.008),
            "clavicle.L": (0.000, 0.000, -0.0045),
            "clavicle.R": (0.000, 0.000, 0.0032),
        },
    },
    {
        "frame": 72,
        "rotations": {
            "chest": (0.012, 0.008, -0.002),
            "neck": (0.022, 0.015, -0.003),
            "head": (0.070, 0.055, -0.008),
            "clavicle.L": (0.000, 0.000, -0.0045),
            "clavicle.R": (0.000, 0.000, 0.0032),
        },
    },
)


def remove_object(name):
    obj = bpy.data.objects.get(name)
    if obj is not None:
        bpy.data.objects.remove(obj, do_unlink=True)


def reset_pose(rig):
    rig.animation_data_clear()
    for bone in rig.pose.bones:
        for constraint in list(bone.constraints):
            bone.constraints.remove(constraint)
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


def create_action(rig):
    old = bpy.data.actions.get(ACTION_NAME)
    if old is not None:
        bpy.data.actions.remove(old)
    action = bpy.data.actions.new(ACTION_NAME)
    action["name_zh"] = "综合首饰展示·抬颏侧转"
    action["source_character_id"] = "CHAR_HUNYUAN_RIGHT2_GOLD_001"
    action["asset_type"] = "jewelry_model_motion"
    action["motion_scope"] = "原模头颈胸安全动作"
    action["paired_camera_id"] = CAMERA_NAME
    action["duration_frames"] = 72
    action["fps"] = 24
    action["status"] = "approved"

    rig.animation_data_create()
    rig.animation_data.action = action
    for pose in POSES:
        frame = pose["frame"]
        for bone_name, rotation in pose["rotations"].items():
            bone = rig.pose.bones[bone_name]
            bone.rotation_mode = "XYZ"
            bone.rotation_euler = Euler(rotation, "XYZ")
            bone.keyframe_insert(data_path="rotation_euler", frame=frame, group=bone.name)
    clamp_action_curves(action)
    try:
        action.asset_mark()
        action.asset_data.description = (
            "右二金色礼服原模：低头起势，缓慢抬颏并单向侧转，最后定格。"
        )
    except (AttributeError, RuntimeError):
        pass
    return action


def key_camera(camera, focus, frame, location, target, lens, fstop):
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
    camera.data.dof.aperture_fstop = fstop
    camera.data.dof.keyframe_insert(data_path="aperture_fstop", frame=frame)
    focus.location = target
    focus.keyframe_insert(data_path="location", frame=frame)


def create_camera():
    remove_object(CAMERA_NAME)
    remove_object(FOCUS_NAME)
    data = bpy.data.cameras.new(f"{CAMERA_NAME}_DATA")
    camera = bpy.data.objects.new(CAMERA_NAME, data)
    bpy.context.scene.collection.objects.link(camera)
    camera.rotation_mode = "XYZ"
    data.sensor_width = 36.0
    data.dof.use_dof = True
    data.dof.aperture_blades = 9

    focus = bpy.data.objects.new(FOCUS_NAME, None)
    bpy.context.scene.collection.objects.link(focus)
    focus.empty_display_type = "SPHERE"
    focus.empty_display_size = 0.025
    focus.hide_render = True
    data.dof.focus_object = focus

    keys = (
        (1, (0.420, -1.600, 0.840), (0.040, 0.000, 0.900), 78.0, 2.2),
        (28, (0.385, -1.530, 0.860), (0.045, 0.000, 0.930), 82.0, 2.0),
        (56, (0.340, -1.450, 0.885), (0.060, 0.000, 0.955), 86.0, 1.8),
        (72, (0.340, -1.450, 0.885), (0.060, 0.000, 0.955), 86.0, 1.8),
    )
    for key in keys:
        key_camera(camera, focus, *key)
    for animated_id in (camera, focus, data):
        if animated_id.animation_data and animated_id.animation_data.action:
            clamp_action_curves(animated_id.animation_data.action)

    camera["name_zh"] = "综合首饰展示·缓慢推近"
    camera["source_character_id"] = "CHAR_HUNYUAN_RIGHT2_GOLD_001"
    camera["shot_scope"] = "原模头肩与耳饰特写"
    camera["status"] = "approved"
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
    scene["prototype_name_zh"] = "右二金色礼服·综合首饰展示"


def main():
    bpy.ops.wm.open_mainfile(filepath=str(SOURCE))
    mesh = bpy.data.objects[MESH_NAME]
    rig = bpy.data.objects[RIG_NAME]
    if len(mesh.data.vertices) < 300_000:
        raise RuntimeError("RIGHT2 source mesh is not the original high-resolution model")
    reset_pose(rig)
    action = create_action(rig)
    rig.animation_data.action = action
    camera = create_camera()
    configure_scene(camera)
    bpy.context.scene.frame_set(1)
    bpy.ops.wm.save_as_mainfile(filepath=str(OUTPUT))
    print(f"RIGHT2_GOLD_JEWELRY_POSE_CREATED={OUTPUT}")


if __name__ == "__main__":
    try:
        main()
    except Exception:
        traceback.print_exc()
        sys.stderr.flush()
        os._exit(1)
