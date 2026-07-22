"""Build the MythRealms 6-second 85 mm macro push-in camera asset in Blender 5+."""

from pathlib import Path

import bpy
from mathutils import Vector


ASSET_ID = "CAM_SLOW_PUSH_MACRO_85MM_001"
CATALOG_ID = "95fc32ae-26a7-4c86-b2a0-01381e7b00a7"  # Camera_Rigs/Push_In
ROOT = Path(__file__).resolve().parent
BLEND_PATH = ROOT / f"{ASSET_ID}_v1.blend"
PREVIEW_PATH = ROOT / "Preview.mp4"
THUMBNAIL_PATH = ROOT / "Thumbnail.png"
PREVIEW_FRAMES = ROOT / "preview_frames"


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for collection in list(bpy.data.collections):
        bpy.data.collections.remove(collection)


def collection(name, parent=None):
    result = bpy.data.collections.new(name)
    (parent or bpy.context.scene.collection).children.link(result)
    return result


def move_to_collection(obj, target):
    for current in list(obj.users_collection):
        current.objects.unlink(obj)
    target.objects.link(obj)


def material(name, color, metallic=0.0, roughness=0.4):
    result = bpy.data.materials.new(name)
    result.use_nodes = True
    nodes = result.node_tree.nodes
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    result.node_tree.links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    return result


def look_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


def keyframe_camera(camera, frame, location):
    camera.location = location
    look_at(camera, (0, 0, 0.15))
    camera.keyframe_insert(data_path="location", frame=frame)
    camera.keyframe_insert(data_path="rotation_euler", frame=frame)


def smooth_motion(camera):
    # Blender 5 stores keyframes in layered Action slots. Newly inserted keys
    # already use Bezier interpolation, so preserve that stable default here.
    # The four keys encode a slow start, a stronger mid push, and a final settle.
    return camera.animation_data.action


def add_proxy_product(target_collection):
    gold = material("MR_Proxy_Gold", (0.83, 0.42, 0.08, 1), metallic=0.92, roughness=0.2)
    pearl = material("MR_Proxy_Pearl", (0.96, 0.9, 0.75, 1), metallic=0.0, roughness=0.16)

    bpy.ops.mesh.primitive_torus_add(major_radius=0.82, minor_radius=0.055, major_segments=96, minor_segments=16, location=(0, 0, 0.15), rotation=(1.5708, 0, 0))
    hoop = bpy.context.object
    hoop.name = "PROXY_EARRING_HOOP__REPLACE_ME"
    hoop.data.materials.append(gold)
    move_to_collection(hoop, target_collection)

    bpy.ops.mesh.primitive_uv_sphere_add(segments=48, ring_count=24, location=(0, -0.03, -0.73), scale=(0.25, 0.12, 0.25))
    drop = bpy.context.object
    drop.name = "PROXY_GEM__REPLACE_ME"
    drop.data.materials.append(pearl)
    move_to_collection(drop, target_collection)


def add_environment(target_collection):
    stone = material("MR_Dark_Stone", (0.015, 0.02, 0.03, 1), metallic=0.15, roughness=0.24)
    bpy.ops.mesh.primitive_plane_add(size=50, location=(0, 2.5, -2.0), rotation=(1.5708, 0, 0))
    backdrop = bpy.context.object
    backdrop.name = "Preview_Backdrop"
    backdrop.data.materials.append(stone)
    move_to_collection(backdrop, target_collection)


def add_area_light(target_collection, name, location, color, power, size):
    data = bpy.data.lights.new(name, "AREA")
    data.energy = power
    data.shape = "DISK"
    data.color = color
    data.size = size
    obj = bpy.data.objects.new(name, data)
    target_collection.objects.link(obj)
    obj.location = location
    look_at(obj, (0, 0, 0))
    return obj


def build():
    clear_scene()
    scene = bpy.context.scene
    # Blender 5.1 exposes Eevee as BLENDER_EEVEE (not the earlier _NEXT enum).
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 540
    scene.render.resolution_y = 960
    scene.render.resolution_percentage = 100
    scene.render.fps = 30
    scene.frame_start = 1
    scene.frame_end = 180
    scene.world.color = (0.003, 0.005, 0.012)

    rig = collection(ASSET_ID)
    slots = collection("PRODUCT_SLOT__LINK_OR_APPEND_PRODUCT_HERE", rig)
    environment = collection("PREVIEW_ENVIRONMENT__REMOVE_FOR_PRODUCTION", rig)
    lighting = collection("PREVIEW_LIGHTING__REPLACE_WITH_LIBRARY_RIG", rig)

    focus = bpy.data.objects.new("FOCUS_TARGET__PRODUCT", None)
    rig.objects.link(focus)
    focus.empty_display_type = "SPHERE"
    focus.empty_display_size = 0.24
    focus.location = (0, 0, 0.15)

    camera_data = bpy.data.cameras.new("CAM_SLOW_PUSH_MACRO_85MM")
    camera_data.lens = 85
    camera_data.dof.use_dof = True
    camera_data.dof.focus_object = focus
    camera_data.dof.aperture_fstop = 2.8
    camera = bpy.data.objects.new("CAM_SLOW_PUSH_MACRO_85MM", camera_data)
    rig.objects.link(camera)
    scene.camera = camera

    keyframe_camera(camera, 1, (0, -16.0, 0.28))
    keyframe_camera(camera, 72, (0, -11.0, 0.22))
    keyframe_camera(camera, 150, (0, -7.5, 0.16))
    keyframe_camera(camera, 180, (0, -7.35, 0.15))  # final 1-second settle
    smooth_motion(camera)

    add_proxy_product(slots)
    add_environment(environment)
    add_area_light(lighting, "Key_Warm_Gold", (2.5, -3.0, 3.0), (1.0, 0.46, 0.15), 1000, 3.0)
    add_area_light(lighting, "Fill_Cool", (-3.0, -2.0, 1.5), (0.16, 0.38, 1.0), 620, 4.0)
    add_area_light(lighting, "Rim", (0, 1.5, 2.0), (1.0, 0.7, 0.42), 850, 2.0)

    rig.asset_mark()
    rig.asset_data.catalog_id = CATALOG_ID
    rig.asset_data.description = "6秒、30fps、85mm 珠宝慢推微距；产品插槽与焦点目标可替换。"
    rig["asset_id"] = ASSET_ID
    rig["duration_seconds"] = 6
    rig["default_import"] = "append"
    rig["focus_target"] = focus.name
    rig["product_slot"] = slots.name

    # Blender 5.1 writes an image sequence here; FFmpeg turns it into Preview.mp4.
    # Keeping the frames also makes the preview audit-friendly.
    PREVIEW_FRAMES.mkdir(parents=True, exist_ok=True)
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = str(PREVIEW_FRAMES / "frame_")
    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))
    bpy.ops.render.render(animation=True)

    scene.frame_set(150)
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = str(THUMBNAIL_PATH)
    bpy.ops.render.render(write_still=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))


if __name__ == "__main__":
    build()
