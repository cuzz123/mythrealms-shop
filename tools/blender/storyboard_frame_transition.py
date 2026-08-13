import math
import sys
from pathlib import Path

import bpy


FRAME_DIR = Path("D:/Chrome_Download/mythrealms_bracelet_storyboard_frames_v3_detected_crop")
OUTPUT_DIR = Path("D:/Chrome_Download/mythrealms_blender_renders/storyboard_transitions")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
FRAME_OUTPUT_DIR = OUTPUT_DIR / "frame_02_to_03_png_sequence"
FRAME_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

START_IMAGE = FRAME_DIR / "bracelet_v3_detected_frame_02.png"
END_IMAGE = FRAME_DIR / "bracelet_v3_detected_frame_03.png"
OUTPUT_MP4 = OUTPUT_DIR / "bracelet_frame_02_to_03_blender_camera_move.mp4"
OUTPUT_BLEND = OUTPUT_DIR / "bracelet_frame_02_to_03_blender_camera_move.blend"


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def make_image_plane(name, image_path, z_offset):
    image = bpy.data.images.load(str(image_path))
    width, height = image.size
    aspect = width / height

    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, z_offset), rotation=(0, 0, 0))
    plane = bpy.context.object
    plane.name = name
    plane.dimensions = (aspect * 4.0, 4.0, 1)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    mat = bpy.data.materials.new(f"{name}_material")
    mat.use_nodes = True
    mat.blend_method = "BLEND"
    mat.use_screen_refraction = True
    mat.show_transparent_back = True

    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    tex = nodes.new("ShaderNodeTexImage")
    tex.image = image
    mat.node_tree.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    mat.node_tree.links.new(tex.outputs["Alpha"], bsdf.inputs["Alpha"])

    plane.data.materials.append(mat)
    return plane, mat


def set_alpha(mat, value, frame):
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Alpha"].default_value = value
    bsdf.inputs["Alpha"].keyframe_insert("default_value", frame=frame)


def keyframe_transform(obj, frame, loc=None, scale=None, rot=None):
    if loc is not None:
        obj.location = loc
        obj.keyframe_insert(data_path="location", frame=frame)
    if scale is not None:
        obj.scale = scale
        obj.keyframe_insert(data_path="scale", frame=frame)
    if rot is not None:
        obj.rotation_euler = rot
        obj.keyframe_insert(data_path="rotation_euler", frame=frame)


def set_linear_interpolation():
    try:
        for obj in bpy.context.scene.objects:
            if not obj.animation_data or not obj.animation_data.action:
                continue
            for curve in getattr(obj.animation_data.action, "fcurves", []):
                for point in curve.keyframe_points:
                    point.interpolation = "SINE"

        for mat in bpy.data.materials:
            action = mat.node_tree.animation_data.action if mat.node_tree and mat.node_tree.animation_data else None
            if not action:
                continue
            for curve in getattr(action, "fcurves", []):
                for point in curve.keyframe_points:
                    point.interpolation = "SINE"
    except Exception as exc:
        print(f"Skipped interpolation tuning: {exc}")


def setup_scene():
    if not START_IMAGE.exists() or not END_IMAGE.exists():
        raise FileNotFoundError(f"Missing source frames in {FRAME_DIR}")

    clear_scene()
    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = 96
    scene.render.fps = 24
    scene.render.resolution_x = 1080
    scene.render.resolution_y = 1920
    scene.render.film_transparent = False
    scene.eevee.taa_render_samples = 64

    bpy.ops.object.light_add(type="AREA", location=(0, -2, 4))
    light = bpy.context.object
    light.name = "soft_gallery_light"
    light.data.energy = 220
    light.data.size = 5

    start_plane, start_mat = make_image_plane("frame_02_start", START_IMAGE, 0)
    end_plane, end_mat = make_image_plane("frame_03_end", END_IMAGE, -0.01)

    keyframe_transform(start_plane, 1, loc=(-0.03, 0, 0), scale=(1.0, 1.0, 1.0), rot=(0, 0, math.radians(-0.35)))
    keyframe_transform(start_plane, 72, loc=(-0.18, 0.05, 0), scale=(1.105, 1.105, 1.0), rot=(0, 0, math.radians(0.25)))
    keyframe_transform(start_plane, 96, loc=(-0.22, 0.06, 0), scale=(1.12, 1.12, 1.0), rot=(0, 0, math.radians(0.25)))

    keyframe_transform(end_plane, 1, loc=(0.11, -0.04, -0.01), scale=(1.12, 1.12, 1.0), rot=(0, 0, math.radians(0.4)))
    keyframe_transform(end_plane, 72, loc=(0.02, 0.0, -0.01), scale=(1.045, 1.045, 1.0), rot=(0, 0, math.radians(0.0)))
    keyframe_transform(end_plane, 96, loc=(0.0, 0.0, -0.01), scale=(1.035, 1.035, 1.0), rot=(0, 0, math.radians(0.0)))

    set_alpha(start_mat, 1.0, 1)
    set_alpha(start_mat, 1.0, 46)
    set_alpha(start_mat, 0.0, 78)
    set_alpha(start_mat, 0.0, 96)

    set_alpha(end_mat, 0.0, 1)
    set_alpha(end_mat, 0.0, 40)
    set_alpha(end_mat, 1.0, 72)
    set_alpha(end_mat, 1.0, 96)

    bpy.ops.object.camera_add(location=(0, -5.2, 0), rotation=(math.radians(90), 0, 0))
    camera = bpy.context.object
    camera.name = "orthographic_camera_move"
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 4.0
    scene.camera = camera

    keyframe_transform(camera, 1, loc=(-0.02, -5.2, 0.0), scale=(1, 1, 1))
    camera.data.ortho_scale = 4.0
    camera.data.keyframe_insert(data_path="ortho_scale", frame=1)
    keyframe_transform(camera, 96, loc=(0.08, -5.2, 0.03), scale=(1, 1, 1))
    camera.data.ortho_scale = 3.72
    camera.data.keyframe_insert(data_path="ortho_scale", frame=96)

    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = str(FRAME_OUTPUT_DIR / "frame_")
    set_linear_interpolation()


if __name__ == "__main__":
    setup_scene()
    bpy.ops.wm.save_as_mainfile(filepath=str(OUTPUT_BLEND))
    if "--render" in sys.argv:
        bpy.ops.render.render(animation=True)
    print(f"Saved transition scene to {OUTPUT_BLEND}")
    print(f"Saved rendered frames to {FRAME_OUTPUT_DIR}")
    print(f"Make mp4 with: ffmpeg -y -framerate 24 -i {FRAME_OUTPUT_DIR / 'frame_%04d.png'} -c:v libx264 -pix_fmt yuv420p {OUTPUT_MP4}")
