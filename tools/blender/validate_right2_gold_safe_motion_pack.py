from __future__ import annotations

import json
import math
import os
import sys
from pathlib import Path

import bpy


ROOT = Path(__file__).resolve().parents[2]
PACK_DIR = (
    ROOT
    / "video-pipeline"
    / "asset-library"
    / "06-motions"
    / "RIGHT2_GOLD_JEWELRY_SAFE_PACK_001"
)
MANIFEST_PATH = PACK_DIR / "motion_manifest.json"
RIG_NAME = "RIG_RIGHT2_GOLD_UPPER_BODY"
MESH_NAME = "node_0"
EXPECTED_COUNT = 30
MOTION_CATALOG_ID = "5df25c2a-d38b-4c9c-8e5c-911d5cab2cb0"
CAMERA_CATALOG_ID = "b9688236-7945-4786-b7fa-2d007689e645"
TRACKED_BONES = (
    "spine_01",
    "spine_02",
    "chest",
    "neck",
    "head",
    "clavicle.L",
    "clavicle.R",
)
LOCKED_ARM_BONES = (
    "upper_arm.L",
    "forearm.L",
    "hand.L",
    "upper_arm.R",
    "forearm.R",
    "hand.R",
)
SAFE_LIMITS = {
    "spine_01": (0.025, 0.025, 0.035),
    "spine_02": (0.025, 0.030, 0.040),
    "chest": (0.040, 0.040, 0.040),
    "neck": (0.060, 0.065, 0.040),
    "head": (0.120, 0.130, 0.060),
    "clavicle.L": (0.020, 0.020, 0.020),
    "clavicle.R": (0.020, 0.020, 0.020),
}


def degrees(value):
    return math.degrees(value)


def reset_pose(rig):
    rig.animation_data_create()
    rig.animation_data.action = None
    for bone in rig.pose.bones:
        bone.rotation_mode = "XYZ"
        bone.location = (0.0, 0.0, 0.0)
        bone.rotation_euler = (0.0, 0.0, 0.0)
        bone.scale = (1.0, 1.0, 1.0)


def sample_action(scene, rig, action):
    reset_pose(rig)
    rig.animation_data.action = action
    samples = []
    previous_quaternions = None
    for frame in range(1, 73):
        scene.frame_set(frame)
        bpy.context.view_layer.update()
        rotations = {
            name: tuple(rig.pose.bones[name].rotation_euler)
            for name in TRACKED_BONES + LOCKED_ARM_BONES
        }
        quaternions = {
            name: rig.pose.bones[name].matrix.to_quaternion()
            for name in TRACKED_BONES
        }
        sample = {"frame": frame, "rotations": rotations, "quaternions": quaternions}
        if previous_quaternions is not None:
            sample["max_step"] = max(
                degrees(
                    quaternions[name]
                    .rotation_difference(previous_quaternions[name])
                    .angle
                )
                for name in TRACKED_BONES
            )
        samples.append(sample)
        previous_quaternions = quaternions
    return samples


def validate_action(scene, rig, entry, action):
    errors = []
    samples = sample_action(scene, rig, action)
    max_step = max(sample.get("max_step", 0.0) for sample in samples)
    if max_step > 0.90:
        errors.append(f"motion step is {max_step:.3f} degrees")

    for bone_name, limits in SAFE_LIMITS.items():
        for axis, limit in enumerate(limits):
            peak = max(abs(sample["rotations"][bone_name][axis]) for sample in samples)
            if peak > limit + 1e-5:
                errors.append(
                    f"{bone_name} axis {axis} exceeds safe limit "
                    f"{degrees(peak):.2f}>{degrees(limit):.2f} degrees"
                )

    for bone_name in LOCKED_ARM_BONES:
        peak = max(
            max(abs(degrees(value)) for value in sample["rotations"][bone_name])
            for sample in samples
        )
        if peak > 0.25:
            errors.append(f"locked arm bone {bone_name} rotates {peak:.3f} degrees")

    active = samples[11:56]
    for bone_name in TRACKED_BONES:
        for axis in range(3):
            start = active[0]["rotations"][bone_name][axis]
            end = active[-1]["rotations"][bone_name][axis]
            direction = 1.0 if end >= start else -1.0
            if abs(end - start) < math.radians(0.08):
                continue
            reversals = []
            for index in range(1, len(active)):
                delta = (
                    active[index]["rotations"][bone_name][axis]
                    - active[index - 1]["rotations"][bone_name][axis]
                ) * direction
                if degrees(delta) < -0.02:
                    reversals.append(active[index]["frame"])
            if reversals:
                errors.append(
                    f"{bone_name} axis {axis} reverses at frames {reversals[:5]}"
                )

    hold_start = int(entry.get("hold_start", 56))
    hold = samples[hold_start - 1 :]
    base = hold[0]["rotations"]
    hold_span = max(
        abs(degrees(sample["rotations"][bone_name][axis] - base[bone_name][axis]))
        for sample in hold
        for bone_name in TRACKED_BONES
        for axis in range(3)
    )
    if hold_span > 0.02:
        errors.append(f"final hold drifts {hold_span:.3f} degrees")
    return errors


def sample_camera(scene, camera):
    rows = []
    previous = None
    for frame in range(1, 73):
        scene.frame_set(frame)
        bpy.context.view_layer.update()
        row = {
            "frame": frame,
            "location": camera.matrix_world.translation.copy(),
            "rotation": camera.matrix_world.to_quaternion(),
            "lens": camera.data.lens,
        }
        if previous is not None:
            row["location_step"] = (row["location"] - previous["location"]).length
            row["rotation_step"] = degrees(
                row["rotation"].rotation_difference(previous["rotation"]).angle
            )
            row["lens_step"] = abs(row["lens"] - previous["lens"])
        rows.append(row)
        previous = row
    return rows


def validate_camera(scene, entry, camera):
    errors = []
    rows = sample_camera(scene, camera)
    max_location = max(row.get("location_step", 0.0) for row in rows)
    max_rotation = max(row.get("rotation_step", 0.0) for row in rows)
    max_lens = max(row.get("lens_step", 0.0) for row in rows)
    if max_location > 0.018:
        errors.append(f"camera moves {max_location:.4f} m in one frame")
    if max_rotation > 0.55:
        errors.append(f"camera rotates {max_rotation:.3f} degrees in one frame")
    if max_lens > 0.65:
        errors.append(f"lens changes {max_lens:.3f} mm in one frame")
    if not 45.0 <= min(row["lens"] for row in rows):
        errors.append("camera lens drops below 45 mm")
    if max(row["lens"] for row in rows) > 110.0:
        errors.append("camera lens exceeds 110 mm")
    if not camera.data.dof.use_dof or camera.data.dof.focus_object is None:
        errors.append("camera is missing object-based depth of field")

    hold_start = int(entry.get("hold_start", 56))
    hold = rows[hold_start - 1 :]
    location_span = max((row["location"] - hold[0]["location"]).length for row in hold)
    rotation_span = max(
        degrees(row["rotation"].rotation_difference(hold[0]["rotation"]).angle)
        for row in hold
    )
    lens_span = max(abs(row["lens"] - hold[0]["lens"]) for row in hold)
    if location_span > 0.001 or rotation_span > 0.02 or lens_span > 0.02:
        errors.append(
            "camera final hold drifts "
            f"location={location_span:.4f} rotation={rotation_span:.3f} lens={lens_span:.3f}"
        )
    return errors


def validate():
    errors = []
    if not MANIFEST_PATH.exists():
        return [f"missing manifest {MANIFEST_PATH}"]
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    entries = manifest.get("motions", [])
    if len(entries) != EXPECTED_COUNT:
        errors.append(f"manifest has {len(entries)} motions, expected {EXPECTED_COUNT}")
    action_ids = [entry.get("action_id") for entry in entries]
    camera_ids = [entry.get("camera_id") for entry in entries]
    if len(set(action_ids)) != len(action_ids):
        errors.append("manifest action IDs are not unique")
    if len(set(camera_ids)) != len(camera_ids):
        errors.append("manifest camera IDs are not unique")
    approved = [entry for entry in entries if entry.get("status") == "approved"]
    if len(approved) != EXPECTED_COUNT:
        errors.append(f"expected {EXPECTED_COUNT} approved motions, got {len(approved)}")
    if manifest.get("approved_count") != EXPECTED_COUNT:
        errors.append(
            f"manifest approved_count must be {EXPECTED_COUNT}, got "
            f"{manifest.get('approved_count')}"
        )
    if manifest.get("candidate_count") != 0:
        errors.append(
            f"manifest candidate_count must be 0, got {manifest.get('candidate_count')}"
        )
    if manifest.get("status") != "approved":
        errors.append("manifest pack status must be approved")
    for entry in entries:
        if entry.get("qc_status") != "approved":
            errors.append(f"{entry.get('action_id')}: manifest qc_status must be approved")

    scene = bpy.context.scene
    rig = bpy.data.objects.get(RIG_NAME)
    mesh = bpy.data.objects.get(MESH_NAME)
    if rig is None or rig.type != "ARMATURE":
        errors.append(f"missing armature {RIG_NAME}")
    if mesh is None or mesh.type != "MESH":
        errors.append(f"missing original mesh {MESH_NAME}")
    elif len(mesh.data.vertices) < 300_000:
        errors.append("visible character is not the original high-resolution RIGHT2 mesh")
    elif mesh.hide_render:
        errors.append("original RIGHT2 mesh is hidden from render")
    if (scene.frame_start, scene.frame_end, scene.render.fps) != (1, 72, 24):
        errors.append("scene timing must be frames 1..72 at 24 fps")

    if mesh is not None and rig is not None:
        direct = [
            modifier
            for modifier in mesh.modifiers
            if modifier.type == "ARMATURE" and modifier.object == rig
        ]
        if not direct:
            errors.append("original RIGHT2 mesh is not directly bound to its rig")
        indirect = [
            modifier.name
            for modifier in mesh.modifiers
            if modifier.type in {"SURFACE_DEFORM", "MESH_DEFORM"}
        ]
        if indirect:
            errors.append(f"unsupported cage deformers remain: {indirect}")

    forbidden_visible = [
        obj.name
        for obj in bpy.data.objects
        if not obj.hide_render
        and (
            obj.get("validation_proxy_only")
            or obj.name.startswith("MH_")
            or "DEFORMATION_CAGE" in obj.name
        )
    ]
    if forbidden_visible:
        errors.append(f"replacement geometry is render-visible: {forbidden_visible}")

    if rig is not None:
        for entry in entries:
            action_id = entry.get("action_id")
            camera_id = entry.get("camera_id")
            action = bpy.data.actions.get(action_id)
            camera = bpy.data.objects.get(camera_id)
            prefix = f"{action_id}: "
            if action is None:
                errors.append(prefix + "missing action")
                continue
            if camera is None or camera.type != "CAMERA":
                errors.append(prefix + f"missing camera {camera_id}")
                continue
            if action.get("name_zh") != entry.get("name_zh"):
                errors.append(prefix + "Chinese motion name does not match manifest")
            if action.get("status") != entry.get("status"):
                errors.append(prefix + "motion status does not match manifest")
            if action.get("qc_status") != "approved":
                errors.append(prefix + "motion qc_status must be approved")
            if action.get("paired_camera_id") != camera_id:
                errors.append(prefix + "paired camera marker is incorrect")
            if action.asset_data is None:
                errors.append(prefix + "motion is not marked as an Asset Browser asset")
            elif str(action.asset_data.catalog_id) != MOTION_CATALOG_ID:
                errors.append(prefix + "motion Asset Browser catalog is incorrect")
            if camera.get("status") != entry.get("status"):
                errors.append(prefix + "camera status does not match manifest")
            if camera.get("qc_status") != "approved":
                errors.append(prefix + "camera qc_status must be approved")
            if camera.get("name_zh") != entry.get("camera_name_zh"):
                errors.append(prefix + "Chinese camera name does not match manifest")
            if camera.asset_data is None:
                errors.append(prefix + "camera is not marked as an Asset Browser asset")
            elif str(camera.asset_data.catalog_id) != CAMERA_CATALOG_ID:
                errors.append(prefix + "camera Asset Browser catalog is incorrect")
            errors.extend(prefix + error for error in validate_action(scene, rig, entry, action))
            errors.extend(prefix + error for error in validate_camera(scene, entry, camera))
    return errors


def main():
    errors = validate()
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        sys.stderr.flush()
        os._exit(1)
    print("RIGHT2_GOLD_SAFE_MOTION_PACK_VALIDATION_OK")


if __name__ == "__main__":
    main()
