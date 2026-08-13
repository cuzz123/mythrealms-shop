from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


W, H = 3840, 2160
BG, INK, MUTED, LINE, GOLD, CARD = "#F1ECE4", "#191817", "#6F6A64", "#C9BFB2", "#9B7747", "#F8F4ED"
REG, BOLD = "C:/Windows/Fonts/msyh.ttc", "C:/Windows/Fonts/msyhbd.ttc"
SHOTS = [
    ("S04A", "36–40s", "第一步离开", "departure-anchor.png", "35mm｜侧后平稳跟移", "从门廊迈出两步，第二步落到湿石，裙摆被风拉向后方。", "末帧：离开门廊，暖窗只剩一个远点。", "中风险｜两步与裙摆；不直视、不停步。"),
    ("S04B", "40–44s", "沿岸快跑", "run-anchor.png", "50mm｜平行侧向跟拍", "从左向右稳定完成三到四步，头始终看向路径。", "末帧：她从右侧离开画面。", "高风险｜单独重做腿或裙摆异常帧。"),
    ("S04C", "44–48s", "风先到达", "breath-anchor.png", "85mm｜锁定肩部近景", "停下后的胸口一次呼吸，发丝持续向左后方飞扬。", "末帧：冷光停在锁骨，为产品段预埋位置。", "低风险｜静止肖像；禁止首饰提前出现。"),
]


def f(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(BOLD if bold else REG, size=size)


def crop(path: Path, size: tuple[int, int]) -> Image.Image:
    with Image.open(path) as src:
        return ImageOps.fit(src.convert("RGB"), size, Image.Resampling.LANCZOS)


def wrap(draw: ImageDraw.ImageDraw, text: str, face: ImageFont.FreeTypeFont, width: int) -> list[str]:
    result, current = [], ""
    for char in text:
        if current and draw.textlength(current + char, font=face) > width:
            result.append(current); current = char
        else:
            current += char
    if current:
        result.append(current)
    return result


def write(draw: ImageDraw.ImageDraw, x: int, y: int, text: str, face: ImageFont.FreeTypeFont, width: int, fill: str) -> int:
    height = face.getbbox("国Ag")[3] - face.getbbox("国Ag")[1]
    for row in wrap(draw, text, face, width):
        draw.text((x, y), row, font=face, fill=fill)
        y += height + 10
    return y


def field(draw: ImageDraw.ImageDraw, x: int, y: int, name: str, value: str, width: int) -> int:
    draw.text((x, y), name, font=f(24, True), fill=GOLD)
    return write(draw, x + 145, y - 3, value, f(27), width - 145, INK) + 14


def build_board(package: Path, output: Path) -> Path:
    package, output = Path(package), Path(output)
    manifest = json.loads((package / "manifest.json").read_text(encoding="utf-8"))
    refs = package / "references"
    image = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(image)
    draw.text((86, 64), "MYTHREALMS", font=f(88), fill=INK)
    draw.text((92, 166), "L U X U R Y   M Y T H O L O G I C A L   J E W E L R Y", font=f(24), fill=MUTED)
    draw.line((86, 235, 3754, 235), fill=LINE, width=2)
    draw.text((1310, 54), "DIRECTOR BOARD  ·  FLIGHT", font=f(34), fill=MUTED)
    draw.text((1310, 104), "逃离不存在的晚宴", font=f(68, True), fill=INK)
    draw.text((1310, 188), "00:36–00:48  |  她无缘无故地跑起来", font=f(27), fill=GOLD)
    draw.text((2960, 78), manifest["id"], font=f(24), fill=MUTED)
    draw.text((2960, 124), "SHE RUNS BEFORE WE KNOW WHY", font=f(31, True), fill=INK)
    draw.text((2960, 178), "ONE WOMAN / NO HORSE / NO PRODUCT YET", font=f(20), fill=MUTED)

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
        by += 92
        by = field(draw, x + 34, by, "镜头", camera, card_w - 68)
        by = field(draw, x + 34, by, "动作", action, card_w - 68)
        by = field(draw, x + 34, by, "落点", endpoint, card_w - 68)
        field(draw, x + 34, by, "可控性", risk, card_w - 68)

    base = 1540
    draw.line((80, base, 3760, base), fill=LINE, width=2)
    image.paste(crop(refs / "breath-anchor.png", (640, 360)), (80, base + 62))
    draw.rectangle((80, base + 62, 720, base + 422), outline=LINE, width=2)
    draw.text((104, base + 84), "CHARACTER MOTION ANCHOR", font=f(24, True), fill="#FFFFFF", stroke_width=2, stroke_fill="#111111")
    draw.text((780, base + 56), "角色约束", font=f(34, True), fill=INK)
    write(draw, 780, base + 112, "同一红棕发、雀斑、深墨蓝礼服；不直视镜头，不微笑，不触摸脸或脖颈。", f(30), 820, INK)
    draw.text((780, base + 246), "跑步规则", font=f(26, True), fill=GOLD)
    write(draw, 780, base + 294, "快跑只是一条同向的三到四步动作，不转头、不跳跃、不跌倒。", f(26), 820, MUTED)
    draw.text((1770, base + 56), "速度如何被看见", font=f(34, True), fill=INK)
    entries = [("风", "发丝与裙摆向后拖拽"), ("脚", "湿石地面给出稳定节拍"), ("气", "停下后胸口的一次呼吸"), ("光", "冷天光擦过锁骨"), ("禁", "不出现马、首饰、产品或文字")]
    for n, (key, val) in enumerate(entries):
        yy = base + 120 + n * 56
        draw.text((1770, yy), key, font=f(24, True), fill=GOLD)
        draw.text((1900, yy), val, font=f(26), fill=INK)
    draw.text((2420, base + 56), "剪辑接口", font=f(34, True), fill=INK)
    write(draw, 2420, base + 118, "从上一段野马的第二次湿蹄落地切给她的第一步。S04C 的锁骨冷光，直接切到下一段珍珠项链与耳环的微距证据。", f(29), 1160, INK)
    draw.text((2420, base + 270), "Seedance 风险处理", font=f(26, True), fill=GOLD)
    write(draw, 2420, base + 318, "腿部、足部或长裙异常时只替换 S04B；出发和停下两镜维持角色身份锚点。", f(26), 1160, MUTED)
    draw.line((80, 2070, 3760, 2070), fill=LINE, width=2)
    draw.text((90, 2090), "VO", font=f(24, True), fill=GOLD)
    draw.text((160, 2087), "气氛都到这里了，让女主莫名其妙地开始狂奔，让她试图逃离一场根本不存在的顶流晚宴。", font=f(26), fill=INK)
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output, "PNG", optimize=True)
    output.with_suffix(".txt").write_text("珍珠潮汐谷第四段导演画板。S04A 第一步离开、S04B 沿岸快跑、S04C 风先到达。仅一名女主，无马，无产品。", encoding="utf-8")
    return output


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--package", required=True, type=Path)
    args = parser.parse_args()
    print(build_board(args.package, args.package / "board" / "pearl-tidal-valley-run-board.png").resolve())


if __name__ == "__main__":
    main()
