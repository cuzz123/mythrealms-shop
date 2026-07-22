from __future__ import annotations

import math
import os
import sys

import bpy
from mathutils import Vector


RIG_NAME = "RIG_RIGHT2_GOLD_UPPER_BODY"
SOURCE_MESH_NAME = "node_0"
CAGE_NAME = "RIGHT2_GOLD_DEFORMATION_CAGE"
ACTION_NAME = "ACT_JEWELRY_TOUCH_EARRING_LEFT_001"
ANCHOR_NAME = "ANCHOR_RIGHT2_EAR_LEFT"
CAMERA_NAME = "CAM_VALIDATION_RIGHT2_CAGE_TOUCH_EARRING_LEFT"
SURFACE_MODIFIER_NAME = "RIGHT2_GOLD_CAGE_SURFACE_DEFORM"


def joint_positions(rig):
    world = rig.matrix_world
    return {
        "shoulder": world @ rig.pose.bones["upper_arm.L"].head,
        "elbow": world @ rig.pose.bones["forearm.L"].head,
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
        bpy.context.view_layer.update()
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
            current["angle_delta"] = abs(
                current["elbow_angle"] - previous["elbow_angle"]
            )
            current["head_delta"] = math.degrees(
                current["head_quat"].rotation_difference(previous["head_quat"]).angle
            )
        rows.append(current)
        previous = current
    return rows


def evaluated_group_centroid(obj, group_name, minimum_weight=0.5):
    group = obj.vertex_groups.get(group_name)
    if group is None:
        raise RuntimeError(f"visible mesh is missing vertex group {group_name}")

    indices = []
    for vertex in obj.data.vertices:
        if any(
            element.group == group.index and element.weight >= minimum_weight
            for element in vertex.groups
        ):
            indices.append(vertex.index)
    if not indices:
        raise RuntimeError(f"visible mesh has no strongly weighted {group_name} vertices")

    depsgraph = bpy.context.evaluated_depsgraph_get()
    evaluated = obj.evaluated_get(depsgraph)
    evaluated_mesh = evaluated.to_mesh()
    try:
        world = evaluated.matrix_world
        return sum(
            (world @ evaluated_mesh.vertices[index].co for index in indices),
            Vector(),
        ) / len(indices)
    finally:
        evaluated.to_mesh_clear()


def validate():
    errors = []
    scene = bpy.context.scene
    rig = bpy.data.objects.get(RIG_NAME)
    source = bpy.data.objects.get(SOURCE_MESH_NAME)
    cage = bpy.data.objects.get(CAGE_NAME)
    action = bpy.data.actions.get(ACTION_NAME)
    anchor = bpy.data.objects.get(ANCHOR_NAME)
    camera = bpy.data.objects.get(CAMERA_NAME)

    if rig is None or rig.type != "ARMATURE":
        errors.append(f"missing armature {RIG_NAME}")
    if source is None or source.type != "MESH":
        errors.append(f"missing original Hunyuan mesh {SOURCE_MESH_NAME}")
    elif len(source.data.vertices) < 300_000:
        errors.append("visible character is not the original high-resolution RIGHT2 mesh")
    elif source.hide_render:
        errors.append("original RIGHT2 mesh is hidden from render")
    if cage is None or cage.type != "MESH":
        errors.append(f"missing deformation cage {CAGE_NAME}")
    elif not cage.hide_render:
        errors.append("deformation cage must be hidden from render")
    if action is None:
        errors.append(f"missing action {ACTION_NAME}")
    if anchor is None:
        errors.append(f"missing ear anchor {ANCHOR_NAME}")
    if camera is None or camera.type != "CAMERA":
        errors.append(f"missing validation camera {CAMERA_NAME}")
    if (scene.frame_start, scene.frame_end, scene.render.fps) != (1, 72, 24):
        errors.append("scene timing must be frames 1..72 at 24 fps")

    if source is not None and cage is not None:
        modifiers = [
            modifier
            for modifier in source.modifiers
            if modifier.name == SURFACE_MODIFIER_NAME
            and modifier.type == "SURFACE_DEFORM"
            and modifier.target == cage
        ]
        if not modifiers:
            errors.append("original RIGHT2 mesh is not driven by the deformation cage")
        elif not modifiers[0].is_bound:
            errors.append("RIGHT2 surface-deform modifier is not bound")
    if cage is not None and rig is not None:
        armature_modifiers = [
            modifier
            for modifier in cage.modifiers
            if modifier.type == "ARMATURE" and modifier.object == rig
        ]
        if not armature_modifiers:
            errors.append("deformation cage is not bound to the RIGHT2 armature")

    forbidden_visible = [
        obj.name
        for obj in bpy.data.objects
        if not obj.hide_render
        and (
            obj.get("validation_proxy_only")
            or obj.name.startswith("MH_")
            or "PROXY" in obj.name.upper()
        )
    ]
    if forbidden_visible:
        errors.append(f"forbidden replacement meshes are render-visible: {forbidden_visible}")

    if action is not None:
        if action.get("validation_character_id") != "CHAR_HUNYUAN_RIGHT2_GOLD_001":
            errors.append("action validation_character_id is missing or incorrect")
        if action.get("deformation_mode") != "hidden_cage_surface_deform_v1":
            errors.append("action deformation_mode marker is missing")

    if rig is not None and action is not None and anchor is not None:
        rig.animation_data_create()
        rig.animation_data.action = action
        live_ik = [
            constraint.name
            for bone_name in ("forearm.L", "hand.L")
            for constraint in rig.pose.bones[bone_name].constraints
            if constraint.type == "IK"
        ]
        if live_ik:
            errors.append(f"release action retains live IK constraints: {live_ik}")

        rows = sample_motion(rig, scene)
        touch = rows[63]
        if not 30.0 <= touch["elbow_angle"] <= 125.0:
            errors.append(
                f"touch elbow angle {touch['elbow_angle']:.2f} is outside 30..125 degrees"
            )
        if touch["elbow"].x < 0.16:
            errors.append(f"touch elbow collapses into torso at x={touch['elbow'].x:.3f}")

        anchor_location = Vector(anchor.location)
        contact_distance = min(
            min(
                (row["wrist"] - anchor_location).length,
                (row["hand_tip"] - anchor_location).length,
            )
            for row in rows[50:]
        )
        if contact_distance > 0.055:
            errors.append(f"RIGHT2 hand misses ear anchor by {contact_distance:.4f} m")

        max_wrist = max(rows, key=lambda row: row.get("wrist_delta", 0.0))
        max_elbow = max(rows, key=lambda row: row.get("elbow_delta", 0.0))
        max_angle = max(rows, key=lambda row: row.get("angle_delta", 0.0))
        max_head = max(rows, key=lambda row: row.get("head_delta", 0.0))
        if max_wrist.get("wrist_delta", 0.0) > 0.025:
            errors.append(
                f"wrist jumps {max_wrist['wrist_delta']:.4f} m at frame {max_wrist['frame']}"
            )
        if max_elbow.get("elbow_delta", 0.0) > 0.025:
            errors.append(
                f"elbow jumps {max_elbow['elbow_delta']:.4f} m at frame {max_elbow['frame']}"
            )
        if max_angle.get("angle_delta", 0.0) > 4.0:
            errors.append(
                f"elbow angle changes {max_angle['angle_delta']:.3f} degrees "
                f"at frame {max_angle['frame']}"
            )
        if max_head.get("head_delta", 0.0) > 2.5:
            errors.append(
                f"head jumps {max_head['head_delta']:.3f} degrees "
                f"at frame {max_head['frame']}"
            )

        initial_upper = rows[0]["upper_length"]
        initial_lower = rows[0]["lower_length"]
        upper_drift = max(abs(row["upper_length"] - initial_upper) for row in rows)
        lower_drift = max(abs(row["lower_length"] - initial_lower) for row in rows)
        if upper_drift > 0.001 or lower_drift > 0.001:
            errors.append(
                f"arm bone lengths drift upper={upper_drift:.4f} "
                f"lower={lower_drift:.4f} m"
            )

        hold_rows = rows[64:]
        wrist_drift = max(
            (row["wrist"] - hold_rows[0]["wrist"]).length for row in hold_rows
        )
        elbow_drift = max(
            (row["elbow"] - hold_rows[0]["elbow"]).length for row in hold_rows
        )
        if wrist_drift > 0.001 or elbow_drift > 0.001:
            errors.append(
                f"final hold drifts wrist={wrist_drift:.4f} elbow={elbow_drift:.4f} m"
            )

        if source is not None:
            scene.frame_set(1)
            bpy.context.view_layer.update()
            visual_hand_start = evaluated_group_centroid(source, "hand.L")
            scene.frame_set(64)
            bpy.context.view_layer.update()
            visual_hand_touch = evaluated_group_centroid(source, "hand.L")
            visual_travel = (visual_hand_touch - visual_hand_start).length
            visual_anchor_distance = (visual_hand_touch - anchor_location).length
            if visual_travel < 0.30:
                errors.append(
                    "visible RIGHT2 hand does not follow the armature: "
                    f"centroid travels only {visual_travel:.4f} m"
                )
            if visual_anchor_distance > 0.18:
                errors.append(
                    "visible RIGHT2 hand misses the earring area by "
                    f"{visual_anchor_distance:.4f} m"
                )
    return errors


def main():
    errors = validate()
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        sys.stderr.flush()
        os._exit(1)
    print("RIGHT2_CAGE_JEWELRY_MOTION_VALIDATION_OK")


if __name__ == "__main__":
    main()
