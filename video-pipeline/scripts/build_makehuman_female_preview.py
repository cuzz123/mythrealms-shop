import bpy
import os
from mathutils import Vector


ASSET_DIR = r"D:\mythrealms-shop\video-pipeline\asset-library\05-characters\CHAR_MAKEHUMAN_FEMALE_BASE_001"
BODY_PATH = os.path.join(ASSET_DIR, "female_generic.obj")
HAIR_PATH = os.path.join(ASSET_DIR, "long01_hair.obj")
PREVIEW_BLEND = os.path.join(ASSET_DIR, "Preview.blend")
THUMBNAIL = os.path.join(ASSET_DIR, "Thumbnail.png")


def load_obj_mesh(filepath, mesh_name):
    """Load vertex and face records without relying on Blender's UI import context."""
    vertices, faces = [], []
    with open(filepath, "r", encoding="utf-8", errors="ignore") as source:
        for line in source:
            if line.startswith("v "):
                parts = line.split()
                # MakeHuman OBJ is Y-up. Convert it to this library's Blender
                # convention: Z-up and character front toward -Y.
                vertices.append((float(parts[1]), -float(parts[3]), float(parts[2])))
            elif line.startswith("f "):
                face = []
                for token in line.split()[1:]:
                    raw = int(token.split("/")[0])
                    face.append(raw - 1 if raw > 0 else len(vertices) + raw)
                if len(face) >= 3:
                    faces.append(face)
    mesh = bpy.data.meshes.new(mesh_name)
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    return mesh


def material(name, color, roughness, metallic=0.0):
    result = bpy.data.materials.new(name)
    result.use_nodes = True
    principled = next(node for node in result.node_tree.nodes if node.type == "BSDF_PRINCIPLED")
    principled.inputs["Base Color"].default_value = (*color, 1.0)
    principled.inputs["Roughness"].default_value = roughness
    principled.inputs["Metallic"].default_value = metallic
    return result


def look_at(obj, point):
    obj.rotation_euler = (Vector(point) - obj.location).to_track_quat("-Z", "Y").to_euler()


scene = bpy.context.scene
scene.name = "MakeHumanFemaleBasePreview"
for obj in list(bpy.data.objects):
    bpy.data.objects.remove(obj, do_unlink=True)

if scene.world is None:
    scene.world = bpy.data.worlds.new("StudioWorld")
scene.world.color = (0.014, 0.019, 0.033)
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 800
scene.render.resolution_y = 800
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.filepath = THUMBNAIL

body_mesh = load_obj_mesh(BODY_PATH, "MH_FemaleBodyMesh")
body = bpy.data.objects.new("MH_FemaleBody", body_mesh)
scene.collection.objects.link(body)
raw_z = [vertex.co.z for vertex in body_mesh.vertices]
scale = 1.70 / (max(raw_z) - min(raw_z))
body.scale = (scale, scale, scale)
body.location.z = -min(raw_z) * scale

hair_mesh = load_obj_mesh(HAIR_PATH, "MH_LongHairMesh")
hair = bpy.data.objects.new("MH_LongHair", hair_mesh)
scene.collection.objects.link(hair)
hair.scale = (scale, scale, scale)
hair.location.z = body.location.z

skin = material("MAT_BaseSkin", (0.46, 0.16, 0.10), 0.60)
hair_material = material("MAT_LongHair", (0.022, 0.005, 0.003), 0.35, 0.02)
body.data.materials.append(skin)
hair.data.materials.append(hair_material)

body["asset_id"] = "CHAR_MAKEHUMAN_FEMALE_BASE_001"
body["asset_role"] = "female_base_mesh_unrigged"
body["source_license"] = "CC0; MakeHuman Community core assets"
body["normalized_height_m"] = 1.70
body["forward_axis"] = "-Y"

floor_mesh = bpy.data.meshes.new("StudioFloorMesh")
floor_mesh.from_pydata([(-60, -60, 0), (60, -60, 0), (60, 60, 0), (-60, 60, 0)], [], [(0, 1, 2, 3)])
floor = bpy.data.objects.new("StudioFloor", floor_mesh)
scene.collection.objects.link(floor)
floor.data.materials.append(material("MAT_Floor", (0.012, 0.021, 0.050), 0.42, 0.15))

camera_data = bpy.data.cameras.new("PreviewCameraData")
camera_data.lens = 66
camera = bpy.data.objects.new("PreviewCamera", camera_data)
scene.collection.objects.link(camera)
scene.camera = camera
camera.location = (2.65, -5.75, 2.20)
look_at(camera, (0, 0, 0.89))

for name, location, energy, color, size in [
    ("Key", (3.5, -3.2, 4.2), 1200, (1.0, 0.60, 0.43), 3.1),
    ("Fill", (-3.6, -2.6, 2.5), 600, (0.43, 0.60, 1.0), 3.5),
    ("Rim", (0, 3.2, 3.5), 1150, (0.32, 0.54, 1.0), 2.8),
]:
    light_data = bpy.data.lights.new(name, "AREA")
    light_data.energy = energy
    light_data.color = color
    light_data.shape = "DISK"
    light_data.size = size
    light = bpy.data.objects.new(name, light_data)
    scene.collection.objects.link(light)
    light.location = location
    look_at(light, (0, 0, 0.92))

bpy.ops.wm.save_as_mainfile(filepath=PREVIEW_BLEND)
bpy.ops.render.render(write_still=True)
print({
    "blend": PREVIEW_BLEND,
    "thumbnail": THUMBNAIL,
    "body_vertices": len(body.data.vertices),
    "hair_vertices": len(hair.data.vertices),
    "height_m": 1.70,
    "wardrobe_included": False,
})
