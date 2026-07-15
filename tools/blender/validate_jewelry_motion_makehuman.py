from __future__ import annotations

import math
import os
import sys

import bpy
from mathutils import Vector


RIG_NAME = "HumanMasterRig_Fitted"
BODY_NAME = "MH_FemaleBody"
ACTION_NAME = "ACT_JEWELRY_TOUCH_EARRING_LEFT_001"
ANCHOR_NAME = "ANCHOR_MH_EAR_LEFT"
CAMERA_NAME = "CAM_VALIDATION_MH_TOUCH_EARRING_LEFT"


def joint_positions(rig):
    world = rig.matrix_world
    return {
        "shoulder": world @ rig.pose.bones["upperarm.L"].head,
        "elbow": world @ rig.pose.bones["lowerarm.L"].head,
        "wrist": world @ rig.pose.bones["hand.L"].head,
        "hand_tip": world @ rig.pose.bones["hand.L"].tail,
        "head_quat": rig.pose.bones["head"].matrix.to_quaternion(),
    }


def elbow_angle_degrees(points):
    upper = points["shoulder"] - points["elbow"]
    lower = points["wrist"] - points["elbow"]
    return math.degrees(upper.angle(lower))


def sample_motion(rig, scene):
    rows = []
    previous = None
    for frame in range(1, 73):
        scene.frame_set(frame)
        current = joint_positions(rig)
        current["frame"] = frame
        current["elbow_angle"] = elbow_angle_degrees(current)
        current["upper_length"] = (
            current["shoulder"] - current["elbow"]
        ).length
        current["lower_length"] = (current["wrist"] - current["elbow"]).length
        if previous is not None:
            current["wrist_delta"] = (
                current["wrist"] - previous["wrist"]
            ).length
            current["elbow_delta"] = (
                current["elbow"] - previous["elbow"]
            ).length
            current["head_delta_deg"] = math.degrees(
                current["head_quat"].rotation_difference(previous["head_quat"]).angle
            )
            current["elbow_angle_delta"] = abs(
                current["elbow_angle"] - previous["elbow_angle"]
            )
        rows.append(current)
        previous = current
    return rows


def validate():
    errors = []
    scene = bpy.context.scene
    rig = bpy.data.objects.get(RIG_NAME)
    body = bpy.data.objects.get(BODY_NAME)
    action = bpy.data.actions.get(ACTION_NAME)
    anchor = bpy.data.objects.get(ANCHOR_NAME)
    camera = bpy.data.objects.get(CAMERA_NAME)

    if rig is None or rig.type != "ARMATURE":
        errors.append(f"missing fitted armature {RIG_NAME}")
    if body is None or body.type != "MESH":
        errors.append(f"missing body mesh {BODY_NAME}")
    if action is None:
        errors.append(f"missing action {ACTION_NAME}")
    if anchor is None:
        errors.append(f"missing ear anchor {ANCHOR_NAME}")
    if camera is None or camera.type != "CAMERA":
        errors.append(f"missing validation camera {CAMERA_NAME}")
    if (scene.frame_start, scene.frame_end, scene.render.fps) != (1, 72, 24):
        errors.append("scene timing must be frames 1..72 at 24 fps")

    if rig is not None and body is not None:
        armature_modifiers = [
            modifier
            for modifier in body.modifiers
            if modifier.type == "ARMATURE" and modifier.object == rig
        ]
        if not armature_modifiers:
            errors.append("MakeHuman body is not bound to the fitted master rig")
        required_groups = {"upperarm.L", "lowerarm.L", "hand.L"}
        missing_groups = required_groups - {group.name for group in body.vertex_groups}
        if missing_groups:
            errors.append(f"body is missing arm groups: {sorted(missing_groups)}")

    if action is not None:
        if action.get("validation_character_id") != "CHAR_MAKEHUMAN_FEMALE_BASE_001":
            errors.append("action validation_character_id is missing or incorrect")
        if action.get("anatomy_validation") != "shoulder_elbow_wrist_v1":
            errors.append("action anatomy_validation marker is missing")

    if rig is not None and action is not None and anchor is not None:
        rig.animation_data_create()
        rig.animation_data.action = action
        live_ik = [
            constraint.name
            for bone_name in ("lowerarm.L", "hand.L")
            for constraint in rig.pose.bones[bone_name].constraints
            if constraint.type == "IK"
        ]
        if live_ik:
            errors.append(f"release action retains live IK constraints: {live_ik}")

        rows = sample_motion(rig, scene)
        touch = rows[51]
        if not 30.0 <= touch["elbow_angle"] <= 125.0:
            errors.append(
                f"touch elbow angle {touch['elbow_angle']:.2f} is outside 30..125 degrees"
            )
        if touch["elbow"].x < 0.20:
            errors.append(f"touch elbow collapses into torso at x={touch['elbow'].x:.3f}")

        anchor_location = Vector(anchor.location)
        contact_distance = min(
            min(
                (row["wrist"] - anchor_location).length,
                (row["hand_tip"] - anchor_location).length,
            )
            for row in rows[50:]
        )
        if contact_distance > 0.09:
            errors.append(f"hand misses ear anchor by {contact_distance:.4f} m")

        max_wrist_row = max(rows, key=lambda row: row.get("wrist_delta", 0.0))
        max_elbow_row = max(rows, key=lambda row: row.get("elbow_delta", 0.0))
        max_head_row = max(rows, key=lambda row: row.get("head_delta_deg", 0.0))
        max_angle_row = max(
            rows, key=lambda row: row.get("elbow_angle_delta", 0.0)
        )
        max_wrist_delta = max_wrist_row.get("wrist_delta", 0.0)
        max_elbow_delta = max_elbow_row.get("elbow_delta", 0.0)
        max_head_delta = max_head_row.get("head_delta_deg", 0.0)
        max_angle_delta = max_angle_row.get("elbow_angle_delta", 0.0)
        if max_wrist_delta > 0.035:
            previous = rows[max_wrist_row["frame"] - 2]
            nearby = rows[
                max(0, max_wrist_row["frame"] - 4) : min(
                    len(rows), max_wrist_row["frame"] + 2
                )
            ]
            errors.append(
                f"wrist jumps {max_wrist_delta:.4f} m at frame "
                f"{max_wrist_row['frame']} "
                f"from {tuple(round(v, 3) for v in previous['wrist'])} "
                f"to {tuple(round(v, 3) for v in max_wrist_row['wrist'])}; "
                f"nearby="
                f"{[(row['frame'], tuple(round(v, 3) for v in row['wrist'])) for row in nearby]}"
            )
        if max_elbow_delta > 0.035:
            previous = rows[max_elbow_row["frame"] - 2]
            errors.append(
                f"elbow jumps {max_elbow_delta:.4f} m at frame "
                f"{max_elbow_row['frame']} "
                f"from {tuple(round(v, 3) for v in previous['elbow'])} "
                f"to {tuple(round(v, 3) for v in max_elbow_row['elbow'])}; "
                f"angle {previous['elbow_angle']:.2f} -> "
                f"{max_elbow_row['elbow_angle']:.2f}"
            )
        if max_head_delta > 2.5:
            errors.append(
                f"head jumps {max_head_delta:.3f} degrees at frame "
                f"{max_head_row['frame']}"
            )
        if max_angle_delta > 4.0:
            errors.append(
                f"elbow angle changes {max_angle_delta:.3f} degrees at frame "
                f"{max_angle_row['frame']}"
            )

        initial_upper_length = rows[0]["upper_length"]
        initial_lower_length = rows[0]["lower_length"]
        upper_length_drift = max(
            abs(row["upper_length"] - initial_upper_length) for row in rows
        )
        lower_length_drift = max(
            abs(row["lower_length"] - initial_lower_length) for row in rows
        )
        if upper_length_drift > 0.001 or lower_length_drift > 0.001:
            errors.append(
                "arm bone lengths drift "
                f"upper={upper_length_drift:.4f} lower={lower_length_drift:.4f} m"
            )

        hold_rows = rows[60:]
        wrist_drift = max(
            (row["wrist"] - hold_rows[0]["wrist"]).length for row in hold_rows
        )
        elbow_drift = max(
            (row["elbow"] - hold_rows[0]["elbow"]).length for row in hold_rows
        )
        if wrist_drift > 0.002 or elbow_drift > 0.002:
            errors.append(
                f"final hold drifts wrist={wrist_drift:.4f} elbow={elbow_drift:.4f} m"
            )

    proxy_objects = [
        obj.name for obj in bpy.data.objects if obj.get("validation_proxy_only")
    ]
    if proxy_objects:
        errors.append(f"non-anatomical proxy objects are forbidden: {proxy_objects}")
    return errors


def main():
    errors = validate()
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        sys.stderr.flush()
        os._exit(1)
    print("MAKEHUMAN_JEWELRY_MOTION_VALIDATION_OK")


if __name__ == "__main__":
    main()
