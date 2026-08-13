"""Render a deterministic parameter sweep against the supplied mannequin view.

This is an analysis helper: it deforms a genuine 3D human-proportion mesh and
renders it from multiple 3D cameras.  It does not create billboard geometry or
use the reference image as a texture.
"""
from pathlib import Path
import random
import json
import math
import bpy
import bmesh
from mathutils import Vector

ROOT = Path(__file__).resolve().parent
SOURCE = Path(r"D:\mythrealms-shop\video-pipeline\asset-library\05-characters\CHAR_XIAOYUNQUE_HUMAN_RIG_BASE_001\CHAR_XIAOYUNQUE_HUMAN_VISUAL_BASE_001.blend")
OUT = ROOT / "analysis" / "score_search"
COUNT = 72


def make_material():
    mat = bpy.data.materials.new("score_lavender")
    mat.use_nodes = True
    mat.node_tree.nodes.clear()
    bsdf = mat.node_tree.nodes.new("ShaderNodeBsdfPrincipled")
    output = mat.node_tree.nodes.new("ShaderNodeOutputMaterial")
    mat.node_tree.links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])
    bsdf.inputs["Base Color"].default_value = (.61, .36, .82, 1)
    bsdf.inputs["Roughness"].default_value = .38
    return mat


def remove_head_cap(body):
    bm = bmesh.new()
    bm.from_mesh(body.data)
    faces = [face for face in bm.faces if all(v.co.z > 1.49 and abs(v.co.x) < .18 for v in face.verts)]
    bmesh.ops.delete(bm, geom=faces, context="FACES")
    bm.to_mesh(body.data)
    bm.free()
    body.data.update()


def add_egg(material):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=20, location=(0, 0, 1.59))
    egg = bpy.context.object
    egg.name = "score_egg"
    egg.data.materials.append(material)
    for face in egg.data.polygons:
        face.use_smooth = True
    return egg


def apply_shape(body, original, egg, p):
    for vertex, base in zip(body.data.vertices, original):
        co = base.copy()
        if abs(co.x) > .28 and co.z > 1.10:
            # Raise director-pose arms, then tune their visible cross-section.
            co.z += p["raise"] * min(1.0, (abs(co.x) - .28) / .75)
            co.y *= p["arm_y"]
            co.z = 1.36 + (co.z - 1.36) * p["arm_z"]
        if .10 < co.z < .97:
            sign = -1 if co.x < 0 else 1
            centre = sign * .108 * p["leg_center"]
            co.x = centre + (co.x - centre) * p["leg_width"]
        elif .97 <= co.z < 1.17:
            co.x *= p["pelvis"]
        elif 1.17 <= co.z < 1.38 and abs(co.x) < .40:
            co.x *= p["torso"]
        vertex.co = co
    body.data.update()
    egg.scale = (p["head_x"], p["head_y"], p["head_z"])


def camera_for(scene):
    camera = next(obj for obj in scene.objects if obj.type == "CAMERA")
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 2.05
    return camera


def render_candidate(scene, camera, path, p):
    camera.location = (p["camera_x"], -5.0, p["camera_z"])
    camera.rotation_euler = (Vector((0, 0, .86)) - camera.location).to_track_quat("-Z", "Y").to_euler()
    scene.render.filepath = str(path)
    bpy.ops.render.render(write_still=True)


def parameter_sets():
    # Include the known 62% build as c000, then explore surrounding space.
    yield {"raise": .10, "arm_y": 1.0, "arm_z": 1.0, "leg_width": 1.0, "leg_center": 1.0, "pelvis": 1.0, "torso": 1.0, "head_x": .13, "head_y": .108, "head_z": .19, "camera_x": 2.2, "camera_z": 1.54}
    rng = random.Random(90349)
    for _ in range(COUNT - 1):
        yield {
            "raise": rng.uniform(.07, .15),
            "arm_y": rng.uniform(.68, 1.08),
            "arm_z": rng.uniform(.72, 1.08),
            "leg_width": rng.uniform(.68, 1.05),
            "leg_center": rng.uniform(.78, 1.40),
            "pelvis": rng.uniform(.78, 1.08),
            "torso": rng.uniform(.82, 1.10),
            "head_x": rng.uniform(.095, .165),
            "head_y": rng.uniform(.080, .145),
            "head_z": rng.uniform(.155, .225),
            "camera_x": rng.uniform(1.20, 3.60),
            "camera_z": rng.uniform(1.10, 1.82),
        }


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.open_mainfile(filepath=str(SOURCE))
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x, scene.render.resolution_y = 450, 600
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = True
    body = bpy.data.objects["XYQ_HUMAN_MANNEQUIN_BODY"]
    material = make_material()
    body.data.materials.clear()
    body.data.materials.append(material)
    remove_head_cap(body)
    original = [vertex.co.copy() for vertex in body.data.vertices]
    egg = add_egg(material)
    camera = camera_for(scene)
    manifest = {}
    for index, params in enumerate(parameter_sets()):
        apply_shape(body, original, egg, params)
        name = f"c{index:03d}.png"
        render_candidate(scene, camera, OUT / name, params)
        manifest[name] = params
    (OUT / "parameters.json").write_text(json.dumps(manifest, indent=2), encoding="utf8")


if __name__ == "__main__":
    main()
