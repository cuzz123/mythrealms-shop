from __future__ import annotations

import os
import sys

import bpy


RIG_NAME = "HumanMasterRig"
ACTION_NAME = "ACT_JEWELRY_TOUCH_EARRING_LEFT_001"
NAME_ZH = "左手轻触左耳饰"
CAMERA_ID = "CAM_JEWELRY_EARRING_TOUCH_LEFT_ARC_85MM_001"
RELEVANT_BONES = (
    "CTRL_hand_ik.L",
    "CTRL_elbow_pole.L",
    "CTRL_head",
    "CTRL_torso",
    "clavicle.L",
    "upperarm.L",
    "lowerarm.L",
    "hand.L",
    "head",
)


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


def validate():
    errors = []
    scene = bpy.context.scene
    rig = bpy.data.objects.get(RIG_NAME)
    action = bpy.data.actions.get(ACTION_NAME)

    if rig is None or rig.type != "ARMATURE":
        errors.append(f"missing armature {RIG_NAME}")
    if action is None:
        errors.append(f"missing action {ACTION_NAME}")
    if (scene.frame_start, scene.frame_end, scene.render.fps) != (1, 72, 24):
        errors.append(
            "scene timing must be frames 1..72 at 24 fps, got "
            f"{scene.frame_start}..{scene.frame_end} at {scene.render.fps} fps"
        )

    if action is not None:
        if action.get("name_zh") != NAME_ZH:
            errors.append(f"action name_zh must equal {NAME_ZH}")
        if action.get("paired_camera_id") != CAMERA_ID:
            errors.append(f"action paired_camera_id must equal {CAMERA_ID}")

        relevant_curves = [
            curve
            for curve in iter_action_fcurves(action)
            if any(f'pose.bones["{name}"]' in curve.data_path for name in RELEVANT_BONES)
        ]
        keyed_frames = {
            round(point.co.x)
            for curve in relevant_curves
            for point in curve.keyframe_points
        }
        if len(relevant_curves) < 3:
            errors.append("action must animate at least three relevant left-arm/head curves")
        if not {1, 24, 52, 72}.issubset(keyed_frames):
            errors.append(
                "action must contain relevant keys at frames 1, 24, 52, and 72; "
                f"found {sorted(keyed_frames)}"
            )

    return errors


def main():
    errors = validate()
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        sys.stderr.flush()
        os._exit(1)
    print("JEWELRY_MOTION_PACK_VALIDATION_OK")


if __name__ == "__main__":
    main()
