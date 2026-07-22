"""Build a XiaoYunque-style articulated mannequin from a real human mesh.

The natural source mesh is the deforming anatomical core.  On top of it this
script builds thin, bone-parented hard-surface plates, hinges, palms and finger
segments.  That gives the character a human volume *and* the readable modular
construction of the supplied director-viewport mannequin; it is not a
silhouette/visual-hull reconstruction.
"""
from pathlib import Path
import math
import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parent
SOURCE = Path(r"D:\Softwares\reallusion\iClone 8\Program\Assets\Share\StandardSeriesConverter\FullBodySource.obj")
OUT = ROOT / "CHAR_XIAOYUNQUE_MANNEQUIN_FEMALE_016_HEAD_NECK_FINAL.blend"
MATCH = ROOT / "Preview_v16_match.png"
FRONT = ROOT / "Preview_v16_front.png"
SIDE = ROOT / "Preview_v16_side.png"
BACK = ROOT / "Preview_v16_back.png"


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for collection in list(bpy.data.collections):
        bpy.data.collections.remove(collection)


def material(name, colour, roughness, metallic=0.0):
    result = bpy.data.materials.new(name)
    result.use_nodes = True
    nodes = result.node_tree.nodes
    nodes.clear()
    shader = nodes.new("ShaderNodeBsdfPrincipled")
    output = nodes.new("ShaderNodeOutputMaterial")
    result.node_tree.links.new(shader.outputs["BSDF"], output.inputs["Surface"])
    shader.inputs["Base Color"].default_value = colour
    shader.inputs["Roughness"].default_value = roughness
    shader.inputs["Metallic"].default_value = metallic
    return result


def relocate(obj, collection):
    for prior in list(obj.users_collection):
        prior.objects.unlink(obj)
    collection.objects.link(obj)
    return obj


def smooth(obj):
    if obj.type == "MESH":
        for face in obj.data.polygons:
            face.use_smooth = True


def sphere(collection, name, location, scale, mat, segments=36, rings=24):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, location=location)
    obj = relocate(bpy.context.object, collection)
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(mat)
    smooth(obj)
    return obj


def torus(collection, name, location, major_radius, minor_radius, mat, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_torus_add(
        major_radius=major_radius,
        minor_radius=minor_radius,
        major_segments=32,
        minor_segments=10,
        location=location,
        rotation=rotation,
    )
    obj = relocate(bpy.context.object, collection)
    obj.name = name
    obj.data.materials.append(mat)
    smooth(obj)
    return obj


def cylinder_between(collection, name, a, b, radius, mat, vertices=28):
    """Make a softly bevelled mechanical axle from ``a`` to ``b``."""
    a, b = Vector(a), Vector(b)
    direction = b - a
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices, radius=radius, depth=direction.length, location=(a + b) / 2
    )
    obj = relocate(bpy.context.object, collection)
    obj.name = name
    obj.rotation_euler = direction.to_track_quat("Z", "Y").to_euler()
    obj.data.materials.append(mat)
    bevel = obj.modifiers.new("edge_softening", "BEVEL")
    bevel.width = radius * .22
    bevel.segments = 2
    smooth(obj)
    return obj


def profile_shell(collection, name, levels, mat, segments=40):
    """Create one sealed, manufacturable shell from elliptical height rings."""
    vertices, faces = [], []
    for z, radius_x, radius_y in levels:
        for index in range(segments):
            angle = math.tau * index / segments
            vertices.append((radius_x * math.cos(angle), radius_y * math.sin(angle), z))
    for row in range(len(levels) - 1):
        for index in range(segments):
            following = (index + 1) % segments
            start = row * segments
            next_start = (row + 1) * segments
            faces.append((start + index, start + following, next_start + following, next_start + index))
    faces.append(tuple(range(segments - 1, -1, -1)))
    last = (len(levels) - 1) * segments
    faces.append(tuple(last + index for index in range(segments)))
    mesh = bpy.data.meshes.new(name + "_mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    collection.objects.link(obj)
    obj.data.materials.append(mat)
    bevel = obj.modifiers.new("manufactured_edge_rounding", "BEVEL")
    bevel.width = .010
    bevel.segments = 2
    smooth(obj)
    return obj


def shell_between(collection, name, a, b, near_radius, far_radius, mat,
                  midpoint_scale=1.0, depth_ratio=.82):
    """A tapered limb plate that leaves an explicit joint gap at either end."""
    a, b = Vector(a), Vector(b)
    direction = b - a
    length = direction.length
    obj = profile_shell(
        collection,
        name,
        [(-length * .50, near_radius * .76, near_radius * depth_ratio * .76),
         (-length * .22, near_radius * midpoint_scale, near_radius * depth_ratio),
         ( length * .20, far_radius * midpoint_scale, far_radius * depth_ratio),
         ( length * .50, far_radius * .76, far_radius * depth_ratio * .76)],
        mat,
    )
    obj.location = (a + b) / 2
    obj.rotation_euler = direction.to_track_quat("Z", "Y").to_euler()
    return obj


def capsule_between(collection, name, a, b, radius, mat):
    """A compact phalanx casing with a rounded, not toy-block, outline."""
    a, b = Vector(a), Vector(b)
    direction = b - a
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=16, location=(a + b) / 2)
    obj = relocate(bpy.context.object, collection)
    obj.name = name
    obj.scale = (radius, radius, direction.length / 2 + radius * .65)
    obj.rotation_euler = direction.to_track_quat("Z", "Y").to_euler()
    obj.data.materials.append(mat)
    smooth(obj)
    return obj


def palm_wedge(collection, name, sign, mat):
    """A low palm shell that hides the anatomical palm but stays hand-shaped."""
    inner, outer = sign * 1.005, sign * 1.155
    vertices = [
        (inner, -.075, 1.286), (inner, .075, 1.286), (inner, -.070, 1.385), (inner, .070, 1.385),
        (outer, -.055, 1.275), (outer, .055, 1.275), (outer, -.047, 1.365), (outer, .047, 1.365),
    ]
    faces = [(0, 4, 6, 2), (1, 3, 7, 5), (0, 1, 5, 4), (2, 6, 7, 3), (0, 2, 3, 1), (4, 5, 7, 6)]
    mesh = bpy.data.meshes.new(name + "_mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    collection.objects.link(obj)
    obj.data.materials.append(mat)
    bevel = obj.modifiers.new("palm_edge_rounding", "BEVEL")
    bevel.width = .016
    bevel.segments = 3
    smooth(obj)
    return obj


def prepare_body(collection, shell_mat, joint_mat):
    bpy.ops.wm.obj_import(filepath=str(SOURCE))
    meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    body = max(meshes, key=lambda item: len(item.data.vertices))
    for obj in meshes:
        if obj != body:
            bpy.data.objects.remove(obj, do_unlink=True)
    relocate(body, collection)
    body.name = "XYQ_NATURAL_PROPORTION_CORE"
    # OBJ millimetres / axes -> the iClone source's upright 1.7m T pose.
    body.scale = (.01, .01, .01)
    body.rotation_euler = (math.pi / 2, 0, 0)
    bpy.context.view_layer.objects.active = body
    body.select_set(True)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    # Lift the extended arms into the reference's clean director T-pose.  This
    # preserves the source's natural proportions while matching the supplied
    # mannequin's arm line.
    for vertex in body.data.vertices:
        coord = vertex.co
        if abs(coord.x) > .28 and coord.z > 1.10:
            coord.z += .10 * min(1.0, (abs(coord.x) - .28) / .75)
    body.data.materials.clear()
    body.data.materials.append(shell_mat)
    body.data.materials.append(joint_mat)
    for face in body.data.polygons:
        face.use_smooth = True
    # Remove only the human facial cap.  A clean egg shell is placed in its
    # exact envelope below; preserving the surrounding neck avoids a floating
    # head and keeps the reference silhouette intact.
    import bmesh
    bm = bmesh.new()
    bm.from_mesh(body.data)
    face_cap = [face for face in bm.faces if all(vertex.co.z > 1.49 and abs(vertex.co.x) < .18 for vertex in face.verts)]
    bmesh.ops.delete(bm, geom=face_cap, context="FACES")
    bm.to_mesh(body.data)
    bm.free()
    # Dark material seams describe joints without adding exterior bulk.  They
    # stay on the same surface, so the measurable silhouette is not sacrificed.
    for face in body.data.polygons:
        centre = face.center
        arm_joint = centre.z > 1.18 and (abs(abs(centre.x) - .69) < .020 or abs(abs(centre.x) - 1.01) < .015)
        leg_joint = abs(centre.z - .50) < .018 or abs(centre.z - .145) < .013
        neck_joint = 1.39 < centre.z < 1.425 and abs(centre.x) < .13
        if arm_joint or leg_joint or neck_joint:
            face.material_index = 1
        face.use_smooth = True
    body.data.update()
    return body


def build_armature(collection):
    bpy.ops.object.armature_add(enter_editmode=True, location=(0, 0, 0))
    rig = relocate(bpy.context.object, collection)
    rig.name = "XYQ_NATURAL_SHELL_55_BONE_RIG"
    rig.data.name = rig.name
    edit = rig.data.edit_bones
    edit.remove(edit[0])
    spec = {
        "root": ((0, 0, .02), (0, 0, .40), None),
        "pelvis": ((0, 0, .78), (0, 0, .98), "root"),
        "spine_01": ((0, 0, .98), (0, 0, 1.12), "pelvis"),
        "spine_02": ((0, 0, 1.12), (0, 0, 1.25), "spine_01"),
        "spine": ((0, 0, 1.25), (0, 0, 1.39), "spine_02"),
        "neck": ((0, 0, 1.39), (0, 0, 1.49), "spine"),
        "head": ((0, 0, 1.49), (0, 0, 1.72), "neck"),
    }
    for sign, suffix in ((-1, "L"), (1, "R")):
        spec.update({
            f"clavicle.{suffix}": ((.08 * sign, 0, 1.35), (.25 * sign, 0, 1.37), "spine"),
            f"scapula.{suffix}": ((.25 * sign, .015, 1.37), (.36 * sign, .01, 1.37), f"clavicle.{suffix}"),
            f"upper_arm.{suffix}": ((.36 * sign, 0, 1.37), (.68 * sign, 0, 1.35), f"scapula.{suffix}"),
            f"forearm.{suffix}": ((.68 * sign, 0, 1.35), (1.01 * sign, 0, 1.34), f"upper_arm.{suffix}"),
            f"hand.{suffix}": ((1.01 * sign, 0, 1.34), (1.18 * sign, 0, 1.34), f"forearm.{suffix}"),
            f"thigh.{suffix}": ((.12 * sign, 0, .88), (.13 * sign, 0, .48), "pelvis"),
            f"shin.{suffix}": ((.13 * sign, 0, .48), (.11 * sign, 0, .13), f"thigh.{suffix}"),
            f"foot.{suffix}": ((.11 * sign, 0, .13), (.11 * sign, -.18, .08), f"shin.{suffix}"),
            f"toe.{suffix}": ((.11 * sign, -.18, .08), (.11 * sign, -.30, .07), f"foot.{suffix}"),
        })
        for finger in range(5):
            y = (finger - 2) * .026
            z = 1.34 + (finger - 2) * .009
            points = [(1.12 * sign, y, z), (1.19 * sign, y * 1.08, z), (1.255 * sign, y * 1.16, z - .006), (1.31 * sign, y * 1.25, z - .012)]
            spec[f"finger_{finger}_01.{suffix}"] = (points[0], points[1], f"hand.{suffix}")
            spec[f"finger_{finger}_02.{suffix}"] = (points[1], points[2], f"finger_{finger}_01.{suffix}")
            spec[f"finger_{finger}_03.{suffix}"] = (points[2], points[3], f"finger_{finger}_02.{suffix}")
    for name, (head, tail, parent) in spec.items():
        bone = edit.new(name)
        bone.head = head
        bone.tail = tail
        if parent:
            bone.parent = edit[parent]
    bpy.ops.object.mode_set(mode="OBJECT")
    rig.data.display_type = "BBONE"
    rig.show_in_front = True
    return rig


def auto_bind(body, rig):
    bpy.ops.object.select_all(action="DESELECT")
    body.select_set(True)
    rig.select_set(True)
    bpy.context.view_layer.objects.active = rig
    try:
        bpy.ops.object.parent_set(type="ARMATURE_AUTO")
        return "automatic weights generated from aligned 55-bone rest pose"
    except RuntimeError as error:
        # Do not silently pretend a failed bind is usable; keep the visual model
        # and record the reason in the blend for follow-up weighting work.
        return "automatic weights pending: " + str(error)


def rigid_bind(modules, rig):
    """Bone-parent every exterior panel while preserving its exact rest pose."""
    bpy.context.view_layer.update()
    saved = [(obj, bone, obj.matrix_world.copy()) for obj, bone in modules]
    for obj, bone, _ in saved:
        obj.parent = rig
        obj.parent_type = "BONE"
        obj.parent_bone = bone
        obj["motion_target_bone"] = bone
    bpy.context.view_layer.update()
    for obj, _, matrix in saved:
        obj.matrix_world = matrix
    bpy.context.view_layer.update()


def build_mechanical_overlays(collection, shell_mat, joint_mat, rig):
    """Build mechanically legible plates over a deforming human proportion core.

    The plates deliberately sit only millimetres proud of the core: viewed in
    motion this reads as a continuous female mannequin, while the exposed dark
    axles at shoulders, elbows, knees, wrists and fingers establish the actual
    articulated construction seen in the reference.
    """
    modules = []
    # The previous horizontal cylinder made the neck read as three separate
    # balls.  A slim upright collar plus a single pear-shaped shell gives a
    # clean jaw-to-neck transition from every camera angle.
    neck_collar = profile_shell(collection, "XYQ_NECK_VERTICAL_COLLAR", [
        (1.365, .068, .058), (1.392, .076, .064),
        (1.435, .074, .063), (1.465, .062, .054),
    ], joint_mat, 36)
    head_shell = profile_shell(collection, "XYQ_FACELESS_PEAR_HEAD_SHELL", [
        (1.425, .062, .052), (1.462, .084, .070),
        (1.520, .116, .094), (1.605, .134, .108),
        (1.685, .118, .096), (1.745, .078, .066),
        (1.772, .035, .030), (1.786, .019, .016), (1.792, .006, .005),
    ], shell_mat, 48)
    # A tiny same-colour stud is a director-side orientation cue, not a face.
    # It disappears at normal render distance yet makes front/back unambiguous
    # when blocking a shot in the viewport.
    forward_stud = sphere(collection, "XYQ_HEAD_FORWARD_STUD", (0, -.109, 1.595), (.014, .003, .027), joint_mat, 20, 12)
    modules.extend([(neck_collar, "neck"), (head_shell, "head"), (forward_stud, "head")])
    # The human core carries every limb and all of the torso.  Its joint seams
    # are assigned directly to the core's geometry in ``prepare_body``: that
    # avoids the detached balls and armour shapes that would make this a toy
    # robot rather than the streamlined mannequin in the reference.
    rigid_bind(modules, rig)


def look_at(camera, target):
    camera.rotation_euler = (Vector(target) - camera.location).to_track_quat("-Z", "Y").to_euler()


def render(scene, camera, path, location, target, scale):
    camera.location = location
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = scale
    look_at(camera, target)
    scene.render.filepath = str(path)
    bpy.ops.render.render(write_still=True)


def main():
    clear_scene()
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x, scene.render.resolution_y = 600, 800
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = True
    scene.world.color = (.045, .05, .07)
    collection = bpy.data.collections.new("CHAR_XIAOYUNQUE_ARTICULATED_HUMAN_016")
    scene.collection.children.link(collection)
    shell_mat = material("XYQ_Lavender_Continuous_Shell", (.61, .36, .82, 1), .38, .04)
    joint_mat = material("XYQ_Deep_Lavender_Mechanical_Joints", (.37, .17, .56, 1), .28, .16)
    body = prepare_body(collection, shell_mat, joint_mat)
    rig = build_armature(collection)
    rig["bone_count"] = len(rig.data.bones)
    rig["binding"] = auto_bind(body, rig)
    build_mechanical_overlays(collection, shell_mat, joint_mat, rig)
    collection.asset_mark()
    collection["asset_id"] = "CHAR_XIAOYUNQUE_MANNEQUIN_FEMALE_016"
    collection["source"] = "real human proportion core with refined pear head, vertical neck collar and forward cue"
    collection["rig"] = rig.name
    # Studio lights make seams visible without contaminating the alpha-based
    # reference silhouette measurement.
    for location, energy, size in [((-3, -4, 4), 1050, 4.0), ((3, -3, 2.5), 480, 3.0), ((0, 3, 3), 260, 3.0)]:
        bpy.ops.object.light_add(type="AREA", location=location)
        light = bpy.context.object
        light.data.energy, light.data.size = energy, size
    bpy.ops.object.camera_add()
    camera = bpy.context.object
    camera.name = "XYQ_NATURAL_SHELL_PREVIEW_CAMERA"
    scene.camera = camera
    target = (0, 0, .86)
    render(scene, camera, MATCH, (2.2, -5.0, 1.54), target, 2.05)
    render(scene, camera, FRONT, (0, -6.0, .94), target, 2.05)
    render(scene, camera, SIDE, (6.0, 0, .94), target, 2.05)
    render(scene, camera, BACK, (0, 6.0, .94), target, 2.05)
    # Save with the matching camera as the opening file view, after the whole
    # scene (including all four preview configurations) has been created.
    render(scene, camera, MATCH, (2.2, -5.0, 1.54), target, 2.05)
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT))


if __name__ == "__main__":
    main()
