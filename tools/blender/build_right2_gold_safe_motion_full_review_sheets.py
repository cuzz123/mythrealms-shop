from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[2]
PACK_DIR = (
    ROOT
    / "video-pipeline"
    / "asset-library"
    / "06-motions"
    / "RIGHT2_GOLD_JEWELRY_SAFE_PACK_001"
)
MANIFEST = PACK_DIR / "motion_manifest.json"
CLIPS_DIR = PACK_DIR / "preview" / "review_clips"
OUTPUT_DIR = PACK_DIR / "preview" / "full_review_sheets"
FRAMES = (1, 12, 28, 44, 56, 72)
GROUP_SIZE = 10
TILE_W = 320
TILE_H = 180
LABEL_H = 42
FONT_PATHS = (
    Path("C:/Windows/Fonts/msyh.ttc"),
    Path("C:/Windows/Fonts/simhei.ttf"),
    Path("C:/Windows/Fonts/arial.ttf"),
)


def load_font(size):
    for path in FONT_PATHS:
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


def build_sheet(group):
    sheet = Image.new(
        "RGB",
        (len(FRAMES) * TILE_W, len(group) * (TILE_H + LABEL_H)),
        "#111317",
    )
    draw = ImageDraw.Draw(sheet)
    title_font = load_font(18)
    frame_font = load_font(14)

    for row, item in enumerate(group):
        index = int(item["index"])
        clip_dir = CLIPS_DIR / f"{index:02d}_{item['action_id']}" / "frames"
        for col, frame in enumerate(FRAMES):
            source = clip_dir / f"frame_{frame:04d}.png"
            image = Image.open(source).convert("RGB")
            image = image.resize((TILE_W, TILE_H), Image.Resampling.LANCZOS)
            x = col * TILE_W
            y = row * (TILE_H + LABEL_H)
            sheet.paste(image, (x, y))
            draw.text((x + 8, y + 7), f"F{frame:02d}", font=frame_font, fill="#f1c56e")

        label_y = row * (TILE_H + LABEL_H) + TILE_H
        draw.rectangle(
            (0, label_y, len(FRAMES) * TILE_W, label_y + LABEL_H),
            fill="#1b1e24",
        )
        status = "已验收" if item["status"] == "approved" else "候选"
        draw.text(
            (10, label_y + 8),
            (
                f"{index:02d}  {item['name_zh']}  |  "
                f"{item['camera_name_zh']}  |  {status}"
            ),
            font=title_font,
            fill="#f5f6f7",
        )
    return sheet


def main():
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    motions = sorted(manifest["motions"], key=lambda item: int(item["index"]))
    if len(motions) != 30:
        raise RuntimeError(f"Expected 30 motions, got {len(motions)}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    outputs = []
    for start in range(0, len(motions), GROUP_SIZE):
        group = motions[start : start + GROUP_SIZE]
        first = int(group[0]["index"])
        last = int(group[-1]["index"])
        output = OUTPUT_DIR / f"RIGHT2_GOLD_REVIEW_{first:02d}_{last:02d}.png"
        build_sheet(group).save(output, quality=95)
        outputs.append(output)
        print(f"RIGHT2_GOLD_FULL_REVIEW_SHEET={output}")

    print(f"FULL_REVIEW_SHEET_COUNT={len(outputs)}")
    print(f"FULL_REVIEW_MOTION_COUNT={len(motions)}")


if __name__ == "__main__":
    main()
