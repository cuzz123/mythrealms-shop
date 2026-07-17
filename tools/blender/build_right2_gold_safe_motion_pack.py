from __future__ import annotations

import json
import os
import sys
import traceback
from pathlib import Path

import bpy
from mathutils import Euler, Matrix, Vector

sys.path.insert(0, str(Path(__file__).resolve().parent))

from right2_gold_safe_motion_specs import CAMERA_PRESETS, SAFE_MOTION_SPECS


ROOT = Path(__file__).resolve().parents[2]
CHAR_DIR = (
    ROOT
    / "video-pipeline"
    / "asset-library"
    / "05-characters"
    / "CHAR_HUNYUAN_RIGHT2_GOLD_001"
)
SOURCE = CHAR_DIR / "RIGHT2_GOLD_JEWELRY_POSE_v1.blend"
PACK_DIR = (
    ROOT
    / "video-pipeline"
    / "asset-library"
    / "06-motions"
    / "RIGHT2_GOLD_JEWELRY_SAFE_PACK_001"
)
OUTPUT = PACK_DIR / "RIGHT2_GOLD_JEWELRY_SAFE_PACK_v1.blend"
MANIFEST = PACK_DIR / "motion_manifest.json"
RIG_NAME = "RIG_RIGHT2_GOLD_UPPER_BODY"
MESH_NAME = "node_0"
CAMERA_COLLECTION = "RIGHT2_GOLD_SAFE_CAMERAS"
MOTION_CATALOG_ID = "5df25c2a-d38b-4c9c-8e5c-911d5cab2cb0"
CAMERA_CATALOG_ID = "b9688236-7945-4786-b7fa-2d007689e645"
KEY_RATIOS = ((1, 0.0), (12, 0.0), (28, 0.36), (44, 0.72), (56, 1.0), (72, 1.0))


def remove_object(name):
    obj = bpy.data.objects.get(name)
    if obj is None:
        return
    data = obj.data
    obj_type = obj.type
    bpy.data.objects.remove(obj, do_unlink=True)
    if obj_type == "CAMERA" and data is not None and data.users == 0:
        bpy.data.cameras.remove(data)


def reset_pose(rig):
    rig.animation_data_create()
    rig.animation_data.action = None
    for bone in rig.pose.bones:
        for constraint in list(bone.constraints):
            bone.constraints.remove(constraint)
        bone.rotation_mode = "XYZ"
        bone.location = (0.0, 0.0, 0.0)
        bone.rotation_euler = (0.0, 0.0, 0.0)
        bone.scale = (1.0, 1.0, 1.0)


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
    for curve in iter_action_fcurves(action):
        for point in curve.keyframe_points:
            point.interpolation = "BEZIER"
            point.handle_left_type = "AUTO_CLAMPED"
            point.handle_right_type = "AUTO_CLAMPED"


def lerp_tuple(start, end, ratio):
    return tuple(a + (b - a) * ratio for a, b in zip(start, end))


def create_candidate_action(rig, spec):
    old = bpy.data.actions.get(spec["action_id"])
    if old is not None:
        bpy.data.actions.remove(old)
    action = bpy.data.actions.new(spec["action_id"])
    rig.animation_data.action = action
    reset_pose(rig)
    rig.animation_data.action = action
    for frame, ratio in KEY_RATIOS:
        for bone_name in spec["start"]:
            rotation = lerp_tuple(
                spec["start"][bone_name],
                spec["end"][bone_name],
                ratio,
            )
            bone = rig.pose.bones[bone_name]
            bone.rotation_mode = "XYZ"
            bone.rotation_euler = Euler(rotation, "XYZ")
            bone.keyframe_insert(data_path="rotation_euler", frame=frame, group=bone.name)
    clamp_action_curves(action)
    return action


def configure_action(action, spec):
    action["name_zh"] = spec["name_zh"]
    action["status"] = spec["status"]
    action["qc_status"] = "approved"
    action["source_character_id"] = "CHAR_HUNYUAN_RIGHT2_GOLD_001"
    action["paired_camera_id"] = spec["camera_id"]
    action["asset_type"] = "jewelry_model_motion"
    action["motion_scope"] = "原模头颈胸安全动作，双臂锁定"
    action["duration_frames"] = 72
    action["fps"] = 24
    action["hold_start"] = spec["hold_start"]
    try:
        action.asset_mark()
        action.asset_data.catalog_id = MOTION_CATALOG_ID
        action.asset_data.description = (
            f"{spec['name_zh']}；RIGHT2 原始混元网格安全动作，双臂锁定。"
        )
    except (AttributeError, RuntimeError):
        pass


def ensure_camera_collection():
    collection = bpy.data.collections.get(CAMERA_COLLECTION)
    if collection is None:
        collection = bpy.data.collections.new(CAMERA_COLLECTION)
        bpy.context.scene.collection.children.link(collection)
    return collection


def key_camera(camera, focus, frame, ratio, preset):
    location = Vector(
        lerp_tuple(preset["start_location"], preset["end_location"], ratio)
    )
    target = Vector(
        lerp_tuple(preset["start_target"], preset["end_target"], ratio)
    )
    camera.matrix_world = Matrix.LocRotScale(
        location,
        (target - location).to_track_quat("-Z", "Y").to_euler(),
        Vector((1.0, 1.0, 1.0)),
    )
    camera.keyframe_insert(data_path="location", frame=frame)
    camera.keyframe_insert(data_path="rotation_euler", frame=frame)
    camera.data.lens = (
        preset["start_lens"]
        + (preset["end_lens"] - preset["start_lens"]) * ratio
    )
    camera.data.keyframe_insert(data_path="lens", frame=frame)
    camera.data.dof.aperture_fstop = (
        preset["start_fstop"]
        + (preset["end_fstop"] - preset["start_fstop"]) * ratio
    )
    camera.data.dof.keyframe_insert(data_path="aperture_fstop", frame=frame)
    focus.location = target
    focus.keyframe_insert(data_path="location", frame=frame)


def create_camera(spec, collection):
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
    data.dof.aperture_blades = 9

    focus = bpy.data.objects.new(focus_id, None)
    collection.objects.link(focus)
    focus.empty_display_type = "SPHERE"
    focus.empty_display_size = 0.02
    focus.hide_render = True
    data.dof.focus_object = focus

    preset = CAMERA_PRESETS[spec["camera_preset"]]
    hold_start = spec["hold_start"]
    camera_keys = KEY_RATIOS
    if hold_start == 72:
        camera_keys = ((1, 0.0), (12, 0.0), (28, 0.30), (44, 0.60), (56, 0.80), (72, 1.0))
    for frame, ratio in camera_keys:
        key_camera(camera, focus, frame, ratio, preset)
    for animated_id in (camera, focus, data):
        if animated_id.animation_data and animated_id.animation_data.action:
            clamp_action_curves(animated_id.animation_data.action)

    camera["name_zh"] = spec["camera_name_zh"]
    camera["status"] = spec["status"]
    camera["qc_status"] = "approved"
    camera["source_character_id"] = "CHAR_HUNYUAN_RIGHT2_GOLD_001"
    camera["paired_action_id"] = spec["action_id"]
    camera["shot_scope"] = "原模头肩、耳饰与锁骨近景"
    camera["hold_start"] = hold_start
    try:
        camera.asset_mark()
        camera.asset_data.catalog_id = CAMERA_CATALOG_ID
        camera.asset_data.description = (
            f"{spec['camera_name_zh']}；配套 {spec['name_zh']}。"
        )
    except (AttributeError, RuntimeError):
        pass
    return camera


def manifest_entry(index, spec):
    entry = {
        "index": index,
        "action_id": spec["action_id"],
        "name_zh": spec["name_zh"],
        "camera_id": spec["camera_id"],
        "camera_name_zh": spec["camera_name_zh"],
        "status": spec["status"],
        "qc_status": (
            "approved" if spec["status"] == "approved" else "passed_internal_qc"
        ),
        "hold_start": spec["hold_start"],
        "frames": 72,
        "fps": 24,
        "character_id": "CHAR_HUNYUAN_RIGHT2_GOLD_001",
        "rig": RIG_NAME,
        "motion_scope": "safe_head_neck_chest_locked_arms",
        "thumbnail": f"preview/thumbnails/{index:02d}_{spec['action_id']}.png",
        "review_clip": (
            f"preview/review_clips/{index:02d}_{spec['action_id']}/preview.mp4"
        ),
    }
    return entry


def configure_scene():
    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = 72
    scene.render.fps = 24
    scene.render.resolution_x = 1280
    scene.render.resolution_y = 720
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.film_transparent = False
    scene["asset_pack_id"] = "RIGHT2_GOLD_JEWELRY_SAFE_PACK_001"
    scene["asset_pack_name_zh"] = "右二金色礼服·首饰模特安全动作镜头包"
    scene["motion_count"] = 30
    scene["camera_count"] = 30


def main():
    bpy.ops.wm.open_mainfile(filepath=str(SOURCE))
    mesh = bpy.data.objects[MESH_NAME]
    rig = bpy.data.objects[RIG_NAME]
    if len(mesh.data.vertices) < 300_000:
        raise RuntimeError("RIGHT2 source mesh is not the original high-resolution model")
    configure_scene()
    collection = ensure_camera_collection()

    cameras = []
    for spec in SAFE_MOTION_SPECS:
        action = bpy.data.actions.get(spec["action_id"])
        if spec["start"] is not None:
            action = create_candidate_action(rig, spec)
        if action is None:
            raise RuntimeError(f"Missing approved source action {spec['action_id']}")
        configure_action(action, spec)
        cameras.append(create_camera(spec, collection))

    rig.animation_data_create()
    rig.animation_data.action = bpy.data.actions["ACT_RIGHT2_GOLD_JEWELRY_POISE_01"]
    bpy.context.scene.camera = bpy.data.objects["CAM_RIGHT2_GOLD_JEWELRY_POISE_01"]
    bpy.context.scene.frame_set(1)

    PACK_DIR.mkdir(parents=True, exist_ok=True)
    manifest_rows = [
        manifest_entry(index, spec)
        for index, spec in enumerate(SAFE_MOTION_SPECS, start=1)
    ]
    approved_count = sum(row["status"] == "approved" for row in manifest_rows)
    candidate_count = len(manifest_rows) - approved_count
    payload = {
        "id": "RIGHT2_GOLD_JEWELRY_SAFE_PACK_001",
        "name_zh": "右二金色礼服·首饰模特安全动作镜头包",
        "version": "v1",
        "status": "approved" if candidate_count == 0 else "candidate_review",
        "character_id": "CHAR_HUNYUAN_RIGHT2_GOLD_001",
        "source_blend": str(SOURCE.relative_to(ROOT)).replace("\\", "/"),
        "pack_blend": str(OUTPUT.relative_to(ROOT)).replace("\\", "/"),
        "motion_count": 30,
        "camera_count": 30,
        "approved_count": approved_count,
        "candidate_count": candidate_count,
        "contact_sheet": "preview/RIGHT2_GOLD_JEWELRY_SAFE_PACK_CONTACT_SHEET.png",
        "review_sheet": "preview/RIGHT2_GOLD_JEWELRY_SAFE_PACK_REVIEW_SHEET.png",
        "review_clip_count": 30,
        "full_review_reel": "preview/RIGHT2_GOLD_ALL_30_ACTIONS_REVIEW.mp4",
        "full_review_sheets": [
            "preview/full_review_sheets/RIGHT2_GOLD_REVIEW_01_10.png",
            "preview/full_review_sheets/RIGHT2_GOLD_REVIEW_11_20.png",
            "preview/full_review_sheets/RIGHT2_GOLD_REVIEW_21_30.png",
        ],
        "internal_qc": {
            "status": "approved",
            "reviewed_at": "2026-07-17",
            "motion_count": 30,
            "camera_count": 30,
            "full_clip_count": 30,
            "corrected_items": [
                {
                    "index": 24,
                    "id": "ACT_RIGHT2_GOLD_LEAN_BACK_01",
                    "fix": "低机位镜头重新取景，保留完整头肩轮廓",
                }
            ],
        },
        "constraints": [
            "原始混元高精度网格保持可见",
            "双臂锁定，不生成大幅抬臂动作",
            "仅使用头、颈、胸、脊柱与极小肩线变化",
            "每个动作72帧、24fps、单向运动并定格",
        ],
        "motions": manifest_rows,
    }
    MANIFEST.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    bpy.ops.wm.save_as_mainfile(filepath=str(OUTPUT))
    print(f"RIGHT2_GOLD_SAFE_MOTION_PACK_CREATED={OUTPUT}")
    print(f"RIGHT2_GOLD_SAFE_MOTION_MANIFEST_CREATED={MANIFEST}")
    print(f"MOTIONS={len(SAFE_MOTION_SPECS)} CAMERAS={len(cameras)}")


if __name__ == "__main__":
    try:
        main()
    except Exception:
        traceback.print_exc()
        sys.stderr.flush()
        os._exit(1)
