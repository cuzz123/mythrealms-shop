#!/usr/bin/env python3
"""Ingest the five Muse turnaround sheets and render a vertical Lookbook test.

This script only copies generated references into the asset library.  It never
moves or edits the source images in the Codex generated-images directory.
"""

from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


PIPELINE = Path(__file__).resolve().parents[1]
LIBRARY = PIPELINE / "asset-library"
CHARACTERS = LIBRARY / "05-characters"
VAULT = LIBRARY / "obsidian-vault" / "01-资产卡"
REGISTRY = LIBRARY / "registry" / "assets.json"
GENERATED = Path(r"C:\Users\11458\.codex\generated_images\019f5b0c-ae77-7d62-8de7-db5b6f2604e8")
IDENTITY_MASTER = GENERATED / "exec-8a83bea1-eb48-4416-8dd7-e9792a4fc376.png"
JOB = PIPELINE / "work" / "2026-07-15-muse-five-lookbook-replica"
FONT = Path(r"C:\Windows\Fonts\arial.ttf")
FONT_BOLD = Path(r"C:\Windows\Fonts\arialbd.ttf")
FPS = "30000/1001"
SIZE = (720, 960)


@dataclass(frozen=True)
class Look:
    index: int
    code: str
    asset_id: str
    title: str
    color: str
    product_id: str
    product_name: str
    product_type: str
    sheet: str
    swatches: tuple[str, str, str]


LOOKS = (
    Look(1, "ivory", "CHAR_MR_TALENT_MUSE_IVORY_001", "象牙白露肩缎面礼服与 The Soft Return 耳环", "象牙白", "pearl-series-13", "The Soft Return", "耳环", "exec-ea9a72e6-8dcf-43d5-a087-3303a2551eac.png", ("#F3ECE2", "#D4B87C", "#AC8C65")),
    Look(2, "navy", "CHAR_MR_TALENT_MUSE_NAVY_001", "午夜海军蓝缎面礼服与 The Morning Pearl 耳环", "午夜海军蓝", "pearl-series-14", "The Morning Pearl", "耳环", "exec-f3fb5346-5c3b-400e-bf52-0a345aafb468.png", ("#0D1A31", "#C7B397", "#ECE7DE")),
    Look(3, "emerald", "CHAR_MR_TALENT_MUSE_EMERALD_001", "祖母绿单肩缎面礼服与 The Listening Stone 耳环", "祖母绿", "pearl-series-16", "The Listening Stone", "耳环", "exec-2124471c-b32e-4288-8cb6-afde015032b6.png", ("#083F37", "#D4B87C", "#F1ECE3")),
    Look(4, "black", "CHAR_MR_TALENT_MUSE_BLACK_001", "黑色天鹅绒礼服与 The Light Keeper 项链", "黑色天鹅绒", "pearl-series-19", "The Light Keeper", "项链", "exec-fdeb8b1d-e8ec-443d-93cd-fa73f0bb4a5f.png", ("#121212", "#B99461", "#EEE8DE")),
    Look(5, "champagne", "CHAR_MR_TALENT_MUSE_CHAMPAGNE_001", "香槟金挂脖礼服与 The Deep Breath 项链", "香槟金", "pearl-series-20", "The Deep Breath", "项链", "exec-06058290-bbde-4cf4-b58d-5f52e34bde36.png", ("#D9C1A1", "#B8874A", "#F4EEE5")),
)


def ensure(condition: bool, message: str) -> None:
    if not condition:
        raise RuntimeError(message)


def copy_file(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, destination)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def save_crop(sheet: Image.Image, panel: int, destination: Path) -> None:
    # Each generated turnaround is 1536×1024 with three equal 512 px panels.
    width, height = sheet.size
    panel_width = width // 3
    left = panel * panel_width
    crop = sheet.crop((left, 0, left + panel_width, height)).convert("RGB")
    destination.parent.mkdir(parents=True, exist_ok=True)
    crop.save(destination, quality=95, subsampling=0)


def asset_metadata(look: Look) -> dict:
    return {
        "id": look.asset_id,
        "asset_type": "female_editorial_character_reference",
        "status": "draft",
        "version": "v1",
        "generator": "Codex image generation",
        "created_at": "2026-07-15",
        "identity_group": "CHAR_MR_TALENT_MUSE_001",
        "featured_product_id": look.product_id,
        "description": f"同一位亚洲女性模特，{look.title}，正面／左前 45°／背面三视图。",
        "files": {
            "identity_master": "source/generated-reference/identity-master.png",
            "turnaround_sheet": "source/generated-turnaround/turnaround-sheet.png",
            "front": "source/three-view-crops/front.jpg",
            "left_45": "source/three-view-crops/left_front.jpg",
            "back": "source/three-view-crops/back.jpg",
            "thumbnail": "Thumbnail.png",
        },
        "hunyuan_web_upload_order": ["front.jpg", "left_front.jpg", "back.jpg"],
        "limitations": [
            "这是图像参考资产，不含 GLB、FBX、骨骼或动作。",
            "饰品为该 SKU 的视觉表现参考；正式商品页和成片前，需逐帧核验珠宝造型与在售 SKU 一致。",
            "使用混元图生 3D 后，仍需检查发丝、手指、服装与背面的一致性。",
        ],
    }


def asset_instructions(look: Look) -> str:
    return f"""# {look.asset_id}

{look.title}

## 用途

- 同一身份模特组：`CHAR_MR_TALENT_MUSE_001`
- 服装：{look.color}
- 展示产品：`{look.product_id}` / {look.product_name}（{look.product_type}）
- 用于 Lookbook 三视图、图生 3D 输入、选角预览和静态商品视频。

## 混元图生 3D 使用

1. 选择“多张图片”。
2. 按 `front.jpg`、`left_front.jpg`、`back.jpg` 顺序上传。
3. 先用 500K 面数测试；下载 GLB 作为 Blender 资产交换格式。
4. 生成后检查面部、耳部饰品、双手、裙摆与背面服装；合格后再变更资产状态。

## 限制

这是一套图片参考，不是已经绑定骨骼的 3D 角色。画面中的珠宝必须在正式投放前与 `{look.product_id}` 的在售商品图人工核对。
"""


def asset_card(look: Look) -> str:
    base = f"D:/mythrealms-shop/video-pipeline/asset-library/05-characters/{look.asset_id}"
    return f"""---
id: {look.asset_id}
asset_type: character_reference
status: draft
import_mode: image_reference
version: v1
identity_group: CHAR_MR_TALENT_MUSE_001
featured_product_id: {look.product_id}
tags: [角色, 全身, 三视图, Lookbook, 同一模特, {look.color}, {look.product_type}, {look.product_name}]
---

# {look.asset_id}｜{look.title}

![](file:///{base}/Thumbnail.png)

## 资产用途

- 同一位模特的五 Look 系列之一，可与 `CHAR_MR_TALENT_MUSE_001` 其余服装保持身份连续。
- 产品展示：`{look.product_id}` · {look.product_name}（{look.product_type}）。
- 当前为图像参考资产；不包含网格、贴图、骨骼或动作。

## 资产文件

- [身份母参考](file:///{base}/source/generated-reference/identity-master.png)
- [三视图整图](file:///{base}/source/generated-turnaround/turnaround-sheet.png)
- [正面](file:///{base}/source/three-view-crops/front.jpg) · [左前 45°](file:///{base}/source/three-view-crops/left_front.jpg) · [背面](file:///{base}/source/three-view-crops/back.jpg)
- [使用说明](file:///{base}/Instructions.md)

## 调用与验收

- 图生 3D：按正面 → 左前 45° → 背面上传；先用 500K 面数测试。
- 商品验收：核对 `{look.product_id}` 在售状态、饰品造型、耳部／颈部佩戴关系与礼服背面。
- 待完成：图生 3D、骨骼绑定、动作测试和正式商品图对照验收。
"""


def insert_registry_entries(entries: list[dict]) -> None:
    raw = REGISTRY.read_text(encoding="utf-8")
    existing = {entry["id"] for entry in json.loads(raw)["assets"]}
    additions = [entry for entry in entries if entry["id"] not in existing]
    if not additions:
        return
    marker = "\n  ]\n}"
    ensure(marker in raw, f"Could not locate assets-array tail in {REGISTRY}")
    serialized = ",\n".join(json.dumps(entry, ensure_ascii=False, separators=(",", ":")) for entry in additions)
    raw = raw.replace(marker, ",\n    " + serialized + marker, 1)
    REGISTRY.write_text(raw, encoding="utf-8")


def ingest_assets() -> list[dict]:
    ensure(IDENTITY_MASTER.exists(), f"Missing identity master: {IDENTITY_MASTER}")
    registry_entries: list[dict] = []
    for look in LOOKS:
        sheet_path = GENERATED / look.sheet
        ensure(sheet_path.exists(), f"Missing generated turnaround: {sheet_path}")
        asset = CHARACTERS / look.asset_id
        source = asset / "source"
        copy_file(sheet_path, source / "generated-turnaround" / "turnaround-sheet.png")
        copy_file(sheet_path, asset / "Thumbnail.png")
        copy_file(IDENTITY_MASTER, source / "generated-reference" / "identity-master.png")
        with Image.open(sheet_path) as image:
            sheet = image.convert("RGB")
            save_crop(sheet, 0, source / "three-view-crops" / "front.jpg")
            save_crop(sheet, 1, source / "three-view-crops" / "left_front.jpg")
            save_crop(sheet, 2, source / "three-view-crops" / "back.jpg")
        (asset / "reference.json").write_text(
            json.dumps(asset_metadata(look), ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        (asset / "Instructions.md").write_text(asset_instructions(look), encoding="utf-8")
        (VAULT / f"{look.asset_id}｜{look.title}.md").write_text(asset_card(look), encoding="utf-8")
        registry_entries.append(
            {
                "id": look.asset_id,
                "name": f"同一模特｜{look.title}",
                "category": "character",
                "status": "draft",
                "version": "v1",
                "source_paths": [
                    f"../05-characters/{look.asset_id}/source/generated-turnaround/turnaround-sheet.png",
                    f"../05-characters/{look.asset_id}/source/three-view-crops/front.jpg",
                    f"../05-characters/{look.asset_id}/source/three-view-crops/left_front.jpg",
                    f"../05-characters/{look.asset_id}/source/three-view-crops/back.jpg",
                ],
                "tags": ["female", "full-body", "three-view", "lookbook", "muse-001", look.code, look.product_id, look.product_type],
                "usage": {"default_import": "copy", "suitable_for": ["Lookbook 三视图", "图生 3D 输入", "静态商品视频"]},
                "quality_gate": ["同一模特身份一致", "三视图服装一致", "正式投放前核对在售 SKU 与饰品造型"],
                "notes": f"图像参考资产；展示产品为 {look.product_id} / {look.product_name}。不含 3D 网格、骨骼或动作。",
            }
        )
    insert_registry_entries(registry_entries)
    return registry_entries


def cover_crop(source: Image.Image, width: int, height: int) -> Image.Image:
    return ImageOps.fit(source, (width, height), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))


def draw_measurement_lines(draw: ImageDraw.ImageDraw) -> None:
    line = (99, 99, 99, 105)
    faint = (99, 99, 99, 62)
    for x in (20, 240, 480, 700):
        draw.line((x, 48, x, 760), fill=faint, width=1)
    for y in (48, 176, 304, 432, 560, 688, 760):
        draw.line((20, y, 700, y), fill=faint, width=1)
    draw.rectangle((20, 48, 700, 760), outline=line, width=1)
    # Small technical ticks remain intentionally generic, not source text.
    for x in (20, 240, 480, 700):
        draw.line((x - 6, 48, x + 6, 48), fill=line, width=1)
        draw.line((x - 6, 760, x + 6, 760), fill=line, width=1)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    path = FONT_BOLD if bold else FONT
    return ImageFont.truetype(str(path), size=size)


def make_card(look: Look, target: Path, hook: bool = False) -> None:
    source_path = CHARACTERS / look.asset_id / "source" / "generated-turnaround" / "turnaround-sheet.png"
    with Image.open(source_path) as source_image:
        source = source_image.convert("RGB")
    canvas = Image.new("RGB", SIZE, "#F5F1EA")
    draw = ImageDraw.Draw(canvas, "RGBA")
    draw_measurement_lines(draw)
    if hook:
        crop = source.crop((92, 0, 420, 1024))
        person = cover_crop(crop, 290, 760)
        canvas.paste(person, (215, 40))
        draw.rectangle((214, 39, 505, 801), outline=(72, 72, 72, 120), width=1)
        draw.text((34, 52), "MYTHREALMS", fill=(26, 26, 26, 210), font=font(18, True))
        draw.text((34, 78), "MUSE / FIT STUDY", fill=(55, 55, 55, 170), font=font(13))
        draw.text((34, 838), "LOOK 01", fill=(20, 20, 20, 255), font=font(42, True))
        draw.text((35, 888), f"{look.product_name.upper()}  ·  {look.product_type.upper()}", fill=(42, 42, 42, 210), font=font(16))
    else:
        panel_width = 330
        positions = (90, 603, 1116)
        x_positions = (20, 250, 480)
        for x, left in zip(x_positions, positions):
            crop = source.crop((left, 0, left + panel_width, 1024))
            person = cover_crop(crop, 220, 684)
            canvas.paste(person, (x, 56))
            draw.rectangle((x, 56, x + 220, 740), outline=(80, 80, 80, 80), width=1)
        draw.text((26, 18), "MYTHREALMS", fill=(28, 28, 28, 210), font=font(16, True))
        draw.text((558, 20), "MUSE STUDY", fill=(48, 48, 48, 165), font=font(12))
        draw.text((26, 804), f"LOOK {look.index:02d}", fill=(20, 20, 20, 255), font=font(42, True))
        draw.text((28, 854), f"{look.product_name.upper()}  ·  {look.product_type.upper()}", fill=(40, 40, 40, 215), font=font(15))
        draw.text((28, 881), look.color.upper(), fill=(70, 70, 70, 165), font=font(13))
    for i, swatch in enumerate(look.swatches):
        x = 573 + i * 39
        draw.rounded_rectangle((x, 858, x + 28, 886), radius=4, fill=swatch, outline=(33, 33, 33, 85), width=1)
    target.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(target)


def make_cta(target: Path) -> None:
    image = Image.new("RGB", SIZE, "#0B101C")
    draw = ImageDraw.Draw(image, "RGBA")
    # A restrained pearl field, not an imitation of any reference CTA or QR layout.
    for x in range(48, 720, 78):
        for y in range(42, 960, 84):
            radius = 4 if (x + y) % 3 else 7
            draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(232, 216, 184, 42))
    draw.line((96, 286, 624, 286), fill=(210, 181, 125, 130), width=1)
    draw.line((96, 674, 624, 674), fill=(210, 181, 125, 130), width=1)
    draw.text((360, 360), "MYTHREALMS", fill=(244, 236, 220, 255), font=font(55, True), anchor="ma")
    draw.text((360, 437), "THE PEARL EDIT", fill=(210, 181, 125, 255), font=font(23, True), anchor="ma")
    draw.text((360, 490), "FIVE LOOKS · ONE MUSE", fill=(232, 227, 216, 220), font=font(17), anchor="ma")
    draw.text((360, 732), "EXPLORE THE COLLECTION", fill=(244, 236, 220, 235), font=font(18, True), anchor="ma")
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target)


def run(command: list[str]) -> None:
    print("+", " ".join(command))
    subprocess.run(command, check=True)


def still_video(image: Path, duration: float, output: Path) -> None:
    run([
        "ffmpeg", "-y", "-loop", "1", "-framerate", FPS, "-t", f"{duration:.6f}", "-i", str(image),
        "-vf", f"fps={FPS},format=yuv420p", "-an", "-r", FPS, "-c:v", "libx264", "-crf", "17", "-preset", "medium", "-pix_fmt", "yuv420p", str(output),
    ])


def render_video() -> Path:
    cards = JOB / "video_clips"
    cards.mkdir(parents=True, exist_ok=True)
    for look in LOOKS:
        make_card(look, cards / f"look{look.index:02d}_card.png")
    make_card(LOOKS[0], cards / "look01_hook.png", hook=True)
    make_cta(cards / "cta.png")

    still_video(cards / "look01_hook.png", 0.70, cards / "hook.mp4")
    still_video(cards / "look01_card.png", 2.15, cards / "look01_card.mp4")
    run([
        "ffmpeg", "-y", "-i", str(cards / "hook.mp4"), "-i", str(cards / "look01_card.mp4"),
        "-filter_complex", "[0:v][1:v]xfade=transition=fade:duration=0.25:offset=0.45,format=yuv420p[v]",
        "-map", "[v]", "-r", FPS, "-c:v", "libx264", "-crf", "17", "-preset", "medium", "-an", str(cards / "look01.mp4"),
    ])
    for look in LOOKS[1:]:
        still_video(cards / f"look{look.index:02d}_card.png", 2.385, cards / f"look{look.index:02d}.mp4")
    still_video(cards / "cta.png", 3.075941, cards / "cta.mp4")

    main = cards / "looks_01_to_05.mp4"
    filter_graph = (
        "[0:v][1:v]xfade=transition=fade:duration=0.26:offset=2.34[v01];"
        "[v01][2:v]xfade=transition=fade:duration=0.26:offset=4.465[v02];"
        "[v02][3:v]xfade=transition=fade:duration=0.26:offset=6.590[v03];"
        "[v03][4:v]xfade=transition=fade:duration=0.26:offset=8.715,format=yuv420p[v]"
    )
    run([
        "ffmpeg", "-y", "-i", str(cards / "look01.mp4"), "-i", str(cards / "look02.mp4"), "-i", str(cards / "look03.mp4"), "-i", str(cards / "look04.mp4"), "-i", str(cards / "look05.mp4"),
        "-filter_complex", filter_graph, "-map", "[v]", "-r", FPS, "-c:v", "libx264", "-crf", "17", "-preset", "medium", "-an", str(main),
    ])
    final = JOB / "remix.mp4"
    run([
        "ffmpeg", "-y", "-i", str(main), "-i", str(cards / "cta.mp4"), "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo",
        "-filter_complex", "[0:v][1:v]concat=n=2:v=1:a=0[v]", "-map", "[v]", "-map", "2:a",
        "-t", "14.175941", "-r", FPS, "-c:v", "libx264", "-crf", "17", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-shortest", str(final),
    ])
    return final


def extract_contact_sheet(video: Path) -> Path:
    contact_dir = JOB / "preview"
    contact_dir.mkdir(parents=True, exist_ok=True)
    timestamps = (0.20, 2.85, 5.00, 7.12, 9.25, 12.00)
    frames: list[Image.Image] = []
    for index, timestamp in enumerate(timestamps, start=1):
        frame = contact_dir / f"frame-{index:02d}.jpg"
        run(["ffmpeg", "-y", "-ss", str(timestamp), "-i", str(video), "-frames:v", "1", "-q:v", "2", str(frame)])
        with Image.open(frame) as image:
            frames.append(image.convert("RGB").resize((240, 320), Image.Resampling.LANCZOS))
    sheet = Image.new("RGB", (720, 640), "#101522")
    for index, frame in enumerate(frames):
        sheet.paste(frame, ((index % 3) * 240, (index // 3) * 320))
    result = contact_dir / "remix-contact-sheet.jpg"
    sheet.save(result, quality=92)
    return result


def write_job_manifests(video: Path, registry_entries: list[dict], contact_sheet: Path) -> None:
    material = JOB / "material"
    material.mkdir(parents=True, exist_ok=True)
    for look in LOOKS:
        source = CHARACTERS / look.asset_id / "source" / "generated-turnaround" / "turnaround-sheet.png"
        copy_file(source, material / f"look{look.index:02d}" / "turnaround-sheet.png")
    source_video = Path(r"D:\视频素材\抖音爆款\489afdadc74474c86569382e52ccca2f.mp4")
    if source_video.exists():
        copy_file(source_video, JOB / "reference.mp4")
    recipe = {
        "id": "MR_MUSE_FIVE_LOOKBOOK_TEST_001",
        "reference_video": str(source_video),
        "output": str(video),
        "format": {"width": 720, "height": 960, "fps": FPS, "duration_seconds": 14.175941, "audio": "silent-aac-bed"},
        "segments": [
            {"id": "S01", "start": 0.0, "end": 2.6, "look": "LOOK 01", "asset_id": LOOKS[0].asset_id, "treatment": "front fit-study hook then three-view card"},
            {"id": "S02", "start": 2.6, "end": 4.725, "look": "LOOK 02", "asset_id": LOOKS[1].asset_id, "treatment": "static three-view card"},
            {"id": "S03", "start": 4.725, "end": 6.85, "look": "LOOK 03", "asset_id": LOOKS[2].asset_id, "treatment": "static three-view card"},
            {"id": "S04", "start": 6.85, "end": 8.975, "look": "LOOK 04", "asset_id": LOOKS[3].asset_id, "treatment": "static three-view card"},
            {"id": "S05", "start": 8.975, "end": 11.1, "look": "LOOK 05", "asset_id": LOOKS[4].asset_id, "treatment": "static three-view card"},
            {"id": "S06", "start": 11.1, "end": 14.175941, "treatment": "MythRealms original CTA"},
        ],
        "transitions": [{"type": "ghost fade", "duration_seconds": 0.26, "offsets": [2.34, 4.465, 6.59, 8.715]}],
        "exclusions": ["source watermark", "source QR", "source platform UI", "source face/clothing", "discontinued legacy products"],
    }
    matches = {"job": recipe["id"], "matches": [{"segment": f"S{look.index:02d}", "asset_id": look.asset_id, "product_id": look.product_id, "confidence": "user-approved generated reference"} for look in LOOKS]}
    plan = {"job": recipe["id"], "source_mode": "manual visual reconstruction", "assets": [entry["id"] for entry in registry_entries], "notes": "All five looks share identity group CHAR_MR_TALENT_MUSE_001. This test uses static 2D turnaround cards, not 3D animation."}
    (JOB / "recipe.json").write_text(json.dumps(recipe, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (JOB / "matches.json").write_text(json.dumps(matches, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (JOB / "fragment_plan.json").write_text(json.dumps(plan, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (JOB / "script.txt").write_text("MYTHREALMS\nTHE PEARL EDIT\nEXPLORE THE COLLECTION\n", encoding="utf-8")
    (JOB / "README.md").write_text(
        f"""# MythRealms 五 Look 三视图复刻测试

- 输出：`{video.name}`（720×960，29.97fps，14.175941 秒）
- 预览抽帧：`{contact_sheet.relative_to(JOB).as_posix()}`
- 五套资产均属于 `CHAR_MR_TALENT_MUSE_001`，只使用在售耳环／项链 SKU：13、14、16、19、20。
- 本测试复刻的是参考片的三视图技术卡、静帧节奏和残影溶解；不复用原片人物、服装、水印、二维码、平台 UI 或音频。
""",
        encoding="utf-8",
    )


def main() -> None:
    entries = ingest_assets()
    video = render_video()
    contact_sheet = extract_contact_sheet(video)
    write_job_manifests(video, entries, contact_sheet)
    print(json.dumps({"video": str(video), "sha256": sha256(video), "contact_sheet": str(contact_sheet)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
