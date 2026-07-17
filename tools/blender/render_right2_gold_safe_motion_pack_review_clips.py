from __future__ import annotations

import json
import os
import traceback
from pathlib import Path

import bpy


ROOT = Path(__file__).resolve().parents[2]
PACK_DIR = (
    ROOT
    / "video-pipeline"
    / "asset-library"
    / "06-motions"
    / "RIGHT2_GOLD_JEWELRY_SAFE_PACK_001"
)
SOURCE = PACK_DIR / "RIGHT2_GOLD_JEWELRY_SAFE_PACK_v1.blend"
MANIFEST = PACK_DIR / "motion_manifest.json"
OUTPUT_DIR = PACK_DIR / "preview" / "review_clips"
RIG_NAME = "RIG_RIGHT2_GOLD_UPPER_BODY"
EXPECTED_FRAMES = frozenset(f"frame_{frame:04d}.png" for frame in range(1, 73))


def frames_complete(frames_dir: Path) -> bool:
    if not frames_dir.is_dir():
        return False
    return {entry.name for entry in frames_dir.iterdir()} == EXPECTED_FRAMES


def configure_preview_render(scene):
    scene.frame_start = 1
    scene.frame_end = 72
    scene.render.fps = 24
    scene.render.resolution_x = 640
    scene.render.resolution_y = 360
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.film_transparent = False
    scene.render.use_file_extension = True


def main():
    bpy.ops.wm.open_mainfile(filepath=str(SOURCE))
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    by_index = {int(item["index"]): item for item in manifest["motions"]}
    scene = bpy.context.scene
    rig = bpy.data.objects[RIG_NAME]
    rig.animation_data_create()
    configure_preview_render(scene)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    rendered = 0
    skipped = 0

    for index in sorted(by_index):
        item = by_index[index]
        clip_dir = OUTPUT_DIR / f"{index:02d}_{item['action_id']}"
        frames_dir = clip_dir / "frames"
        if frames_complete(frames_dir):
            skipped += 1
            print(
                f"REVIEW_CLIP_SKIPPED={index:02d}/30 "
                f"ACTION={item['action_id']} OUTPUT={frames_dir}"
            )
            continue
        rig.animation_data.action = bpy.data.actions[item["action_id"]]
        scene.camera = bpy.data.objects[item["camera_id"]]
        frames_dir.mkdir(parents=True, exist_ok=True)
        scene.render.filepath = str(frames_dir / "frame_")
        scene.frame_set(1)
        bpy.ops.render.render(animation=True)
        rendered += 1
        print(
            f"REVIEW_CLIP_FRAMES={index:02d}/30 "
            f"ACTION={item['action_id']} OUTPUT={frames_dir}"
        )

    print(f"RIGHT2_GOLD_SAFE_MOTION_REVIEW_CLIPS={OUTPUT_DIR}")
    print(f"REVIEW_CLIP_COUNT={len(by_index)}")
    print(f"REVIEW_CLIP_RENDERED={rendered}")
    print(f"REVIEW_CLIP_SKIPPED={skipped}")


if __name__ == "__main__":
    try:
        main()
    except Exception:
        traceback.print_exc()
        os._exit(1)
