from __future__ import annotations

import math
import sys
from pathlib import Path

import bpy
from mathutils import Euler, Vector

sys.path.insert(0, str(Path(__file__).resolve().parent))

from jewelry_motion_specs import load_motion_specs


ROOT = Path(__file__).resolve().parents[2]
SOURCE = (
    ROOT
    / "video-pipeline"
    / "asset-library"
    / "05-characters"
    / "CHAR_HUMAN_MASTER_RIG_001"
    / "HumanMasterRig.blend"
)
PACK_DIR = (
    ROOT
    / "video-pipeline"
    / "asset-library"
    / "06-motions"
    / "jewelry-model-actions"
)
SPECS_PATH = PACK_DIR / "motion_specs.json"
OUTPUT = PACK_DIR / "JewelryMotionPack_v1.blend"
RIG_NAME = "HumanMasterRig"
ACTION_NAME = "ACT_JEWELRY_TOUCH_EARRING_LEFT_001"


BEAT_POSES = {
    1: {
        "hand": (0.950, -0.160, 1.380),
        "pole": (0.480, -0.520, 1.320),
        "head_y": 0.0,
        "head_z": 0.0,
        "torso_z": 0.0,
    },
    12: {
        "hand": (0.950, -0.160, 1.380),
        "pole": (0.480, -0.520, 1.320),
        "head_y": 0.0,
        "head_z": 0.0,
        "torso_z": 0.0,
    },
    24: {
        "hand": (0.780, -0.195, 1.455),
        "pole": (0.510, -0.455, 1.390),
        "head_y": math.radians(0.8),
        "head_z": math.radians(0.2),
        "torso_z": math.radians(0.5),
    },
    52: {
        "hand": (0.175, -0.105, 1.635),
        "pole": (0.505, -0.350, 1.500),
        "head_y": math.radians(3.2),
        "head_z": math.radians(0.8),
        "torso_z": math.radians(1.4),
    },
    60: {
        "hand": (0.175, -0.105, 1.635),
        "pole": (0.505, -0.350, 1.500),
        "head_y": math.radians(3.2),
        "head_z": math.radians(0.8),
        "torso_z": math.radians(1.4),
    },
    61: {
        "hand": (0.175, -0.105, 1.635),
        "pole": (0.505, -0.350, 1.500),
        "head_y": math.radians(3.2),
        "head_z": math.radians(0.8),
        "torso_z": math.radians(1.4),
    },
    72: {
        "hand": (0.175, -0.105, 1.635),
        "pole": (0.505, -0.350, 1.500),
        "head_y": math.radians(3.2),
        "head_z": math.radians(0.8),
        "torso_z": math.radians(1.4),
    },
}


def reset_pose(rig):
    for bone in rig.pose.bones:
        bone.rotation_mode = "XYZ"
        bone.location = (0.0, 0.0, 0.0)
        bone.rotation_euler = (0.0, 0.0, 0.0)
        bone.scale = (1.0, 1.0, 1.0)


def set_bone_translation(bone, translation):
    matrix = bone.matrix.copy()
    matrix.translation = Vector(translation)
    bone.matrix = matrix


def key_control_pose(rig, frame, pose):
    scene = bpy.context.scene
    scene.frame_set(frame)

    hand = rig.pose.bones["CTRL_hand_ik.L"]
    pole = rig.pose.bones["CTRL_elbow_pole.L"]
    head = rig.pose.bones["CTRL_head"]
    torso = rig.pose.bones["CTRL_torso"]

    set_bone_translation(hand, pose["hand"])
    set_bone_translation(pole, pose["pole"])
    head.rotation_euler = Euler((0.0, pose["head_y"], pose["head_z"]), "XYZ")
    torso.rotation_euler = Euler((0.0, 0.0, pose["torso_z"]), "XYZ")

    hand.keyframe_insert(data_path="location", frame=frame, group=hand.name)
    hand.keyframe_insert(data_path="rotation_euler", frame=frame, group=hand.name)
    pole.keyframe_insert(data_path="location", frame=frame, group=pole.name)
    head.keyframe_insert(data_path="rotation_euler", frame=frame, group=head.name)
    torso.keyframe_insert(data_path="rotation_euler", frame=frame, group=torso.name)


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


def create_ear_anchor():
    collection = bpy.data.collections.get("JewelryMotionGuides")
    if collection is None:
        collection = bpy.data.collections.new("JewelryMotionGuides")
        bpy.context.scene.collection.children.link(collection)
    anchor = bpy.data.objects.get("ANCHOR_EAR_LEFT")
    if anchor is None:
        anchor = bpy.data.objects.new("ANCHOR_EAR_LEFT", None)
        collection.objects.link(anchor)
    anchor.location = (0.105, -0.060, 1.650)
    anchor.empty_display_type = "SPHERE"
    anchor.empty_display_size = 0.035
    anchor.hide_render = True
    anchor["target_type"] = "ear_left"
    return anchor


def create_action(rig, spec):
    old = bpy.data.actions.get(spec.id)
    if old:
        bpy.data.actions.remove(old)
    action = bpy.data.actions.new(spec.id)
    action["name_zh"] = spec.name_zh
    action["paired_camera_id"] = spec.paired_camera_id
    action["asset_type"] = "jewelry_model_motion"
    action["duration_frames"] = spec.frames
    action["fps"] = spec.fps
    action["status"] = "prototype"
    action["authoring_rig"] = RIG_NAME
    rig.animation_data_create()
    rig.animation_data.action = action
    for beat in spec.beats:
        key_control_pose(rig, beat.frame, BEAT_POSES[beat.frame])
    clamp_action_curves(action)
    try:
        action.asset_mark()
        action.asset_data.description = (
            "Jewelry model action: left hand rises once and settles beside the left earring."
        )
    except (AttributeError, RuntimeError):
        pass
    return action


def main():
    specs = load_motion_specs(SPECS_PATH)
    spec = specs[ACTION_NAME]
    bpy.ops.wm.open_mainfile(filepath=str(SOURCE))
    scene = bpy.context.scene
    rig = bpy.data.objects[RIG_NAME]
    rig.animation_data_clear()
    reset_pose(rig)
    bpy.context.view_layer.update()

    create_ear_anchor()
    create_action(rig, spec)
    scene.frame_start = 1
    scene.frame_end = spec.frames
    scene.render.fps = spec.fps
    scene.frame_set(1)

    PACK_DIR.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(OUTPUT))
    print(f"JEWELRY_MOTION_PACK_CREATED={OUTPUT}")


if __name__ == "__main__":
    main()
