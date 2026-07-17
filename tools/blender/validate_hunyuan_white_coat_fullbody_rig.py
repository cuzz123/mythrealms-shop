from __future__ import annotations

import json
import math
from pathlib import Path

import bpy


ROOT = Path(__file__).resolve().parents[2]
CHARACTER_DIR = (
    ROOT
    / "video-pipeline"
    / "asset-library"
    / "05-characters"
    / "CHAR_HUNYUAN_WHITE_COAT_FULLBODY_001"
)
RIG_BLEND = CHARACTER_DIR / "CHAR_HUNYUAN_WHITE_COAT_FULLBODY_RIG_v1.blend"
HIRES_NAME = "MESH_WHITE_COAT_HIRES"
PROXY_NAME = "MESH_WHITE_COAT_PROXY"
RIG_NAME = "RIG_WHITE_COAT_FULLBODY"
EXPECTED_BONES = {
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
    "upper_leg.L",
    "lower_leg.L",
    "foot.L",
    "toe.L",
    "upper_leg.R",
    "lower_leg.R",
    "foot.R",
    "toe.R",
    "foot_ik.L",
    "foot_ik.R",
    "knee_pole.L",
    "knee_pole.R",
}
LEG_GROUPS = {
    "upper_leg.L",
    "lower_leg.L",
    "foot.L",
    "toe.L",
    "upper_leg.R",
    "lower_leg.R",
    "foot.R",
    "toe.R",
}


def validate() -> list[str]:
    errors: list[str] = []
    if not RIG_BLEND.exists():
        return [f"missing rig blend: {RIG_BLEND}"]

    hires = bpy.data.objects.get(HIRES_NAME)
    proxy = bpy.data.objects.get(PROXY_NAME)
    rig = bpy.data.objects.get(RIG_NAME)
    if hires is None or hires.type != "MESH":
        errors.append(f"missing mesh object {HIRES_NAME}")
    if proxy is None or proxy.type != "MESH":
        errors.append(f"missing mesh object {PROXY_NAME}")
    if rig is None or rig.type != "ARMATURE":
        errors.append(f"missing armature object {RIG_NAME}")
    if errors:
        return errors

    if len(hires.data.vertices) < 290_000:
        errors.append(
            f"high-res mesh has {len(hires.data.vertices)} vertices, expected >= 290000"
        )
    proxy_vertices = len(proxy.data.vertices)
    if not 20_000 <= proxy_vertices <= 35_000:
        errors.append(
            f"proxy has {proxy_vertices} vertices, expected between 20000 and 35000"
        )
    if not proxy.hide_render:
        errors.append("proxy must be hidden from renders")
    if hires.hide_render:
        errors.append("high-res mesh must remain render-visible")
    if len(hires.data.materials) == 0:
        errors.append("high-res mesh lost its source material")

    bone_names = set(rig.data.bones.keys())
    missing_bones = sorted(EXPECTED_BONES - bone_names)
    if missing_bones:
        errors.append(f"missing bones: {missing_bones}")
    if rig.get("rig_version") != 1:
        errors.append("rig_version custom property must equal 1")
    try:
        limits = json.loads(rig.get("joint_limits_deg", "{}"))
    except json.JSONDecodeError:
        limits = {}
    if not {"upper_leg", "lower_leg", "foot"}.issubset(limits):
        errors.append("rig joint_limits_deg metadata is incomplete")

    armature_modifiers = [
        modifier
        for modifier in hires.modifiers
        if modifier.type == "ARMATURE" and modifier.object == rig
    ]
    if not armature_modifiers:
        errors.append("high-res mesh is missing its Armature modifier")
    if hires.parent != rig:
        errors.append("high-res mesh must be parented to the fullbody rig")

    group_names = {group.name for group in hires.vertex_groups}
    missing_groups = sorted(LEG_GROUPS - group_names)
    if missing_groups:
        errors.append(f"missing high-res leg vertex groups: {missing_groups}")
    for group_name in sorted(LEG_GROUPS & group_names):
        group_index = hires.vertex_groups[group_name].index
        members = sum(
            1
            for vertex in hires.data.vertices
            if any(group.group == group_index and group.weight > 0.001 for group in vertex.groups)
        )
        if members == 0:
            errors.append(f"high-res leg group {group_name} is empty")

    deform_names = {bone.name for bone in rig.data.bones if bone.use_deform}
    unweighted = 0
    for vertex in hires.data.vertices:
        total = sum(
            group.weight
            for group in vertex.groups
            if hires.vertex_groups[group.group].name in deform_names
        )
        if total < 0.001:
            unweighted += 1
    if unweighted:
        errors.append(f"unweighted high-res vertices={unweighted}")

    for side in ("L", "R"):
        lower_leg = rig.pose.bones.get(f"lower_leg.{side}")
        if lower_leg is None:
            continue
        ik_constraints = [
            constraint
            for constraint in lower_leg.constraints
            if constraint.type == "IK"
            and constraint.subtarget == f"foot_ik.{side}"
            and constraint.pole_subtarget == f"knee_pole.{side}"
        ]
        if len(ik_constraints) != 1:
            errors.append(f"lower_leg.{side} must have one foot IK constraint")
        elif ik_constraints[0].chain_count != 2:
            errors.append(f"lower_leg.{side} IK chain_count must equal 2")
        elif abs(ik_constraints[0].pole_angle + math.pi / 2.0) > math.radians(0.1):
            errors.append(f"lower_leg.{side} IK pole angle must equal -90 degrees")
        upper_leg = rig.pose.bones.get(f"upper_leg.{side}")
        if upper_leg is not None:
            rest_rotation = rig.data.bones[f"upper_leg.{side}"].matrix_local.to_quaternion()
            neutral_delta = math.degrees(
                upper_leg.matrix.to_quaternion().rotation_difference(rest_rotation).angle
            )
            if neutral_delta > 2.0:
                errors.append(
                    f"upper_leg.{side} neutral IK twist is {neutral_delta:.3f} degrees"
                )
    return errors


def main() -> None:
    errors = validate()
    if errors:
        print("WHITE_COAT_FULLBODY_RIG_VALIDATION_FAILED")
        for error in errors:
            print(f"- {error}")
        raise SystemExit(1)
    print("WHITE_COAT_FULLBODY_RIG_VALIDATION_OK")


if __name__ == "__main__":
    main()
