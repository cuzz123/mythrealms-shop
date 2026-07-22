"""Bind the Hunyuan white-shirt model to a body-aligned rig and create five previs actions."""

from pathlib import Path
import math

import bpy
from mathutils import Vector


ROOT = Path(__file__).resolve().parent
CHARACTER_ROOT = ROOT.parents[1] / "05-characters" / "CHAR_MR_TALENT_FULL_001"
MODEL_PATH = CHARACTER_ROOT / "source" / "hunyuan-web" / "MR_TALENT_WHITE_SHIRT.glb"
OUTPUT_BLEND = ROOT / "ACT_MR_TALENT_COMMON_ACTIONS_001.blend"
FRAME_ROOT = ROOT / "frames"
THUMBNAIL = ROOT / "Thumbnail.png"
FPS = 24
ACTION_END = 96

ACTION_NAMES = (
    "ACT_MR_TALENT_IDLE_WEIGHT_SHIFT_001",
    "ACT_MR_TALENT_WALK_FORWARD_001",
    "ACT_MR_TALENT_SIT_DOWN_001",
    "ACT_MR_TALENT_HEAD_TURN_001",
    "ACT_MR_TALENT_TOUCH_EAR_001",
)


def look_at(obj, point):
    obj.rotation_euler = (Vector(point) - obj.location).to_track_quat("-Z", "Y").to_euler()


def bounds(mesh):
    points = [mesh.matrix_world @ Vector(corner) for corner in mesh.bound_box]
    lower = Vector((min(point.x for point in points), min(point.y for point in points), min(point.z for point in points)))
    upper = Vector((max(point.x for point in points), max(point.y for point in points), max(point.z for point in points)))
    return lower, upper


def add_bone(edit_bones, name, head, tail, parent=None):
    bone = edit_bones.new(name)
    bone.head = head
    bone.tail = tail
    bone.parent = parent
    bone.use_connect = False
    bone.roll = 0.0
    return bone


def create_body_aligned_rig(scene, lower, upper):
    width = upper.x - lower.x
    depth = upper.y - lower.y
    height = upper.z - lower.z
    center_x = (lower.x + upper.x) / 2
    center_y = (lower.y + upper.y) / 2

    bpy.ops.object.armature_add(enter_editmode=True, location=(0, 0, 0))
    rig = bpy.context.object
    rig.name = "MR_TALENT_ACTION_RIG"
    rig.data.name = "MR_TALENT_ACTION_RIG_DATA"
    bones = rig.data.edit_bones
    bones.remove(bones[0])
    z = lambda ratio: lower.z + height * ratio
    x = lambda ratio: center_x + width * ratio
    y = lambda ratio: center_y + depth * ratio

    root = add_bone(bones, "root", (center_x, center_y, z(0.0)), (center_x, center_y, z(0.47)))
    pelvis = add_bone(bones, "pelvis", (center_x, center_y, z(0.47)), (center_x, center_y, z(0.57)), root)
    spine_01 = add_bone(bones, "spine_01", (center_x, center_y, z(0.57)), (center_x, center_y, z(0.66)), pelvis)
    spine_02 = add_bone(bones, "spine_02", (center_x, center_y, z(0.66)), (center_x, center_y, z(0.75)), spine_01)
    spine_03 = add_bone(bones, "spine_03", (center_x, center_y, z(0.75)), (center_x, center_y, z(0.84)), spine_02)
    neck = add_bone(bones, "neck", (center_x, center_y, z(0.84)), (center_x, center_y, z(0.91)), spine_03)
    add_bone(bones, "head", (center_x, center_y, z(0.91)), (center_x, center_y, z(1.04)), neck)

    for side, sign in (("L", 1), ("R", -1)):
        clavicle = add_bone(
            bones, f"clavicle.{side}", (center_x, center_y, z(0.82)), (x(sign * 0.22), y(-0.02), z(0.82)), spine_03
        )
        upper_arm = add_bone(
            bones, f"upperarm.{side}", (x(sign * 0.22), y(-0.02), z(0.82)), (x(sign * 0.28), y(-0.03), z(0.65)), clavicle
        )
        lower_arm = add_bone(
            bones, f"lowerarm.{side}", (x(sign * 0.28), y(-0.03), z(0.65)), (x(sign * 0.30), y(-0.05), z(0.49)), upper_arm
        )
        add_bone(bones, f"hand.{side}", (x(sign * 0.30), y(-0.05), z(0.49)), (x(sign * 0.30), y(-0.08), z(0.41)), lower_arm)

        thigh = add_bone(
            bones, f"thigh.{side}", (x(sign * 0.15), center_y, z(0.49)), (x(sign * 0.16), y(0.01), z(0.27)), pelvis
        )
        calf = add_bone(
            bones, f"calf.{side}", (x(sign * 0.16), y(0.01), z(0.27)), (x(sign * 0.15), y(-0.01), z(0.07)), thigh
        )
        foot = add_bone(
            bones, f"foot.{side}", (x(sign * 0.15), y(-0.01), z(0.07)), (x(sign * 0.15), y(-0.28), z(0.02)), calf
        )
        add_bone(bones, f"ball.{side}", foot.tail, (x(sign * 0.15), y(-0.38), z(0.02)), foot)

    bpy.ops.object.mode_set(mode="OBJECT")
    for bone in rig.pose.bones:
        bone.rotation_mode = "XYZ"
    rig["rig_type"] = "body_aligned_previs_humanoid"
    rig["source_character"] = "CHAR_MR_TALENT_FULL_001"
    return rig


def squared_distance_to_segment(point, start, end):
    segment = end - start
    denominator = segment.length_squared
    if denominator == 0:
        return (point - start).length_squared
    position = max(0.0, min(1.0, (point - start).dot(segment) / denominator))
    return (point - (start + segment * position)).length_squared


def bind_mesh(mesh, rig):
    """Use deterministic nearest-bone weights when Hunyuan topology defeats bone heat.

    Hunyuan's merged body, dress, hair and sleeves often create a zero-weight
    result with Blender's automatic heat solver.  Segment-distance weights keep
    every vertex attached for previs while leaving a clear upgrade path to
    hand-painted production weights.
    """
    mesh.parent = rig
    mesh.matrix_parent_inverse = rig.matrix_world.inverted()
    modifier = mesh.modifiers.new("MR_TALENT_ACTION_SKIN", "ARMATURE")
    modifier.object = rig
    modifier.use_vertex_groups = True
    modifier.use_bone_envelopes = False
    mesh.vertex_groups.clear()
    deform_bones = [bone for bone in rig.data.bones if bone.use_deform and bone.name != "root"]
    groups = {bone.name: mesh.vertex_groups.new(name=bone.name) for bone in deform_bones}
    segments = [
        (bone.name, rig.matrix_world @ bone.head_local, rig.matrix_world @ bone.tail_local)
        for bone in deform_bones
    ]
    for vertex in mesh.data.vertices:
        point = mesh.matrix_world @ vertex.co
        nearest = sorted(
            ((name, squared_distance_to_segment(point, start, end)) for name, start, end in segments),
            key=lambda item: item[1],
        )[:3]
        inverse_distances = [(name, 1.0 / max(distance, 0.000001)) for name, distance in nearest]
        total = sum(weight for _, weight in inverse_distances)
        for name, weight in inverse_distances:
            groups[name].add([vertex.index], weight / total, "REPLACE")
    if not any(mod.type == "ARMATURE" and mod.object == rig for mod in mesh.modifiers):
        raise RuntimeError("Skinning did not create an Armature modifier.")
    if any(not vertex.groups for vertex in mesh.data.vertices):
        raise RuntimeError("Deterministic skinning failed to weight every vertex.")


def reset_pose(rig):
    for bone in rig.pose.bones:
        bone.rotation_mode = "XYZ"
        bone.rotation_euler = (0.0, 0.0, 0.0)
        bone.location = (0.0, 0.0, 0.0)


def key_rotation(rig, bone_name, frame, value):
    bone = rig.pose.bones[bone_name]
    bone.rotation_euler = value
    bone.keyframe_insert(data_path="rotation_euler", frame=frame, group=bone_name)


def key_location(rig, bone_name, frame, value):
    bone = rig.pose.bones[bone_name]
    bone.location = value
    bone.keyframe_insert(data_path="location", frame=frame, group=bone_name)


def pose_all_neutral(rig, frame):
    for bone in rig.pose.bones:
        bone.rotation_euler = (0.0, 0.0, 0.0)
        bone.location = (0.0, 0.0, 0.0)
        bone.keyframe_insert(data_path="rotation_euler", frame=frame, group=bone.name)
        bone.keyframe_insert(data_path="location", frame=frame, group=bone.name)


def new_action(rig, name):
    reset_pose(rig)
    if rig.animation_data is None:
        rig.animation_data_create()
    action = bpy.data.actions.new(name)
    action.use_fake_user = True
    slot = action.slots.new(rig.id_type, rig.name)
    rig.animation_data.action = action
    rig.animation_data.action_slot = slot
    action["character"] = "CHAR_MR_TALENT_FULL_001"
    action["fps"] = FPS
    return action


def set_smooth(action):
    for layer in action.layers:
        for strip in layer.strips:
            for channel_bag in strip.channelbags:
                for curve in channel_bag.fcurves:
                    for point in curve.keyframe_points:
                        point.interpolation = "BEZIER"
                        point.handle_left_type = "AUTO_CLAMPED"
                        point.handle_right_type = "AUTO_CLAMPED"


def build_idle_weight_shift(rig):
    action = new_action(rig, ACTION_NAMES[0])
    pose_all_neutral(rig, 1)
    key_location(rig, "root", 28, (0.025, 0.0, 0.0))
    key_rotation(rig, "pelvis", 28, (0.0, 0.0, -0.055))
    key_rotation(rig, "spine_02", 28, (0.025, 0.0, -0.025))
    key_rotation(rig, "head", 28, (-0.015, 0.0, 0.035))
    key_rotation(rig, "thigh.L", 28, (0.0, 0.0, 0.035))
    key_location(rig, "root", 64, (-0.018, 0.0, 0.0))
    key_rotation(rig, "pelvis", 64, (0.0, 0.0, 0.045))
    key_rotation(rig, "spine_02", 64, (-0.018, 0.0, 0.022))
    key_rotation(rig, "head", 64, (0.01, 0.0, -0.025))
    key_rotation(rig, "thigh.R", 64, (0.0, 0.0, -0.028))
    pose_all_neutral(rig, ACTION_END)
    set_smooth(action)
    return action


def build_walk_forward(rig):
    action = new_action(rig, ACTION_NAMES[1])
    pose_all_neutral(rig, 1)
    for frame, left_leg, right_leg, left_arm, right_arm in (
        (1, 0.30, -0.30, -0.22, 0.22),
        (25, -0.30, 0.30, 0.22, -0.22),
        (49, 0.30, -0.30, -0.22, 0.22),
        (73, -0.30, 0.30, 0.22, -0.22),
        (ACTION_END, 0.30, -0.30, -0.22, 0.22),
    ):
        key_rotation(rig, "thigh.L", frame, (left_leg, 0.0, 0.0))
        key_rotation(rig, "thigh.R", frame, (right_leg, 0.0, 0.0))
        key_rotation(rig, "calf.L", frame, (-max(left_leg, 0.0) * 0.65, 0.0, 0.0))
        key_rotation(rig, "calf.R", frame, (-max(right_leg, 0.0) * 0.65, 0.0, 0.0))
        key_rotation(rig, "upperarm.L", frame, (left_arm, 0.0, 0.0))
        key_rotation(rig, "upperarm.R", frame, (right_arm, 0.0, 0.0))
        key_rotation(rig, "spine_02", frame, (0.025 if frame % 48 else -0.025, 0.0, 0.0))
    key_location(rig, "root", 1, (0.0, 0.0, 0.0))
    key_location(rig, "root", ACTION_END, (0.0, -0.28, 0.0))
    set_smooth(action)
    return action


def build_sit_down(rig):
    action = new_action(rig, ACTION_NAMES[2])
    pose_all_neutral(rig, 1)
    key_location(rig, "root", 28, (0.0, 0.08, -0.04))
    key_rotation(rig, "spine_02", 28, (0.08, 0.0, 0.0))
    for side in ("L", "R"):
        key_rotation(rig, f"thigh.{side}", 28, (0.35, 0.0, 0.0))
        key_rotation(rig, f"calf.{side}", 28, (-0.18, 0.0, 0.0))
    key_location(rig, "root", 60, (0.0, 0.20, -0.18))
    key_rotation(rig, "pelvis", 60, (0.12, 0.0, 0.0))
    key_rotation(rig, "spine_02", 60, (0.16, 0.0, 0.0))
    key_rotation(rig, "head", 60, (-0.05, 0.0, 0.0))
    for side in ("L", "R"):
        key_rotation(rig, f"thigh.{side}", 60, (1.20, 0.0, 0.0))
        key_rotation(rig, f"calf.{side}", 60, (-1.10, 0.0, 0.0))
        key_rotation(rig, f"upperarm.{side}", 60, (-0.12, 0.0, 0.0))
    key_location(rig, "root", 80, (0.0, 0.20, -0.18))
    for side in ("L", "R"):
        key_rotation(rig, f"thigh.{side}", 80, (1.20, 0.0, 0.0))
        key_rotation(rig, f"calf.{side}", 80, (-1.10, 0.0, 0.0))
    pose_all_neutral(rig, ACTION_END)
    set_smooth(action)
    return action


def build_head_turn(rig):
    action = new_action(rig, ACTION_NAMES[3])
    pose_all_neutral(rig, 1)
    key_rotation(rig, "pelvis", 30, (0.0, 0.0, -0.035))
    key_rotation(rig, "spine_02", 42, (0.0, 0.0, -0.065))
    key_rotation(rig, "neck", 55, (0.0, 0.0, -0.19))
    key_rotation(rig, "head", 60, (0.0, 0.0, -0.45))
    key_rotation(rig, "head", 76, (0.0, 0.0, -0.45))
    pose_all_neutral(rig, ACTION_END)
    set_smooth(action)
    return action


def build_touch_ear(rig):
    action = new_action(rig, ACTION_NAMES[4])
    pose_all_neutral(rig, 1)
    key_rotation(rig, "pelvis", 24, (0.0, 0.0, -0.035))
    key_rotation(rig, "spine_02", 28, (0.0, 0.0, -0.06))
    key_rotation(rig, "head", 32, (0.0, 0.0, -0.18))
    key_rotation(rig, "upperarm.R", 36, (0.0, -0.42, 0.35))
    key_rotation(rig, "lowerarm.R", 48, (0.0, -1.12, 0.22))
    key_rotation(rig, "hand.R", 56, (0.0, -0.26, 0.35))
    key_rotation(rig, "upperarm.L", 56, (0.0, 0.10, -0.08))
    key_rotation(rig, "spine_02", 64, (0.0, 0.0, -0.08))
    key_rotation(rig, "head", 64, (0.0, 0.0, -0.23))
    for bone_name, value in (("upperarm.R", (0.0, -0.42, 0.35)), ("lowerarm.R", (0.0, -1.12, 0.22)), ("hand.R", (0.0, -0.26, 0.35))):
        key_rotation(rig, bone_name, 76, value)
    pose_all_neutral(rig, ACTION_END)
    set_smooth(action)
    return action


def add_preview_chair(scene, lower, upper):
    height = upper.z - lower.z
    center_x = (lower.x + upper.x) / 2
    center_y = (lower.y + upper.y) / 2
    material = bpy.data.materials.new("MAT_PREVIEW_CHAIR")
    material.diffuse_color = (0.09, 0.075, 0.055, 1.0)
    for name, location, scale in (
        ("PreviewChairSeat", (center_x, center_y + 0.17, lower.z + height * 0.32), (0.26, 0.22, 0.035)),
        ("PreviewChairBack", (center_x, center_y + 0.32, lower.z + height * 0.53), (0.26, 0.035, 0.23)),
    ):
        bpy.ops.mesh.primitive_cube_add(location=location)
        obj = bpy.context.object
        obj.name = name
        obj.scale = scale
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
        obj.data.materials.append(material)


def setup_preview(scene, lower, upper):
    width = upper.x - lower.x
    height = upper.z - lower.z
    center = (lower + upper) / 2
    world = bpy.data.worlds.new("MR_TALENT_ACTION_WORLD")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.008, 0.012, 0.025, 1.0)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.18
    scene.world = world

    bpy.ops.mesh.primitive_plane_add(size=max(width, height) * 7, location=(center.x, center.y, lower.z))
    floor = bpy.context.object
    floor.name = "PreviewFloor"
    floor_material = bpy.data.materials.new("MAT_PREVIEW_FLOOR")
    floor_material.diffuse_color = (0.014, 0.025, 0.075, 1.0)
    floor.data.materials.append(floor_material)

    bpy.ops.object.camera_add(location=(center.x + width * 1.35, lower.y - height * 2.75, lower.z + height * 0.62))
    camera = bpy.context.object
    camera.name = "MotionPreviewCamera"
    camera.data.lens = 52
    look_at(camera, (center.x, center.y, lower.z + height * 0.55))
    scene.camera = camera

    for name, location, energy, color, size in (
        ("MotionKey", (center.x + width * 2.2, lower.y - height * 1.5, lower.z + height * 1.55), 500, (1.0, 0.67, 0.52), height),
        ("MotionFill", (center.x - width * 2.0, lower.y - height * 1.0, lower.z + height * 1.15), 200, (0.38, 0.55, 1.0), height * 1.4),
        ("MotionRim", (center.x, upper.y + height * 1.4, lower.z + height * 1.5), 650, (0.62, 0.45, 1.0), height),
    ):
        data = bpy.data.lights.new(name, "AREA")
        data.energy = energy
        data.color = color
        data.shape = "DISK"
        data.size = size
        light = bpy.data.objects.new(name, data)
        scene.collection.objects.link(light)
        light.location = location
        look_at(light, (center.x, center.y, lower.z + height * 0.58))

    scene.render.engine = "BLENDER_EEVEE"
    scene.render.fps = FPS
    scene.render.resolution_x = 480
    scene.render.resolution_y = 640
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.film_transparent = False
    scene.view_settings.look = "AgX - Medium High Contrast"
    scene.view_settings.exposure = -0.7
    add_preview_chair(scene, lower, upper)


def render_action_frames(scene, rig, action):
    rig.animation_data.action = action
    rig.animation_data.action_slot = action.slots[0]
    action_dir = FRAME_ROOT / action.name
    action_dir.mkdir(parents=True, exist_ok=True)
    # The Hunyuan mesh is high density.  Workbench is deliberately used only
    # for motion review frames, so a five-action library stays fast to inspect.
    previous_engine = scene.render.engine
    previous_resolution = (scene.render.resolution_x, scene.render.resolution_y)
    scene.render.engine = "BLENDER_WORKBENCH"
    scene.display.shading.light = "STUDIO"
    scene.display.shading.color_type = "MATERIAL"
    scene.render.resolution_x = 288
    scene.render.resolution_y = 384
    scene.frame_start = 1
    scene.frame_end = ACTION_END
    scene.render.filepath = str(action_dir / "frame_")
    bpy.ops.render.render(animation=True)
    scene.render.engine = previous_engine
    scene.render.resolution_x, scene.render.resolution_y = previous_resolution
    return action_dir


def main():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    bpy.ops.import_scene.gltf(filepath=str(MODEL_PATH))
    meshes = [obj for obj in scene.objects if obj.type == "MESH"]
    if len(meshes) != 1:
        raise RuntimeError(f"Expected one Hunyuan mesh, found {len(meshes)}")
    mesh = meshes[0]
    mesh.name = "MR_TALENT_MESH"
    lower, upper = bounds(mesh)
    rig = create_body_aligned_rig(scene, lower, upper)
    bind_mesh(mesh, rig)
    actions = (
        build_idle_weight_shift(rig),
        build_walk_forward(rig),
        build_sit_down(rig),
        build_head_turn(rig),
        build_touch_ear(rig),
    )
    setup_preview(scene, lower, upper)
    for action in actions:
        render_action_frames(scene, rig, action)
    rig.animation_data.action = actions[0]
    rig.animation_data.action_slot = actions[0].slots[0]
    scene.frame_set(48)
    scene.render.filepath = str(THUMBNAIL)
    bpy.ops.render.render(write_still=True)
    scene.frame_set(1)
    bpy.ops.wm.save_as_mainfile(filepath=str(OUTPUT_BLEND))
    print({"blend": str(OUTPUT_BLEND), "actions": [action.name for action in actions], "frame_root": str(FRAME_ROOT)})


if __name__ == "__main__":
    main()
