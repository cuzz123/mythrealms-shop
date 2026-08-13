from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


W, H = 3840, 2160
BG, INK, MUTED, LINE, GOLD, CARD = "#F1ECE4", "#191817", "#6F6A64", "#C9BFB2", "#9B7747", "#F8F4ED"
REG, BOLD = "C:/Windows/Fonts/msyh.ttc", "C:/Windows/Fonts/msyhbd.ttc"
SHOTS = [
    ("S05A", "48–52s", "锁骨上的答案", "necklace-reveal-anchor.png", "85mm｜固定肩颈近景", "女主已停下；风掠过头发，镜头从锁骨冷光停在项链的主坠。", "末帧：主坠第一次成为整个画面的重心。", "中风险｜仅头发和海面反光移动；不要转头。"),
    ("S05B", "52–56s", "一次轻触", "pendant-touch-anchor.png", "100mm｜极慢微距推进", "一只手从左下进入，只用拇指和食指轻轻稳住主坠一次。", "末帧：手离开画面，主坠回到自然垂落。", "高风险｜手指只出现一次；异常时单独重做。"),
    ("S05C", "56–60s", "珍珠记住海的光", "pendant-hero-anchor.png", "100mm｜锁定产品微距", "无手、无人脸；冷色反光从珍珠表面缓慢掠过。", "末帧：主坠居中且清晰，为结尾台词留出剪辑接口。", "低风险｜锁定产品结构；不加入文字或 Logo。"),
]


def f(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(BOLD if bold else REG, size=size)


def crop(path: Path, size: tuple[int, int]) -> Image.Image:
    with Image.open(path) as src:
        return ImageOps.fit(src.convert("RGB"), size, Image.Resampling.LANCZOS)


def wrap(draw: ImageDraw.ImageDraw, text: str, face: ImageFont.FreeTypeFont, width: int) -> list[str]:
    rows, current = [], ""
    for char in text:
        if current and draw.textlength(current + char, font=face) > width:
            rows.append(current)
            current = char
        else:
            current += char
    if current:
        rows.append(current)
    return rows


def write(draw: ImageDraw.ImageDraw, x: int, y: int, text: str, face: ImageFont.FreeTypeFont, width: int, fill: str) -> int:
    line_h = face.getbbox("国Ag")[3] - face.getbbox("国Ag")[1]
    for row in wrap(draw, text, face, width):
        draw.text((x, y), row, font=face, fill=fill)
        y += line_h + 10
    return y


def field(draw: ImageDraw.ImageDraw, x: int, y: int, label: str, value: str, width: int) -> int:
    draw.text((x, y), label, font=f(24, True), fill=GOLD)
    return write(draw, x + 145, y - 3, value, f(27), width - 145, INK) + 14


def build_board(package: Path, output: Path) -> Path:
    manifest = json.loads((package / "manifest.json").read_text(encoding="utf-8"))
    refs = package / "references"
    image = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(image)
    draw.text((86, 64), "MYTHREALMS", font=f(88), fill=INK)
    draw.text((92, 166), "L U X U R Y   M Y T H O L O G I C A L   J E W E L R Y", font=f(24), fill=MUTED)
    draw.line((86, 235, 3754, 235), fill=LINE, width=2)
    draw.text((1310, 54), "DIRECTOR BOARD · REVEAL", font=f(34), fill=MUTED)
    draw.text((1310, 104), "产品第一次回答问题", font=f(68, True), fill=INK)
    draw.text((1310, 188), "00:48–01:00  |  珍珠记住海的光", font=f(27), fill=GOLD)
    draw.text((2920, 78), manifest["id"], font=f(24), fill=MUTED)
    draw.text((2920, 124), "THE PRODUCT IS THE ANSWER", font=f(31, True), fill=INK)
    draw.text((2920, 178), "ONE NECKLACE / NO LOGO YET", font=f(20), fill=MUTED)

    x0, y0, card_w, gap, img_h, card_h = 80, 300, 1200, 40, 675, 1190
    for index, (sid, timecode, title, asset, camera, action, endpoint, risk) in enumerate(SHOTS):
        x = x0 + index * (card_w + gap)
        draw.rounded_rectangle((x, y0, x + card_w, y0 + card_h), radius=10, fill=CARD, outline=LINE, width=2)
        image.paste(crop(refs / asset, (card_w, img_h)), (x, y0))
        draw.rectangle((x + 24, y0 + 22, x + 178, y0 + 80), fill="#151515")
        draw.text((x + 42, y0 + 29), sid, font=f(30, True), fill="#FFFFFF")
        tw = int(draw.textlength(timecode, font=f(28, True))) + 42
        draw.rounded_rectangle((x + card_w - tw - 24, y0 + 22, x + card_w - 24, y0 + 80), radius=4, fill="#151515")
        draw.text((x + card_w - tw, y0 + 30), timecode, font=f(28, True), fill="#FFFFFF")
        by = y0 + img_h + 32
        draw.text((x + 34, by), title, font=f(42, True), fill=INK)
        draw.line((x + 34, by + 64, x + card_w - 34, by + 64), fill=LINE, width=2)
        by = field(draw, x + 34, by + 92, "镜头", camera, card_w - 68)
        by = field(draw, x + 34, by, "动作", action, card_w - 68)
        by = field(draw, x + 34, by, "落点", endpoint, card_w - 68)
        field(draw, x + 34, by, "可控性", risk, card_w - 68)

    base = 1540
    draw.line((80, base, 3760, base), fill=LINE, width=2)
    image.paste(crop(refs / "product-design-reference.png", (640, 360)), (80, base + 62))
    draw.rectangle((80, base + 62, 720, base + 422), outline=LINE, width=2)
    draw.text((104, base + 84), "PRODUCT DESIGN LOCK", font=f(24, True), fill="#FFFFFF", stroke_width=2, stroke_fill="#111111")
    draw.text((780, base + 56), "产品约束", font=f(34, True), fill=INK)
    write(draw, 780, base + 112, "细金链、簇状不规则象牙色珍珠、中央一颗大型巴洛克珍珠主坠。每一镜都按同一结构生成。", f(30), 820, INK)
    draw.text((780, base + 246), "佩戴约束", font=f(26, True), fill=GOLD)
    write(draw, 780, base + 294, "深墨蓝缎面礼服、同一位红棕卷发女主；S05A 只露肩颈，S05B 只露一只手，S05C 只见产品。", f(26), 820, MUTED)
    draw.text((1770, base + 56), "让珍珠自己说话", font=f(34, True), fill=INK)
    entries = [("光", "冷色海面反光慢慢掠过珠层"), ("手", "只轻触一次，不揉搓、不拨弄"), ("景", "背景保留深墨蓝缎面与虚化海色"), ("焦", "S05C 永远锁在主坠表面"), ("禁", "不出现马、额外首饰、文字或 Logo")]
    for n, (key, value) in enumerate(entries):
        yy = base + 120 + n * 56
        draw.text((1770, yy), key, font=f(24, True), fill=GOLD)
        draw.text((1900, yy), value, font=f(26), fill=INK)
    draw.text((2420, base + 56), "剪辑接口", font=f(34, True), fill=INK)
    write(draw, 2420, base + 118, "从 S04C 锁骨冷光硬切至 S05A 的项链同一位置。S05B 只作为触感证据；S05C 的居中主坠留给结尾台词和品牌 Logo。", f(29), 1160, INK)
    draw.text((2420, base + 270), "Seedance 风险处理", font=f(26, True), fill=GOLD)
    write(draw, 2420, base + 318, "如果链条结构、珍珠数目或手指异常，只替换对应单镜；所有重做都以产品设计锁图为第一引用。", f(26), 1160, MUTED)
    draw.line((80, 2070, 3760, 2070), fill=LINE, width=2)
    draw.text((90, 2090), "VO", font=f(24, True), fill=GOLD)
    draw.text((160, 2087), "这时候，再露出我想卖的产品。", font=f(26), fill=INK)
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output, "PNG", optimize=True)
    output.with_suffix(".txt").write_text("珍珠潮汐谷第五段导演画板。S05A 项链露出、S05B 一次轻触、S05C 主坠微距。", encoding="utf-8")
    return output


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--package", required=True, type=Path)
    args = parser.parse_args()
    print(build_board(args.package, args.package / "board" / "pearl-tidal-valley-product-board.png").resolve())


if __name__ == "__main__":
    main()
