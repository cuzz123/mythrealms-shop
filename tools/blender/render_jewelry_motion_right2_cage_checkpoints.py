from __future__ import annotations

from pathlib import Path

import bpy


ROOT = Path(__file__).resolve().parents[2]
CHAR_DIR = (
    ROOT
    / "video-pipeline"
    / "asset-library"
    / "05-characters"
    / "CHAR_HUNYUAN_RIGHT2_GOLD_001"
)
SOURCE = CHAR_DIR / "RIGHT2_GOLD_JEWELRY_MOTION_CAGE_v1.blend"
OUTPUT_DIR = (
    CHAR_DIR
    / "preview"
    / "jewelry_touch_earring_left_cage_v1"
    / "checkpoints"
)
RIG_NAME = "RIG_RIGHT2_GOLD_UPPER_BODY"
ACTION_NAME = "ACT_JEWELRY_TOUCH_EARRING_LEFT_001"
CAMERA_NAME = "CAM_VALIDATION_RIGHT2_CAGE_TOUCH_EARRING_LEFT"
CHECKPOINTS = (1, 16, 32, 48, 64, 72)


def main():
    bpy.ops.wm.open_mainfile(filepath=str(SOURCE))
    scene = bpy.context.scene
    rig = bpy.data.objects[RIG_NAME]
    rig.animation_data_create()
    rig.animation_data.action = bpy.data.actions[ACTION_NAME]
    scene.camera = bpy.data.objects[CAMERA_NAME]
    scene.render.resolution_x = 1280
    scene.render.resolution_y = 720
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.film_transparent = False
    try:
        scene.render.engine = "BLENDER_EEVEE_NEXT"
    except TypeError:
        pass

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for frame in CHECKPOINTS:
        scene.frame_set(frame)
        scene.render.filepath = str(OUTPUT_DIR / f"checkpoint_{frame:03d}.png")
        bpy.ops.render.render(write_still=True)
    print(f"RIGHT2_CAGE_JEWELRY_CHECKPOINTS={OUTPUT_DIR}")


if __name__ == "__main__":
    main()
