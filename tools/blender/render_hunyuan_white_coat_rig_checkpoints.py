from __future__ import annotations

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
OUTPUT_DIR = CHARACTER_DIR / "preview" / "rig_v1_checkpoints"
RIG_NAME = "RIG_WHITE_COAT_FULLBODY"
HIRES_NAME = "MESH_WHITE_COAT_HIRES"


def point_at(obj: bpy.types.Object, target: Vector) -> None:
    obj.rotation_euler = (target - obj.location).to_track_quat("-Z", "Y").to_euler()


def reset_pose(rig: bpy.types.Object) -> None:
    for bone in rig.pose.bones:
        bone.rotation_mode = "XYZ"
        bone.location = (0.0, 0.0, 0.0)
        bone.rotation_euler = (0.0, 0.0, 0.0)
        bone.scale = (1.0, 1.0, 1.0)


def setup_stage(height: float) -> bpy.types.Object:
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 640
    scene.render.resolution_y = 900
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.film_transparent = False
    if scene.world is None:
        scene.world = bpy.data.worlds.new("WHITE_COAT_RIG_CHECK_WORLD")
    scene.world.use_nodes = True
    background = scene.world.node_tree.nodes.get("Background")
    if background is None:
        scene.world.node_tree.nodes.clear()
        background = scene.world.node_tree.nodes.new("ShaderNodeBackground")
        output = scene.world.node_tree.nodes.new("ShaderNodeOutputWorld")
        scene.world.node_tree.links.new(background.outputs["Background"], output.inputs["Surface"])
    background.inputs["Color"].default_value = (0.025, 0.028, 0.032, 1.0)
    background.inputs["Strength"].default_value = 0.45

    bpy.ops.mesh.primitive_plane_add(size=5 * height, location=(0, 0, -0.002))
    floor = bpy.context.object
    floor.name = "RIG_CHECK_FLOOR"
    material = bpy.data.materials.new("RIG_CHECK_FLOOR_MAT")
    material.diffuse_color = (0.055, 0.06, 0.068, 1.0)
    floor.data.materials.append(material)

    bpy.ops.object.camera_add(location=(0.0, -2.7 * height, 0.50 * height))
    camera = bpy.context.object
    camera.name = "CAM_WHITE_COAT_RIG_CHECK"
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 1.27 * height
    point_at(camera, Vector((0.0, 0.0, 0.50 * height)))
    scene.camera = camera

    for name, location, energy, size in (
        ("KEY", (-0.75 * height, -1.3 * height, 1.45 * height), 850, 0.85),
        ("FILL", (0.8 * height, -0.6 * height, 0.9 * height), 520, 0.75),
        ("RIM", (0.2 * height, 0.8 * height, 1.3 * height), 700, 0.65),
    ):
        bpy.ops.object.light_add(type="AREA", location=location)
        light = bpy.context.object
        light.name = f"RIG_CHECK_{name}"
        light.data.energy = energy
        light.data.shape = "DISK"
        light.data.size = size * height
        point_at(light, Vector((0.0, 0.0, 0.55 * height)))
    return camera


def pose_checkpoint(rig: bpy.types.Object, name: str, height: float) -> None:
    reset_pose(rig)
    if name == "left_contact":
        rig.pose.bones["foot_ik.L"].location.y = -0.055 * height
        rig.pose.bones["foot_ik.R"].location.y = 0.035 * height
        rig.pose.bones["pelvis"].rotation_euler.z = math.radians(1.5)
    elif name == "right_contact":
        rig.pose.bones["foot_ik.R"].location.y = -0.055 * height
        rig.pose.bones["foot_ik.L"].location.y = 0.035 * height
        rig.pose.bones["pelvis"].rotation_euler.z = math.radians(-1.5)
    elif name == "left_knee_lift":
        rig.pose.bones["foot_ik.L"].location.y = -0.035 * height
        rig.pose.bones["foot_ik.L"].location.z = 0.115 * height
        rig.pose.bones["pelvis"].location.z = 0.012 * height
        rig.pose.bones["pelvis"].rotation_euler.z = math.radians(-1.0)
    elif name == "right_knee_lift":
        rig.pose.bones["foot_ik.R"].location.y = -0.035 * height
        rig.pose.bones["foot_ik.R"].location.z = 0.115 * height
        rig.pose.bones["pelvis"].location.z = 0.012 * height
        rig.pose.bones["pelvis"].rotation_euler.z = math.radians(1.0)
    bpy.context.view_layer.update()


def main() -> None:
    rig = bpy.data.objects[RIG_NAME]
    hires = bpy.data.objects[HIRES_NAME]
    height = float(rig["body_height"])
    hires.hide_render = False
    setup_stage(height)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    checkpoints = (
        "neutral",
        "left_contact",
        "right_contact",
        "left_knee_lift",
        "right_knee_lift",
    )
    for index, name in enumerate(checkpoints, start=1):
        pose_checkpoint(rig, name, height)
        output = OUTPUT_DIR / f"{index:02d}_{name}.png"
        bpy.context.scene.render.filepath = str(output)
        bpy.ops.render.render(write_still=True)
        print(f"WHITE_COAT_RIG_CHECKPOINT={output}")
    reset_pose(rig)


if __name__ == "__main__":
    main()
