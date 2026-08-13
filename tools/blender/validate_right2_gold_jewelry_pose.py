from __future__ import annotations

import math
import os
import sys

import bpy


RIG_NAME = "RIG_RIGHT2_GOLD_UPPER_BODY"
MESH_NAME = "node_0"
ACTION_NAME = "ACT_RIGHT2_GOLD_JEWELRY_POISE_01"
CAMERA_NAME = "CAM_RIGHT2_GOLD_JEWELRY_POISE_01"


def degrees(value):
    return math.degrees(value)


def validate_motion(scene, rig):
    errors = []
    samples = []
    previous = None
    for frame in range(1, 73):
        scene.frame_set(frame)
        bpy.context.view_layer.update()
        head = rig.pose.bones["head"].rotation_euler.copy()
        neck = rig.pose.bones["neck"].rotation_euler.copy()
        chest = rig.pose.bones["chest"].rotation_euler.copy()
        camera = bpy.data.objects[CAMERA_NAME]
        current = {
            "frame": frame,
            "head": head,
            "neck": neck,
            "chest": chest,
            "camera_location": camera.matrix_world.translation.copy(),
            "camera_rotation": camera.matrix_world.to_quaternion(),
            "lens": camera.data.lens,
        }
        if previous is not None:
            current["head_step"] = max(
                abs(degrees(head[axis] - previous["head"][axis]))
                for axis in range(3)
            )
            current["camera_step"] = (
                current["camera_location"] - previous["camera_location"]
            ).length
            current["camera_angle_step"] = degrees(
                current["camera_rotation"]
                .rotation_difference(previous["camera_rotation"])
                .angle
            )
            current["lens_step"] = abs(current["lens"] - previous["lens"])
        samples.append(current)
        previous = current

    active = samples[11:56]
    for axis, label in ((0, "抬颏"), (1, "侧转")):
        reversals = []
        for index in range(1, len(active)):
            delta = degrees(active[index]["head"][axis] - active[index - 1]["head"][axis])
            if delta < -0.02:
                reversals.append((active[index]["frame"], delta))
        if reversals:
            errors.append(f"head {label} reverses: {reversals[:5]}")

    max_head_step = max(row.get("head_step", 0.0) for row in samples)
    if max_head_step > 0.75:
        errors.append(f"head moves {max_head_step:.3f} degrees in one frame")

    max_camera_step = max(row.get("camera_step", 0.0) for row in samples)
    max_camera_angle = max(row.get("camera_angle_step", 0.0) for row in samples)
    max_lens_step = max(row.get("lens_step", 0.0) for row in samples)
    if max_camera_step > 0.012:
        errors.append(f"camera moves {max_camera_step:.4f} m in one frame")
    if max_camera_angle > 0.40:
        errors.append(f"camera rotates {max_camera_angle:.3f} degrees in one frame")
    if max_lens_step > 0.45:
        errors.append(f"lens changes {max_lens_step:.3f} mm in one frame")

    hold = samples[55:]
    hold_head = hold[0]["head"]
    hold_span = max(
        max(abs(degrees(row["head"][axis] - hold_head[axis])) for axis in range(3))
        for row in hold
    )
    if hold_span > 0.02:
        errors.append(f"final head hold drifts {hold_span:.3f} degrees")

    for bone_name in (
        "upper_arm.L",
        "forearm.L",
        "hand.L",
        "upper_arm.R",
        "forearm.R",
        "hand.R",
    ):
        worst = 0.0
        for frame in range(1, 73):
            scene.frame_set(frame)
            bone = rig.pose.bones[bone_name]
            worst = max(worst, max(abs(degrees(value)) for value in bone.rotation_euler))
        if worst > 0.25:
            errors.append(f"unsupported arm bone {bone_name} rotates {worst:.3f} degrees")

    return errors


def validate():
    errors = []
    scene = bpy.context.scene
    rig = bpy.data.objects.get(RIG_NAME)
    mesh = bpy.data.objects.get(MESH_NAME)
    action = bpy.data.actions.get(ACTION_NAME)
    camera = bpy.data.objects.get(CAMERA_NAME)

    if rig is None or rig.type != "ARMATURE":
        errors.append(f"missing armature {RIG_NAME}")
    if mesh is None or mesh.type != "MESH":
        errors.append(f"missing original mesh {MESH_NAME}")
    elif len(mesh.data.vertices) < 300_000:
        errors.append("visible character is not the original high-resolution RIGHT2 mesh")
    elif mesh.hide_render:
        errors.append("original RIGHT2 mesh is hidden from render")
    if action is None:
        errors.append(f"missing action {ACTION_NAME}")
    if camera is None or camera.type != "CAMERA":
        errors.append(f"missing camera {CAMERA_NAME}")
    if (scene.frame_start, scene.frame_end, scene.render.fps) != (1, 72, 24):
        errors.append("scene timing must be frames 1..72 at 24 fps")

    forbidden = [
        obj.name
        for obj in bpy.data.objects
        if not obj.hide_render
        and (
            obj.get("validation_proxy_only")
            or obj.name.startswith("MH_")
            or "DEFORMATION_CAGE" in obj.name
        )
    ]
    if forbidden:
        errors.append(f"replacement geometry is render-visible: {forbidden}")

    if mesh is not None and rig is not None:
        direct_modifiers = [
            modifier
            for modifier in mesh.modifiers
            if modifier.type == "ARMATURE" and modifier.object == rig
        ]
        if not direct_modifiers:
            errors.append("original RIGHT2 mesh is not directly bound to its validated rig")
        indirect = [
            modifier.name
            for modifier in mesh.modifiers
            if modifier.type in {"SURFACE_DEFORM", "MESH_DEFORM"}
        ]
        if indirect:
            errors.append(f"original RIGHT2 mesh uses unsupported cage deformers: {indirect}")

    if action is not None:
        if action.get("name_zh") != "综合首饰展示·抬颏侧转":
            errors.append("action Chinese display name is missing")
        if action.get("source_character_id") != "CHAR_HUNYUAN_RIGHT2_GOLD_001":
            errors.append("action source_character_id is missing or incorrect")

    if rig is not None and action is not None and camera is not None:
        rig.animation_data_create()
        rig.animation_data.action = action
        errors.extend(validate_motion(scene, rig))
    return errors


def main():
    errors = validate()
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        sys.stderr.flush()
        os._exit(1)
    print("RIGHT2_GOLD_JEWELRY_POSE_VALIDATION_OK")


if __name__ == "__main__":
    main()
