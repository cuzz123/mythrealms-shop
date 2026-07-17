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
OUTPUT = PACK_DIR / "preview" / "RIGHT2_GOLD_JEWELRY_SAFE_PACK_CONTACT_SHEET.png"
FONT_PATHS = (
    Path("C:/Windows/Fonts/msyh.ttc"),
    Path("C:/Windows/Fonts/simhei.ttf"),
    Path("C:/Windows/Fonts/arial.ttf"),
)
COLS = 5
ROWS = 6
TILE_W = 384
TILE_H = 216
LABEL_H = 54


def load_font(size):
    for path in FONT_PATHS:
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


def fit_label(text, max_width, draw, font):
    if draw.textbbox((0, 0), text, font=font)[2] <= max_width:
        return text
    suffix = "..."
    while text and draw.textbbox((0, 0), text + suffix, font=font)[2] > max_width:
        text = text[:-1]
    return text + suffix


def main():
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    motions = manifest["motions"]
    if len(motions) != COLS * ROWS:
        raise RuntimeError(f"Expected {COLS * ROWS} motions, got {len(motions)}")

    sheet = Image.new("RGB", (COLS * TILE_W, ROWS * (TILE_H + LABEL_H)), "#111317")
    draw = ImageDraw.Draw(sheet)
    title_font = load_font(21)
    meta_font = load_font(15)

    for item in motions:
        index = int(item["index"]) - 1
        col = index % COLS
        row = index // COLS
        x = col * TILE_W
        y = row * (TILE_H + LABEL_H)
        image_path = PACK_DIR / item["thumbnail"]
        image = Image.open(image_path).convert("RGB")
        image.thumbnail((TILE_W, TILE_H), Image.Resampling.LANCZOS)
        paste_x = x + (TILE_W - image.width) // 2
        paste_y = y + (TILE_H - image.height) // 2
        sheet.paste(image, (paste_x, paste_y))

        status_color = "#72d39b" if item["status"] == "approved" else "#f1c56e"
        draw.rectangle((x, y + TILE_H, x + TILE_W, y + TILE_H + LABEL_H), fill="#1b1e24")
        title = f"{item['index']:02d}  {item['name_zh']}"
        title = fit_label(title, TILE_W - 20, draw, title_font)
        draw.text((x + 10, y + TILE_H + 5), title, font=title_font, fill="#f5f6f7")
        status = "已验收" if item["status"] == "approved" else "候选"
        meta = f"{status}  |  {item['camera_name_zh']}"
        meta = fit_label(meta, TILE_W - 20, draw, meta_font)
        draw.text((x + 10, y + TILE_H + 31), meta, font=meta_font, fill=status_color)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(OUTPUT, quality=95)
    print(f"RIGHT2_GOLD_SAFE_MOTION_CONTACT_SHEET={OUTPUT}")
    print(f"CONTACT_SHEET_TILES={len(motions)}")


if __name__ == "__main__":
    main()
