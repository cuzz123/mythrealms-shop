import math
import shutil
import subprocess
import sys
from pathlib import Path

import bpy
from mathutils import Vector


OUTPUT_DIR = Path("D:/Chrome_Download/mythrealms_garage_mannequin_director_stage")
OUTPUT_BLEND = OUTPUT_DIR / "garage_mannequin_director_stage.blend"
PREVIEW_DIR = OUTPUT_DIR / "preview_frames"
ANIMATION_FRAMES_DIR = OUTPUT_DIR / "animation_frames"


def ensure_dirs():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    PREVIEW_DIR.mkdir(parents=True, exist_ok=True)
    ANIMATION_FRAMES_DIR.mkdir(parents=True, exist_ok=True)


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()
    # Blender does not select viewport-hidden helpers for deletion. Remove any
    # remaining hidden cameras, lights and focus controls by datablock as well.
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)


def make_material(name, color, roughness=0.45, metallic=0.0, alpha=1.0, emission=None, strength=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    mat.blend_method = "BLEND" if alpha < 1.0 else "OPAQUE"
    bsdf = next((node for node in mat.node_tree.nodes if node.type == "BSDF_PRINCIPLED"), None)
    if bsdf is None:
        bsdf = mat.node_tree.nodes.new(type="ShaderNodeBsdfPrincipled")
        output = next((node for node in mat.node_tree.nodes if node.type == "OUTPUT_MATERIAL"), None)
        if output:
            mat.node_tree.links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])
    if "Base Color" in bsdf.inputs:
        bsdf.inputs["Base Color"].default_value = color
    if "Roughness" in bsdf.inputs:
        bsdf.inputs["Roughness"].default_value = roughness
    if "Metallic" in bsdf.inputs:
        bsdf.inputs["Metallic"].default_value = metallic
    if "Alpha" in bsdf.inputs:
        bsdf.inputs["Alpha"].default_value = alpha
    if emission and "Emission Color" in bsdf.inputs:
        bsdf.inputs["Emission Color"].default_value = emission
        bsdf.inputs["Emission Strength"].default_value = strength
    return mat


def add_cube(name, location, scale, material, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if material:
        obj.data.materials.append(material)
    return obj


def add_cylinder(name, location, radius, depth, material, rotation=(0, 0, 0), vertices=48):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices,
        radius=radius,
        depth=depth,
        location=location,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    if material:
        obj.data.materials.append(material)
    return obj


def add_sphere(name, location, scale, material, segments=32):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=16, radius=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    if material:
        obj.data.materials.append(material)
    return obj


def add_torus(name, location, major_radius, minor_radius, material, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_torus_add(
        major_radius=major_radius,
        minor_radius=minor_radius,
        major_segments=36,
        minor_segments=8,
        location=location,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    if material:
        obj.data.materials.append(material)
    return obj


def add_limb(name, start, end, radius, material, vertices=24):
    start_v = Vector(start)
    end_v = Vector(end)
    direction = end_v - start_v
    midpoint = start_v + direction * 0.5
    length = direction.length
    obj = add_cylinder(name, midpoint, radius, length, material, vertices=vertices)
    obj.rotation_euler = direction.to_track_quat("Z", "Y").to_euler()
    return obj


def add_joint(name, location, radius, material):
    """A visible ball joint keeps the proxy readable at a glance."""
    return add_sphere(name, location, (radius, radius, radius), material, segments=20)


def add_segment(name, start, end, radius, material, joint_material):
    """Build a tapered-looking limb from a solid segment plus articulation caps."""
    segment = add_limb(name, start, end, radius, material)
    start_joint = add_joint(f"{name}_joint_start", start, radius * 1.13, joint_material)
    end_joint = add_joint(f"{name}_joint_end", end, radius * 1.10, joint_material)
    return [segment, start_joint, end_joint]


def create_director_rig(name, base, arm_points, with_bat_control=False):
    """Create a lightweight control rig with IK for blocking and camera rehearsal."""
    bpy.ops.object.armature_add(enter_editmode=True, location=base)
    rig = bpy.context.object
    rig.name = f"{name}_DIRECTOR_RIG"
    rig.data.name = f"{name}_DIRECTOR_ARMATURE"
    # Keep the director controls available without obscuring the segmented proxy.
    rig.show_in_front = False
    rig.data.display_type = "STICK"

    edit_bones = rig.data.edit_bones
    default_bone = edit_bones[0]
    edit_bones.remove(default_bone)

    def add_bone(bone_name, head, tail, parent=None, deform=True):
        bone = edit_bones.new(bone_name)
        bone.head = head
        bone.tail = tail
        if parent:
            bone.parent = edit_bones[parent]
            bone.use_connect = False
        bone.use_deform = deform
        return bone

    add_bone("root", (0, 0, 0), (0, 0, 0.6))
    add_bone("pelvis", (0, 0, 0.6), (0, 0, 0.86), "root")
    add_bone("waist", (0, 0, 0.86), (0, 0, 1.09), "pelvis")
    add_bone("chest", (0, 0, 1.09), (0, 0, 1.36), "waist")
    add_bone("spine", (0, 0, 1.36), (0, 0, 1.43), "chest")
    add_bone("neck", (0, 0, 1.43), (0, 0, 1.57), "spine")
    add_bone("head", (0, 0, 1.57), (0, 0, 1.88), "neck")

    left_shoulder = Vector(arm_points["left_shoulder"])
    right_shoulder = Vector(arm_points["right_shoulder"])
    left_elbow = Vector(arm_points["left_elbow"])
    right_elbow = Vector(arm_points["right_elbow"])
    left_hand = Vector(arm_points["left_hand"])
    right_hand = Vector(arm_points["right_hand"])
    add_bone("clavicle.L", (-0.12, 0, 1.34), left_shoulder, "chest")
    add_bone("upper_arm.L", left_shoulder, left_elbow, "clavicle.L")
    add_bone("lower_arm.L", left_elbow, left_hand, "upper_arm.L")
    add_bone("wrist.L", left_hand, left_hand + Vector((0, -0.12, -0.02)), "lower_arm.L")
    add_bone("clavicle.R", (0.12, 0, 1.34), right_shoulder, "chest")
    add_bone("upper_arm.R", right_shoulder, right_elbow, "clavicle.R")
    add_bone("lower_arm.R", right_elbow, right_hand, "upper_arm.R")
    add_bone("wrist.R", right_hand, right_hand + Vector((0, -0.12, -0.02)), "lower_arm.R")

    add_bone("upper_leg.L", (-0.14, 0, 0.69), (-0.18, -0.02, 0.36), "pelvis")
    add_bone("lower_leg.L", (-0.18, -0.02, 0.36), (-0.16, -0.05, 0.08), "upper_leg.L")
    add_bone("ankle.L", (-0.16, -0.05, 0.08), (-0.16, -0.05, 0.04), "lower_leg.L")
    add_bone("toe.L", (-0.16, -0.05, 0.04), (-0.16, -0.22, 0.04), "ankle.L")
    add_bone("upper_leg.R", (0.14, 0, 0.69), (0.18, -0.02, 0.36), "pelvis")
    add_bone("lower_leg.R", (0.18, -0.02, 0.36), (0.16, -0.05, 0.08), "upper_leg.R")
    add_bone("ankle.R", (0.16, -0.05, 0.08), (0.16, -0.05, 0.04), "lower_leg.R")
    add_bone("toe.R", (0.16, -0.05, 0.04), (0.16, -0.22, 0.04), "ankle.R")

    # Non-deforming controls remain visible in front for fast director-stage posing.
    add_bone("head_target", (0, 0, 2.3), (0, -0.2, 2.3), "root", deform=False)
    add_bone("hand_ik.L", left_hand, left_hand + Vector((0, -0.16, 0)), "root", deform=False)
    add_bone("hand_ik.R", right_hand, right_hand + Vector((0, -0.16, 0)), "root", deform=False)
    add_bone("elbow_pole.L", left_elbow + Vector((0, -0.7, 0)), left_elbow + Vector((0, -0.9, 0)), "root", deform=False)
    add_bone("elbow_pole.R", right_elbow + Vector((0, -0.7, 0)), right_elbow + Vector((0, -0.9, 0)), "root", deform=False)
    add_bone("foot_ik.L", (-0.16, -0.05, 0.08), (-0.16, -0.28, 0.08), "root", deform=False)
    add_bone("foot_ik.R", (0.16, -0.05, 0.08), (0.16, -0.28, 0.08), "root", deform=False)
    add_bone("knee_pole.L", (-0.18, -0.72, 0.36), (-0.18, -0.92, 0.36), "root", deform=False)
    add_bone("knee_pole.R", (0.18, -0.72, 0.36), (0.18, -0.92, 0.36), "root", deform=False)
    if with_bat_control:
        add_bone("bat_ctrl", right_hand, right_hand + Vector((0.45, 0, 0)), "root", deform=False)

    bpy.ops.object.mode_set(mode="OBJECT")

    head_aim = rig.pose.bones["head"].constraints.new("DAMPED_TRACK")
    head_aim.name = "HEAD_AIM_TARGET"
    head_aim.target = rig
    head_aim.subtarget = "head_target"
    head_aim.track_axis = "TRACK_Y"
    head_aim.owner_space = "POSE"
    head_aim.target_space = "POSE"

    for side in ("L", "R"):
        arm_ik = rig.pose.bones[f"lower_arm.{side}"].constraints.new("IK")
        arm_ik.name = f"HAND_IK_{side}"
        arm_ik.target = rig
        arm_ik.subtarget = f"hand_ik.{side}"
        arm_ik.chain_count = 2
        leg_ik = rig.pose.bones[f"lower_leg.{side}"].constraints.new("IK")
        leg_ik.name = f"FOOT_IK_{side}"
        leg_ik.target = rig
        leg_ik.subtarget = f"foot_ik.{side}"
        leg_ik.chain_count = 2

    if with_bat_control:
        grip_follow = rig.pose.bones["hand_ik.R"].constraints.new("COPY_TRANSFORMS")
        grip_follow.name = "BAT_CTRL_TO_RIGHT_HAND_IK"
        grip_follow.target = rig
        grip_follow.subtarget = "bat_ctrl"
        grip_follow.owner_space = "POSE"
        grip_follow.target_space = "POSE"
    return rig


def parent_to_bone(obj, rig, bone_name):
    """Bone-parent a rigid mannequin part while preserving its world pose."""
    world_matrix = obj.matrix_world.copy()
    obj.parent = rig
    obj.parent_type = "BONE"
    obj.parent_bone = bone_name
    obj.matrix_world = world_matrix


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


def keyframe_camera_rig(rig, frame, location, target):
    """Animate an Empty rig; Blender 5.1 reliably evaluates this during playback."""
    rig.location = Vector(location)
    look_at(rig, target)
    rig.keyframe_insert(data_path="location", frame=frame)
    rig.keyframe_insert(data_path="rotation_euler", frame=frame)


def setup_continuous_focus_target(camera):
    """Animate one invisible focus target so rack-focus is spatially correct."""
    bpy.ops.object.empty_add(type="SPHERE", location=(4.9, 0.915, 1.80))
    focus_target = bpy.context.object
    focus_target.name = "DIRECTOR_DOF_TARGET_continuous"
    focus_target.empty_display_size = 0.025
    # Empty helper objects never render, but keeping it render-enabled ensures
    # Blender evaluates its animation for camera depth of field.
    focus_target.hide_render = False
    # Do not hide this Empty in the viewport: Blender 5.1 skips evaluating
    # animation for viewport-hidden guide objects. It remains invisible in renders.
    focus_target.hide_viewport = False
    camera.data.dof.use_dof = True
    camera.data.dof.focus_object = focus_target

    targets = {
        "right1": (4.90, 2.915, 1.80),
        "right2": (2.65, 0.915, 1.80),
        "left2": (-2.65, -0.785, 1.80),
        "center": (0.0, -0.585, 1.80),
    }
    # Frames 64 -> 66 create the explicit rapid foreground rack in shot 2.
    focus_keys = [
        (1, "right1"), (48, "right1"), (49, "right1"), (64, "right1"),
        (66, "right2"), (120, "right2"), (121, "right2"),
        (216, "left2"), (217, "left2"), (288, "center"),
        (289, "center"), (360, "center"),
    ]
    for frame, role in focus_keys:
        focus_target.location = targets[role]
        focus_target.keyframe_insert(data_path="location", frame=frame)

    # Keep the close shots shallow, then stop down for the five-role finale.
    aperture_keys = [(1, 0.8), (288, 0.8), (289, 5.6), (360, 5.6)]
    for frame, fstop in aperture_keys:
        camera.data.dof.aperture_fstop = fstop
        camera.data.dof.keyframe_insert(data_path="aperture_fstop", frame=frame)


def set_interpolation():
    for obj in bpy.context.scene.objects:
        if obj.animation_data and obj.animation_data.action:
            for curve in getattr(obj.animation_data.action, "fcurves", []):
                for point in curve.keyframe_points:
                    point.interpolation = "SINE"


def add_label(text, location, material, size=0.18, hide_render=True):
    bpy.ops.object.text_add(location=location, rotation=(math.radians(70), 0, 0))
    obj = bpy.context.object
    obj.name = f"label_{text}"
    obj.data.body = text
    obj.data.align_x = "CENTER"
    obj.data.align_y = "CENTER"
    obj.data.size = size
    obj.data.materials.append(material)
    obj.hide_render = hide_render
    obj.hide_viewport = hide_render
    return obj


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
        add_cube(f"back_depth_pillar_{x}", (x, 2.8, 1.45), (0.46, 0.46, 2.9), materials["pillar"])

    for x in (-4.6, 0.0, 4.6):
        add_cube(f"parking_line_{x}", (x, -1.4, 0.01), (0.04, 7.5, 0.012), materials["line"])
    for x in (-7.0, 7.0):
        add_cube(f"wide_outer_parking_line_{x}", (x, -1.4, 0.01), (0.035, 7.5, 0.012), materials["line"])

    for y in (-5.0, -2.0, 1.0, 4.0):
        for x in (-4.5, 0.0, 4.5):
            add_cube(f"fluorescent_strip_{x}_{y}", (x, y, 3.17), (2.2, 0.08, 0.06), materials["fluorescent"])
            bpy.ops.object.light_add(type="AREA", location=(x, y, 3.0))
            light = bpy.context.object
            light.name = f"cold_area_light_{x}_{y}"
            light.data.energy = 230
            light.data.size = 2.2
            light.data.color = (0.78, 0.88, 1.0)
            light.hide_viewport = True


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
            pieces.append(
                add_cylinder(
                    f"wheel_{x}_{y}",
                    (x, y, 0.28),
                    0.34,
                    0.26,
                    materials["tire"],
                    rotation=(math.radians(90), 0, 0),
                )
            )
    for obj in pieces:
        obj.parent = root
    return root


def make_mannequin(name, base, suit_mat, accent_mat, materials, pose="neutral", add_glasses=False, add_bat=False):
    root = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(root)
    base_v = Vector(base)

    def p(x, y, z):
        return base_v + Vector((x, y, z))

    joint_mat = materials["mannequin"]
    parts = [
        add_sphere(f"{name}_pelvis", p(0, 0, 0.76), (0.28, 0.19, 0.19), suit_mat),
        add_sphere(f"{name}_abdomen", p(0, -0.005, 1.01), (0.22, 0.15, 0.18), accent_mat),
        add_sphere(f"{name}_ribcage", p(0, -0.01, 1.25), (0.35, 0.20, 0.29), suit_mat),
        add_cylinder(f"{name}_waist_ring", p(0, 0, 0.92), 0.235, 0.075, joint_mat, vertices=24),
        add_limb(f"{name}_neck", p(0, 0, 1.50), p(0, -0.01, 1.61), 0.075, joint_mat),
        add_sphere(f"{name}_head", p(0, -0.035, 1.80), (0.18, 0.16, 0.21), joint_mat),
        add_sphere(f"{name}_chest_plate", p(0, -0.19, 1.28), (0.24, 0.035, 0.16), accent_mat),
        add_limb(f"{name}_shoulder_bar", p(-0.29, 0, 1.39), p(0.29, 0, 1.39), 0.048, suit_mat),
    ]

    if pose == "proud":
        left_elbow, left_hand = p(-0.42, -0.02, 1.05), p(-0.30, -0.06, 0.66)
        right_elbow, right_hand = p(0.42, -0.02, 1.05), p(0.30, -0.06, 0.66)
    elif pose == "bat":
        left_elbow, left_hand = p(-0.45, -0.04, 1.12), p(-0.24, -0.09, 1.32)
        right_elbow, right_hand = p(0.45, -0.04, 1.02), p(0.62, -0.11, 1.42)
    elif pose == "lean":
        left_elbow, left_hand = p(-0.37, -0.02, 1.08), p(-0.18, -0.06, 0.83)
        right_elbow, right_hand = p(0.42, -0.03, 1.08), p(0.56, -0.08, 0.76)
    else:
        left_elbow, left_hand = p(-0.38, -0.02, 1.06), p(-0.24, -0.06, 0.72)
        right_elbow, right_hand = p(0.38, -0.02, 1.06), p(0.24, -0.06, 0.72)

    shoulder_l = p(-0.29, 0, 1.39)
    shoulder_r = p(0.29, 0, 1.39)
    hip_l, knee_l, ankle_l = p(-0.16, 0, 0.69), p(-0.20, -0.03, 0.38), p(-0.17, -0.06, 0.10)
    hip_r, knee_r, ankle_r = p(0.16, 0, 0.69), p(0.20, -0.03, 0.38), p(0.17, -0.06, 0.10)
    limb_specs = [
        ("upper_arm.L", shoulder_l, left_elbow, 0.082, suit_mat),
        ("lower_arm.L", left_elbow, left_hand, 0.066, accent_mat),
        ("upper_arm.R", shoulder_r, right_elbow, 0.082, suit_mat),
        ("lower_arm.R", right_elbow, right_hand, 0.066, accent_mat),
        ("upper_leg.L", hip_l, knee_l, 0.105, suit_mat),
        ("lower_leg.L", knee_l, ankle_l, 0.082, accent_mat),
        ("upper_leg.R", hip_r, knee_r, 0.105, suit_mat),
        ("lower_leg.R", knee_r, ankle_r, 0.082, accent_mat),
    ]
    for limb_name, start, end, radius, mat in limb_specs:
        parts.extend(add_segment(f"{name}_{limb_name}", start, end, radius, mat, joint_mat))

    parts.extend(
        [
            add_joint(f"{name}_shoulder_joint.L", shoulder_l, 0.105, joint_mat),
            add_joint(f"{name}_shoulder_joint.R", shoulder_r, 0.105, joint_mat),
            add_joint(f"{name}_hip_joint.L", hip_l, 0.12, joint_mat),
            add_joint(f"{name}_hip_joint.R", hip_r, 0.12, joint_mat),
            add_sphere(f"{name}_hand.L", left_hand, (0.085, 0.065, 0.095), joint_mat),
            add_sphere(f"{name}_hand.R", right_hand, (0.085, 0.065, 0.095), joint_mat),
        ]
    )

    parts.extend(
        [
            add_cube(f"{name}_left_foot", p(-0.17, -0.15, 0.045), (0.22, 0.30, 0.09), joint_mat),
            add_cube(f"{name}_right_foot", p(0.17, -0.15, 0.045), (0.22, 0.30, 0.09), joint_mat),
            add_cube(f"{name}_front_sash", p(0, -0.205, 1.15), (0.095, 0.03, 0.42), accent_mat),
        ]
    )

    if add_glasses:
        parts.extend(
            [
                add_torus(
                    f"{name}_left_glasses_lens",
                    p(-0.065, -0.16, 1.745),
                    0.045,
                    0.006,
                    materials["chrome"],
                    rotation=(math.radians(90), 0, 0),
                ),
                add_torus(
                    f"{name}_right_glasses_lens",
                    p(0.065, -0.16, 1.745),
                    0.045,
                    0.006,
                    materials["chrome"],
                    rotation=(math.radians(90), 0, 0),
                ),
                add_limb(f"{name}_glasses_bridge", p(-0.02, -0.16, 1.745), p(0.02, -0.16, 1.745), 0.006, materials["chrome"], vertices=12),
            ]
        )

    if add_bat:
        bat = add_limb(f"{name}_metal_bat_on_shoulder", p(0.25, -0.2, 1.58), p(0.92, -0.18, 1.22), 0.04, materials["chrome"])
        knob = add_sphere(f"{name}_bat_knob", p(0.95, -0.18, 1.2), (0.07, 0.07, 0.07), materials["chrome"], segments=16)
        parts.extend([bat, knob])

    arm_points = {
        "left_shoulder": (-0.29, 0, 1.39),
        "right_shoulder": (0.29, 0, 1.39),
        "left_elbow": tuple(left_elbow - base_v),
        "right_elbow": tuple(right_elbow - base_v),
        "left_hand": tuple(left_hand - base_v),
        "right_hand": tuple(right_hand - base_v),
    }
    rig = create_director_rig(name, base, arm_points, with_bat_control=add_bat)
    rig.parent = root
    rig["role"] = name
    rig["purpose"] = "director_stage_blocking_rig"

    bone_by_part = {
        f"{name}_pelvis": "pelvis",
        f"{name}_abdomen": "waist",
        f"{name}_ribcage": "chest",
        f"{name}_waist_ring": "pelvis",
        f"{name}_neck": "neck",
        f"{name}_head": "head",
        f"{name}_chest_plate": "chest",
        f"{name}_shoulder_bar": "chest",
        f"{name}_upper_arm.L": "upper_arm.L",
        f"{name}_lower_arm.L": "lower_arm.L",
        f"{name}_upper_arm.R": "upper_arm.R",
        f"{name}_lower_arm.R": "lower_arm.R",
        f"{name}_upper_leg.L": "upper_leg.L",
        f"{name}_lower_leg.L": "lower_leg.L",
        f"{name}_upper_leg.R": "upper_leg.R",
        f"{name}_lower_leg.R": "lower_leg.R",
        f"{name}_upper_arm.L_joint_start": "upper_arm.L",
        f"{name}_upper_arm.L_joint_end": "lower_arm.L",
        f"{name}_lower_arm.L_joint_start": "lower_arm.L",
        f"{name}_lower_arm.L_joint_end": "wrist.L",
        f"{name}_upper_arm.R_joint_start": "upper_arm.R",
        f"{name}_upper_arm.R_joint_end": "lower_arm.R",
        f"{name}_lower_arm.R_joint_start": "lower_arm.R",
        f"{name}_lower_arm.R_joint_end": "wrist.R",
        f"{name}_upper_leg.L_joint_start": "upper_leg.L",
        f"{name}_upper_leg.L_joint_end": "lower_leg.L",
        f"{name}_lower_leg.L_joint_start": "lower_leg.L",
        f"{name}_lower_leg.L_joint_end": "ankle.L",
        f"{name}_upper_leg.R_joint_start": "upper_leg.R",
        f"{name}_upper_leg.R_joint_end": "lower_leg.R",
        f"{name}_lower_leg.R_joint_start": "lower_leg.R",
        f"{name}_lower_leg.R_joint_end": "ankle.R",
        f"{name}_shoulder_joint.L": "clavicle.L",
        f"{name}_shoulder_joint.R": "clavicle.R",
        f"{name}_hip_joint.L": "upper_leg.L",
        f"{name}_hip_joint.R": "upper_leg.R",
        f"{name}_hand.L": "wrist.L",
        f"{name}_hand.R": "wrist.R",
        f"{name}_left_foot": "toe.L",
        f"{name}_right_foot": "toe.R",
        f"{name}_front_sash": "chest",
        f"{name}_left_glasses_lens": "head",
        f"{name}_right_glasses_lens": "head",
        f"{name}_glasses_bridge": "head",
        f"{name}_metal_bat_on_shoulder": "bat_ctrl" if add_bat else "wrist.R",
        f"{name}_bat_knob": "bat_ctrl" if add_bat else "wrist.R",
    }
    for obj in parts:
        parent_to_bone(obj, rig, bone_by_part.get(obj.name, "spine"))
    return root


def build_mannequins(materials):
    specs = [
        ("role_A_foreground_glasses", (-4.9, 0.95, 0), materials["ivory_suit"], materials["role_blue"], "neutral", True, False),
        ("role_B_left_support", (-2.65, -0.75, 0), materials["sage_suit"], materials["role_blue"], "neutral", False, False),
        ("role_C_center_hero", (0.0, -0.55, 0), materials["navy_suit"], materials["role_gold"], "proud", False, False),
        ("role_D_bat_guard", (2.65, -0.75, 0), materials["black_suit"], materials["role_gold"], "bat", False, True),
        ("role_E_right_support", (4.9, 0.95, 0), materials["gold_suit"], materials["role_blue"], "lean", False, False),
    ]
    for name, base, suit, accent, pose, glasses, bat in specs:
        make_mannequin(name, base, suit, accent, materials, pose=pose, add_glasses=glasses, add_bat=bat)
        dot = add_cylinder(f"{name}_floor_position_dot", (base[0], base[1], 0.025), 0.23, 0.02, accent, vertices=48)
        dot.hide_render = True
        add_label(name.replace("role_", "").upper(), (base[0], base[1] - 0.55, 0.04), materials["label"], size=0.15, hide_render=True)


def add_camera_path(materials):
    points = [
        (1.25, -4.7, 1.55),
        (1.45, -4.2, 1.55),
        (-5.8, -2.4, 1.58),
        (-5.2, -0.25, 1.68),
        (1.8, -3.5, 1.55),
        (2.0, -3.5, 1.55),
        (0.4, -4.7, 1.6),
        (0.0, -8.0, 1.6),
    ]
    curve = bpy.data.curves.new("director_camera_path_curve", "CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = 2
    curve.bevel_depth = 0.018
    spline = curve.splines.new("POLY")
    spline.points.add(len(points) - 1)
    for point, co in zip(spline.points, points):
        point.co = (co[0], co[1], co[2], 1)
    obj = bpy.data.objects.new("DIRECTOR_CAMERA_PATH_visible_cyan", curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(materials["camera_path"])
    obj.hide_render = True
    obj.hide_viewport = True
    for index, co in enumerate(points, start=1):
        key = add_sphere(f"camera_path_key_{index:02d}", co, (0.08, 0.08, 0.08), materials["camera_path"], segments=16)
        key.hide_render = True
        key.hide_viewport = True


def get_motion_root(name):
    root = bpy.data.objects.get(name)
    if root:
        root.hide_render = True
    return root


def get_director_rig(name):
    return bpy.data.objects.get(f"{name}_DIRECTOR_RIG")


def key_object(obj, frame, location=None, rotation=None, scale=None):
    if obj is None:
        return
    if location is not None:
        obj.location = Vector(location)
        obj.keyframe_insert(data_path="location", frame=frame)
    if rotation is not None:
        obj.rotation_euler = rotation
        obj.keyframe_insert(data_path="rotation_euler", frame=frame)
    if scale is not None:
        obj.scale = scale
        obj.keyframe_insert(data_path="scale", frame=frame)


def key_pose_bone(rig, bone_name, frame, rotation=None, location=None):
    if rig is None:
        return
    pose_bone = rig.pose.bones.get(bone_name)
    if pose_bone is None:
        return
    pose_bone.rotation_mode = "XYZ"
    if rotation is not None:
        pose_bone.rotation_euler = rotation
        pose_bone.keyframe_insert(data_path="rotation_euler", frame=frame)
    if location is not None:
        pose_bone.location = location
        pose_bone.keyframe_insert(data_path="location", frame=frame)


def name_rig_action(rig):
    if rig and rig.animation_data and rig.animation_data.action:
        rig.animation_data.action.name = f"{rig.name}_BLOCKING_ACTION"


def animate_mannequins():
    roots = {
        "glasses": get_motion_root("role_A_foreground_glasses"),
        "left": get_motion_root("role_B_left_support"),
        "center": get_motion_root("role_C_center_hero"),
        "bat": get_motion_root("role_D_bat_guard"),
        "right": get_motion_root("role_E_right_support"),
    }
    rigs = {
        "glasses": get_director_rig("role_A_foreground_glasses"),
        "left": get_director_rig("role_B_left_support"),
        "center": get_director_rig("role_C_center_hero"),
        "bat": get_director_rig("role_D_bat_guard"),
        "right": get_director_rig("role_E_right_support"),
    }

    # The original opens on the black-suit woman before revealing the bat.
    # Keep the prop out of shots 1-2, then reveal it on the shot-3 cut.
    bat_parts = [
        bpy.data.objects.get("role_D_bat_guard_metal_bat_on_shoulder"),
        bpy.data.objects.get("role_D_bat_guard_bat_knob"),
    ]
    for part in bat_parts:
        if part is None:
            continue
        part.hide_render = True
        part.keyframe_insert(data_path="hide_render", frame=1)
        part.keyframe_insert(data_path="hide_render", frame=120)
        part.hide_render = False
        part.keyframe_insert(data_path="hide_render", frame=121)
        part.keyframe_insert(data_path="hide_render", frame=360)

    # Shot 1: the center figure starts guarded, then lifts into the look.
    key_object(roots["center"], 1, location=(0.0, 0.0, 0.0), rotation=(0, 0, 0))
    key_object(roots["center"], 28, location=(0.0, -0.05, 0.0), rotation=(0, 0, 0))
    key_object(roots["center"], 48, location=(0.0, -0.03, 0.0), rotation=(0, 0, 0))

    key_pose_bone(rigs["center"], "waist", 1, rotation=(math.radians(-4), 0, math.radians(-2)))
    key_pose_bone(rigs["center"], "chest", 1, rotation=(math.radians(-5), 0, 0))
    key_pose_bone(rigs["center"], "head_target", 1, location=(0, 0, 0))
    key_pose_bone(rigs["center"], "waist", 48, rotation=(0, 0, 0))
    key_pose_bone(rigs["center"], "chest", 48, rotation=(math.radians(2), 0, 0))
    key_pose_bone(rigs["center"], "head_target", 36, location=(0.04, -0.16, 0.0))
    key_pose_bone(rigs["center"], "head_target", 48, location=(0.02, -0.10, 0.0))

    # Shot 2: the glasses figure snaps into the foreground attention.
    key_object(roots["glasses"], 49, location=(0.0, 0.0, 0.0), rotation=(0, 0, 0))
    key_object(roots["glasses"], 68, location=(0.08, -0.11, 0.0), rotation=(0, 0, 0))
    key_object(roots["glasses"], 120, location=(0.06, -0.09, 0.0), rotation=(0, 0, 0))

    key_pose_bone(rigs["glasses"], "waist", 49, rotation=(0, 0, math.radians(-3)))
    key_pose_bone(rigs["glasses"], "chest", 49, rotation=(0, 0, math.radians(-3)))
    key_pose_bone(rigs["glasses"], "head_target", 49, location=(0, 0, 0))
    key_pose_bone(rigs["glasses"], "waist", 70, rotation=(math.radians(-3), 0, math.radians(5)))
    key_pose_bone(rigs["glasses"], "chest", 70, rotation=(math.radians(-3), 0, math.radians(4)))
    key_pose_bone(rigs["glasses"], "head_target", 70, location=(0.08, -0.22, 0.0))
    key_pose_bone(rigs["glasses"], "head_target", 120, location=(0.04, -0.14, 0.0))
    key_pose_bone(rigs["glasses"], "hand_ik.R", 49, location=(0, 0, 0))
    key_pose_bone(rigs["glasses"], "hand_ik.R", 70, location=(0.04, -0.02, 0.06))
    key_pose_bone(rigs["glasses"], "hand_ik.R", 120, location=(0.03, -0.01, 0.03))

    # Shot 3: the bat guard cuts in and plants the pose.
    key_object(roots["bat"], 121, location=(0.2, 0.17, 0.0), rotation=(0, 0, 0))
    key_object(roots["bat"], 170, location=(0.0, -0.05, 0.0), rotation=(0, 0, 0))
    key_object(roots["bat"], 216, location=(-0.07, -0.07, 0.0), rotation=(0, 0, 0))

    key_pose_bone(rigs["bat"], "waist", 121, rotation=(0, 0, math.radians(-5)))
    key_pose_bone(rigs["bat"], "chest", 121, rotation=(math.radians(-2), 0, math.radians(-3)))
    key_pose_bone(rigs["bat"], "head_target", 121, location=(0, 0, 0))
    key_pose_bone(rigs["bat"], "bat_ctrl", 121, location=(0, 0, 0), rotation=(0, 0, 0))
    key_pose_bone(rigs["bat"], "waist", 170, rotation=(math.radians(-2), 0, math.radians(8)))
    key_pose_bone(rigs["bat"], "chest", 170, rotation=(math.radians(-3), 0, math.radians(7)))
    key_pose_bone(rigs["bat"], "head_target", 170, location=(-0.05, -0.20, 0.02))
    key_pose_bone(
        rigs["bat"],
        "bat_ctrl",
        170,
        location=(0.0, 0.0, 0.0),
        rotation=(0, 0, math.radians(4)),
    )
    key_pose_bone(rigs["bat"], "waist", 216, rotation=(0, 0, math.radians(10)))
    key_pose_bone(rigs["bat"], "chest", 216, rotation=(math.radians(-2), 0, math.radians(8)))
    key_pose_bone(rigs["bat"], "head_target", 216, location=(-0.04, -0.15, 0.02))
    key_pose_bone(
        rigs["bat"],
        "bat_ctrl",
        216,
        location=(0.0, 0.0, 0.0),
        rotation=(0, 0, math.radians(8)),
    )

    # Shot 4 and 5: supporting figures settle while the center holds command.
    key_object(roots["left"], 217, location=(-0.07, 0.03, 0.0), rotation=(0, 0, 0))
    key_object(roots["left"], 288, location=(0.0, 0.0, 0.0), rotation=(0, 0, 0))
    key_object(roots["right"], 217, location=(0.15, -0.03, 0.0), rotation=(0, 0, 0))
    key_object(roots["right"], 288, location=(0.0, 0.0, 0.0), rotation=(0, 0, 0))
    key_object(roots["center"], 288, location=(0.0, -0.03, 0.0), rotation=(0, 0, 0))
    key_object(roots["center"], 360, location=(0.0, -0.03, 0.0), rotation=(0, 0, 0))
    key_pose_bone(rigs["left"], "waist", 217, rotation=(0, 0, math.radians(4)))
    key_pose_bone(rigs["left"], "chest", 217, rotation=(0, 0, math.radians(3)))
    key_pose_bone(rigs["left"], "head_target", 217, location=(0.05, -0.12, 0.0))
    key_pose_bone(rigs["left"], "foot_ik.L", 217, location=(0.0, 0.03, 0.0))
    key_pose_bone(rigs["left"], "waist", 288, rotation=(0, 0, 0))
    key_pose_bone(rigs["left"], "chest", 288, rotation=(0, 0, 0))
    key_pose_bone(rigs["left"], "head_target", 288, location=(0.02, -0.06, 0.0))
    key_pose_bone(rigs["left"], "foot_ik.L", 288, location=(0, 0, 0))
    key_pose_bone(rigs["right"], "waist", 217, rotation=(0, 0, math.radians(-4)))
    key_pose_bone(rigs["right"], "chest", 217, rotation=(0, 0, math.radians(-3)))
    key_pose_bone(rigs["right"], "head_target", 217, location=(-0.05, -0.12, 0.0))
    key_pose_bone(rigs["right"], "foot_ik.R", 217, location=(0.0, 0.03, 0.0))
    key_pose_bone(rigs["right"], "waist", 288, rotation=(0, 0, 0))
    key_pose_bone(rigs["right"], "chest", 288, rotation=(0, 0, 0))
    key_pose_bone(rigs["right"], "head_target", 288, location=(-0.02, -0.06, 0.0))
    key_pose_bone(rigs["right"], "foot_ik.R", 288, location=(0, 0, 0))
    key_pose_bone(rigs["center"], "head_target", 288, location=(0.02, -0.10, 0.0))
    key_pose_bone(rigs["center"], "head_target", 360, location=(0.02, -0.10, 0.0))

    # Match the original reveal order: support, bat guard, hero, glasses, support.
    final_positions = {
        "left": (-2.25, 0.0, 0.0),
        "bat": (-5.30, 0.0, 0.0),
        "center": (0.0, 0.0, 0.0),
        "glasses": (7.55, 0.0, 0.0),
        "right": (0.0, 0.0, 0.0),
    }
    for key, location in final_positions.items():
        key_object(roots[key], 289, location=location, rotation=(0, 0, 0))
        key_object(roots[key], 360, location=location, rotation=(0, 0, 0))
    for root in roots.values():
        if root:
            root.keyframe_insert(data_path="location", frame=360)
            root.keyframe_insert(data_path="rotation_euler", frame=360)
    for rig in rigs.values():
        name_rig_action(rig)


def animate_reference_choreography():
    """Keep the reference lineup fixed; only the white center role walks in."""
    roots = {
        "left1": get_motion_root("role_B_left_support"),
        "left2": get_motion_root("role_D_bat_guard"),
        "center": get_motion_root("role_C_center_hero"),
        "right2": get_motion_root("role_A_foreground_glasses"),
        "right1": get_motion_root("role_E_right_support"),
    }
    rigs = {
        "left1": get_director_rig("role_B_left_support"),
        "left2": get_director_rig("role_D_bat_guard"),
        "center": get_director_rig("role_C_center_hero"),
        "right2": get_director_rig("role_A_foreground_glasses"),
        "right1": get_director_rig("role_E_right_support"),
    }
    for root in roots.values():
        if root:
            root.animation_data_clear()
    for rig in rigs.values():
        if rig:
            rig.animation_data_clear()

    # World-space final order: left1, left2, center, right2, right1.
    fixed_offsets = {
        "left1": (-2.25, 0.0, 0.0),
        "left2": (-5.30, 0.0, 0.0),
        "right2": (7.55, 0.0, 0.0),
        # Keep right1 behind the right2 foreground line for the rack-focus shot.
        "right1": (0.0, 2.0, 0.0),
    }
    for key, location in fixed_offsets.items():
        key_object(roots[key], 1, location=location, rotation=(0, 0, 0))
        key_object(roots[key], 360, location=location, rotation=(0, 0, 0))

    # All five roles remain in the final lineup. The reveal is camera-driven.
    key_object(roots["center"], 1, location=(0.0, 0.0, 0.0), rotation=(0, 0, 0))
    key_object(roots["center"], 360, location=(0.0, 0.0, 0.0), rotation=(0, 0, 0))

    bat_parts = [
        bpy.data.objects.get("role_D_bat_guard_metal_bat_on_shoulder"),
        bpy.data.objects.get("role_D_bat_guard_bat_knob"),
    ]
    for part in bat_parts:
        if part:
            part.animation_data_clear()
            part.hide_render = True
            part.keyframe_insert(data_path="hide_render", frame=1)
            part.hide_render = False
            part.keyframe_insert(data_path="hide_render", frame=49)
            part.keyframe_insert(data_path="hide_render", frame=360)

    # Restrained acting: featured roles look toward their camera without changing position.
    for key, start, end, turn in [
        ("right1", 1, 48, -3),
        ("right2", 49, 120, 5),
        ("left2", 121, 216, -5),
        ("center", 217, 288, 2),
    ]:
        rig = rigs[key]
        if rig is None:
            continue
        key_pose_bone(rig, "waist", start, rotation=(0, 0, math.radians(turn)))
        key_pose_bone(rig, "chest", start, rotation=(math.radians(-2), 0, math.radians(turn * 0.55)))
        key_pose_bone(rig, "head_target", start, location=(0.0, -0.10, 0.0))
        key_pose_bone(rig, "waist", end, rotation=(0, 0, math.radians(turn * 0.35)))
        key_pose_bone(rig, "chest", end, rotation=(0, 0, math.radians(turn * 0.2)))
        key_pose_bone(rig, "head_target", end, location=(0.02, -0.16, 0.0))
        name_rig_action(rig)


def add_shot_markers():
    shot_data = [
        ("SHOT_01_right1_arc_000_002", 1),
        ("SHOT_02_right2_continuous_rack_002_005", 49),
        ("SHOT_03_pullback_left_pan_to_left2_005_009", 121),
        ("SHOT_04_diagonal_crane_to_center_009_012", 217),
        ("SHOT_05_continuous_group_wide_012_015", 289),
    ]
    timeline = bpy.context.scene.timeline_markers
    for name, start in shot_data:
        marker = timeline.new(name, frame=start)
        marker.camera = None


def add_reference_cut_camera(name, start_frame, end_frame, start_location, start_target, end_location, end_target, lens, fstop, focus_location):
    """Create a cut-camera with an Empty rig so its short move plays reliably."""
    bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, 0, 0))
    rig = bpy.context.object
    rig.name = f"{name}_RIG"
    rig.empty_display_size = 0.15
    rig.hide_render = True

    bpy.ops.object.camera_add(location=(0, 0, 0))
    camera = bpy.context.object
    camera.name = name
    camera.parent = rig
    camera.location = (0, 0, 0)
    camera.rotation_euler = (0, 0, 0)
    camera.data.sensor_width = 32
    camera.data.lens = lens
    camera.data.dof.use_dof = True
    camera.data.dof.aperture_fstop = fstop
    camera.hide_viewport = True

    bpy.ops.object.empty_add(type="SPHERE", location=focus_location)
    focus = bpy.context.object
    focus.name = f"{name}_FOCUS"
    focus.empty_display_size = 0.02
    focus.hide_render = True
    camera.data.dof.focus_object = focus

    keyframe_camera_rig(rig, start_frame, start_location, start_target)
    keyframe_camera_rig(rig, end_frame, end_location, end_target)
    return camera


def setup_reference_cut_cameras():
    """Rebuild the actual cut rhythm seen in the reference clip."""
    add_reference_cut_camera(
        "CAM_REF_01_RIGHT1", 1, 48,
        (6.2, -3.4, 1.70), (4.9, 2.95, 1.58),
        (5.7, -2.9, 1.72), (4.9, 2.95, 1.60),
        55, 2.4, (4.9, 2.915, 1.80),
    )
    add_reference_cut_camera(
        "CAM_REF_02A_RIGHT2_BACK", 49, 60,
        (3.45, 2.35, 1.62), (2.65, 0.95, 1.70),
        (3.12, 1.82, 1.64), (2.65, 0.95, 1.72),
        62, 1.8, (2.65, 0.915, 1.80),
    )
    add_reference_cut_camera(
        "CAM_REF_02B_RIGHT2_FACE", 61, 120,
        (2.92, -1.55, 1.64), (3.10, 1.25, 1.72),
        (2.72, -1.28, 1.66), (3.10, 1.25, 1.72),
        52, 0.8, (2.65, 0.915, 1.80),
    )
    add_reference_cut_camera(
        "CAM_REF_03A_RIGHT2_MEDIUM", 121, 149,
        (3.20, -3.90, 1.52), (2.65, 0.95, 1.52),
        (2.86, -3.55, 1.55), (2.65, 0.95, 1.55),
        48, 2.0, (2.65, 0.915, 1.80),
    )
    add_reference_cut_camera(
        "CAM_REF_03B_LEFT2_FOREGROUND", 150, 216,
        (-1.95, -3.55, 1.38), (-2.65, -0.75, 1.62),
        (-2.28, -2.92, 1.43), (-2.65, -0.75, 1.66),
        58, 1.4, (-2.65, -0.785, 1.80),
    )
    add_reference_cut_camera(
        "CAM_REF_04_CENTER", 217, 288,
        (0.88, -3.05, 1.22), (0.0, -0.55, 1.58),
        (0.0, -7.90, 2.90), (0.0, 0.20, 1.48),
        46, 2.8, (0.0, -0.585, 1.80),
    )
    add_reference_cut_camera(
        "CAM_REF_05_GROUP", 289, 360,
        (0.0, -12.0, 3.35), (0.0, 0.45, 1.38),
        (0.0, -16.8, 3.70), (0.0, 0.55, 1.30),
        50, 5.6, (0.0, -0.585, 1.80),
    )


def setup_cameras():
    scene = bpy.context.scene
    bpy.ops.object.camera_add(location=(0, -6, 1.6))
    camera = bpy.context.object
    camera.name = "DIRECTOR_CAMERA_continuous_prompt_path"
    camera.data.sensor_width = 32
    camera.data.dof.use_dof = True
    camera.data.dof.aperture_fstop = 0.8
    scene.camera = camera
    camera.hide_viewport = True

    bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, 0, 0))
    camera_rig = bpy.context.object
    camera_rig.name = "DIRECTOR_CAMERA_RIG_continuous"
    camera.parent = camera_rig
    camera.location = (0, 0, 0)
    camera.rotation_euler = (0, 0, 0)
    camera.animation_data_clear()
    camera.data.animation_data_clear()

    camera.data.lens = 50
    keyframe_camera_rig(camera_rig, 1, (6.15, -3.40, 1.70), (4.90, 2.95, 1.55))
    keyframe_camera_rig(camera_rig, 48, (5.65, -2.90, 1.72), (4.90, 2.95, 1.58))
    keyframe_camera_rig(camera_rig, 49, (5.65, -2.90, 1.72), (4.90, 2.95, 1.58))
    keyframe_camera_rig(camera_rig, 64, (4.82, -2.68, 1.70), (4.90, 2.95, 1.60))
    keyframe_camera_rig(camera_rig, 66, (4.66, -2.62, 1.70), (2.65, 0.95, 1.72))
    keyframe_camera_rig(camera_rig, 120, (2.80, -2.20, 1.65), (3.15, 1.25, 1.72))
    keyframe_camera_rig(camera_rig, 121, (2.80, -2.20, 1.65), (3.15, 1.25, 1.72))
    keyframe_camera_rig(camera_rig, 150, (0.48, -3.15, 1.55), (2.65, 0.95, 1.58))
    keyframe_camera_rig(camera_rig, 180, (-1.42, -3.72, 1.50), (-2.65, -0.75, 1.60))
    keyframe_camera_rig(camera_rig, 216, (-2.08, -4.05, 1.46), (-2.65, -0.75, 1.52))
    keyframe_camera_rig(camera_rig, 217, (-2.08, -4.05, 1.46), (-2.65, -0.75, 1.52))
    keyframe_camera_rig(camera_rig, 250, (-0.88, -6.10, 2.18), (0.0, -0.55, 1.55))
    keyframe_camera_rig(camera_rig, 288, (0.0, -8.50, 3.05), (0.0, 0.25, 1.48))
    keyframe_camera_rig(camera_rig, 289, (0.0, -12.0, 3.35), (0.0, 0.45, 1.38))
    keyframe_camera_rig(camera_rig, 360, (0.0, -16.8, 3.70), (0.0, 0.55, 1.30))

    setup_continuous_focus_target(camera)

    static_cameras = [
        ("CAM_01_CENTER_MID_ARC_LEFT", (-1.55, -4.85, 1.5), (0.0, -0.55, 1.4), 45),
        ("CAM_02_GLASSES_CLOSEUP", (-5.55, -2.2, 1.42), (-4.9, 0.95, 1.58), 78),
        ("CAM_03_BAT_GUARD_FOREGROUND", (1.75, -3.15, 1.42), (2.65, -0.75, 1.45), 58),
        ("CAM_04_CENTER_CRANE_REVEAL", (0.2, -6.0, 2.35), (0.0, -0.55, 1.45), 38),
        ("CAM_05_FINAL_GROUP_WIDE", (0.0, -8.0, 2.55), (0.0, 0.1, 1.35), 22),
    ]
    for name, loc, target, lens in static_cameras:
        bpy.ops.object.camera_add(location=loc)
        cam = bpy.context.object
        cam.name = name
        look_at(cam, target)
        cam.data.lens = lens
        cam.data.dof.use_dof = True
        cam.hide_viewport = True

    # Each editorial shot owns its movement. Camera markers cut between these
    # short paths, so no camera ever travels through the set between shots.
    shot_moves = [
        ("CAM_01_CENTER_MID_ARC_LEFT", 1, 48, (6.15, -3.05, 1.70), (4.90, 0.95, 1.55), 60, (5.65, -2.55, 1.72), (4.90, 0.95, 1.58), 64, 2.8, 4.18),
        ("CAM_02_GLASSES_CLOSEUP", 49, 120, (2.84, -1.72, 1.62), (2.65, 0.95, 1.72), 76, (2.74, -1.38, 1.64), (2.65, 0.95, 1.72), 82, 1.8, 2.66),
        ("CAM_03_BAT_GUARD_FOREGROUND", 121, 216, (-1.72, -4.05, 1.42), (-2.65, -0.75, 1.48), 52, (-2.08, -3.42, 1.46), (-2.65, -0.75, 1.52), 58, 2.4, 3.42),
        ("CAM_04_CENTER_CRANE_REVEAL", 217, 288, (0.82, -2.95, 1.24), (0.0, -0.55, 1.58), 58, (0.10, -4.50, 1.52), (0.0, -0.55, 1.55), 48, 2.8, 2.55),
        ("CAM_05_FINAL_GROUP_WIDE", 289, 360, (0.0, -8.00, 2.55), (0.0, 0.10, 1.35), 22, (0.0, -8.25, 2.62), (0.0, 0.10, 1.35), 21, 5.6, 8.3),
    ]
    for name, start_frame, end_frame, start_loc, start_target, start_lens, end_loc, end_target, end_lens, fstop, focus_distance in shot_moves:
        cam = bpy.data.objects[name]
        keyframe_camera(cam, start_frame, start_loc, start_target, start_lens)
        keyframe_camera(cam, end_frame, end_loc, end_target, end_lens)
        cam.data.dof.aperture_fstop = fstop
        cam.data.dof.focus_distance = focus_distance
        cam.data.dof.keyframe_insert(data_path="aperture_fstop", frame=start_frame)
        cam.data.dof.keyframe_insert(data_path="focus_distance", frame=start_frame)
        cam.data.dof.keyframe_insert(data_path="aperture_fstop", frame=end_frame)
        cam.data.dof.keyframe_insert(data_path="focus_distance", frame=end_frame)

    set_interpolation()


def setup_scene():
    ensure_dirs()
    clear_scene()

    scene = bpy.context.scene
    scene.timeline_markers.clear()
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
        "mannequin": make_material("matte_ivory_mannequin_skin", (0.72, 0.70, 0.64, 1), roughness=0.62),
        "navy_suit": make_material("role_center_navy_suit", (0.02, 0.04, 0.12, 1), roughness=0.38),
        "ivory_suit": make_material("role_glasses_ivory_suit", (0.74, 0.70, 0.62, 1), roughness=0.42),
        "sage_suit": make_material("role_left_sage_suit", (0.43, 0.55, 0.46, 1), roughness=0.48),
        "black_suit": make_material("role_bat_black_suit", (0.012, 0.011, 0.012, 1), roughness=0.42),
        "gold_suit": make_material("role_right_gold_suit", (0.75, 0.56, 0.28, 1), roughness=0.34, metallic=0.15),
        "role_blue": make_material("role_blue_position_marker", (0.1, 0.45, 0.9, 1), emission=(0.02, 0.12, 0.32, 1), strength=0.3),
        "role_gold": make_material("role_gold_position_marker", (0.95, 0.72, 0.28, 1), emission=(0.25, 0.15, 0.02, 1), strength=0.35),
        "camera_path": make_material("visible_cyan_camera_path", (0.0, 0.9, 1.0, 1), emission=(0.0, 0.45, 0.65, 1), strength=1.0),
        "label": make_material("technical_label_white", (0.85, 0.9, 1.0, 1)),
    }

    build_garage(materials)
    build_car(materials)
    build_mannequins(materials)
    animate_reference_choreography()
    add_camera_path(materials)
    setup_cameras()
    add_shot_markers()

    scene.render.filepath = str(OUTPUT_DIR / "garage_mannequin_stage_")


def get_args():
    if "--" not in sys.argv:
        return set()
    return set(sys.argv[sys.argv.index("--") + 1 :])


def render_preview_frames():
    frames = {
        48: "shot01_center_mid_arc",
        120: "shot02_glasses_closeup",
        216: "shot03_bat_guard_cutin",
        288: "shot04_center_car_reveal",
        360: "shot05_group_power_freeze",
    }
    for frame, name in frames.items():
        bpy.context.scene.frame_set(frame)
        bpy.context.scene.render.filepath = str(PREVIEW_DIR / f"{name}.png")
        bpy.ops.render.render(write_still=True)
    print(f"Saved preview frames to {PREVIEW_DIR}")


def render_animation():
    scene = bpy.context.scene
    for old_frame in ANIMATION_FRAMES_DIR.glob("frame_*.png"):
        old_frame.unlink()

    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.filepath = str(ANIMATION_FRAMES_DIR / "frame_####")
    bpy.ops.render.render(animation=True)

    ffmpeg = shutil.which("ffmpeg")
    fallback = Path("C:/Users/11458/AppData/Local/Microsoft/WinGet/Links/ffmpeg.exe")
    if ffmpeg is None and fallback.exists():
        ffmpeg = str(fallback)
    if ffmpeg is None:
        raise RuntimeError(
            f"Rendered PNG frames to {ANIMATION_FRAMES_DIR}, but ffmpeg.exe was not found on PATH."
        )

    output_mp4 = OUTPUT_DIR / "garage_mannequin_director_stage.mp4"
    input_pattern = ANIMATION_FRAMES_DIR / "frame_%04d.png"
    command = [
        ffmpeg,
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-framerate",
        str(scene.render.fps),
        "-start_number",
        str(scene.frame_start),
        "-i",
        str(input_pattern),
        "-c:v",
        "libx264",
        "-crf",
        "18",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        str(output_mp4),
    ]
    subprocess.run(command, check=True)
    print(f"Saved animation frames to {ANIMATION_FRAMES_DIR}")
    print(f"Saved animation to {output_mp4}")


if __name__ == "__main__":
    args = get_args()
    setup_scene()
    bpy.ops.wm.save_as_mainfile(filepath=str(OUTPUT_BLEND))
    print(f"Saved Blender mannequin director stage to {OUTPUT_BLEND}")
    if "--preview" in args:
        render_preview_frames()
    if "--render-animation" in args:
        render_animation()
