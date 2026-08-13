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
SOURCE = CHAR_DIR / "RIGHT2_GOLD_JEWELRY_POSE_v1.blend"
OUTPUT_DIR = CHAR_DIR / "preview" / "jewelry_pose_v1" / "checkpoints"
FRAMES = (1, 12, 28, 44, 56, 72)


def main():
    bpy.ops.wm.open_mainfile(filepath=str(SOURCE))
    scene = bpy.context.scene
    scene.render.resolution_x = 1280
    scene.render.resolution_y = 720
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for frame in FRAMES:
        scene.frame_set(frame)
        scene.render.filepath = str(OUTPUT_DIR / f"checkpoint_{frame:03d}.png")
        bpy.ops.render.render(write_still=True)
    print(f"RIGHT2_GOLD_JEWELRY_POSE_CHECKPOINTS={OUTPUT_DIR}")


if __name__ == "__main__":
    main()
