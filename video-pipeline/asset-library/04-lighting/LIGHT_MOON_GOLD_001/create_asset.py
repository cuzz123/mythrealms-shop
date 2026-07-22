"""Build a reusable cool-moon / warm-gold jewelry lighting rig for Blender 5+."""

from pathlib import Path
import math

import bpy
from mathutils import Vector


ASSET_ID = "LIGHT_MOON_GOLD_001"
CATALOG_ID = "f5fc32ae-26a7-4c86-b2a0-01381e7b00ad"
ROOT = Path(__file__).resolve().parent
BLEND_PATH = ROOT / f"{ASSET_ID}_v1.blend"
THUMBNAIL_PATH = ROOT / "Thumbnail.png"
FRAMES_DIR = ROOT / "preview_frames"


def look_at(obj, target=(0, 0, 0)):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


def material(name, color, metallic=0.0, roughness=0.4):
    result = bpy.data.materials.new(name)
    result.use_nodes = True
    nodes = result.node_tree.nodes
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    shader = nodes.new("ShaderNodeBsdfPrincipled")
    shader.inputs["Base Color"].default_value = color
    shader.inputs["Metallic"].default_value = metallic
    shader.inputs["Roughness"].default_value = roughness
    result.node_tree.links.new(shader.outputs["BSDF"], output.inputs["Surface"])
    return result


def add_light(collection, name, kind, location, color, energy, size=1.0):
    data = bpy.data.lights.new(name, kind)
    data.energy = energy
    data.color = color
    if kind == "AREA":
        data.shape = "DISK"
        data.size = size
    obj = bpy.data.objects.new(name, data)
    collection.objects.link(obj)
    obj.location = location
    look_at(obj)
    return obj


def build():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for item in list(bpy.data.collections):
        bpy.data.collections.remove(item)

    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 540
    scene.render.resolution_y = 960
    scene.render.resolution_percentage = 100
    scene.render.fps = 30
    scene.frame_start = 1
    scene.frame_end = 90
    scene.world.color = (0.002, 0.004, 0.01)

    rig = bpy.data.collections.new(ASSET_ID)
    scene.collection.children.link(rig)
    preview = bpy.data.collections.new("PREVIEW_ONLY__REMOVE_FOR_PRODUCTION")
    scene.collection.children.link(preview)

    target = bpy.data.objects.new("LIGHT_TARGET__PRODUCT_CENTER", None)
    rig.objects.link(target)
    target.empty_display_type = "SPHERE"
    target.empty_display_size = 0.25

    moon = add_light(rig, "Moon_Key_Cool", "AREA", (-3.6, -2.8, 4.2), (0.19, 0.4, 1.0), 900, 4.5)
    gold = add_light(rig, "Gold_Side_Reflection", "AREA", (3.1, -2.0, 2.0), (1.0, 0.34, 0.07), 1050, 2.3)
    rim = add_light(rig, "Gold_Rim", "AREA", (0.2, 2.2, 3.8), (1.0, 0.64, 0.22), 700, 2.0)
    fill = add_light(rig, "Moon_Fill", "AREA", (-0.8, 1.0, 1.2), (0.16, 0.25, 0.7), 250, 3.0)
    for light in (moon, gold, rim, fill):
        light.parent = target

    dark = material("MR_Preview_Dark", (0.006, 0.009, 0.016, 1), metallic=0.12, roughness=0.28)
    pearl = material("MR_Preview_Pearl", (0.95, 0.88, 0.68, 1), roughness=0.14)
    metal = material("MR_Preview_Gold", (0.83, 0.34, 0.06, 1), metallic=0.9, roughness=0.18)
    bpy.ops.mesh.primitive_plane_add(size=20, location=(0, 0, -1.5))
    floor = bpy.context.object
    floor.name = "Preview_Floor"
    floor.data.materials.append(dark)
    for current in list(floor.users_collection):
        current.objects.unlink(floor)
    preview.objects.link(floor)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.9, minor_radius=0.07, major_segments=96, minor_segments=16, location=(0, 0, 0), rotation=(math.radians(90), 0, 0))
    hoop = bpy.context.object
    hoop.name = "Preview_Jewelry_Proxy"
    hoop.data.materials.append(metal)
    for current in list(hoop.users_collection):
        current.objects.unlink(hoop)
    preview.objects.link(hoop)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=48, ring_count=24, location=(0, -0.05, -0.92), scale=(0.3, 0.15, 0.3))
    gem = bpy.context.object
    gem.data.materials.append(pearl)
    for current in list(gem.users_collection):
        current.objects.unlink(gem)
    preview.objects.link(gem)
    hoop.rotation_euler = (math.radians(90), 0, math.radians(-9))
    hoop.keyframe_insert(data_path="rotation_euler", frame=1)
    hoop.rotation_euler = (math.radians(90), 0, math.radians(9))
    hoop.keyframe_insert(data_path="rotation_euler", frame=90)
    gem.parent = hoop

    camera_data = bpy.data.cameras.new("Preview_Camera")
    camera_data.lens = 70
    camera = bpy.data.objects.new("Preview_Camera", camera_data)
    preview.objects.link(camera)
    camera.location = (0, -7.4, 0.15)
    look_at(camera)
    scene.camera = camera

    rig.asset_mark()
    rig.asset_data.catalog_id = CATALOG_ID
    rig.asset_data.description = "珠宝用冷月光与暖金反光；灯光独立于场景与产品。"
    rig["asset_id"] = ASSET_ID
    rig["default_import"] = "link"
    rig["usage"] = "产品资产与场景保持独立；需要项目级变化时再 Append。"

    FRAMES_DIR.mkdir(parents=True, exist_ok=True)
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = str(FRAMES_DIR / "frame_")
    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))
    bpy.ops.render.render(animation=True)
    scene.frame_set(45)
    scene.render.filepath = str(THUMBNAIL_PATH)
    bpy.ops.render.render(write_still=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))


if __name__ == "__main__":
    build()
