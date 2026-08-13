from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


CANVAS = (3840, 2160)
BG = "#F1ECE4"
INK = "#191817"
MUTED = "#6F6A64"
HAIRLINE = "#C9BFB2"
GOLD = "#9B7747"
CARD = "#F8F4ED"
FONT_REGULAR = Path("C:/Windows/Fonts/msyh.ttc")
FONT_BOLD = Path("C:/Windows/Fonts/msyhbd.ttc")


SHOTS = [
    {
        "id": "S01A",
        "time": "0–4s",
        "title": "未知海岛建立",
        "image": "world-anchor.png",
        "scene": "黎明前的湿黑玄武岩群岛，中央海蚀峡谷构成唯一前进路径。",
        "camera": "24mm 航拍广角｜缓慢前推 + 轻微下降",
        "endpoint": "末帧：中央峡谷清晰对齐，承接下一镜。",
        "control": "低风险｜单一镜头运动；锁岛体轮廓与真实海水。",
    },
    {
        "id": "S01B",
        "time": "4–8s",
        "title": "进入海蚀峡谷",
        "image": "ravine-anchor.png",
        "scene": "低空进入峡谷，珍珠母色只存在于掠射光下的细薄矿物层。",
        "camera": "35mm｜水平低空直线穿行",
        "endpoint": "末帧：出口第一次出现极小的别墅剪影。",
        "control": "中风险｜锁两侧岩壁；禁止霓虹矿洞与左右摆动。",
    },
    {
        "id": "S01C",
        "time": "8–12s",
        "title": "悬崖别墅揭示",
        "image": "villa-anchor.png",
        "scene": "黑曜石与无框玻璃别墅嵌入悬崖，整栋建筑只有一扇暖窗。",
        "camera": "50mm｜前景岩石后缓慢横向揭示",
        "endpoint": "末帧：减速停稳，暖窗落在右上三分区。",
        "control": "高风险｜双参考分工；锁建筑轮廓、层数、窗格与唯一暖窗。",
    },
]


ACCESSIBILITY = """MYTHREALMS｜珍珠潮汐谷首段导演画板｜00:00–00:12

旁白：一条高级的广告，一开始都必须从大众未见过的风景开始。卖什么不重要，但得制造一种人们想要的生活幻觉。

S01A 0–4s｜未知海岛建立
场景：黎明前的湿黑玄武岩群岛，中央海蚀峡谷构成唯一前进路径。
摄影机：24mm 航拍广角，缓慢前推并轻微下降。
末帧：中央峡谷清晰对齐，承接下一镜。

S01B 4–8s｜进入海蚀峡谷
场景：低空进入峡谷，珍珠母色只存在于掠射光下的细薄矿物层。
摄影机：35mm，水平低空直线穿行。
末帧：出口第一次出现极小的别墅剪影。

S01C 8–12s｜悬崖别墅揭示
场景：黑曜石与无框玻璃别墅嵌入悬崖，整栋建筑只有一扇暖窗。
摄影机：50mm，从前景岩石后缓慢横向揭示。
末帧：减速停稳，暖窗落在右上三分区。

统一约束：黎明前、低云、冷灰海面、湿黑玄武岩、风向一致；本段无人物、无产品、无马、无文字与 Logo。珍珠母层只作材质隐喻，不出现巨型珍珠或贝壳建筑。
"""


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    path = FONT_BOLD if bold else FONT_REGULAR
    return ImageFont.truetype(str(path), size=size)


def wrap(draw: ImageDraw.ImageDraw, text: str, face: ImageFont.FreeTypeFont, width: int) -> list[str]:
    lines: list[str] = []
    current = ""
    for char in text:
        candidate = current + char
        if current and draw.textlength(candidate, font=face) > width:
            lines.append(current)
            current = char
        else:
            current = candidate
    if current:
        lines.append(current)
    return lines


def draw_wrapped(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    text: str,
    face: ImageFont.FreeTypeFont,
    fill: str,
    width: int,
    spacing: int = 12,
    max_lines: int | None = None,
) -> int:
    x, y = xy
    lines = wrap(draw, text, face, width)
    if max_lines is not None:
        lines = lines[:max_lines]
    line_height = face.getbbox("国Ag")[3] - face.getbbox("国Ag")[1]
    for line in lines:
        draw.text((x, y), line, font=face, fill=fill)
        y += line_height + spacing
    return y


def cover(path: Path, size: tuple[int, int]) -> Image.Image:
    with Image.open(path) as source:
        return ImageOps.fit(
            source.convert("RGB"),
            size,
            method=Image.Resampling.LANCZOS,
            centering=(0.5, 0.5),
        )


def label_value(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    label: str,
    value: str,
    width: int,
) -> int:
    label_face = font(24, True)
    value_face = font(28)
    draw.text((x, y), label, font=label_face, fill=GOLD)
    return draw_wrapped(
        draw,
        (x + 150, y - 2),
        value,
        value_face,
        INK,
        width - 150,
        spacing=8,
        max_lines=2,
    )


def build_board(package_root: Path, output: Path) -> Path:
    package_root = Path(package_root)
    output = Path(output)
    manifest = json.loads((package_root / "manifest.json").read_text(encoding="utf-8"))
    references = package_root / "references"

    canvas = Image.new("RGB", CANVAS, BG)
    draw = ImageDraw.Draw(canvas)

    # Header
    draw.text((86, 64), "MYTHREALMS", font=font(88), fill=INK)
    draw.text((92, 166), "L U X U R Y   M Y T H O L O G I C A L   J E W E L R Y", font=font(24), fill=MUTED)
    draw.line((86, 235, 3754, 235), fill=HAIRLINE, width=2)
    draw.text((1380, 54), "DIRECTOR BOARD  ·  OPENING 01", font=font(34), fill=MUTED)
    draw.text((1380, 104), "珍珠潮汐谷", font=font(68, True), fill=INK)
    draw.text((1380, 188), "00:00–00:12  |  三段 I2V 顺接", font=font(27), fill=GOLD)
    draw.text((3030, 78), manifest.get("id", ""), font=font(24), fill=MUTED)
    draw.text((3030, 124), "世界先行，产品暂不出场", font=font(34, True), fill=INK)
    draw.text((3030, 178), "COLD BASALT · SILVER SEA · ONE WARM WINDOW", font=font(20), fill=MUTED)

    # Shot cards
    margin = 80
    gap = 40
    card_w = 1200
    card_y = 300
    image_h = 675
    card_h = 1190
    for index, shot in enumerate(SHOTS):
        x = margin + index * (card_w + gap)
        draw.rounded_rectangle((x, card_y, x + card_w, card_y + card_h), radius=10, fill=CARD, outline=HAIRLINE, width=2)
        frame = cover(references / shot["image"], (card_w, image_h))
        canvas.paste(frame, (x, card_y))
        # Frame labels
        draw.rectangle((x + 24, card_y + 22, x + 176, card_y + 80), fill=(20, 20, 20))
        draw.text((x + 42, card_y + 29), shot["id"], font=font(30, True), fill="#FFFFFF")
        time_width = int(draw.textlength(shot["time"], font=font(28, True))) + 42
        draw.rounded_rectangle((x + card_w - time_width - 24, card_y + 22, x + card_w - 24, card_y + 80), radius=4, fill=(20, 20, 20))
        draw.text((x + card_w - time_width, card_y + 30), shot["time"], font=font(28, True), fill="#FFFFFF")

        body_y = card_y + image_h + 32
        draw.text((x + 34, body_y), shot["title"], font=font(42, True), fill=INK)
        draw.line((x + 34, body_y + 64, x + card_w - 34, body_y + 64), fill=HAIRLINE, width=2)
        body_y += 92
        for label, key in (("场景", "scene"), ("镜头", "camera"), ("落点", "endpoint"), ("可控性", "control")):
            body_y = label_value(draw, x + 34, body_y, label, shot[key], card_w - 68)
            body_y += 18

    # Bottom strip
    bottom_y = 1540
    draw.line((80, bottom_y, 3760, bottom_y), fill=HAIRLINE, width=2)

    material = cover(references / "material-anchor.png", (620, 350))
    canvas.paste(material, (80, bottom_y + 62))
    draw.rectangle((80, bottom_y + 62, 700, bottom_y + 412), outline=HAIRLINE, width=2)
    draw.text((102, bottom_y + 84), "MATERIAL ANCHOR", font=font(24, True), fill="#FFFFFF", stroke_width=2, stroke_fill="#111111")

    info_x = 750
    draw.text((info_x, bottom_y + 56), "材质语法", font=font(34, True), fill=INK)
    draw_wrapped(draw, (info_x, bottom_y + 112), "湿黑玄武岩 / 真实银灰海沫 / 掠射光下的细薄珍珠母矿物层", font(27), INK, 710, spacing=10)
    draw.text((info_x, bottom_y + 248), "禁止", font=font(26, True), fill=GOLD)
    draw_wrapped(draw, (info_x, bottom_y + 294), "巨型珍珠、贝壳宫殿、霓虹矿洞、魔法发光、科幻建筑", font(25), MUTED, 710, spacing=10)

    palette_x = 1560
    draw.text((palette_x, bottom_y + 56), "色彩连续性", font=font(34, True), fill=INK)
    swatches = [
        ("玄武黑", "#11161B"),
        ("云层蓝灰", "#697685"),
        ("海面银", "#AAB4BD"),
        ("珍珠粉", "#D8C3C8"),
        ("唯一暖窗", "#C88943"),
    ]
    for i, (name, colour) in enumerate(swatches):
        sx = palette_x + i * 155
        draw.rounded_rectangle((sx, bottom_y + 118, sx + 124, bottom_y + 236), radius=6, fill=colour, outline=HAIRLINE, width=1)
        draw.text((sx, bottom_y + 256), name, font=font(19), fill=MUTED)

    progression_x = 2400
    draw.text((progression_x, bottom_y + 56), "镜头递进", font=font(34, True), fill=INK)
    nodes = [
        ("24mm", "高空前推", "S01A"),
        ("35mm", "低空直行", "S01B"),
        ("50mm", "横移揭示", "S01C"),
    ]
    for i, (lens, move, sid) in enumerate(nodes):
        nx = progression_x + i * 310
        draw.ellipse((nx, bottom_y + 130, nx + 120, bottom_y + 250), fill="#FFFFFF", outline=GOLD, width=4)
        tw = draw.textlength(lens, font=font(25, True))
        draw.text((nx + 60 - tw / 2, bottom_y + 158), lens, font=font(25, True), fill=INK)
        draw.text((nx + 2, bottom_y + 276), f"{sid} · {move}", font=font(22), fill=MUTED)
        if i < len(nodes) - 1:
            draw.line((nx + 136, bottom_y + 190, nx + 292, bottom_y + 190), fill=GOLD, width=3)
            draw.polygon([(nx + 292, bottom_y + 190), (nx + 270, bottom_y + 179), (nx + 270, bottom_y + 201)], fill=GOLD)

    # Narration footer
    draw.line((80, 2070, 3760, 2070), fill=HAIRLINE, width=2)
    draw.text((90, 2090), "VO", font=font(24, True), fill=GOLD)
    draw.text((160, 2087), "一条高级的广告，一开始都必须从大众未见过的风景开始。卖什么不重要，但得制造一种人们想要的生活幻觉。", font=font(26), fill=INK)

    output.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output, "PNG", optimize=True)
    output.with_suffix(".txt").write_text(ACCESSIBILITY, encoding="utf-8")
    return output


def main() -> None:
    parser = argparse.ArgumentParser(description="Build the Pearl Tidal Valley director board")
    parser.add_argument("--package", required=True, type=Path)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    output = args.output or args.package / "board" / "pearl-tidal-valley-opening-board.png"
    result = build_board(args.package, output)
    print(result.resolve())


if __name__ == "__main__":
    main()
