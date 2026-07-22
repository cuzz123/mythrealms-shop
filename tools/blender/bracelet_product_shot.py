import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector


OUTPUT_DIR = Path("D:/Chrome_Download/mythrealms_blender_renders")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
PREVIEW_DIR = OUTPUT_DIR / "preview_frames"
PREVIEW_DIR.mkdir(parents=True, exist_ok=True)


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def make_material(name, color, roughness=0.35, metallic=0.0, alpha=1.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Alpha"].default_value = alpha
    if alpha < 1:
        mat.blend_method = "BLEND"
    return mat


def add_uv_sphere(name, location, scale, material, segments=48, rings=24):
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=segments,
        ring_count=rings,
        location=location,
    )
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(material)
    return obj


def add_torus(name, location, major_radius, minor_radius, material):
    bpy.ops.mesh.primitive_torus_add(
        major_radius=major_radius,
        minor_radius=minor_radius,
        major_segments=96,
        minor_segments=12,
        location=location,
    )
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    return obj


def keyframe(obj, frame, loc=None, rot=None, scale=None):
    if loc is not None:
        obj.location = loc
        obj.keyframe_insert(data_path="location", frame=frame)
    if rot is not None:
        obj.rotation_euler = rot
        obj.keyframe_insert(data_path="rotation_euler", frame=frame)
    if scale is not None:
        obj.scale = scale
        obj.keyframe_insert(data_path="scale", frame=frame)


def build_bracelet():
    pearl = make_material("mother_of_pearl", (0.95, 0.86, 0.72, 1), 0.18)
    emerald = make_material("deep_emerald_bead", (0.01, 0.22, 0.12, 1), 0.22)
    gold = make_material("polished_gold", (1.0, 0.62, 0.18, 1), 0.2, metallic=1.0)

    root = bpy.data.objects.new("bracelet_root", None)
    bpy.context.collection.objects.link(root)

    count = 18
    radius_x = 2.15
    radius_y = 1.35
    for i in range(count):
        angle = (math.tau / count) * i
        x = math.cos(angle) * radius_x
        y = math.sin(angle) * radius_y
        z = 0.28 + 0.05 * math.sin(angle * 2)

        if i % 3 == 0:
            obj = add_uv_sphere(
                f"pearl_{i:02d}",
                (x, y, z),
                (0.19, 0.19, 0.19),
                pearl,
            )
        elif i % 3 == 1:
            obj = add_uv_sphere(
                f"emerald_{i:02d}",
                (x, y, z),
                (0.15, 0.15, 0.15),
                emerald,
            )
        else:
            cluster = []
            for j in range(5):
                petal_angle = angle + (math.tau / 5) * j
                px = x + math.cos(petal_angle) * 0.13
                py = y + math.sin(petal_angle) * 0.13
                cluster.append(
                    add_uv_sphere(
                        f"pearl_flower_{i:02d}_{j}",
                        (px, py, z),
                        (0.075, 0.075, 0.075),
                        pearl,
                        segments=32,
                        rings=16,
                    )
                )
            obj = cluster[0]

        if isinstance(obj, bpy.types.Object):
            obj.parent = root

    ring = add_torus("thin_gold_bracelet_curve", (0, 0, 0.22), 1.0, 0.018, gold)
    ring.scale = (radius_x, radius_y, 0.04)
    ring.parent = root

    clasp = add_uv_sphere("small_gold_clasp", (0, -radius_y - 0.12, 0.28), (0.1, 0.1, 0.1), gold, 32, 16)
    clasp.parent = root

    charm = add_uv_sphere("tiny_pearl_charm", (0.22, -radius_y - 0.28, 0.14), (0.12, 0.12, 0.12), pearl, 32, 16)
    charm.parent = root

    return root


def setup_scene():
    clear_scene()
    bpy.context.scene.frame_start = 1
    bpy.context.scene.frame_end = 120
    bpy.context.scene.render.fps = 24
    bpy.context.scene.render.resolution_x = 1080
    bpy.context.scene.render.resolution_y = 1920
    bpy.context.scene.eevee.taa_render_samples = 64

    velvet = make_material("black_velvet", (0.015, 0.012, 0.011, 1), 0.82)
    bpy.ops.mesh.primitive_plane_add(size=8, location=(0, 0, 0))
    plane = bpy.context.object
    plane.name = "black_velvet_surface"
    plane.data.materials.append(velvet)

    bracelet = build_bracelet()
    bracelet.location = (0, 0, 0.18)
    keyframe(bracelet, 1, rot=(0, 0, math.radians(-8)))
    keyframe(bracelet, 120, rot=(0, 0, math.radians(16)))

    bpy.ops.object.light_add(type="AREA", location=(-2.6, -3.0, 4.5))
    key = bpy.context.object
    key.name = "large_warm_window_light"
    key.data.energy = 750
    key.data.size = 4.0

    bpy.ops.object.light_add(type="POINT", location=(2.4, 1.6, 1.2))
    rim = bpy.context.object
    rim.name = "small_gold_sparkle_light"
    rim.data.energy = 85
    rim.data.color = (1.0, 0.72, 0.36)

    bpy.ops.object.camera_add(location=(0, -5.0, 2.35), rotation=(math.radians(64), 0, 0))
    camera = bpy.context.object
    bpy.context.scene.camera = camera
    camera.data.lens = 70
    camera.data.dof.use_dof = True
    camera.data.dof.focus_object = bracelet
    camera.data.dof.aperture_fstop = 2.0

    keyframe(camera, 1, loc=Vector((0.0, -5.0, 2.35)), rot=(math.radians(64), 0, 0))
    keyframe(camera, 120, loc=Vector((0.0, -3.35, 1.72)), rot=(math.radians(60), 0, 0))

    bpy.context.scene.render.filepath = str(OUTPUT_DIR / "bracelet_product_shot_")


def get_script_args():
    if "--" not in sys.argv:
        return set()
    return set(sys.argv[sys.argv.index("--") + 1 :])


def render_preview_frames():
    for frame in (1, 30, 60, 90, 120):
        bpy.context.scene.frame_set(frame)
        bpy.context.scene.render.filepath = str(PREVIEW_DIR / f"bracelet_preview_{frame:03d}.png")
        bpy.ops.render.render(write_still=True)
    print(f"Saved preview frames to {PREVIEW_DIR}")


def render_animation():
    bpy.context.scene.render.image_settings.file_format = "FFMPEG"
    bpy.context.scene.render.ffmpeg.format = "MPEG4"
    bpy.context.scene.render.ffmpeg.codec = "H264"
    bpy.context.scene.render.ffmpeg.constant_rate_factor = "MEDIUM"
    bpy.context.scene.render.filepath = str(OUTPUT_DIR / "bracelet_product_shot.mp4")
    bpy.ops.render.render(animation=True)
    print(f"Saved animation to {OUTPUT_DIR / 'bracelet_product_shot.mp4'}")


if __name__ == "__main__":
    args = get_script_args()
    setup_scene()
    bpy.ops.wm.save_as_mainfile(filepath=str(OUTPUT_DIR / "bracelet_product_shot.blend"))
    print(f"Saved Blender scene to {OUTPUT_DIR / 'bracelet_product_shot.blend'}")
    if "--preview" in args:
        render_preview_frames()
    if "--render-animation" in args:
        render_animation()
