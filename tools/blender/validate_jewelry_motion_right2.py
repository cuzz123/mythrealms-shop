from __future__ import annotations

import math
import os
import sys

import bpy
from mathutils import Vector


RIG_NAME = "RIG_RIGHT2_GOLD_UPPER_BODY"
ACTION_NAME = "ACT_JEWELRY_TOUCH_EARRING_LEFT_001"
ANCHOR_NAME = "ANCHOR_RIGHT2_EAR_LEFT"
CAMERA_NAME = "CAM_VALIDATION_JEWELRY_TOUCH_EARRING_LEFT"


def sample_motion(rig, scene):
    rows = []
    previous = None
    for frame in range(1, 73):
        scene.frame_set(frame)
        hand = rig.pose.bones["hand.L"]
        head = rig.pose.bones["head"]
        current = {
            "frame": frame,
            "hand_head": hand.head.copy(),
            "hand_tail": hand.tail.copy(),
            "head_quat": head.matrix.to_quaternion(),
            "head_yaw": head.rotation_euler.y,
        }
        if previous is not None:
            current["hand_delta"] = (
                current["hand_head"] - previous["hand_head"]
            ).length
            current["head_delta_deg"] = math.degrees(
                current["head_quat"].rotation_difference(previous["head_quat"]).angle
            )
            current["head_yaw_delta_deg"] = math.degrees(
                current["head_yaw"] - previous["head_yaw"]
            )
        rows.append(current)
        previous = current
    return rows


def validate():
    errors = []
    scene = bpy.context.scene
    rig = bpy.data.objects.get(RIG_NAME)
    action = bpy.data.actions.get(ACTION_NAME)
    anchor = bpy.data.objects.get(ANCHOR_NAME)
    camera = bpy.data.objects.get(CAMERA_NAME)

    if rig is None or rig.type != "ARMATURE":
        errors.append(f"missing armature {RIG_NAME}")
    if action is None:
        errors.append(f"missing action {ACTION_NAME}")
    if anchor is None:
        errors.append(f"missing ear anchor {ANCHOR_NAME}")
    if camera is None or camera.type != "CAMERA":
        errors.append(f"missing validation camera {CAMERA_NAME}")
    if (scene.frame_start, scene.frame_end, scene.render.fps) != (1, 72, 24):
        errors.append("scene timing must be frames 1..72 at 24 fps")

    if action is not None:
        if action.get("source_motion_id") != ACTION_NAME:
            errors.append("action source_motion_id is missing or incorrect")
        if action.get("validation_character_id") != "CHAR_HUNYUAN_RIGHT2_GOLD_001":
            errors.append("action validation_character_id is missing or incorrect")

    if rig is not None and action is not None and anchor is not None:
        rig.animation_data_create()
        rig.animation_data.action = action
        for bone_name in ("forearm.L", "hand.L"):
            live_ik = [
                constraint.name
                for constraint in rig.pose.bones[bone_name].constraints
                if constraint.type == "IK"
            ]
            if live_ik:
                errors.append(f"{bone_name} retains live IK constraints: {live_ik}")

        rows = sample_motion(rig, scene)
        anchor_location = Vector(anchor.location)
        contact_distance = min(
            min(
                (row["hand_head"] - anchor_location).length,
                (row["hand_tail"] - anchor_location).length,
            )
            for row in rows[50:]
        )
        if contact_distance > 0.10:
            errors.append(f"left hand misses ear anchor by {contact_distance:.4f} m")

        max_hand_delta = max(row.get("hand_delta", 0.0) for row in rows)
        if max_hand_delta > 0.035:
            errors.append(f"hand jumps {max_hand_delta:.4f} m in one frame")

        max_head_delta = max(row.get("head_delta_deg", 0.0) for row in rows)
        if max_head_delta > 2.5:
            errors.append(f"head jumps {max_head_delta:.3f} degrees in one frame")

        reversals = [
            row
            for row in rows[1:]
            if row["head_yaw_delta_deg"] < -0.20
        ]
        if reversals:
            errors.append(
                "head yaw reverses at frames "
                + ", ".join(str(row["frame"]) for row in reversals)
            )

        hold_rows = rows[60:]
        hold_hand_span = max(
            (row["hand_head"] - hold_rows[0]["hand_head"]).length
            for row in hold_rows
        )
        hold_head_span = max(
            math.degrees(
                row["head_quat"].rotation_difference(hold_rows[0]["head_quat"]).angle
            )
            for row in hold_rows
        )
        if hold_hand_span > 0.002:
            errors.append(f"final hand hold drifts {hold_hand_span:.4f} m")
        if hold_head_span > 0.05:
            errors.append(f"final head hold drifts {hold_head_span:.3f} degrees")

    return errors


def main():
    errors = validate()
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        sys.stderr.flush()
        os._exit(1)
    print("RIGHT2_JEWELRY_MOTION_VALIDATION_OK")


if __name__ == "__main__":
    main()
