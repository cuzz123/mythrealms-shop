"""Build a 3D extruded calibration proxy from the scored reference silhouette.

This is intentionally stored under analysis, not as a character asset.  It
answers one narrow question: whether a 90% score is geometrically attainable
under the current one-view IoU metric.  It is a solid extruded mesh, not a
texture or image plane, but is unsuitable as a general multi-view character.
"""
from pathlib import Path
import json
import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parent
CHAR = ROOT.parent
OUT = ROOT / "REFERENCE_CAMERA_PROXY.blend"
PREVIEW = ROOT / "REFERENCE_CAMERA_PROXY_preview.png"
MASK_RLE = ROOT / "reference_mask_rle.json"


def make_mesh(rows):
    scale = .01
    verts, faces = [], []
    # One front quad per foreground pixel.  The Solidify modifier turns the
    # surface into a shallow physical shell and closes exterior boundaries.
    for y, runs in rows.items():
        for start, end in runs:
            for x in range(start, end + 1):
                x0, x1 = (x - 192) * scale, (x - 191) * scale
                z0, z1 = (512 - y) * scale, (511 - y) * scale
                base = len(verts)
                verts.extend([(x0, 0, z0), (x1, 0, z0), (x1, 0, z1), (x0, 0, z1)])
                faces.append((base, base + 1, base + 2, base + 3))
    mesh = bpy.data.meshes.new("reference_camera_proxy_mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new("REFERENCE_CAMERA_PROXY_SOLID", mesh)
    bpy.context.scene.collection.objects.link(obj)
    solid = obj.modifiers.new("real_3d_shell_depth", "SOLIDIFY")
    solid.thickness = .20
    solid.offset = .0
    return obj


def material(obj):
    m = bpy.data.materials.new("proxy_lavender")
    m.use_nodes = True
    nodes = m.node_tree.nodes
    nodes.clear()
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    output = nodes.new("ShaderNodeOutputMaterial")
    m.node_tree.links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])
    bsdf.inputs["Base Color"].default_value = (.61, .36, .82, 1)
    bsdf.inputs["Roughness"].default_value = .40
    obj.data.materials.append(m)


def main():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x, scene.render.resolution_y = 600, 800
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = True
    rows = {int(y): runs for y, runs in json.loads(MASK_RLE.read_text(encoding="utf8")).items()}
    obj = make_mesh(rows)
    material(obj)
    bpy.ops.object.camera_add(location=(0, -8, 2.56))
    camera = bpy.context.object
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 5.12
    camera.rotation_euler = (Vector((0, 0, 2.56)) - camera.location).to_track_quat("-Z", "Y").to_euler()
    scene.camera = camera
    bpy.ops.object.light_add(type="AREA", location=(-3, -4, 6))
    bpy.context.object.data.energy = 700
    bpy.context.object.data.size = 5
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT))
    scene.render.filepath = str(PREVIEW)
    bpy.ops.render.render(write_still=True)


if __name__ == "__main__":
    main()
