from __future__ import annotations

import json
import math
import os
import sys
import traceback
from pathlib import Path

import bpy
from mathutils import Euler, Matrix, Vector


ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from white_coat_walk_specs import (  # noqa: E402
    CAMERA_CATALOG_ID,
    CHARACTER_ID,
    FPS,
    FRAMES,
    MOTION_CATALOG_ID,
    RIG_NAME,
    WALKS,
)


CHARACTER_DIR = (
    ROOT
    / "video-pipeline"
    / "asset-library"
    / "05-characters"
    / CHARACTER_ID
)
SOURCE_BLEND = CHARACTER_DIR / "CHAR_HUNYUAN_WHITE_COAT_FULLBODY_RIG_v1.blend"
PACK_DIR = (
    ROOT
    / "video-pipeline"
    / "asset-library"
    / "06-motions"
    / "WHITE_COAT_WALK_PACK_001"
)
OUTPUT_BLEND = PACK_DIR / "WHITE_COAT_WALK_PACK_v1.blend"
MANIFEST_PATH = PACK_DIR / "motion_manifest.json"
CAMERA_COLLECTION = "WHITE_COAT_WALK_CAMERAS"


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


def clamp_action_curves(action) -> None:
    for curve in iter_action_fcurves(action):
        for point in curve.keyframe_points:
            point.interpolation = "BEZIER"
            point.handle_left_type = "AUTO_CLAMPED"
            point.handle_right_type = "AUTO_CLAMPED"


def reset_pose(rig: bpy.types.Object) -> None:
    rig.animation_data_create()
    rig.animation_data.action = None
    for bone in rig.pose.bones:
        bone.rotation_mode = "XYZ"
        bone.location = (0.0, 0.0, 0.0)
        bone.rotation_euler = (0.0, 0.0, 0.0)
        bone.scale = (1.0, 1.0, 1.0)


def smoothstep(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3.0 - 2.0 * value)


def root_progress(spec: dict, frame: int) -> float:
    if spec["action_id"] == "ACT_WHITE_COAT_WALK_IN_STOP_01":
        if frame >= 85:
            return 1.0
        return smoothstep((frame - 1) / 83.0)
    return smoothstep((frame - 1) / (FRAMES - 1))


def root_translation(spec: dict, frame: int, height: float) -> Vector:
    progress = root_progress(spec, frame)
    forward = -spec["distance_height"] * height * progress
    stance_drop = -0.018 * height
    if spec["action_id"] == "ACT_WHITE_COAT_WALK_IN_STOP_01" and frame >= 85:
        bob = 0.0
    else:
        bob = 0.0045 * height * math.sin(progress * math.tau * 2.0)
    return Vector((0.0, forward, stance_drop + bob))


def interval_target(
    spec: dict,
    side: str,
    interval_index: int,
    rest_head: Vector,
    height: float,
) -> Vector:
    start, _ = spec["planted_intervals"][side][interval_index]
    if side == "L" and interval_index == 0 and start == 1:
        return rest_head.copy()
    root = root_translation(spec, start, height)
    target = rest_head.copy()
    target.y += root.y - 0.018 * height
    return target


def foot_target(
    spec: dict,
    side: str,
    frame: int,
    rest_head: Vector,
    height: float,
) -> Vector:
    intervals = spec["planted_intervals"][side]
    targets = [
        interval_target(spec, side, index, rest_head, height)
        for index in range(len(intervals))
    ]
    for index, (start, end) in enumerate(intervals):
        if start <= frame <= end:
            return targets[index].copy()

    previous_end = 1
    previous_target = rest_head.copy()
    next_start = None
    next_target = None
    for index, (start, end) in enumerate(intervals):
        if end < frame:
            previous_end = end
            previous_target = targets[index]
            continue
        if frame < start:
            next_start = start
            next_target = targets[index]
            break
    if next_start is None:
        hold_frame = (
            85
            if spec["action_id"] == "ACT_WHITE_COAT_WALK_IN_STOP_01"
            else FRAMES
        )
        next_start = hold_frame
        next_target = rest_head.copy()
        final_root = root_translation(spec, hold_frame, height)
        next_target.y += final_root.y - 0.055 * height
    span = max(1, next_start - previous_end)
    ratio = smoothstep((frame - previous_end) / span)
    target = previous_target.lerp(next_target, ratio)
    target.z += 0.052 * height * math.sin(math.pi * ratio)
    lateral = (1.0 if side == "L" else -1.0) * 0.004 * height
    target.x += lateral * math.sin(math.pi * ratio)
    return target


def set_absolute_pose_head(pose_bone, target_head: Vector) -> None:
    matrix = pose_bone.bone.matrix_local.copy()
    matrix.translation = target_head
    pose_bone.matrix = matrix


def key_location(pose_bone, frame: int) -> None:
    pose_bone.keyframe_insert(data_path="location", frame=frame, group=pose_bone.name)


def key_rotation(pose_bone, frame: int) -> None:
    pose_bone.keyframe_insert(
        data_path="rotation_euler", frame=frame, group=pose_bone.name
    )


def create_walk_action(rig: bpy.types.Object, spec: dict) -> bpy.types.Action:
    old = bpy.data.actions.get(spec["action_id"])
    if old is not None:
        bpy.data.actions.remove(old)
    reset_pose(rig)
    action = bpy.data.actions.new(spec["action_id"])
    rig.animation_data.action = action
    height = float(rig["body_height"])
    rest_root = rig.data.bones["root"].head_local.copy()
    rest_feet = {
        side: rig.data.bones[f"foot_ik.{side}"].head_local.copy()
        for side in ("L", "R")
    }

    for frame in range(1, FRAMES + 1):
        bpy.context.scene.frame_set(frame)
        translation = root_translation(spec, frame, height)
        set_absolute_pose_head(rig.pose.bones["root"], rest_root + translation)
        key_location(rig.pose.bones["root"], frame)
        bpy.context.view_layer.update()

        for side in ("L", "R"):
            control = rig.pose.bones[f"foot_ik.{side}"]
            set_absolute_pose_head(
                control,
                foot_target(spec, side, frame, rest_feet[side], height),
            )
            key_location(control, frame)

        progress = root_progress(spec, frame)
        if spec["action_id"] == "ACT_WHITE_COAT_WALK_IN_STOP_01" and frame >= 85:
            cycle = 0.0
        else:
            cycle = math.sin(progress * math.tau * 2.0)
        pelvis = rig.pose.bones["pelvis"]
        chest = rig.pose.bones["chest"]
        head = rig.pose.bones["head"]
        pelvis.rotation_euler = Euler((0.0, 0.0, math.radians(2.8) * cycle), "XYZ")
        chest.rotation_euler = Euler((0.0, 0.0, math.radians(-2.0) * cycle), "XYZ")
        head.rotation_euler = Euler((0.0, math.radians(0.7) * cycle, 0.0), "XYZ")
        for bone in (pelvis, chest, head):
            key_rotation(bone, frame)

        left_arm = rig.pose.bones["upper_arm.L"]
        right_arm = rig.pose.bones["upper_arm.R"]
        left_arm.rotation_euler = Euler((math.radians(3.2) * cycle, 0.0, 0.0), "XYZ")
        right_arm.rotation_euler = Euler((math.radians(-3.2) * cycle, 0.0, 0.0), "XYZ")
        key_rotation(left_arm, frame)
        key_rotation(right_arm, frame)

    clamp_action_curves(action)
    action["name_zh"] = spec["name_zh"]
    action["status"] = spec["status"]
    action["qc_status"] = "pending_visual_review"
    action["source_character_id"] = CHARACTER_ID
    action["paired_camera_id"] = spec["camera_id"]
    action["asset_type"] = "fullbody_model_walk"
    action["duration_frames"] = FRAMES
    action["fps"] = FPS
    action["planted_intervals"] = json.dumps(spec["planted_intervals"])
    try:
        action.asset_mark()
        action.asset_data.catalog_id = MOTION_CATALOG_ID
        action.asset_data.description = f"{spec['name_zh']}；白色长外套全身模特走路候选。"
    except (AttributeError, RuntimeError):
        pass
    return action


def remove_object(name: str) -> None:
    obj = bpy.data.objects.get(name)
    if obj is None:
        return
    data = obj.data
    obj_type = obj.type
    bpy.data.objects.remove(obj, do_unlink=True)
    if obj_type == "CAMERA" and data is not None and data.users == 0:
        bpy.data.cameras.remove(data)


def ensure_camera_collection() -> bpy.types.Collection:
    collection = bpy.data.collections.get(CAMERA_COLLECTION)
    if collection is None:
        collection = bpy.data.collections.new(CAMERA_COLLECTION)
        bpy.context.scene.collection.children.link(collection)
    return collection


def camera_pose(spec: dict, frame: int, height: float) -> tuple[Vector, Vector, float]:
    root = root_translation(spec, frame, height)
    style = spec["camera_style"]
    if style == "front_dolly":
        location = Vector((0.0, -3.75 * height + root.y * 0.78, 0.53 * height))
        target = Vector((0.0, root.y, 0.51 * height))
        lens = 65.0
    elif style == "walk_in_stop":
        location = Vector((0.0, -3.90 * height + root.y * 0.52, 0.55 * height))
        target = Vector((0.0, root.y * 0.88, 0.50 * height))
        lens = 68.0
    else:
        location = Vector((1.15 * height, -3.10 * height + root.y, 0.54 * height))
        target = Vector((0.0, root.y, 0.50 * height))
        lens = 62.0
    return location, target, lens


def create_camera(
    spec: dict,
    collection: bpy.types.Collection,
    height: float,
) -> bpy.types.Object:
    camera_id = spec["camera_id"]
    focus_id = f"FOCUS_{camera_id}"
    remove_object(camera_id)
    remove_object(focus_id)
    data = bpy.data.cameras.new(f"{camera_id}_DATA")
    camera = bpy.data.objects.new(camera_id, data)
    collection.objects.link(camera)
    camera.rotation_mode = "XYZ"
    data.sensor_width = 36.0
    data.dof.use_dof = True
    data.dof.aperture_fstop = 4.0
    data.dof.aperture_blades = 9
    focus = bpy.data.objects.new(focus_id, None)
    collection.objects.link(focus)
    focus.empty_display_type = "SPHERE"
    focus.empty_display_size = 0.025 * height
    focus.hide_render = True
    data.dof.focus_object = focus

    keyframes = list(range(1, FRAMES + 1))
    for frame in keyframes:
        location, target, lens = camera_pose(spec, frame, height)
        camera.matrix_world = Matrix.LocRotScale(
            location,
            (target - location).to_track_quat("-Z", "Y"),
            Vector((1.0, 1.0, 1.0)),
        )
        camera.keyframe_insert(data_path="location", frame=frame)
        camera.keyframe_insert(data_path="rotation_euler", frame=frame)
        data.lens = lens
        data.keyframe_insert(data_path="lens", frame=frame)
        focus.location = target
        focus.keyframe_insert(data_path="location", frame=frame)
    for animated in (camera, data, focus):
        if animated.animation_data and animated.animation_data.action:
            clamp_action_curves(animated.animation_data.action)

    camera["name_zh"] = spec["camera_name_zh"]
    camera["status"] = spec["status"]
    camera["qc_status"] = "pending_visual_review"
    camera["source_character_id"] = CHARACTER_ID
    camera["paired_action_id"] = spec["action_id"]
    camera["shot_scope"] = "稳定全身走路镜头，完整保留双脚"
    try:
        camera.asset_mark()
        camera.asset_data.catalog_id = CAMERA_CATALOG_ID
        camera.asset_data.description = f"{spec['camera_name_zh']}；配套 {spec['name_zh']}。"
    except (AttributeError, RuntimeError):
        pass
    return camera


def manifest_entry(spec: dict) -> dict:
    return {
        "index": spec["index"],
        "action_id": spec["action_id"],
        "name_zh": spec["name_zh"],
        "camera_id": spec["camera_id"],
        "camera_name_zh": spec["camera_name_zh"],
        "status": spec["status"],
        "qc_status": "pending_visual_review",
        "frames": FRAMES,
        "fps": FPS,
        "character_id": CHARACTER_ID,
        "rig": RIG_NAME,
        "planted_intervals": {
            side: [list(pair) for pair in intervals]
            for side, intervals in spec["planted_intervals"].items()
        },
        "review_clip": f"preview/{spec['index']:02d}_{spec['action_id']}.mp4",
        "checkpoint_dir": f"preview/{spec['index']:02d}_{spec['action_id']}_frames",
    }


def configure_scene() -> None:
    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = FRAMES
    scene.render.fps = FPS
    scene.render.resolution_x = 640
    scene.render.resolution_y = 360
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene["asset_pack_id"] = "WHITE_COAT_WALK_PACK_001"
    scene["asset_pack_name_zh"] = "白色长外套·全身走路动作镜头测试包"
    scene["motion_count"] = 3
    scene["camera_count"] = 3


def main() -> None:
    if not SOURCE_BLEND.exists():
        raise FileNotFoundError(SOURCE_BLEND)
    bpy.ops.wm.open_mainfile(filepath=str(SOURCE_BLEND))
    rig = bpy.data.objects[RIG_NAME]
    hires = bpy.data.objects["MESH_WHITE_COAT_HIRES"]
    hires.hide_set(True)
    configure_scene()
    collection = ensure_camera_collection()
    height = float(rig["body_height"])
    actions = [create_walk_action(rig, spec) for spec in WALKS]
    cameras = [create_camera(spec, collection, height) for spec in WALKS]
    rig.animation_data.action = actions[0]
    hires.hide_set(False)
    bpy.context.scene.camera = cameras[0]
    bpy.context.scene.frame_set(1)

    PACK_DIR.mkdir(parents=True, exist_ok=True)
    manifest = {
        "id": "WHITE_COAT_WALK_PACK_001",
        "name_zh": "白色长外套·全身走路动作镜头测试包",
        "version": "v1",
        "status": "candidate_review",
        "character_id": CHARACTER_ID,
        "source_blend": str(SOURCE_BLEND.relative_to(ROOT)).replace("\\", "/"),
        "pack_blend": str(OUTPUT_BLEND.relative_to(ROOT)).replace("\\", "/"),
        "motion_count": 3,
        "camera_count": 3,
        "candidate_count": 3,
        "approved_count": 0,
        "review_sheet": "preview/WHITE_COAT_WALK_REVIEW_SHEET.png",
        "combined_reel": "preview/WHITE_COAT_WALK_ALL_3_REVIEW.mp4",
        "motions": [manifest_entry(spec) for spec in WALKS],
    }
    MANIFEST_PATH.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    bpy.ops.wm.save_as_mainfile(filepath=str(OUTPUT_BLEND))
    print(f"WHITE_COAT_WALK_PACK_CREATED={OUTPUT_BLEND}")
    print(f"WHITE_COAT_WALK_MANIFEST_CREATED={MANIFEST_PATH}")
    print("WHITE_COAT_WALK_ACTIONS=3 CAMERAS=3")


if __name__ == "__main__":
    try:
        main()
    except Exception:
        traceback.print_exc()
        sys.stderr.flush()
        os._exit(1)
