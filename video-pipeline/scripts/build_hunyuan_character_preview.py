"""Import the C-position Hunyuan GLB into Blender and render a library thumbnail."""

from __future__ import annotations

import argparse
import os
import sys

import bpy
from mathutils import Vector


DEFAULT_ASSET_DIR = r"D:\mythrealms-shop\video-pipeline\asset-library\05-characters\CHAR_HUNYUAN_C_POSITION_001"
DEFAULT_MODEL = os.path.join("source", "hunyuan-raw", "C_POSITION.glb")
DEFAULT_BLEND = "C_POSITION.blend"


def read_cli_options() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--asset-dir", default=DEFAULT_ASSET_DIR)
    parser.add_argument("--model", default=DEFAULT_MODEL, help="GLB path relative to --asset-dir, or an absolute path")
    parser.add_argument("--blend", default=DEFAULT_BLEND)
    parser.add_argument("--thumbnail", default="Thumbnail.png")
    arguments = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    return parser.parse_args(arguments)


options = read_cli_options()
ASSET_DIR = os.path.abspath(options.asset_dir)
MODEL_PATH = options.model if os.path.isabs(options.model) else os.path.join(ASSET_DIR, options.model)
BLEND_PATH = os.path.join(ASSET_DIR, options.blend)
THUMBNAIL_PATH = os.path.join(ASSET_DIR, options.thumbnail)
ASSET_ID = os.path.basename(ASSET_DIR)


def look_at(obj: bpy.types.Object, point: Vector) -> None:
    obj.rotation_euler = (point - obj.location).to_track_quat("-Z", "Y").to_euler()


def add_area_light(name: str, location: tuple[float, float, float], energy: float, color: tuple[float, float, float], size: float, target: Vector) -> None:
    data = bpy.data.lights.new(name, "AREA")
    data.energy = energy
    data.color = color
    data.shape = "DISK"
    data.size = size
    light = bpy.data.objects.new(name, data)
    bpy.context.scene.collection.objects.link(light)
    light.location = location
    look_at(light, target)


bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.name = f"{ASSET_ID}_Preview"
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 900
scene.render.resolution_y = 900
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.filepath = THUMBNAIL_PATH
scene.view_settings.look = "AgX - Medium High Contrast"
scene.view_settings.exposure = -1.15

bpy.ops.import_scene.gltf(filepath=MODEL_PATH)
mesh_objects = [obj for obj in scene.objects if obj.type == "MESH"]
if not mesh_objects:
    raise RuntimeError("No mesh was imported from Hunyuan GLB.")

corners = [obj.matrix_world @ Vector(corner) for obj in mesh_objects for corner in obj.bound_box]
minimum = Vector((min(point.x for point in corners), min(point.y for point in corners), min(point.z for point in corners)))
maximum = Vector((max(point.x for point in corners), max(point.y for point in corners), max(point.z for point in corners)))
center = (minimum + maximum) / 2
height = max(maximum.z - minimum.z, 0.01)
width = max(maximum.x - minimum.x, maximum.y - minimum.y, 0.01)

for obj in mesh_objects:
    obj["asset_id"] = ASSET_ID
    obj["generator"] = "Tencent Hunyuan 3D Pro 3.1"
    obj["source"] = "user-provided front/right-front/back reference"

world = bpy.data.worlds.new("DarkStudio")
world.use_nodes = True
background = world.node_tree.nodes.get("Background")
background.inputs["Color"].default_value = (0.004, 0.006, 0.012, 1.0)
background.inputs["Strength"].default_value = 0.15
scene.world = world

floor_data = bpy.data.meshes.new("StudioFloorMesh")
floor_size = max(width, height) * 6
floor_data.from_pydata(
    [(-floor_size, -floor_size, minimum.z), (floor_size, -floor_size, minimum.z), (floor_size, floor_size, minimum.z), (-floor_size, floor_size, minimum.z)],
    [],
    [(0, 1, 2, 3)],
)
floor = bpy.data.objects.new("StudioFloor", floor_data)
scene.collection.objects.link(floor)
floor_material = bpy.data.materials.new("MAT_StudioFloor")
floor_material.use_nodes = True
floor_bsdf = floor_material.node_tree.nodes.get("Principled BSDF")
floor_bsdf.inputs["Base Color"].default_value = (0.003, 0.006, 0.016, 1.0)
floor_bsdf.inputs["Roughness"].default_value = 0.48
floor_bsdf.inputs["Metallic"].default_value = 0.15
floor.data.materials.append(floor_material)

camera_data = bpy.data.cameras.new("PreviewCameraData")
camera_data.lens = 58
camera = bpy.data.objects.new("PreviewCamera", camera_data)
scene.collection.objects.link(camera)
scene.camera = camera
camera.location = (width * 1.8, -height * 2.8, minimum.z + height * 0.57)
look_at(camera, Vector((center.x, center.y, minimum.z + height * 0.56)))

light_scale = max(width, height)
target = Vector((center.x, center.y, minimum.z + height * 0.55))
add_area_light("Key", (width * 2.1, -height * 1.8, minimum.z + height * 1.5), 260, (1.0, 0.57, 0.42), light_scale * 1.3, target)
add_area_light("Fill", (-width * 2.0, -height * 1.2, minimum.z + height * 1.1), 95, (0.34, 0.56, 1.0), light_scale * 1.8, target)
add_area_light("Rim", (0.0, height * 1.9, minimum.z + height * 1.5), 360, (0.55, 0.50, 1.0), light_scale * 1.1, target)

bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)
bpy.ops.render.render(write_still=True)
print({
    "blend": BLEND_PATH,
    "thumbnail": THUMBNAIL_PATH,
    "mesh_objects": len(mesh_objects),
    "bbox": {"min": tuple(round(value, 4) for value in minimum), "max": tuple(round(value, 4) for value in maximum)},
})
