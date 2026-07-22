import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector


OUTPUT_DIR = Path("D:/Chrome_Download/mythrealms_garage_director_stage")
OUTPUT_BLEND = OUTPUT_DIR / "five_character_garage_director_stage.blend"
PREVIEW_DIR = OUTPUT_DIR / "preview_frames"

CHARACTER_IMAGES = {
    "left2_ivory_glasses": Path("D:/Chrome_Download/mythrealms_garage_director_stage/character_crops/left2_ivory_glasses.jpg"),
    "left1_sage": Path("D:/Chrome_Download/mythrealms_garage_director_stage/character_crops/left1_sage.jpg"),
    "center_navy": Path("D:/Chrome_Download/mythrealms_garage_director_stage/character_crops/center_navy.jpg"),
    "right1_black_gold": Path("D:/Chrome_Download/mythrealms_garage_director_stage/character_crops/right1_black_gold.jpg"),
    "right2_gold": Path("D:/Chrome_Download/mythrealms_garage_director_stage/character_crops/right2_gold.jpg"),
}


def ensure_dirs():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    PREVIEW_DIR.mkdir(parents=True, exist_ok=True)


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def make_material(name, color, roughness=0.45, metallic=0.0, alpha=1.0, emission=None, strength=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    mat.blend_method = "BLEND" if alpha < 1.0 else "OPAQUE"
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Alpha"].default_value = alpha
    if emission and "Emission Color" in bsdf.inputs:
        bsdf.inputs["Emission Color"].default_value = emission
        bsdf.inputs["Emission Strength"].default_value = strength
    return mat


def add_cube(name, location, scale, material):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if material:
        obj.data.materials.append(material)
    return obj


def add_cylinder(name, location, radius, depth, material, rotation=(0, 0, 0), vertices=48):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    if material:
        obj.data.materials.append(material)
    return obj


def make_image_material(name, image_path, fallback_color):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if image_path.exists():
        image = bpy.data.images.load(str(image_path))
        tex = mat.node_tree.nodes.new("ShaderNodeTexImage")
        tex.image = image
        mat.node_tree.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
        return mat, True
    bsdf.inputs["Base Color"].default_value = fallback_color
    bsdf.inputs["Roughness"].default_value = 0.6
    return mat, False


def add_vertical_card(name, image_path, location, width, height, fallback_color):
    verts = [
        (-width / 2, 0, 0),
        (width / 2, 0, 0),
        (width / 2, 0, height),
        (-width / 2, 0, height),
    ]
    faces = [(0, 1, 2, 3)]
    mesh = bpy.data.meshes.new(f"{name}_mesh")
    mesh.from_pydata(verts, [], faces)
    uv_layer = mesh.uv_layers.new(name="UVMap")
    for loop, uv in zip(uv_layer.data, [(0, 0), (1, 0), (1, 1), (0, 1)]):
        loop.uv = uv
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    mat, loaded = make_image_material(f"{name}_material", image_path, fallback_color)
    obj.data.materials.append(mat)
    obj["source_image"] = str(image_path)
    obj["image_loaded"] = loaded
    return obj


def add_label(text, location):
    bpy.ops.object.text_add(location=location, rotation=(math.radians(70), 0, 0))
    obj = bpy.context.object
    obj.name = f"label_{text}"
    obj.data.body = text
    obj.data.align_x = "CENTER"
    obj.data.align_y = "CENTER"
    obj.data.size = 0.18
    obj.data.materials.append(make_material(f"{text}_label_white", (0.85, 0.9, 1.0, 1)))
    obj.hide_render = True
    return obj


def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def keyframe_camera(camera, frame, location, target, lens):
    camera.location = Vector(location)
    look_at(camera, target)
    camera.data.lens = lens
    camera.keyframe_insert(data_path="location", frame=frame)
    camera.keyframe_insert(data_path="rotation_euler", frame=frame)
    camera.data.keyframe_insert(data_path="lens", frame=frame)


def set_interpolation():
    for obj in bpy.context.scene.objects:
        if obj.animation_data and obj.animation_data.action:
            for curve in getattr(obj.animation_data.action, "fcurves", []):
                for point in curve.keyframe_points:
                    point.interpolation = "SINE"


def build_garage(materials):
    add_cube("garage_floor_glossy_concrete", (0, 0, -0.04), (16, 18, 0.08), materials["floor"])
    add_cube("back_wall", (0, 7.2, 1.7), (16, 0.18, 3.4), materials["wall"])
    add_cube("left_wall", (-7.8, 0, 1.7), (0.18, 18, 3.4), materials["wall"])
    add_cube("right_wall", (7.8, 0, 1.7), (0.18, 18, 3.4), materials["wall"])
    add_cube("low_ceiling", (0, 0, 3.35), (16, 18, 0.18), materials["ceiling"])

    for x in (-6.2, 6.2):
        for y in (-3.8, 2.8):
            add_cube(f"concrete_pillar_{x}_{y}", (x, y, 1.45), (0.46, 0.46, 2.9), materials["pillar"])
    for x in (-3.4, 3.4):
        for y in (2.8,):
            add_cube(f"concrete_pillar_{x}_{y}", (x, y, 1.45), (0.46, 0.46, 2.9), materials["pillar"])

    for x in (-4.6, 0.0, 4.6):
        add_cube(f"parking_line_{x}", (x, -1.4, 0.01), (0.04, 7.5, 0.012), materials["line"])

    light_mat = materials["fluorescent"]
    for y in (-5.0, -2.0, 1.0, 4.0):
        for x in (-4.5, 0.0, 4.5):
            add_cube(f"fluorescent_strip_{x}_{y}", (x, y, 3.17), (2.2, 0.08, 0.06), light_mat)
            bpy.ops.object.light_add(type="AREA", location=(x, y, 3.0))
            light = bpy.context.object
            light.name = f"cold_area_light_{x}_{y}"
            light.data.energy = 230
            light.data.size = 2.2
            light.data.color = (0.78, 0.88, 1.0)


def build_car(materials):
    root = bpy.data.objects.new("black_luxury_car_proxy", None)
    bpy.context.collection.objects.link(root)

    pieces = [
        add_cube("car_body_black_sedan", (0, 1.0, 0.48), (4.7, 2.0, 0.62), materials["car_black"]),
        add_cube("car_cabin_dark_glass", (0, 1.22, 1.0), (2.45, 1.42, 0.75), materials["glass"]),
        add_cube("car_front_grille", (0, -0.08, 0.52), (2.8, 0.08, 0.32), materials["chrome"]),
        add_cube("left_headlight", (-1.35, -0.16, 0.64), (0.78, 0.06, 0.16), materials["headlight"]),
        add_cube("right_headlight", (1.35, -0.16, 0.64), (0.78, 0.06, 0.16), materials["headlight"]),
    ]
    for x in (-1.65, 1.65):
        for y in (0.18, 1.78):
            pieces.append(add_cylinder(f"wheel_{x}_{y}", (x, y, 0.28), 0.34, 0.26, materials["tire"], rotation=(math.radians(90), 0, 0)))

    for obj in pieces:
        obj.parent = root
    return root


def build_characters(materials):
    specs = [
        ("char_left2_ivory_glasses", CHARACTER_IMAGES["left2_ivory_glasses"], (-4.9, 0.95, 0), 1.28, 2.48, (0.85, 0.78, 0.66, 1), "LEFT2 ivory glasses"),
        ("char_left1_sage", CHARACTER_IMAGES["left1_sage"], (-2.65, -0.75, 0), 1.28, 2.5, (0.58, 0.68, 0.58, 1), "LEFT1 sage"),
        ("char_center_navy", CHARACTER_IMAGES["center_navy"], (0.0, -0.55, 0), 1.38, 2.6, (0.02, 0.05, 0.14, 1), "CENTER navy"),
        ("char_right1_black_gold", CHARACTER_IMAGES["right1_black_gold"], (2.65, -0.75, 0), 1.28, 2.5, (0.05, 0.035, 0.025, 1), "RIGHT1 black gold"),
        ("char_right2_gold", CHARACTER_IMAGES["right2_gold"], (4.9, 0.95, 0), 1.28, 2.48, (0.8, 0.58, 0.28, 1), "RIGHT2 gold"),
    ]
    cards = {}
    for name, path, loc, width, height, color, label in specs:
        card = add_vertical_card(name, path, loc, width, height, color)
        cards[name] = card
        add_label(label, (loc[0], loc[1] - 0.08, height + 0.25))

    cane = add_cylinder(
        "right1_silver_cane_or_jewel_scepter",
        (1.9, -1.05, 1.15),
        0.035,
        1.65,
        materials["chrome"],
        rotation=(math.radians(72), 0, math.radians(18)),
        vertices=24,
    )
    cane.parent = cards["char_right1_black_gold"]
    return cards


def add_shot_markers():
    shot_data = [
        ("SHOT_01_center_navy_mid_arc_left_000_002", 1, 48),
        ("SHOT_02_left2_ivory_rack_focus_closeup_002_005", 49, 120),
        ("SHOT_03_right1_black_gold_pullback_cutin_005_009", 121, 216),
        ("SHOT_04_center_navy_crane_reveal_009_012", 217, 288),
        ("SHOT_05_group_wide_power_freeze_012_015", 289, 360),
    ]
    timeline = bpy.context.scene.timeline_markers
    for name, start, _end in shot_data:
        timeline.new(name, frame=start)


def setup_cameras():
    scene = bpy.context.scene
    bpy.ops.object.camera_add(location=(0, -6, 1.6))
    camera = bpy.context.object
    camera.name = "DIRECTOR_CAMERA_keyframed_all_shots"
    camera.data.sensor_width = 32
    camera.data.dof.use_dof = True
    camera.data.dof.aperture_fstop = 3.2
    scene.camera = camera

    # Shot 1: medium start, left arc on center navy heroine.
    keyframe_camera(camera, 1, (-1.25, -5.2, 1.45), (0.0, -0.55, 1.42), 42)
    keyframe_camera(camera, 48, (-1.55, -4.85, 1.5), (0.0, -0.55, 1.46), 45)

    # Shot 2: foreground rack focus, ivory glasses close-up.
    keyframe_camera(camera, 49, (-5.9, -3.05, 1.35), (-4.9, 0.95, 1.48), 66)
    keyframe_camera(camera, 120, (-5.55, -2.2, 1.42), (-4.9, 0.95, 1.5), 78)

    # Shot 3: pull back, black-gold guard enters foreground.
    keyframe_camera(camera, 121, (-5.55, -2.2, 1.42), (-4.9, 0.95, 1.5), 72)
    keyframe_camera(camera, 216, (1.75, -3.15, 1.42), (2.65, -0.75, 1.45), 58)

    # Shot 4: crane back and up to reveal center C-position at car.
    keyframe_camera(camera, 217, (1.75, -3.15, 1.42), (2.65, -0.75, 1.45), 54)
    keyframe_camera(camera, 288, (0.2, -6.0, 2.35), (0.0, -0.55, 1.48), 38)

    # Shot 5: wide group power freeze.
    keyframe_camera(camera, 289, (0.0, -6.5, 2.3), (0.0, 0.05, 1.35), 26)
    keyframe_camera(camera, 360, (0.0, -8.0, 2.55), (0.0, 0.1, 1.35), 22)

    for frame, fstop in [(1, 3.0), (49, 1.8), (121, 2.4), (217, 3.2), (289, 5.6), (360, 5.6)]:
        camera.data.dof.aperture_fstop = fstop
        camera.data.dof.keyframe_insert(data_path="aperture_fstop", frame=frame)

    for name, loc, target, lens in [
        ("CAM_01_CENTER_NAVY_ARC_LEFT", (-1.55, -4.85, 1.5), (0.0, -0.55, 1.4), 45),
        ("CAM_02_LEFT2_IVORY_GLASSES_CLOSEUP", (-5.55, -2.2, 1.42), (-4.9, 0.95, 1.48), 78),
        ("CAM_03_RIGHT1_BLACK_GOLD_FOREGROUND", (1.75, -3.15, 1.42), (2.65, -0.75, 1.45), 58),
        ("CAM_04_CENTER_NAVY_CRANE", (0.2, -6.0, 2.35), (0.0, -0.55, 1.45), 38),
        ("CAM_05_FINAL_GROUP_WIDE", (0.0, -8.0, 2.55), (0.0, 0.1, 1.35), 22),
    ]:
        bpy.ops.object.camera_add(location=loc)
        cam = bpy.context.object
        cam.name = name
        look_at(cam, target)
        cam.data.lens = lens

    set_interpolation()


def setup_scene():
    ensure_dirs()
    clear_scene()

    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = 360
    scene.render.fps = 24
    scene.render.resolution_x = 1280
    scene.render.resolution_y = 720
    scene.eevee.taa_render_samples = 64
    scene.world = bpy.data.worlds.new("cold_dark_garage_world") if not scene.world else scene.world
    scene.world.color = (0.012, 0.016, 0.02)

    materials = {
        "floor": make_material("wet_dark_concrete", (0.06, 0.065, 0.07, 1), roughness=0.18),
        "wall": make_material("cool_gray_wall", (0.22, 0.24, 0.25, 1), roughness=0.7),
        "ceiling": make_material("low_industrial_ceiling", (0.12, 0.13, 0.14, 1), roughness=0.75),
        "pillar": make_material("concrete_pillar_material", (0.28, 0.29, 0.28, 1), roughness=0.72),
        "line": make_material("faded_parking_line", (0.78, 0.78, 0.68, 1), roughness=0.5),
        "car_black": make_material("gloss_black_car_paint", (0.002, 0.002, 0.004, 1), roughness=0.18, metallic=0.45),
        "glass": make_material("dark_car_glass", (0.02, 0.035, 0.055, 0.55), roughness=0.08, alpha=0.55),
        "chrome": make_material("cold_chrome", (0.8, 0.86, 0.92, 1), roughness=0.15, metallic=1.0),
        "tire": make_material("matte_black_tire", (0.006, 0.006, 0.005, 1), roughness=0.85),
        "headlight": make_material("cold_headlight_emission", (0.7, 0.9, 1.0, 1), emission=(0.7, 0.9, 1.0, 1), strength=2.8),
        "fluorescent": make_material("cold_fluorescent_tube", (0.75, 0.9, 1.0, 1), emission=(0.75, 0.9, 1.0, 1), strength=3.0),
    }

    build_garage(materials)
    build_car(materials)
    build_characters(materials)
    setup_cameras()
    add_shot_markers()

    scene.render.filepath = str(OUTPUT_DIR / "garage_director_stage_")


def get_args():
    if "--" not in sys.argv:
        return set()
    return set(sys.argv[sys.argv.index("--") + 1 :])


def render_preview_frames():
    frames = {
        48: "shot01_navy_heroine",
        120: "shot02_ivory_closeup",
        216: "shot03_black_gold_guard",
        288: "shot04_center_reveal",
        360: "shot05_final_group",
    }
    for frame, name in frames.items():
        bpy.context.scene.frame_set(frame)
        bpy.context.scene.render.filepath = str(PREVIEW_DIR / f"{name}.png")
        bpy.ops.render.render(write_still=True)
    print(f"Saved preview frames to {PREVIEW_DIR}")


def render_animation():
    bpy.context.scene.render.image_settings.file_format = "FFMPEG"
    bpy.context.scene.render.ffmpeg.format = "MPEG4"
    bpy.context.scene.render.ffmpeg.codec = "H264"
    bpy.context.scene.render.ffmpeg.constant_rate_factor = "MEDIUM"
    bpy.context.scene.render.filepath = str(OUTPUT_DIR / "five_character_garage_director_stage.mp4")
    bpy.ops.render.render(animation=True)
    print(f"Saved animation to {OUTPUT_DIR / 'five_character_garage_director_stage.mp4'}")


if __name__ == "__main__":
    args = get_args()
    setup_scene()
    bpy.ops.wm.save_as_mainfile(filepath=str(OUTPUT_BLEND))
    print(f"Saved Blender director stage to {OUTPUT_BLEND}")
    if "--preview" in args:
        render_preview_frames()
    if "--render-animation" in args:
        render_animation()
