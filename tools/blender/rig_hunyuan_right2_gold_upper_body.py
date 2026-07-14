import math
from collections import defaultdict
from pathlib import Path

import bpy
from mathutils import Euler, Matrix, Vector


ASSET_ID = "CHAR_HUNYUAN_RIGHT2_GOLD_001"
MESH_NAME = "node_0"
RIG_NAME = "RIG_RIGHT2_GOLD_UPPER_BODY"
CAMERA_NAME = "CAM_RIGHT2_GOLD_UPPER_BODY_SHOWREEL"
FOCUS_NAME = "DOF_RIGHT2_GOLD_UPPER_BODY"
PROTO_CAM_NAME = "CAM_RIGHT2_GOLD_EARRING_REVEAL_TEST"
PROTO_FOCUS_NAME = "FOCUS_RIGHT2_GOLD_EARRING_REVEAL_TEST"
PROTO_ACTION_NAME = "ACT_RIGHT2_GOLD_EARRING_REVEAL_01"
OUTPUT = Path(
    r"D:\mythrealms-shop\video-pipeline\asset-library\05-characters"
    r"\CHAR_HUNYUAN_RIGHT2_GOLD_001\RIGHT2_GOLD_RIGGED_UPPER_BODY_v1.blend"
)


BONE_SPECS = {
    "root": ((0.0, 0.0, 0.04), (0.0, 0.0, 0.24), None, False),
    "pelvis": ((0.0, 0.0, 0.24), (0.0, 0.0, 0.48), "root", True),
    "spine_01": ((0.0, 0.0, 0.48), (0.0, 0.0, 0.62), "pelvis", True),
    "spine_02": ((0.0, 0.0, 0.62), (0.0, 0.0, 0.74), "spine_01", True),
    "chest": ((0.0, 0.0, 0.74), (0.0, 0.0, 0.84), "spine_02", True),
    "neck": ((0.0, 0.0, 0.84), (0.0, 0.0, 0.92), "chest", True),
    "head": ((0.0, 0.0, 0.92), (0.0, 0.0, 1.10), "neck", True),
    "clavicle.L": ((0.018, 0.0, 0.80), (0.105, 0.0, 0.80), "chest", True),
    "upper_arm.L": ((0.105, 0.0, 0.80), (0.145, 0.0, 0.62), "clavicle.L", True),
    "forearm.L": ((0.145, 0.0, 0.62), (0.154, 0.0, 0.44), "upper_arm.L", True),
    "hand.L": ((0.154, 0.0, 0.44), (0.158, 0.0, 0.32), "forearm.L", True),
    "clavicle.R": ((-0.018, 0.0, 0.80), (-0.105, 0.0, 0.80), "chest", True),
    "upper_arm.R": ((-0.105, 0.0, 0.80), (-0.145, 0.0, 0.62), "clavicle.R", True),
    "forearm.R": ((-0.145, 0.0, 0.62), (-0.154, 0.0, 0.44), "upper_arm.R", True),
    "hand.R": ((-0.154, 0.0, 0.44), (-0.158, 0.0, 0.32), "forearm.R", True),
}


def remove_object(name):
    obj = bpy.data.objects.get(name)
    if not obj:
        return
    data = obj.data
    obj_type = obj.type
    bpy.data.objects.remove(obj, do_unlink=True)
    if obj_type == "ARMATURE" and data.users == 0:
        bpy.data.armatures.remove(data)
    elif obj_type == "CAMERA" and data.users == 0:
        bpy.data.cameras.remove(data)


def create_rig():
    remove_object(RIG_NAME)
    armature = bpy.data.armatures.new(f"{RIG_NAME}_DATA")
    rig = bpy.data.objects.new(RIG_NAME, armature)
    bpy.context.collection.objects.link(rig)
    rig.show_in_front = True
    rig.display_type = "WIRE"
    rig["asset_id"] = ASSET_ID
    rig["rig_scope"] = "upper_body_previs"
    rig["target_standard"] = "CHAR_HUMAN_MASTER_RIG_001"
    rig["quality_boundary"] = (
        "Head, neck, spine and restrained arm motion only; source mesh is high-poly and lacks production retopology."
    )

    bpy.context.view_layer.objects.active = rig
    rig.select_set(True)
    bpy.ops.object.mode_set(mode="EDIT")
    for name, (head, tail, parent_name, deform) in BONE_SPECS.items():
        bone = armature.edit_bones.new(name)
        bone.head = head
        bone.tail = tail
        bone.use_deform = deform
        if parent_name:
            bone.parent = armature.edit_bones[parent_name]
            bone.use_connect = name in {"spine_01", "spine_02", "chest", "neck", "head"}
    bpy.ops.object.mode_set(mode="OBJECT")
    rig.select_set(False)
    return rig


def add_weight(weight_map, vertex_index, group_name, weight):
    weight = max(0.0, min(1.0, weight))
    if weight < 0.025:
        return
    quantized = round(weight * 20.0) / 20.0
    weight_map[group_name][quantized].append(vertex_index)


def build_geometric_weights(mesh_obj, rig):
    for modifier in list(mesh_obj.modifiers):
        if modifier.type == "ARMATURE":
            mesh_obj.modifiers.remove(modifier)
    while mesh_obj.vertex_groups:
        mesh_obj.vertex_groups.remove(mesh_obj.vertex_groups[0])

    groups = {
        name: mesh_obj.vertex_groups.new(name=name)
        for name, (_, _, _, deform) in BONE_SPECS.items()
        if deform
    }
    weight_map = defaultdict(lambda: defaultdict(list))

    mesh_world = mesh_obj.matrix_world.copy()
    for vertex in mesh_obj.data.vertices:
        # Hunyuan stores this mesh Y-up and uses an object matrix to present it
        # Z-up in Blender. Weight against the visible world-space anatomy.
        x, y, z = mesh_world @ vertex.co
        ax = abs(x)

        if z >= 0.92:
            add_weight(weight_map, vertex.index, "head", 1.0)
            continue
        if z >= 0.84:
            t = (z - 0.84) / 0.08
            add_weight(weight_map, vertex.index, "neck", 1.0 - t)
            add_weight(weight_map, vertex.index, "head", t)
            continue

        side = "L" if x >= 0.0 else "R"
        arm_threshold = 0.105 if z >= 0.65 else 0.125
        is_arm = ax >= arm_threshold and z >= 0.34

        if is_arm and z >= 0.74:
            t = max(0.0, min(1.0, (z - 0.74) / 0.10))
            add_weight(weight_map, vertex.index, f"upper_arm.{side}", 0.72 - 0.30 * t)
            add_weight(weight_map, vertex.index, f"clavicle.{side}", 0.18 + 0.42 * t)
            add_weight(weight_map, vertex.index, "chest", 0.10)
        elif is_arm and z >= 0.56:
            t = (z - 0.56) / 0.18
            add_weight(weight_map, vertex.index, f"forearm.{side}", 1.0 - t)
            add_weight(weight_map, vertex.index, f"upper_arm.{side}", t)
        elif is_arm and z >= 0.40:
            t = (z - 0.40) / 0.16
            add_weight(weight_map, vertex.index, f"hand.{side}", 1.0 - t)
            add_weight(weight_map, vertex.index, f"forearm.{side}", t)
        elif is_arm:
            add_weight(weight_map, vertex.index, f"hand.{side}", 1.0)
        elif z >= 0.74:
            t = (z - 0.74) / 0.10
            add_weight(weight_map, vertex.index, "chest", 0.85)
            add_weight(weight_map, vertex.index, "neck", 0.15 * t)
            add_weight(weight_map, vertex.index, "spine_02", 0.15 * (1.0 - t))
        elif z >= 0.62:
            t = (z - 0.62) / 0.12
            add_weight(weight_map, vertex.index, "spine_02", 1.0 - t)
            add_weight(weight_map, vertex.index, "chest", t)
        elif z >= 0.48:
            t = (z - 0.48) / 0.14
            add_weight(weight_map, vertex.index, "spine_01", 1.0 - t)
            add_weight(weight_map, vertex.index, "spine_02", t)
        else:
            add_weight(weight_map, vertex.index, "pelvis", 1.0)

    for group_name, buckets in weight_map.items():
        group = groups[group_name]
        for weight, indices in buckets.items():
            if indices:
                group.add(indices, weight, "REPLACE")

    mesh_obj.parent = rig
    modifier = mesh_obj.modifiers.new("RIGHT2_GOLD_UpperBodyArmature", "ARMATURE")
    modifier.object = rig
    modifier.use_vertex_groups = True
    modifier.use_deform_preserve_volume = True
    return groups


def reset_pose(rig):
    for bone in rig.pose.bones:
        bone.rotation_mode = "XYZ"
        bone.location = (0.0, 0.0, 0.0)
        bone.rotation_euler = (0.0, 0.0, 0.0)
        bone.scale = (1.0, 1.0, 1.0)


def key_pose(rig, frame, rotations=None, locations=None):
    reset_pose(rig)
    rotations = rotations or {}
    locations = locations or {}
    for bone_name, rotation in rotations.items():
        rig.pose.bones[bone_name].rotation_euler = Euler(rotation, "XYZ")
    for bone_name, location in locations.items():
        rig.pose.bones[bone_name].location = Vector(location)
    for bone in rig.pose.bones:
        bone.keyframe_insert(data_path="location", frame=frame, group=bone.name)
        bone.keyframe_insert(data_path="rotation_euler", frame=frame, group=bone.name)
        bone.keyframe_insert(data_path="scale", frame=frame, group=bone.name)


def iter_action_fcurves(action):
    if hasattr(action, "fcurves"):
        yield from action.fcurves
        return
    for layer in action.layers:
        for strip in layer.strips:
            for slot in action.slots:
                channelbag = strip.channelbag(slot, ensure=False)
                if channelbag:
                    yield from channelbag.fcurves


def clamp_action_curves(action):
    for fcurve in iter_action_fcurves(action):
        for key in fcurve.keyframe_points:
            key.interpolation = "BEZIER"
            key.handle_left_type = "AUTO_CLAMPED"
            key.handle_right_type = "AUTO_CLAMPED"


def create_action(rig, name, poses, description):
    action = bpy.data.actions.get(name)
    if action:
        bpy.data.actions.remove(action)
    action = bpy.data.actions.new(name=name)
    action["asset_id"] = ASSET_ID
    action["description"] = description
    action["motion_scope"] = "upper_body_previs"
    rig.animation_data_create()
    rig.animation_data.action = action
    for pose in poses:
        key_pose(
            rig,
            pose["frame"],
            rotations=pose.get("rotations"),
            locations=pose.get("locations"),
        )
    clamp_action_curves(action)
    try:
        action.asset_mark()
    except Exception:
        pass
    return action


def create_motion_assets(rig):
    assets = []
    assets.append(
        create_action(
            rig,
            "ACT_RIGHT2_GOLD_IDLE_BREATH_01",
            [
                {"frame": 1},
                {
                    "frame": 16,
                    "rotations": {"spine_02": (0.012, 0.0, 0.0), "chest": (-0.016, 0.0, 0.0)},
                    "locations": {"pelvis": (0.0, 0.0, 0.003)},
                },
                {"frame": 32},
                {
                    "frame": 40,
                    "rotations": {"spine_02": (0.009, 0.0, 0.0), "chest": (-0.012, 0.0, 0.0)},
                },
                {"frame": 48},
            ],
            "Subtle breathing loop for close and medium shots.",
        )
    )
    assets.append(
        create_action(
            rig,
            "ACT_RIGHT2_GOLD_SNAP_GLANCE_01",
            [
                {"frame": 1, "rotations": {"chest": (0.0, -0.04, 0.0), "neck": (0.0, -0.08, 0.0), "head": (0.0, -0.16, 0.0)}},
                {"frame": 12, "rotations": {"chest": (0.0, -0.04, 0.0), "neck": (0.0, -0.08, 0.0), "head": (0.0, -0.16, 0.0)}},
                {"frame": 16, "rotations": {"chest": (0.0, -0.005, 0.0), "neck": (0.0, -0.01, 0.0), "head": (0.0, -0.02, 0.0)}},
                {"frame": 20, "rotations": {"chest": (0.0, 0.015, 0.0), "neck": (0.0, 0.03, 0.0), "head": (0.0, 0.06, 0.0)}},
                {"frame": 32, "rotations": {"chest": (0.0, 0.009, 0.0), "neck": (0.0, 0.018, 0.0), "head": (0.0, 0.035, 0.0)}},
                {"frame": 48, "rotations": {"head": (0.0, 0.015, 0.0)}},
            ],
            "Fast side-to-camera glance for rack-focus and reaction beats.",
        )
    )
    assets.append(
        create_action(
            rig,
            "ACT_RIGHT2_GOLD_CHIN_LIFT_01",
            [
                {"frame": 1, "rotations": {"neck": (-0.018, 0.0, 0.0), "head": (-0.06, 0.0, 0.0)}},
                {"frame": 14, "rotations": {"neck": (-0.018, 0.0, 0.0), "head": (-0.06, 0.0, 0.0)}},
                {"frame": 28, "rotations": {"chest": (0.012, 0.0, 0.0), "neck": (0.028, 0.0, 0.0), "head": (0.08, 0.0, 0.0)}},
                {"frame": 48, "rotations": {"chest": (0.009, 0.0, 0.0), "neck": (0.018, 0.0, 0.0), "head": (0.055, 0.0, 0.0)}},
            ],
            "Controlled downward gaze to confident chin lift.",
        )
    )
    assets.append(
        create_action(
            rig,
            "ACT_RIGHT2_GOLD_EDITORIAL_ARM_01",
            [
                {"frame": 1},
                {
                    "frame": 20,
                    "rotations": {
                        "clavicle.L": (0.0, 0.0, -0.025),
                        "upper_arm.L": (0.04, 0.0, -0.10),
                        "forearm.L": (-0.015, 0.0, 0.12),
                        "hand.L": (0.0, 0.035, -0.02),
                        "chest": (0.0, -0.025, 0.0),
                    },
                },
                {
                    "frame": 36,
                    "rotations": {
                        "clavicle.L": (0.0, 0.0, -0.035),
                        "upper_arm.L": (0.06, 0.0, -0.14),
                        "forearm.L": (-0.02, 0.0, 0.18),
                        "hand.L": (0.0, 0.045, -0.03),
                        "chest": (0.0, -0.04, 0.0),
                        "head": (0.0, 0.04, 0.0),
                    },
                },
                {"frame": 48},
            ],
            "Restrained single-arm editorial presentation pose for the high-poly dress mesh.",
        )
    )
    assets.append(
        create_action(
            rig,
            "ACT_RIGHT2_GOLD_SIDE_LEAN_01",
            [
                {"frame": 1},
                {
                    "frame": 24,
                    "rotations": {
                        "spine_01": (0.0, 0.0, 0.035),
                        "spine_02": (0.0, -0.04, 0.075),
                        "chest": (0.0, -0.06, 0.06),
                        "neck": (0.0, 0.04, -0.014),
                        "head": (0.0, 0.07, -0.03),
                    },
                },
                {
                    "frame": 40,
                    "rotations": {
                        "spine_01": (0.0, 0.0, 0.028),
                        "spine_02": (0.0, -0.03, 0.06),
                        "chest": (0.0, -0.045, 0.05),
                        "neck": (0.0, 0.03, -0.011),
                        "head": (0.0, 0.055, -0.024),
                    },
                },
                {"frame": 48},
            ],
            "Small torso lean with counter-rotated head for fashion close-ups.",
        )
    )
    assets.append(
        create_action(
            rig,
            "ACT_RIGHT2_GOLD_EARRING_REVEAL_01",
            [
                {"frame": 1},
                {"frame": 12},
                {"frame": 28, "rotations": {
                    "chest": (0.0, -0.018, 0.006),
                    "neck": (0.0, -0.045, 0.008),
                    "head": (-0.008, -0.09, 0.014),
                    "clavicle.L": (0.0, 0.0, -0.008),
                    "clavicle.R": (0.0, 0.0, 0.006),
                }},
                {"frame": 44, "rotations": {
                    "chest": (0.0, 0.012, -0.004),
                    "neck": (0.012, 0.025, -0.006),
                    "head": (0.018, 0.07, -0.012),
                    "clavicle.L": (0.0, 0.0, -0.004),
                    "clavicle.R": (0.0, 0.0, 0.003),
                }},
                {"frame": 56, "rotations": {
                    "chest": (0.0, 0.009, -0.003),
                    "neck": (0.009, 0.02, -0.004),
                    "head": (0.014, 0.055, -0.009),
                }},
                {"frame": 72},
            ],
            "Slow three-quarter turn that reveals the near earring and settles without a pose pop.",
        )
    )
    return assets


def create_showreel_action(rig):
    poses = [
        {"frame": 1},
        {"frame": 24, "rotations": {
            "spine_02": (0.012, 0.0, 0.0),
            "chest": (-0.016, 0.0, 0.0),
        }, "locations": {"pelvis": (0.0, 0.0, 0.003)}},
        {"frame": 36},
        {"frame": 40, "rotations": {
            "chest": (0.0, -0.01, 0.0),
            "neck": (0.0, -0.02, 0.0),
            "head": (0.0, -0.04, 0.0),
        }},
        {"frame": 52, "rotations": {
            "chest": (0.0, -0.04, 0.0),
            "neck": (0.0, -0.08, 0.0),
            "head": (0.0, -0.16, 0.0),
        }},
        {"frame": 60, "rotations": {
            "chest": (0.0, -0.04, 0.0),
            "neck": (0.0, -0.08, 0.0),
            "head": (0.0, -0.16, 0.0),
        }},
        {"frame": 68, "rotations": {
            "chest": (0.0, -0.01, 0.0),
            "neck": (0.0, -0.025, 0.0),
            "head": (0.0, -0.05, 0.0),
        }},
        {"frame": 76, "rotations": {
            "chest": (0.0, 0.015, 0.0),
            "neck": (0.0, 0.03, 0.0),
            "head": (0.0, 0.06, 0.0),
        }},
        {"frame": 84, "rotations": {
            "chest": (0.0, 0.009, 0.0),
            "neck": (0.0, 0.018, 0.0),
            "head": (0.0, 0.035, 0.0),
        }},
        {"frame": 92},
        {"frame": 100, "rotations": {
            "neck": (-0.018, 0.0, 0.0),
            "head": (-0.06, 0.0, 0.0),
        }},
        {"frame": 112, "rotations": {
            "neck": (-0.018, 0.0, 0.0),
            "head": (-0.06, 0.0, 0.0),
        }},
        {"frame": 128, "rotations": {
            "chest": (0.012, 0.0, 0.0),
            "neck": (0.028, 0.0, 0.0),
            "head": (0.08, 0.0, 0.0),
        }},
        {"frame": 140},
        {"frame": 144},
        {"frame": 145},
        {"frame": 164, "rotations": {"clavicle.L": (0.0, 0.0, -0.025), "upper_arm.L": (0.04, 0.0, -0.10), "forearm.L": (-0.015, 0.0, 0.12), "hand.L": (0.0, 0.035, -0.02), "chest": (0.0, -0.025, 0.0)}},
        {"frame": 180, "rotations": {"clavicle.L": (0.0, 0.0, -0.035), "upper_arm.L": (0.06, 0.0, -0.14), "forearm.L": (-0.02, 0.0, 0.18), "hand.L": (0.0, 0.045, -0.03), "chest": (0.0, -0.04, 0.0), "head": (0.0, 0.04, 0.0)}},
        {"frame": 192},
        {"frame": 193},
        {"frame": 208, "rotations": {"spine_01": (0.0, 0.0, 0.035), "spine_02": (0.0, -0.04, 0.075), "chest": (0.0, -0.06, 0.06), "neck": (0.0, 0.04, -0.014), "head": (0.0, 0.07, -0.03)}},
        {"frame": 224, "rotations": {"spine_01": (0.0, 0.0, 0.028), "spine_02": (0.0, -0.03, 0.06), "chest": (0.0, -0.045, 0.05), "neck": (0.0, 0.03, -0.011), "head": (0.0, 0.055, -0.024)}},
        {"frame": 240},
    ]
    return create_action(
        rig,
        "ACT_RIGHT2_GOLD_UPPER_BODY_SHOWREEL_01",
        poses,
        "Five upper-body motion assets arranged as a 240-frame camera-ready showreel.",
    )


def key_camera(camera, frame, location, target, lens, fstop=None):
    location = Vector(location)
    target = Vector(target)
    camera.matrix_world = Matrix.LocRotScale(
        location,
        (target - location).to_track_quat("-Z", "Y").to_euler(),
        Vector((1.0, 1.0, 1.0)),
    )
    camera.keyframe_insert(data_path="location", frame=frame)
    camera.keyframe_insert(data_path="rotation_euler", frame=frame)
    camera.data.lens = lens
    camera.data.keyframe_insert(data_path="lens", frame=frame)
    if fstop is not None:
        camera.data.dof.aperture_fstop = fstop
        camera.data.dof.keyframe_insert(data_path="aperture_fstop", frame=frame)


def create_camera_showreel():
    remove_object(CAMERA_NAME)
    remove_object(FOCUS_NAME)
    camera_data = bpy.data.cameras.new(f"{CAMERA_NAME}_DATA")
    camera = bpy.data.objects.new(CAMERA_NAME, camera_data)
    bpy.context.collection.objects.link(camera)
    camera.rotation_mode = "XYZ"
    camera_data.sensor_width = 36.0
    camera_data.dof.use_dof = True
    camera_data.dof.aperture_fstop = 2.0
    camera_data.dof.aperture_blades = 9

    focus = bpy.data.objects.new(FOCUS_NAME, None)
    bpy.context.collection.objects.link(focus)
    focus.empty_display_type = "SPHERE"
    focus.empty_display_size = 0.035
    camera_data.dof.focus_object = focus

    keys = [
        (1, (0.48, -1.92, 0.72), (0.0, 0.0, 0.71), 58),
        (40, (0.40, -1.72, 0.74), (0.0, 0.0, 0.74), 64),
        (64, (0.30, -1.42, 0.80), (0.0, 0.0, 0.86), 82),
        (88, (0.46, -1.62, 0.78), (0.0, 0.0, 0.80), 72),
        (112, (0.62, -1.78, 0.70), (0.0, 0.0, 0.72), 64),
        (144, (-0.40, -1.68, 0.74), (0.0, 0.0, 0.75), 62),
        (145, (-0.40, -1.68, 0.74), (0.0, 0.0, 0.72), 62),
        (180, (-0.62, -1.48, 0.66), (0.015, 0.0, 0.74), 70),
        (192, (-0.52, -1.58, 0.70), (0.0, 0.0, 0.74), 66),
        (193, (-0.52, -1.58, 0.70), (0.0, 0.0, 0.74), 66),
        (224, (0.18, -1.36, 0.84), (0.0, 0.0, 0.82), 80),
        (240, (0.10, -1.52, 0.78), (0.0, 0.0, 0.78), 74),
    ]
    for frame, location, target, lens in keys:
        key_camera(camera, frame, location, target, lens)
        focus.location = target
        focus.keyframe_insert(data_path="location", frame=frame)
        camera_data.dof.aperture_fstop = 1.7 if frame in {64, 88, 224} else 2.2
        camera_data.dof.keyframe_insert(data_path="aperture_fstop", frame=frame)

    camera["asset_id"] = ASSET_ID
    camera["shot_scope"] = "upper_body_motion_showreel"
    return camera


def create_prototype_camera():
    """Earring-reveal prototype camera with separate focus empty and auto-clamped curves."""
    remove_object(PROTO_CAM_NAME)
    remove_object(PROTO_FOCUS_NAME)
    cam_data = bpy.data.cameras.new(f"{PROTO_CAM_NAME}_DATA")
    proto_cam = bpy.data.objects.new(PROTO_CAM_NAME, cam_data)
    bpy.context.collection.objects.link(proto_cam)
    proto_cam.rotation_mode = "XYZ"
    cam_data.sensor_width = 36.0
    cam_data.dof.use_dof = True
    cam_data.dof.aperture_fstop = 2.2
    cam_data.dof.aperture_blades = 9

    proto_focus = bpy.data.objects.new(PROTO_FOCUS_NAME, None)
    bpy.context.collection.objects.link(proto_focus)
    proto_focus.empty_display_type = "SPHERE"
    proto_focus.empty_display_size = 0.035
    cam_data.dof.focus_object = proto_focus

    keys = [
        (1, (0.42, -1.52, 0.86), (0.04, 0.0, 0.94), 78.0, 2.2),
        (24, (0.38, -1.47, 0.88), (0.055, 0.0, 0.97), 81.0, 2.0),
        (48, (0.33, -1.41, 0.90), (0.07, 0.0, 0.99), 85.0, 1.8),
        (72, (0.31, -1.39, 0.90), (0.07, 0.0, 0.99), 86.0, 1.8),
    ]
    for frame, location, target, lens, fstop in keys:
        key_camera(proto_cam, frame, location, target, lens, fstop)
        proto_focus.location = target
        proto_focus.keyframe_insert(data_path="location", frame=frame)

    # Clamp all fcurve handles via clamp_action_curves for Blender 5.1 layered actions support
    for animated_id in (proto_cam, proto_focus, cam_data):
        ad = animated_id.animation_data
        if ad and ad.action:
            clamp_action_curves(ad.action)

    proto_cam["asset_id"] = ASSET_ID
    proto_cam["shot_scope"] = "earring_reveal_prototype"
    return proto_cam


def configure_scene(camera):
    scene = bpy.context.scene
    scene.camera = camera
    scene.frame_start = 1
    scene.frame_end = 240
    scene.render.fps = 24
    scene.render.resolution_x = 1280
    scene.render.resolution_y = 720
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    try:
        scene.render.engine = "BLENDER_EEVEE_NEXT"
    except TypeError:
        pass

    for marker in list(scene.timeline_markers):
        if marker.name.startswith("RIGHT2_GOLD_"):
            scene.timeline_markers.remove(marker)
    markers = {
        1: "RIGHT2_GOLD_01_IDLE_BREATH",
        40: "RIGHT2_GOLD_02_SNAP_GLANCE",
        100: "RIGHT2_GOLD_03_CHIN_LIFT",
        145: "RIGHT2_GOLD_04_EDITORIAL_ARM",
        193: "RIGHT2_GOLD_05_SIDE_LEAN",
    }
    for frame, name in markers.items():
        scene.timeline_markers.new(name, frame=frame)
    scene["asset_id"] = ASSET_ID
    scene["showreel_description"] = "Five upper-body motion and camera assets; 10 seconds at 24 fps."


def main():
    mesh_obj = bpy.data.objects.get(MESH_NAME)
    if not mesh_obj or mesh_obj.type != "MESH":
        raise RuntimeError(f"Expected mesh {MESH_NAME!r} in the open Hunyuan blend file")

    rig = create_rig()
    build_geometric_weights(mesh_obj, rig)
    actions = create_motion_assets(rig)
    showreel = create_showreel_action(rig)
    rig.animation_data.action = showreel
    camera = create_camera_showreel()
    configure_scene(camera)
    proto_cam = create_prototype_camera()
    proto_action = bpy.data.actions.get(PROTO_ACTION_NAME)
    if not proto_action:
        raise RuntimeError(f"Missing prototype action {PROTO_ACTION_NAME}")
    bpy.context.scene.camera = proto_cam
    rig.animation_data.action = proto_action
    bpy.context.scene.frame_start = 1
    bpy.context.scene.frame_end = 72
    bpy.context.scene.frame_set(1)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(OUTPUT))
    print("SAVED", OUTPUT)
    print("RIG", rig.name, "BONES", len(rig.data.bones))
    print("VERTICES", len(mesh_obj.data.vertices), "GROUPS", len(mesh_obj.vertex_groups))
    print("ACTIONS", [action.name for action in actions] + [showreel.name])
    print("CAMERA", proto_cam.name, "FRAMES", bpy.context.scene.frame_start, bpy.context.scene.frame_end)
    print("LEGACY_CAMERA", camera.name, "LEGACY_FRAMES 1-240 STILL_PRESENT")


if __name__ == "__main__":
    main()
