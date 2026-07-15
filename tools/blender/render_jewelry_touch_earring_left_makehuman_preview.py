from __future__ import annotations

from pathlib import Path

import bpy


ROOT = Path(__file__).resolve().parents[2]
CHAR_DIR = (
    ROOT
    / "video-pipeline"
    / "asset-library"
    / "05-characters"
    / "CHAR_MAKEHUMAN_FEMALE_BASE_001"
)
SOURCE = CHAR_DIR / "MakeHuman_JewelryMotionValidation_v1.blend"
PREVIEW_DIR = CHAR_DIR / "preview" / "jewelry_touch_earring_left_001"
FRAME_DIR = PREVIEW_DIR / "frames"
RIG_NAME = "HumanMasterRig_Fitted"
ACTION_NAME = "ACT_JEWELRY_TOUCH_EARRING_LEFT_001"
CAMERA_NAME = "CAM_VALIDATION_MH_TOUCH_EARRING_LEFT"


def main():
    bpy.ops.wm.open_mainfile(filepath=str(SOURCE))
    scene = bpy.context.scene
    rig = bpy.data.objects[RIG_NAME]
    rig.animation_data_create()
    rig.animation_data.action = bpy.data.actions[ACTION_NAME]
    scene.camera = bpy.data.objects[CAMERA_NAME]
    scene.frame_start = 1
    scene.frame_end = 72
    scene.render.fps = 24
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

    FRAME_DIR.mkdir(parents=True, exist_ok=True)
    scene.render.filepath = str(FRAME_DIR / "frame_")
    scene.frame_set(1)
    bpy.ops.render.render(animation=True)
    print(f"MAKEHUMAN_JEWELRY_PREVIEW_FRAMES={FRAME_DIR}")


if __name__ == "__main__":
    main()
