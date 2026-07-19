from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[2]
PACK_DIR = (
    ROOT
    / "video-pipeline"
    / "asset-library"
    / "06-motions"
    / "WHITE_COAT_WALK_PACK_001"
)
MANIFEST = PACK_DIR / "motion_manifest.json"
OUTPUT = PACK_DIR / "preview" / "WHITE_COAT_WALK_REVIEW_SHEET.png"
REVIEW_FINGERPRINT = PACK_DIR / "preview" / ".review_fingerprint.json"
SCRIPT_PATH = Path(__file__).resolve()
FRAMES = (1, 12, 24, 36, 48, 60, 72, 84, 96)
TILE_W = 320
TILE_H = 180
LABEL_H = 50
FONT_PATHS = (
    Path("C:/Windows/Fonts/msyh.ttc"),
    Path("C:/Windows/Fonts/simhei.ttf"),
    Path("C:/Windows/Fonts/arial.ttf"),
)


def load_font(size: int):
    for path in FONT_PATHS:
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    motions = sorted(manifest["motions"], key=lambda item: int(item["index"]))
    if len(motions) != 3:
        raise RuntimeError(f"Expected 3 walk motions, got {len(motions)}")

    sheet = Image.new(
        "RGB",
        (len(FRAMES) * TILE_W, len(motions) * (TILE_H + LABEL_H)),
        "#111317",
    )
    draw = ImageDraw.Draw(sheet)
    frame_font = load_font(14)
    label_font = load_font(18)

    for row, item in enumerate(motions):
        frames_dir = PACK_DIR / item["checkpoint_dir"]
        for col, frame in enumerate(FRAMES):
            source = frames_dir / f"frame_{frame:04d}.png"
            if not source.exists():
                raise FileNotFoundError(source)
            image = Image.open(source).convert("RGB")
            image = image.resize((TILE_W, TILE_H), Image.Resampling.LANCZOS)
            x = col * TILE_W
            y = row * (TILE_H + LABEL_H)
            sheet.paste(image, (x, y))
            draw.rectangle((x + 6, y + 6, x + 54, y + 30), fill="#15171c")
            draw.text((x + 12, y + 8), f"F{frame:02d}", font=frame_font, fill="#f1c56e")

        label_y = row * (TILE_H + LABEL_H) + TILE_H
        draw.rectangle(
            (0, label_y, len(FRAMES) * TILE_W, label_y + LABEL_H),
            fill="#1b1e24",
        )
        draw.text(
            (12, label_y + 11),
            (
                f"{int(item['index']):02d}  {item['name_zh']}  |  "
                f"{item['camera_name_zh']}  |  候选待审"
            ),
            font=label_font,
            fill="#f5f6f7",
        )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(OUTPUT, quality=95)
    fingerprint = {
        "version": 1,
        "builder_sha256": sha256_file(SCRIPT_PATH),
        "sheet_sha256": sha256_file(OUTPUT),
        "source_fingerprints": {
            item["action_id"]: sha256_file(
                PACK_DIR / item["checkpoint_dir"] / ".render_fingerprint.json"
            )
            for item in motions
        },
    }
    REVIEW_FINGERPRINT.write_text(
        json.dumps(fingerprint, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"WHITE_COAT_WALK_REVIEW_SHEET={OUTPUT}")
    print(f"WHITE_COAT_WALK_REVIEW_ROWS={len(motions)}")
    print(f"WHITE_COAT_WALK_REVIEW_FRAMES={len(motions) * len(FRAMES)}")


if __name__ == "__main__":
    main()
