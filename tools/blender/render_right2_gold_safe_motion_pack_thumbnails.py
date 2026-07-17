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
OUTPUT_DIR = PACK_DIR / "preview" / "thumbnails"
RIG_NAME = "RIG_RIGHT2_GOLD_UPPER_BODY"


def configure_preview_render(scene):
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
    scene = bpy.context.scene
    rig = bpy.data.objects[RIG_NAME]
    rig.animation_data_create()
    configure_preview_render(scene)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for item in manifest["motions"]:
        action = bpy.data.actions[item["action_id"]]
        camera = bpy.data.objects[item["camera_id"]]
        rig.animation_data.action = action
        scene.camera = camera
        scene.frame_set(int(item["hold_start"]))
        output = PACK_DIR / item["thumbnail"]
        output.parent.mkdir(parents=True, exist_ok=True)
        scene.render.filepath = str(output)
        bpy.ops.render.render(write_still=True)
        print(
            f"THUMBNAIL={item['index']:02d}/30 "
            f"ACTION={item['action_id']} OUTPUT={output}"
        )

    print(f"RIGHT2_GOLD_SAFE_MOTION_THUMBNAILS={OUTPUT_DIR}")
    print(f"THUMBNAIL_COUNT={len(manifest['motions'])}")


if __name__ == "__main__":
    try:
        main()
    except Exception:
        traceback.print_exc()
        os._exit(1)
