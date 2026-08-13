from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from PIL import Image, ImageFilter, ImageOps

from common import write_json


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def frame_name(prefix: str, index: int) -> str:
    return f"{prefix}_{index:02d}.png"


def normalize_image(
    image: Image.Image,
    size: tuple[int, int],
    *,
    mode: str,
    background_blur: int,
) -> Image.Image:
    image = image.convert("RGB")
    if mode == "cover":
        return ImageOps.fit(image, size, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))

    if mode == "contain":
        canvas = Image.new("RGB", size, (0, 0, 0))
    else:
        cover = ImageOps.fit(image, size, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
        canvas = cover.filter(ImageFilter.GaussianBlur(radius=background_blur))

    contained = ImageOps.contain(image, size, method=Image.Resampling.LANCZOS)
    x = (size[0] - contained.width) // 2
    y = (size[1] - contained.height) // 2
    canvas.paste(contained, (x, y))
    return canvas


def crop_board(args: argparse.Namespace) -> None:
    config = read_json(Path(args.config))
    board = Image.open(args.board).convert("RGB")

    rows = int(args.rows or config["storyboard"]["rows"])
    cols = int(args.cols or config["storyboard"]["cols"])
    target = (
        int(args.width or config["storyboard"]["target_width"]),
        int(args.height or config["storyboard"]["target_height"]),
    )

    margin = int(args.margin)
    gap_x = int(args.gap_x)
    gap_y = int(args.gap_y)
    safe_inset = int(args.safe_inset)
    usable_w = board.width - margin * 2 - gap_x * (cols - 1)
    usable_h = board.height - margin * 2 - gap_y * (rows - 1)
    cell_w = usable_w / cols
    cell_h = usable_h / rows

    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    prefix = args.prefix

    manifest: dict[str, Any] = {
        "source_board": str(Path(args.board).resolve()),
        "rows": rows,
        "cols": cols,
        "target_width": target[0],
        "target_height": target[1],
        "normalize_mode": args.mode,
        "frames": [],
    }

    index = 1
    for row in range(rows):
        for col in range(cols):
            left = round(margin + col * (cell_w + gap_x)) + safe_inset
            top = round(margin + row * (cell_h + gap_y)) + safe_inset
            right = round(margin + col * (cell_w + gap_x) + cell_w) - safe_inset
            bottom = round(margin + row * (cell_h + gap_y) + cell_h) - safe_inset
            cell = board.crop((left, top, right, bottom))
            normalized = normalize_image(
                cell,
                target,
                mode=args.mode,
                background_blur=int(args.background_blur),
            )
            path = output / frame_name(prefix, index)
            normalized.save(path, quality=95)
            manifest["frames"].append(
                {
                    "index": index,
                    "path": str(path.resolve()),
                    "crop_box": [left, top, right, bottom],
                    "size": [target[0], target[1]],
                }
            )
            index += 1

    contact = make_contact_sheet([Path(item["path"]) for item in manifest["frames"]], rows, cols)
    contact_path = output / f"contact_sheet_{prefix}.png"
    contact.save(contact_path)
    manifest["contact_sheet"] = str(contact_path.resolve())
    write_json(output / "storyboard_manifest.json", manifest)
    print(f"Wrote {len(manifest['frames'])} frames to {output}")
    print(f"Contact sheet: {contact_path}")


def make_contact_sheet(paths: list[Path], rows: int, cols: int) -> Image.Image:
    thumbs: list[Image.Image] = []
    thumb_w = 270
    thumb_h = 480
    for path in paths:
        image = Image.open(path).convert("RGB")
        thumbs.append(ImageOps.fit(image, (thumb_w, thumb_h), method=Image.Resampling.LANCZOS))
    sheet = Image.new("RGB", (thumb_w * cols, thumb_h * rows), (245, 245, 245))
    for idx, thumb in enumerate(thumbs):
        x = (idx % cols) * thumb_w
        y = (idx // cols) * thumb_h
        sheet.paste(thumb, (x, y))
    return sheet


def generate_prompts(args: argparse.Namespace) -> None:
    config = read_json(Path(args.config))
    frames_dir = Path(args.frames)
    prefix = args.prefix

    storyboard = config["storyboard"]
    product = config["product"]
    base = config["video_prompt"]["base"]
    segments = storyboard.get("segments") or []
    if not segments:
        count = int(storyboard["frame_count"])
        segments = [
            {
                "from": idx,
                "to": idx + 1,
                "seconds": storyboard.get("default_seconds", 4),
                "motion": "smooth continuous camera motion",
            }
            for idx in range(1, count)
        ]

    prompt_lines = [
        "# Seedance / 小云雀首尾帧提示词",
        "",
        f"产品：{product['name']}",
        f"帧目录：`{frames_dir.resolve()}`",
        "",
        "使用方式：每段上传相邻两张图作为首尾帧。连接帧必须使用同一个标准化文件，不要重新导出。",
        "",
    ]
    jobs: list[dict[str, Any]] = []

    for segment in segments:
        start = int(segment["from"])
        end = int(segment["to"])
        seconds = float(segment.get("seconds", storyboard.get("default_seconds", 4)))
        start_path = frames_dir / frame_name(prefix, start)
        end_path = frames_dir / frame_name(prefix, end)
        prompt = (
            f"{seconds:g} seconds. {base} "
            f"Motion: {segment.get('motion', 'smooth continuous camera motion')}. "
            "Maintain the same camera speed and motion energy across adjacent clips. "
            "The final frame must match the provided last frame exactly in composition, product placement, and subject scale."
        )
        title = f"{start:02d} -> {end:02d}"
        prompt_lines.extend(
            [
                f"## {title} / {seconds:g}s",
                "",
                f"- 首帧：`{start_path.resolve()}`",
                f"- 尾帧：`{end_path.resolve()}`",
                "",
                "```text",
                prompt,
                "```",
                "",
            ]
        )
        jobs.append(
            {
                "segment": title,
                "seconds": seconds,
                "first_frame": str(start_path.resolve()),
                "last_frame": str(end_path.resolve()),
                "prompt": prompt,
                "provider": args.provider,
                "model": config.get("providers", {}).get(args.provider, {}).get("model_for_tests"),
                "resolution": config.get("providers", {}).get(args.provider, {}).get("test_resolution"),
                "status": "ready_for_manual_upload",
            }
        )

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text("\n".join(prompt_lines), encoding="utf-8")
    jobs_path = output.with_suffix(".jobs.json")
    write_json(jobs_path, {"jobs": jobs})
    print(f"Wrote prompts: {output}")
    print(f"Wrote job manifest: {jobs_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="MythRealms AI storyboard workflow tools.")
    subparsers = parser.add_subparsers(required=True)

    crop = subparsers.add_parser("crop-board", help="Crop a storyboard board into normalized frames.")
    crop.add_argument("--board", required=True, help="Path to the 3x4 storyboard image.")
    crop.add_argument("--config", default="storyboard.template.json")
    crop.add_argument("--output", required=True)
    crop.add_argument("--prefix", default="frame")
    crop.add_argument("--rows", type=int)
    crop.add_argument("--cols", type=int)
    crop.add_argument("--width", type=int)
    crop.add_argument("--height", type=int)
    crop.add_argument("--margin", type=int, default=0)
    crop.add_argument("--gap-x", type=int, default=0)
    crop.add_argument("--gap-y", type=int, default=0)
    crop.add_argument("--safe-inset", type=int, default=0)
    crop.add_argument("--mode", choices=["cover", "contain", "contain-blur"], default="contain-blur")
    crop.add_argument("--background-blur", type=int, default=28)
    crop.set_defaults(func=crop_board)

    prompts = subparsers.add_parser("prompts", help="Generate first-last-frame video prompts.")
    prompts.add_argument("--frames", required=True)
    prompts.add_argument("--config", default="storyboard.template.json")
    prompts.add_argument("--output", required=True)
    prompts.add_argument("--prefix", default="frame")
    prompts.add_argument("--provider", choices=["seedance", "xiaoyunque"], default="seedance")
    prompts.set_defaults(func=generate_prompts)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
