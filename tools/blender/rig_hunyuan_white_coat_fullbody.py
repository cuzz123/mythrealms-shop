from __future__ import annotations

import json
import math
from pathlib import Path

import bpy
from mathutils import Vector


ROOT = Path(__file__).resolve().parents[2]
CHARACTER_DIR = (
    ROOT
    / "video-pipeline"
    / "asset-library"
    / "05-characters"
    / "CHAR_HUNYUAN_WHITE_COAT_FULLBODY_001"
)
SOURCE_GLB = CHARACTER_DIR / "source.glb"
OUTPUT_BLEND = CHARACTER_DIR / "CHAR_HUNYUAN_WHITE_COAT_FULLBODY_RIG_v1.blend"
HIRES_NAME = "MESH_WHITE_COAT_HIRES"
PROXY_NAME = "MESH_WHITE_COAT_PROXY"
RIG_NAME = "RIG_WHITE_COAT_FULLBODY"
TARGET_PROXY_VERTICES = 26_000


def world_bounds(obj: bpy.types.Object) -> tuple[Vector, Vector]:
    points = [obj.matrix_world @ Vector(corner) for corner in obj.bound_box]
    minimum = Vector(tuple(min(point[axis] for point in points) for axis in range(3)))
    maximum = Vector(tuple(max(point[axis] for point in points) for axis in range(3)))
    return minimum, maximum


def apply_object_modifier(obj: bpy.types.Object, modifier_name: str) -> None:
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier=modifier_name)


def make_proxy(hires: bpy.types.Object) -> bpy.types.Object:
    proxy = hires.copy()
    proxy.data = hires.data.copy()
    proxy.animation_data_clear()
    proxy.name = PROXY_NAME
    proxy.data.name = f"{PROXY_NAME}_DATA"
    bpy.context.collection.objects.link(proxy)
    ratio = min(1.0, TARGET_PROXY_VERTICES / max(1, len(proxy.data.vertices)))
    modifier = proxy.modifiers.new("WHITE_COAT_PROXY_DECIMATE", "DECIMATE")
    modifier.decimate_type = "COLLAPSE"
    modifier.ratio = ratio
    modifier.use_collapse_triangulate = True
    apply_object_modifier(proxy, modifier.name)
    for iteration in range(2):
        current = len(proxy.data.vertices)
        if 20_000 <= current <= 35_000:
            break
        correction = min(0.95, TARGET_PROXY_VERTICES / max(1, current))
        modifier = proxy.modifiers.new(
            f"WHITE_COAT_PROXY_DECIMATE_CORRECTION_{iteration + 1}", "DECIMATE"
        )
        modifier.decimate_type = "COLLAPSE"
        modifier.ratio = correction
        modifier.use_collapse_triangulate = True
        apply_object_modifier(proxy, modifier.name)
    proxy["proxy_target_vertices"] = TARGET_PROXY_VERTICES
    proxy["validation_proxy_only"] = True
    proxy.hide_render = True
    proxy.display_type = "WIRE"
    return proxy


def create_fullbody_rig(minimum: Vector, maximum: Vector) -> bpy.types.Object:
    height = maximum.z - minimum.z
    center_x = (minimum.x + maximum.x) * 0.5
    center_y = (minimum.y + maximum.y) * 0.5

    def point(x: float, y: float, z: float) -> Vector:
        return Vector((center_x + x * height, center_y + y * height, minimum.z + z * height))

    armature_data = bpy.data.armatures.new(f"{RIG_NAME}_DATA")
    rig = bpy.data.objects.new(RIG_NAME, armature_data)
    bpy.context.collection.objects.link(rig)
    rig.show_in_front = True
    rig["rig_version"] = 1
    rig["character_id"] = "CHAR_HUNYUAN_WHITE_COAT_FULLBODY_001"
    rig["body_height"] = height
    rig["forward_axis"] = "-Y"
    rig["joint_limits_deg"] = json.dumps(
        {
            "upper_leg": {"flexion": [-20, 45], "abduction": [-12, 12]},
            "lower_leg": {"flexion": [0, 65]},
            "foot": {"pitch": [-25, 25]},
        },
        ensure_ascii=False,
    )

    bpy.context.view_layer.objects.active = rig
    rig.select_set(True)
    bpy.ops.object.mode_set(mode="EDIT")

    def add_bone(
        name: str,
        head: Vector,
        tail: Vector,
        parent: str | None = None,
        connected: bool = False,
        deform: bool = True,
    ) -> bpy.types.EditBone:
        bone = armature_data.edit_bones.new(name)
        bone.head = head
        bone.tail = tail
        bone.roll = 0.0
        bone.use_deform = deform
        if parent:
            bone.parent = armature_data.edit_bones[parent]
            bone.use_connect = connected
        return bone

    add_bone("root", point(0, 0, 0.00), point(0, 0, 0.06), deform=False)
    add_bone("pelvis", point(0, 0, 0.49), point(0, 0, 0.57), "root")
    add_bone("spine_01", point(0, 0, 0.57), point(0, 0, 0.65), "pelvis", True)
    add_bone("spine_02", point(0, 0, 0.65), point(0, 0, 0.73), "spine_01", True)
    add_bone("chest", point(0, 0, 0.73), point(0, 0, 0.82), "spine_02", True)
    add_bone("neck", point(0, 0, 0.82), point(0, 0, 0.88), "chest", True)
    add_bone("head", point(0, 0, 0.88), point(0, 0, 0.99), "neck", True)

    for side, sign in (("L", 1.0), ("R", -1.0)):
        add_bone(
            f"clavicle.{side}",
            point(0.0, 0.0, 0.79),
            point(0.105 * sign, 0.0, 0.79),
            "chest",
        )
        add_bone(
            f"upper_arm.{side}",
            point(0.105 * sign, 0.0, 0.79),
            point(0.135 * sign, -0.005, 0.62),
            f"clavicle.{side}",
            True,
        )
        add_bone(
            f"forearm.{side}",
            point(0.135 * sign, -0.005, 0.62),
            point(0.145 * sign, -0.008, 0.47),
            f"upper_arm.{side}",
            True,
        )
        add_bone(
            f"hand.{side}",
            point(0.145 * sign, -0.008, 0.47),
            point(0.150 * sign, -0.015, 0.39),
            f"forearm.{side}",
            True,
        )

        add_bone(
            f"upper_leg.{side}",
            point(0.058 * sign, 0.0, 0.51),
            point(0.060 * sign, -0.010, 0.30),
            "pelvis",
        )
        add_bone(
            f"lower_leg.{side}",
            point(0.060 * sign, -0.010, 0.30),
            point(0.060 * sign, 0.0, 0.085),
            f"upper_leg.{side}",
            True,
        )
        add_bone(
            f"foot.{side}",
            point(0.060 * sign, 0.0, 0.085),
            point(0.060 * sign, -0.075, 0.035),
            f"lower_leg.{side}",
            True,
        )
        add_bone(
            f"toe.{side}",
            point(0.060 * sign, -0.075, 0.035),
            point(0.060 * sign, -0.125, 0.025),
            f"foot.{side}",
            True,
        )
        add_bone(
            f"foot_ik.{side}",
            point(0.060 * sign, 0.0, 0.085),
            point(0.060 * sign, -0.075, 0.035),
            "root",
            deform=False,
        )
        add_bone(
            f"knee_pole.{side}",
            point(0.060 * sign, -0.24, 0.30),
            point(0.060 * sign, -0.24, 0.37),
            "root",
            deform=False,
        )

    bpy.ops.object.mode_set(mode="POSE")
    for side in ("L", "R"):
        constraint = rig.pose.bones[f"lower_leg.{side}"].constraints.new("IK")
        constraint.name = f"FOOT_IK_{side}"
        constraint.target = rig
        constraint.subtarget = f"foot_ik.{side}"
        constraint.pole_target = rig
        constraint.pole_subtarget = f"knee_pole.{side}"
        constraint.chain_count = 2
        constraint.pole_angle = -math.pi / 2.0
        constraint.use_stretch = False
    bpy.ops.object.mode_set(mode="OBJECT")
    rig.select_set(False)
    return rig


def clear_vertex_groups(obj: bpy.types.Object) -> None:
    while obj.vertex_groups:
        obj.vertex_groups.remove(obj.vertex_groups[0])


def assign_procedural_weights(
    obj: bpy.types.Object,
    rig: bpy.types.Object,
    minimum: Vector,
    maximum: Vector,
) -> None:
    clear_vertex_groups(obj)
    deform_names = [bone.name for bone in rig.data.bones if bone.use_deform]
    groups = {name: obj.vertex_groups.new(name=name) for name in deform_names}
    height = maximum.z - minimum.z
    center_x = (minimum.x + maximum.x) * 0.5
    center_y = (minimum.y + maximum.y) * 0.5
    assignments: dict[str, list[int]] = {name: [] for name in deform_names}

    for vertex in obj.data.vertices:
        world = obj.matrix_world @ vertex.co
        x = (world.x - center_x) / height
        y = (world.y - center_y) / height
        z = (world.z - minimum.z) / height
        side = "L" if x >= 0.0 else "R"
        ax = abs(x)
        if z >= 0.88:
            bone = "head"
        elif z >= 0.82:
            bone = "neck"
        elif ax >= 0.125 and z < 0.49:
            bone = f"hand.{side}"
        elif ax >= 0.120 and z < 0.63:
            bone = f"forearm.{side}"
        elif ax >= 0.095 and z < 0.80:
            bone = f"upper_arm.{side}"
        elif ax >= 0.085 and z >= 0.73:
            bone = f"clavicle.{side}"
        elif z >= 0.73:
            bone = "chest"
        elif z >= 0.65:
            bone = "spine_02"
        elif z >= 0.56:
            bone = "spine_01"
        elif z >= 0.30:
            bone = "pelvis" if ax < 0.020 else f"upper_leg.{side}"
        elif z >= 0.07:
            bone = f"lower_leg.{side}"
        elif y < -0.025:
            bone = f"toe.{side}"
        else:
            bone = f"foot.{side}"
        assignments[bone].append(vertex.index)

    for bone_name, indices in assignments.items():
        if indices:
            groups[bone_name].add(indices, 1.0, "REPLACE")


def has_complete_weights(obj: bpy.types.Object, rig: bpy.types.Object) -> bool:
    deform_names = {bone.name for bone in rig.data.bones if bone.use_deform}
    available = {group.name for group in obj.vertex_groups}
    if not deform_names.issubset(available):
        return False
    for name in deform_names:
        group_index = obj.vertex_groups[name].index
        if not any(
            assignment.group == group_index and assignment.weight > 0.001
            for vertex in obj.data.vertices
            for assignment in vertex.groups
        ):
            return False
    return all(
        any(
            obj.vertex_groups[assignment.group].name in deform_names
            and assignment.weight > 0.001
            for assignment in vertex.groups
        )
        for vertex in obj.data.vertices
    )


def bind_proxy(
    proxy: bpy.types.Object,
    rig: bpy.types.Object,
    minimum: Vector,
    maximum: Vector,
) -> None:
    clear_vertex_groups(proxy)
    bpy.ops.object.select_all(action="DESELECT")
    proxy.hide_set(False)
    proxy.select_set(True)
    rig.select_set(True)
    bpy.context.view_layer.objects.active = rig
    try:
        result = bpy.ops.object.parent_set(type="ARMATURE_AUTO", keep_transform=True)
        auto_ok = "FINISHED" in result and has_complete_weights(proxy, rig)
    except RuntimeError as exc:
        print(f"WHITE_COAT_AUTO_WEIGHT_WARNING={exc}")
        auto_ok = False
    if not auto_ok:
        print("WHITE_COAT_WEIGHT_FALLBACK=PROCEDURAL_ANATOMICAL")
        proxy.parent = rig
        proxy.matrix_parent_inverse = rig.matrix_world.inverted()
        for modifier in list(proxy.modifiers):
            if modifier.type == "ARMATURE":
                proxy.modifiers.remove(modifier)
        armature_modifier = proxy.modifiers.new("WHITE_COAT_PROXY_ARMATURE", "ARMATURE")
        armature_modifier.object = rig
        assign_procedural_weights(proxy, rig, minimum, maximum)
    proxy.hide_render = True
    proxy.hide_set(True)


def transfer_weights(
    proxy: bpy.types.Object,
    hires: bpy.types.Object,
    rig: bpy.types.Object,
    minimum: Vector,
    maximum: Vector,
) -> None:
    clear_vertex_groups(hires)
    for group in proxy.vertex_groups:
        hires.vertex_groups.new(name=group.name)
    modifier = hires.modifiers.new("WHITE_COAT_TRANSFER_WEIGHTS", "DATA_TRANSFER")
    modifier.object = proxy
    modifier.use_vert_data = True
    modifier.data_types_verts = {"VGROUP_WEIGHTS"}
    # Blender 5.1 renamed the legacy NEAREST_POLYNOR mapping enum.
    modifier.vert_mapping = "POLYINTERP_NEAREST"
    modifier.layers_vgroup_select_src = "ALL"
    modifier.layers_vgroup_select_dst = "NAME"
    modifier.mix_mode = "REPLACE"
    apply_object_modifier(hires, modifier.name)

    deform_names = {bone.name for bone in rig.data.bones if bone.use_deform}
    weighted = 0
    for vertex in hires.data.vertices:
        if any(
            hires.vertex_groups[item.group].name in deform_names and item.weight > 0.001
            for item in vertex.groups
        ):
            weighted += 1
    if weighted < len(hires.data.vertices) * 0.99:
        print(
            f"WHITE_COAT_HIRES_WEIGHT_FALLBACK={weighted}/{len(hires.data.vertices)}"
        )
        assign_procedural_weights(hires, rig, minimum, maximum)

    for modifier in list(hires.modifiers):
        if modifier.type == "ARMATURE":
            hires.modifiers.remove(modifier)
    armature_modifier = hires.modifiers.new("WHITE_COAT_FULLBODY_ARMATURE", "ARMATURE")
    armature_modifier.object = rig
    armature_modifier.use_vertex_groups = True
    hires.parent = rig
    hires.matrix_parent_inverse = rig.matrix_world.inverted()


def configure_scene() -> None:
    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = 96
    scene.render.fps = 24
    scene.unit_settings.system = "METRIC"
    scene.unit_settings.scale_length = 1.0
    scene["asset_id"] = "CHAR_HUNYUAN_WHITE_COAT_FULLBODY_001"
    scene["rig_status"] = "candidate_validation"


def main() -> None:
    if not SOURCE_GLB.exists():
        raise FileNotFoundError(SOURCE_GLB)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(SOURCE_GLB))
    meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    if len(meshes) != 1:
        raise RuntimeError(f"Expected one source mesh, got {len(meshes)}")
    hires = meshes[0]
    hires.name = HIRES_NAME
    hires.data.name = f"{HIRES_NAME}_DATA"
    hires["source_vertex_count"] = len(hires.data.vertices)
    hires["preserve_high_resolution"] = True
    minimum, maximum = world_bounds(hires)
    proxy = make_proxy(hires)
    rig = create_fullbody_rig(minimum, maximum)
    bind_proxy(proxy, rig, minimum, maximum)
    transfer_weights(proxy, hires, rig, minimum, maximum)
    configure_scene()
    bpy.context.scene.frame_set(1)
    OUTPUT_BLEND.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(OUTPUT_BLEND))
    print(f"WHITE_COAT_FULLBODY_RIG_CREATED={OUTPUT_BLEND}")
    print(f"WHITE_COAT_HIRES_VERTICES={len(hires.data.vertices)}")
    print(f"WHITE_COAT_PROXY_VERTICES={len(proxy.data.vertices)}")
    print(f"WHITE_COAT_RIG_BONES={len(rig.data.bones)}")


if __name__ == "__main__":
    main()
