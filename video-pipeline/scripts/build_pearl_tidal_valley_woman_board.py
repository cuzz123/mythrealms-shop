from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


W, H = 3840, 2160
BG = "#F1ECE4"
INK = "#191817"
MUTED = "#6F6A64"
LINE = "#C9BFB2"
GOLD = "#9B7747"
CARD = "#F8F4ED"
REG = "C:/Windows/Fonts/msyh.ttc"
BOLD = "C:/Windows/Fonts/msyhbd.ttc"

SHOTS = [
    ("S02A", "12–16s", "栖居者出现", "heroine-anchor.png", "35mm｜室内横向滑动", "侧背站在落地窗旁，只做一次轻微吸气。", "末帧：她落在左三分区，银灰海占右侧。", "中风险｜角色与建筑双锚点；禁止转身与正视。"),
    ("S02B", "16–20s", "不被讨好的凝视", "interior-anchor.png", "50mm｜极慢前推", "她看向镜头右侧的空气，第 2 秒下颌只抬起两厘米。", "末帧：焦点落在右眼和雀斑，海面柔焦。", "中风险｜锁侧脸与目线；手不进入画面。"),
    ("S02C", "20–24s", "像在思考文明存亡", "profile-anchor.png", "85mm｜锁定近景", "侧脸保持静止，只完成一次缓慢眨眼。", "末帧：视线仍指向海，供下一段野马切入。", "低风险｜锁面部；禁止笑、摇镜与拉焦。"),
]


def f(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(BOLD if bold else REG, size=size)


def fit(path: Path, size: tuple[int, int]) -> Image.Image:
    with Image.open(path) as source:
        return ImageOps.fit(source.convert("RGB"), size, Image.Resampling.LANCZOS)


def lines(draw: ImageDraw.ImageDraw, text: str, face: ImageFont.FreeTypeFont, width: int) -> list[str]:
    out, line = [], ""
    for ch in text:
        if line and draw.textlength(line + ch, font=face) > width:
            out.append(line)
            line = ch
        else:
            line += ch
    if line:
        out.append(line)
    return out


def text_block(draw: ImageDraw.ImageDraw, x: int, y: int, text: str, face: ImageFont.FreeTypeFont, width: int, fill: str) -> int:
    h = face.getbbox("国Ag")[3] - face.getbbox("国Ag")[1]
    for line in lines(draw, text, face, width):
        draw.text((x, y), line, font=face, fill=fill)
        y += h + 10
    return y


def field(draw: ImageDraw.ImageDraw, x: int, y: int, label: str, value: str, width: int) -> int:
    draw.text((x, y), label, font=f(24, True), fill=GOLD)
    return text_block(draw, x + 145, y - 3, value, f(27), width - 145, INK) + 14


def build_board(package: Path, output: Path) -> Path:
    package = Path(package)
    output = Path(output)
    manifest = json.loads((package / "manifest.json").read_text(encoding="utf-8"))
    refs = package / "references"
    canvas = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(canvas)

    draw.text((86, 64), "MYTHREALMS", font=f(88), fill=INK)
    draw.text((92, 166), "L U X U R Y   M Y T H O L O G I C A L   J E W E L R Y", font=f(24), fill=MUTED)
    draw.line((86, 235, 3754, 235), fill=LINE, width=2)
    draw.text((1270, 54), "DIRECTOR BOARD  ·  CHARACTER ARRIVAL", font=f(34), fill=MUTED)
    draw.text((1270, 104), "拥有一切的女人", font=f(68, True), fill=INK)
    draw.text((1270, 188), "00:12–00:24  |  不直视，不微笑", font=f(27), fill=GOLD)
    draw.text((2940, 78), manifest["id"], font=f(24), fill=MUTED)
    draw.text((2940, 124), "THE GAZE IS NEVER FOR US", font=f(31, True), fill=INK)
    draw.text((2940, 178), "COLD SEA / WARM PRACTICAL / NO PRODUCT YET", font=f(20), fill=MUTED)

    card_w, gap, x0, y0, image_h, card_h = 1200, 40, 80, 300, 675, 1190
    for i, (sid, tc, title, image, camera, action, end, risk) in enumerate(SHOTS):
        x = x0 + i * (card_w + gap)
        draw.rounded_rectangle((x, y0, x + card_w, y0 + card_h), radius=10, fill=CARD, outline=LINE, width=2)
        canvas.paste(fit(refs / image, (card_w, image_h)), (x, y0))
        draw.rectangle((x + 24, y0 + 22, x + 178, y0 + 80), fill="#151515")
        draw.text((x + 42, y0 + 29), sid, font=f(30, True), fill="#FFFFFF")
        tw = int(draw.textlength(tc, font=f(28, True))) + 42
        draw.rounded_rectangle((x + card_w - tw - 24, y0 + 22, x + card_w - 24, y0 + 80), radius=4, fill="#151515")
        draw.text((x + card_w - tw, y0 + 30), tc, font=f(28, True), fill="#FFFFFF")
        by = y0 + image_h + 32
        draw.text((x + 34, by), title, font=f(42, True), fill=INK)
        draw.line((x + 34, by + 64, x + card_w - 34, by + 64), fill=LINE, width=2)
        by += 92
        by = field(draw, x + 34, by, "镜头", camera, card_w - 68)
        by = field(draw, x + 34, by, "表演", action, card_w - 68)
        by = field(draw, x + 34, by, "落点", end, card_w - 68)
        field(draw, x + 34, by, "可控性", risk, card_w - 68)

    base_y = 1540
    draw.line((80, base_y, 3760, base_y), fill=LINE, width=2)
    portrait = fit(refs / "profile-anchor.png", (640, 360))
    canvas.paste(portrait, (80, base_y + 62))
    draw.rectangle((80, base_y + 62, 720, base_y + 422), outline=LINE, width=2)
    draw.text((104, base_y + 84), "CHARACTER ANCHOR", font=f(24, True), fill="#FFFFFF", stroke_width=2, stroke_fill="#111111")

    draw.text((780, base_y + 56), "表演规则", font=f(34, True), fill=INK)
    text_block(draw, 780, base_y + 112, "不直视镜头  ·  不笑  ·  不触摸脸  ·  不用手展示产品", f(30), 820, INK)
    draw.text((780, base_y + 244), "可见动作预算", font=f(26, True), fill=GOLD)
    text_block(draw, 780, base_y + 292, "一次吸气 / 抬颏两厘米 / 一次眨眼。其余全留给海、风与光。", f(26), 820, MUTED)

    draw.text((1770, base_y + 56), "连续性", font=f(34, True), fill=INK)
    continuity = [("时间", "同一黎明前"), ("空间", "同一玻璃别墅"), ("光", "冷海 + 单一暖窗"), ("服装", "深墨蓝缎面"), ("产品", "暂不出现")]
    for i, (key, value) in enumerate(continuity):
        yy = base_y + 120 + i * 56
        draw.text((1770, yy), key, font=f(24, True), fill=GOLD)
        draw.text((1900, yy), value, font=f(26), fill=INK)

    draw.text((2420, base_y + 56), "剪辑入口", font=f(34, True), fill=INK)
    text_block(draw, 2420, base_y + 118, "S02C 的静止侧脸结束后，先给一个脱离室内空间的马蹄声，再切到野马的升格外景。", f(29), 1160, INK)
    draw.text((2420, base_y + 270), "禁止提前泄露", font=f(26, True), fill=GOLD)
    text_block(draw, 2420, base_y + 318, "野马、奔跑、首饰特写、品牌 Logo、台词正对镜头。", f(26), 1160, MUTED)

    draw.line((80, 2070, 3760, 2070), fill=LINE, width=2)
    draw.text((90, 2090), "VO", font=f(24, True), fill=GOLD)
    draw.text((160, 2087), "接着，需要一个看似拥有一切的女人。她绝不能直视镜头，不能笑，因为讨好观众显得太廉价。", font=f(26), fill=INK)

    output.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output, "PNG", optimize=True)
    output.with_suffix(".txt").write_text(
        "珍珠潮汐谷第二段导演画板。S02A 12–16秒栖居者出现；S02B 16–20秒不被讨好的凝视；S02C 20–24秒像在思考文明存亡。角色始终不直视镜头、不笑、不展示产品。", encoding="utf-8"
    )
    return output


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--package", required=True, type=Path)
    args = parser.parse_args()
    result = build_board(args.package, args.package / "board" / "pearl-tidal-valley-woman-board.png")
    print(result.resolve())


if __name__ == "__main__":
    main()
