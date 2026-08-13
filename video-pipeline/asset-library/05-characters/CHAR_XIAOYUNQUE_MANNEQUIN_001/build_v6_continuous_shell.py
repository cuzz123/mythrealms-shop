"""Build a XiaoYunque-like articulated female director mannequin.

This version deliberately uses continuous, shaped shells instead of a stack of
primitive spheres.  The silhouette is calibrated against the supplied purple
reference: tall egg head, narrow waist, full hip shells, slim lower legs and
mechanically separated joints.  Every visible module is rigidly attached to a
human-oriented 55-bone armature so it remains usable for blocking poses.
"""
from pathlib import Path
import math
import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "CHAR_XIAOYUNQUE_MANNEQUIN_FEMALE_009.blend"
PREVIEW_MATCH = ROOT / "Preview_v9_match.png"
PREVIEW_FRONT = ROOT / "Preview_v9_front.png"
PREVIEW_SIDE = ROOT / "Preview_v9_side.png"
PREVIEW_BACK = ROOT / "Preview_v9_back.png"


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for collection in list(bpy.data.collections):
        bpy.data.collections.remove(collection)


def new_material(name, colour, roughness=.42, metallic=.04):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    nodes = material.node_tree.nodes
    nodes.clear()
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    output = nodes.new("ShaderNodeOutputMaterial")
    material.node_tree.links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])
    bsdf.inputs["Base Color"].default_value = colour
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    return material


def move_to_collection(obj, collection):
    for prior in list(obj.users_collection):
        prior.objects.unlink(obj)
    collection.objects.link(obj)
    return obj


def smooth(obj):
    if obj.type == "MESH":
        for polygon in obj.data.polygons:
            polygon.use_smooth = True


def uv_sphere(collection, name, location, scale, material, segments=40, rings=28):
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=segments, ring_count=rings, location=location
    )
    obj = move_to_collection(bpy.context.object, collection)
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(material)
    smooth(obj)
    return obj


def cylinder_between(collection, name, a, b, radius, material, vertices=32):
    """Create a smooth cylindrical pin whose local Z points from a to b."""
    a, b = Vector(a), Vector(b)
    direction = b - a
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices, radius=radius, depth=direction.length, location=(a + b) / 2
    )
    obj = move_to_collection(bpy.context.object, collection)
    obj.name = name
    obj.rotation_euler = direction.to_track_quat("Z", "Y").to_euler()
    obj.data.materials.append(material)
    bevel = obj.modifiers.new("rounded_edges", "BEVEL")
    bevel.width = min(radius * .24, .025)
    bevel.segments = 2
    smooth(obj)
    return obj


def capsule_between(collection, name, a, b, radius, material):
    """A soft phalanx / connector with a tapered-friendly rounded silhouette."""
    a, b = Vector(a), Vector(b)
    direction = b - a
    mid = (a + b) / 2
    bpy.ops.mesh.primitive_uv_sphere_add(segments=28, ring_count=16, location=mid)
    obj = move_to_collection(bpy.context.object, collection)
    obj.name = name
    obj.scale = (radius, radius, direction.length / 2 + radius)
    obj.rotation_euler = direction.to_track_quat("Z", "Y").to_euler()
    obj.data.materials.append(material)
    smooth(obj)
    return obj


def profile_shell(collection, name, levels, material, segments=48):
    """Build a sealed smooth shell along local Z from elliptical profile levels.

    Each level is (z, side_radius_x, depth_radius_y).  This gives deliberate
    waist, hip and limb contours without relying on generic cones.
    """
    verts, faces = [], []
    for z, rx, ry in levels:
        for index in range(segments):
            angle = math.tau * index / segments
            verts.append((rx * math.cos(angle), ry * math.sin(angle), z))
    for row in range(len(levels) - 1):
        for index in range(segments):
            nxt = (index + 1) % segments
            base = row * segments
            after = (row + 1) * segments
            faces.append((base + index, base + nxt, after + nxt, after + index))
    faces.append(tuple(range(segments - 1, -1, -1)))
    last = (len(levels) - 1) * segments
    faces.append(tuple(last + index for index in range(segments)))
    mesh = bpy.data.meshes.new(name + "_mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    collection.objects.link(obj)
    obj.data.materials.append(material)
    bevel = obj.modifiers.new("continuous_shell_edge_softening", "BEVEL")
    bevel.width = .018
    bevel.segments = 2
    smooth(obj)
    return obj


def shell_between(collection, name, a, b, near_radius, far_radius, material,
                  midpoint_scale=1.0, depth_ratio=.82):
    """A tapered limb casing, full in its middle and narrow around exposed joints."""
    a, b = Vector(a), Vector(b)
    direction = b - a
    length = direction.length
    obj = profile_shell(
        collection,
        name,
        [(-length * .50, near_radius * .72, near_radius * depth_ratio * .72),
         (-length * .24, near_radius * midpoint_scale, near_radius * depth_ratio),
         ( length * .20, far_radius * midpoint_scale, far_radius * depth_ratio),
         ( length * .50, far_radius * .72, far_radius * depth_ratio * .72)],
        material,
    )
    obj.location = (a + b) / 2
    obj.rotation_euler = direction.to_track_quat("Z", "Y").to_euler()
    return obj


def wedge_palm(collection, name, side, material):
    """A low, broad palm wedge; unlike a cylinder it reads as a mechanical hand."""
    inner, outer = side * 1.34, side * 1.54
    # y is front/back; z is vertical.  Taper toward the finger edge.
    verts = [
        (inner, -.105, 2.80), (inner, .105, 2.80), (inner, -.095, 2.94), (inner, .095, 2.94),
        (outer, -.080, 2.77), (outer, .080, 2.77), (outer, -.060, 2.90), (outer, .060, 2.90),
    ]
    faces = [(0, 4, 6, 2), (1, 3, 7, 5), (0, 1, 5, 4), (2, 6, 7, 3), (0, 2, 3, 1), (4, 5, 7, 6)]
    mesh = bpy.data.meshes.new(name + "_mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    collection.objects.link(obj)
    obj.data.materials.append(material)
    bevel = obj.modifiers.new("palm_rounding", "BEVEL")
    bevel.width = .025
    bevel.segments = 3
    smooth(obj)
    return obj


def create_armature(collection):
    bpy.ops.object.armature_add(enter_editmode=True, location=(0, 0, 0))
    rig = move_to_collection(bpy.context.object, collection)
    rig.name = "XYQ_CONTINUOUS_SHELL_55_BONE_RIG"
    rig.data.name = rig.name
    edit_bones = rig.data.edit_bones
    edit_bones.remove(edit_bones[0])
    bones = {
        "root": ((0, 0, 0), (0, 0, .55), None),
        "pelvis": ((0, 0, 1.70), (0, 0, 2.05), "root"),
        "spine_01": ((0, 0, 2.05), (0, 0, 2.30), "pelvis"),
        "spine_02": ((0, 0, 2.30), (0, 0, 2.56), "spine_01"),
        "spine": ((0, 0, 2.56), (0, 0, 2.83), "spine_02"),
        "neck": ((0, 0, 2.83), (0, 0, 3.02), "spine"),
        "head": ((0, 0, 3.02), (0, 0, 3.54), "neck"),
    }
    for sign in (-1, 1):
        suffix = "L" if sign < 0 else "R"
        bones.update({
            f"clavicle.{suffix}": ((.16 * sign, 0, 2.79), (.39 * sign, 0, 2.84), "spine"),
            f"scapula.{suffix}": ((.39 * sign, .025, 2.84), (.53 * sign, .025, 2.84), f"clavicle.{suffix}"),
            f"upper_arm.{suffix}": ((.53 * sign, 0, 2.84), (.86 * sign, 0, 2.82), f"scapula.{suffix}"),
            f"forearm.{suffix}": ((.96 * sign, 0, 2.82), (1.30 * sign, 0, 2.80), f"upper_arm.{suffix}"),
            f"hand.{suffix}": ((1.34 * sign, 0, 2.80), (1.55 * sign, 0, 2.82), f"forearm.{suffix}"),
            f"thigh.{suffix}": ((.25 * sign, 0, 1.86), (.23 * sign, 0, 1.15), "pelvis"),
            f"shin.{suffix}": ((.23 * sign, 0, 1.05), (.20 * sign, 0, .34), f"thigh.{suffix}"),
            f"foot.{suffix}": ((.20 * sign, 0, .25), (.20 * sign, -.30, .18), f"shin.{suffix}"),
            f"toe.{suffix}": ((.20 * sign, -.30, .18), (.20 * sign, -.52, .18), f"foot.{suffix}"),
        })
        for finger in range(5):
            y = (finger - 2) * .043
            # Thumb is lower / swept back; little finger slightly higher.
            z = 2.80 + (finger - 2) * .018
            p1, p2, p3, p4 = (1.52 * sign, y, z), (1.59 * sign, y * 1.12, z - .005), (1.66 * sign, y * 1.25, z - .017), (1.72 * sign, y * 1.35, z - .027)
            bones[f"finger_{finger}_01.{suffix}"] = (p1, p2, f"hand.{suffix}")
            bones[f"finger_{finger}_02.{suffix}"] = (p2, p3, f"finger_{finger}_01.{suffix}")
            bones[f"finger_{finger}_03.{suffix}"] = (p3, p4, f"finger_{finger}_02.{suffix}")
    for name, (head, tail, parent) in bones.items():
        bone = edit_bones.new(name)
        bone.head, bone.tail = head, tail
        if parent:
            bone.parent = edit_bones[parent]
    bpy.ops.object.mode_set(mode="OBJECT")
    rig.data.display_type = "BBONE"
    return rig


def rigid_bind(parts, rig):
    """Bone-parent all modules in two passes while preserving their rest pose.

    Blender only resolves mirrored bone transforms after the dependency graph
    update.  Parenting one module and immediately restoring its world matrix
    left an intermittent right-foot error.  Parent every module first, force a
    graph evaluation, then restore every saved world matrix in one coherent
    pass.
    """
    bpy.context.view_layer.update()
    saved = [(obj, bone_name, obj.matrix_world.copy()) for obj, bone_name in parts]
    for obj, bone_name, _ in saved:
        obj.parent = rig
        obj.parent_type = "BONE"
        obj.parent_bone = bone_name
    bpy.context.view_layer.update()
    for obj, _, world_matrix in saved:
        obj.matrix_world = world_matrix
    bpy.context.view_layer.update()


def build_figure(collection, shell_mat, joint_mat, accent_mat, rig):
    parts = []
    # Head / neck: a deliberately faceless egg shell, with a subtle front notch
    # to make orientation legible in a director viewport.
    parts.extend([
        (uv_sphere(collection, "HEAD_FACELESS_EGG", (0, -.005, 3.33), (.215, .180, .295), shell_mat), "head"),
        (cylinder_between(collection, "NECK_CYLINDER", (0, 0, 2.93), (0, 0, 3.08), .092, joint_mat), "neck"),
        (uv_sphere(collection, "HEAD_FRONT_ORIENTATION", (0, -.205, 3.32), (.050, .014, .105), accent_mat), "head"),
    ])
    # A female-contoured thorax and pelvis, both continuous hard shells.
    torso = profile_shell(collection, "CONTINUOUS_THORAX_SHELL", [
        (2.14, .265, .185), (2.27, .225, .170), (2.42, .235, .180),
        (2.60, .365, .235), (2.76, .455, .245), (2.87, .410, .225),
    ], shell_mat)
    pelvis = profile_shell(collection, "CONTINUOUS_PELVIS_SHELL", [
        (1.69, .195, .155), (1.79, .325, .225), (1.94, .425, .265),
        (2.08, .355, .235), (2.16, .265, .185),
    ], shell_mat)
    parts.extend([(torso, "spine"), (pelvis, "pelvis")])
    # Smoother chest panels read as a single sculpted shell in front while
    # preserving a shallow seam that makes it mechanically manufactured.
    for sign, suffix in ((-1, "L"), (1, "R")):
        parts.append((uv_sphere(collection, f"CHEST_PANEL.{suffix}", (.165 * sign, -.155, 2.66), (.190, .058, .175), shell_mat), "spine"))
        parts.append((uv_sphere(collection, f"HIP_SOCKET.{suffix}", (.255 * sign, -.01, 1.82), (.185, .175, .185), joint_mat), f"thigh.{suffix}"))
    # Arms: visible ball cap -> axle/ring elbow -> tapered shells -> palm ->
    # three phalanges per finger.  Joint gaps are intentional rather than seams.
    for sign, suffix in ((-1, "L"), (1, "R")):
        shoulder = (.55 * sign, 0, 2.84)
        elbow = (.93 * sign, 0, 2.82)
        wrist = (1.34 * sign, 0, 2.80)
        parts.extend([
            (uv_sphere(collection, f"SHOULDER_BALL.{suffix}", shoulder, (.118, .122, .118), joint_mat), f"upper_arm.{suffix}"),
            (shell_between(collection, f"UPPER_ARM_CASING.{suffix}", (.65 * sign, 0, 2.84), (.84 * sign, 0, 2.825), .105, .082, shell_mat, 1.03), f"upper_arm.{suffix}"),
            (cylinder_between(collection, f"ELBOW_AXLE.{suffix}", (.87 * sign, -.120, 2.82), (.87 * sign, .120, 2.82), .077, joint_mat), f"forearm.{suffix}"),
            (uv_sphere(collection, f"ELBOW_CAP.{suffix}", elbow, (.094, .090, .094), shell_mat), f"forearm.{suffix}"),
            (shell_between(collection, f"FOREARM_CASING.{suffix}", (.99 * sign, 0, 2.815), (1.27 * sign, 0, 2.802), .082, .062, shell_mat, 1.02, .78), f"forearm.{suffix}"),
            (cylinder_between(collection, f"WRIST_RING.{suffix}", (1.31 * sign, -.068, 2.80), (1.31 * sign, .068, 2.80), .052, joint_mat), f"hand.{suffix}"),
            (wedge_palm(collection, f"PALM_WEDGE.{suffix}", sign, shell_mat), f"hand.{suffix}"),
        ])
        for finger in range(5):
            y = (finger - 2) * .043
            z = 2.80 + (finger - 2) * .018
            # Delicate, slightly fanned fingers consistent with the reference.
            nodes = [(1.52 * sign, y, z), (1.59 * sign, y * 1.15, z - .004), (1.66 * sign, y * 1.28, z - .017), (1.73 * sign, y * 1.40, z - .030)]
            for segment in range(3):
                parts.append((capsule_between(collection, f"FINGER_{finger}_{segment + 1}.{suffix}", nodes[segment], nodes[segment + 1], .022 - segment * .003, shell_mat), f"finger_{finger}_{segment + 1:02d}.{suffix}"))
                if segment < 2:
                    parts.append((uv_sphere(collection, f"FINGER_KNUCKLE_{finger}_{segment + 1}.{suffix}", nodes[segment + 1], (.026, .026, .026), joint_mat, 20, 12), f"finger_{finger}_{segment + 1:02d}.{suffix}"))
    # Lower body: broad articulated thighs, compact knee mechanisms, tapered
    # calf casings and small flat feet.  The wide hip-to-narrow-ankle ratio is
    # calibrated from the front and side references.
    for sign, suffix in ((-1, "L"), (1, "R")):
        hip = (.245 * sign, 0, 1.77)
        knee = (.225 * sign, 0, 1.08)
        ankle = (.205 * sign, 0, .32)
        parts.extend([
            (shell_between(collection, f"THIGH_CASING.{suffix}", hip, (.225 * sign, 0, 1.20), .165, .120, shell_mat, 1.10, .86), f"thigh.{suffix}"),
            (cylinder_between(collection, f"KNEE_HINGE.{suffix}", (.225 * sign, -.115, 1.09), (.225 * sign, .115, 1.09), .084, joint_mat), f"shin.{suffix}"),
            (uv_sphere(collection, f"KNEE_CAP.{suffix}", knee, (.105, .096, .112), shell_mat), f"shin.{suffix}"),
            (shell_between(collection, f"SHIN_CASING.{suffix}", (.225 * sign, 0, .97), (.205 * sign, 0, .42), .105, .070, shell_mat, .92, .80), f"shin.{suffix}"),
            (cylinder_between(collection, f"ANKLE_RING.{suffix}", (.205 * sign, -.065, .32), (.205 * sign, .065, .32), .052, joint_mat), f"foot.{suffix}"),
            (shell_between(collection, f"FOOT_SHELL.{suffix}", (.205 * sign, -.035, .24), (.205 * sign, -.34, .18), .080, .052, shell_mat, .85, .72), f"foot.{suffix}"),
        ])
    rigid_bind(parts, rig)


def look_at(obj, point):
    obj.rotation_euler = (Vector(point) - obj.location).to_track_quat("-Z", "Y").to_euler()


def render_view(scene, camera, path, location, target, orthographic_scale=4.25):
    camera.location = location
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = orthographic_scale
    look_at(camera, target)
    scene.render.filepath = str(path)
    bpy.ops.render.render(write_still=True)


def main():
    clear_scene()
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 600
    scene.render.resolution_y = 800
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = True
    scene.world.color = (.045, .050, .070)
    collection = bpy.data.collections.new("CHAR_XIAOYUNQUE_CONTINUOUS_SHELL_006")
    scene.collection.children.link(collection)
    shell_mat = new_material("Xiaoyunque_Lavender_Shell", (.61, .36, .82, 1), .35, .05)
    joint_mat = new_material("Xiaoyunque_Mech_Joints", (.45, .22, .65, 1), .28, .12)
    accent_mat = new_material("Xiaoyunque_Front_Orientation", (.82, .61, 1.0, 1), .40, .0)
    rig = create_armature(collection)
    build_figure(collection, shell_mat, joint_mat, accent_mat, rig)
    collection.asset_mark()
    collection["asset_id"] = "CHAR_XIAOYUNQUE_MANNEQUIN_FEMALE_009"
    collection["style"] = "continuous hard-surface articulated female mannequin"
    collection["rigging"] = "55-bone human-oriented rigid modular bind"
    # A soft studio setup makes the material and mechanical gaps legible in all
    # previews, while transparent alpha keeps the silhouette score objective.
    bpy.ops.object.light_add(type="AREA", location=(-3.5, -4.5, 5.5))
    bpy.context.object.data.energy = 1000
    bpy.context.object.data.shape = "DISK"
    bpy.context.object.data.size = 4.5
    bpy.ops.object.light_add(type="AREA", location=(3.5, -2.5, 3.3))
    bpy.context.object.data.energy = 520
    bpy.context.object.data.size = 3.5
    bpy.ops.object.light_add(type="AREA", location=(0, 3.5, 4.0))
    bpy.context.object.data.energy = 350
    bpy.context.object.data.size = 3.0
    bpy.ops.object.camera_add()
    camera = bpy.context.object
    camera.name = "XYQ_PREVIEW_CAMERA"
    scene.camera = camera
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT))
    target = (0, 0, 1.88)
    # The match view intentionally mirrors the original director viewport's
    # modest right-side perspective.  The other views document actual geometry.
    render_view(scene, camera, PREVIEW_MATCH, (5.2, -9.6, 3.0), target, 4.25)
    render_view(scene, camera, PREVIEW_FRONT, (0, -10, 1.95), target, 4.18)
    render_view(scene, camera, PREVIEW_SIDE, (10, 0, 1.95), target, 4.18)
    render_view(scene, camera, PREVIEW_BACK, (0, 10, 1.95), target, 4.18)


if __name__ == "__main__":
    main()
