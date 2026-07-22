"""Import and render the front/side visual-hull prototype for evaluation."""
from pathlib import Path
import bpy
from mathutils import Vector, Matrix

ROOT = Path(__file__).resolve().parent
OBJ = ROOT / "visual_hull.obj"
OUT = ROOT / "VISUAL_HULL_PROTOTYPE.blend"


def look(camera, target):
    # Build an upright camera basis explicitly.  ``to_track_quat`` may roll
    # 180 degrees when aiming along a cardinal horizontal axis.
    forward = (Vector(target) - camera.location).normalized()
    # Blender's camera image Y is inverted relative to our image-mask row
    # coordinates, so use the negative world-Z reference for an upright render.
    right = forward.cross(Vector((0, 0, -1))).normalized()
    up = right.cross(forward).normalized()
    basis = Matrix(((right.x, up.x, -forward.x, 0),
                    (right.y, up.y, -forward.y, 0),
                    (right.z, up.z, -forward.z, 0),
                    (0, 0, 0, 1)))
    camera.rotation_euler = basis.to_euler()


def render(scene, camera, name, location):
    camera.location = location
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = 5.25
    look(camera, (0, 0, 2.56))
    scene.render.filepath = str(ROOT / name)
    bpy.ops.render.render(write_still=True)


def main():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x, scene.render.resolution_y = 600, 800
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = True
    bpy.ops.wm.obj_import(filepath=str(OBJ))
    obj = next(o for o in scene.objects if o.type == "MESH")
    obj.name = "XYQ_VISUAL_HULL_PROTOTYPE"
    # Blender's OBJ importer rotates Y-up OBJ data to Z-up.  The generator
    # already emits Z-up coordinates, so undo that importer convenience.
    obj.rotation_euler = (0, 0, 0)
    # The OBJ generator emits only exposed voxel faces for robustness.  Merge
    # shared coordinates before smooth shading so it reads as a continuous
    # visual-hull surface instead of a stack of independent plates.
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.mesh.remove_doubles(threshold=.000001)
    bpy.ops.object.mode_set(mode="OBJECT")
    remesh = obj.modifiers.new("watertight_visual_hull_remesh", "REMESH")
    remesh.mode = "VOXEL"
    remesh.voxel_size = .012
    remesh.adaptivity = .05
    remesh.use_smooth_shade = True
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier=remesh.name)
    smoothing = obj.modifiers.new("gentle_surface_smoothing", "SMOOTH")
    smoothing.factor = .18
    smoothing.iterations = 2
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier=smoothing.name)
    mat = bpy.data.materials.new("hull_lavender")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    shader = nodes.new("ShaderNodeBsdfPrincipled")
    output = nodes.new("ShaderNodeOutputMaterial")
    mat.node_tree.links.new(shader.outputs["BSDF"], output.inputs["Surface"])
    shader.inputs["Base Color"].default_value = (.61, .36, .82, 1)
    shader.inputs["Roughness"].default_value = .42
    obj.data.materials.append(mat)
    for face in obj.data.polygons:
        face.use_smooth = True
    bpy.ops.object.light_add(type="AREA", location=(-3, -4, 6))
    bpy.context.object.data.energy = 1000
    bpy.context.object.data.size = 5
    bpy.ops.object.light_add(type="AREA", location=(4, -2, 3))
    bpy.context.object.data.energy = 450
    bpy.context.object.data.size = 3
    bpy.ops.object.camera_add()
    camera = bpy.context.object
    scene.camera = camera
    # The primary hull plane is aligned to the scored director-camera view.
    render(scene, camera, "VISUAL_HULL_match.png", (0, -10, 2.56))
    render(scene, camera, "VISUAL_HULL_front.png", (0, -10, 2.56))
    render(scene, camera, "VISUAL_HULL_side.png", (10, 0, 2.56))
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT))


if __name__ == "__main__":
    main()
