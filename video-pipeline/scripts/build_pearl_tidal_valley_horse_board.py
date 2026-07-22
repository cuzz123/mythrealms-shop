from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


W, H = 3840, 2160
BG, INK, MUTED, LINE, GOLD, CARD = "#F1ECE4", "#191817", "#6F6A64", "#C9BFB2", "#9B7747", "#F8F4ED"
REG, BOLD = "C:/Windows/Fonts/msyh.ttc", "C:/Windows/Fonts/msyhbd.ttc"
SHOTS = [
    ("S03A", "24–28s", "野马抵达", "horse-anchor.png", "50mm｜低机位极慢侧移", "全身静止，第二秒只抬头并把重心压向前腿。", "末帧：完整侧身，海在背景。", "中风险｜全身马只做抬头，禁止跑跳。"),
    ("S03B", "28–32s", "呼气与鬃毛", "horse-profile-anchor.png", "85mm｜锁定中近景", "呼出短暂白雾，左耳只轻转一次。", "末帧：眼睛与鼻孔仍为焦点。", "低风险｜静态肖像；禁止摇镜与嘶鸣。"),
    ("S03C", "32–36s", "踏过浅潮", "hoof-anchor.png", "100mm｜低机位固定", "一次前蹄落水，水花向外，第二步离开。", "末帧：向右延伸的涟漪和蹄印。", "高风险｜只重做蹄部帧；检查蹄数和水花。"),
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
    draw.text((1310, 54), "DIRECTOR BOARD  ·  SYMBOLIC FORCE", font=f(34), fill=MUTED)
    draw.text((1310, 104), "野马的隐喻", font=f(68, True), fill=INK)
    draw.text((1310, 188), "00:24–00:36  |  慢一些，再慢一些", font=f(27), fill=GOLD)
    draw.text((2960, 78), manifest["id"], font=f(24), fill=MUTED)
    draw.text((2960, 124), "POWER WITHOUT EXPLANATION", font=f(31, True), fill=INK)
    draw.text((2960, 178), "ONE HORSE / NO RIDER / NO PRODUCT", font=f(20), fill=MUTED)

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
    image.paste(crop(refs / "horse-profile-anchor.png", (640, 360)), (80, base + 62))
    draw.rectangle((80, base + 62, 720, base + 422), outline=LINE, width=2)
    draw.text((104, base + 84), "ANIMAL IDENTITY ANCHOR", font=f(24, True), fill="#FFFFFF", stroke_width=2, stroke_fill="#111111")
    draw.text((780, base + 56), "动物约束", font=f(34, True), fill=INK)
    write(draw, 780, base + 112, "仅一匹深黑棕色成年马；无骑手、无缰绳、无鞍具、无人马同框。", f(30), 820, INK)
    draw.text((780, base + 246), "升格规则", font=f(26, True), fill=GOLD)
    write(draw, 780, base + 294, "48fps 质感来自缓慢的重量与水花延迟，不来自加速或多重动作。", f(26), 820, MUTED)
    draw.text((1770, base + 56), "力量如何被看见", font=f(34, True), fill=INK)
    entries = [("毛", "风把鬃毛推向右侧"), ("气", "鼻息在冷空气中短暂显形"), ("重", "前蹄落下，水花晚半拍回落"), ("声", "风、海、两次湿蹄"), ("禁", "不神化，不拟人，不展示产品")]
    for n, (key, val) in enumerate(entries):
        yy = base + 120 + n * 56
        draw.text((1770, yy), key, font=f(24, True), fill=GOLD)
        draw.text((1900, yy), val, font=f(26), fill=INK)
    draw.text((2420, base + 56), "剪辑接口", font=f(34, True), fill=INK)
    write(draw, 2420, base + 118, "从女主静止侧脸的海风切入野马。S03C 的第二次湿蹄落地，切给下一段女主莫名其妙开始狂奔。", f(29), 1160, INK)
    draw.text((2420, base + 270), "Seedance 风险处理", font=f(26, True), fill=GOLD)
    write(draw, 2420, base + 318, "若四蹄或水花异常，仅替换 S03C；不要把问题带回全身马或头部锚点。", f(26), 1160, MUTED)
    draw.line((80, 2070, 3760, 2070), fill=LINE, width=2)
    draw.text((90, 2090), "VO", font=f(24, True), fill=GOLD)
    draw.text((160, 2087), "如果觉得太单调，我们可以牵入一匹野马。它与产品无关，但能强行暗示不可驾驭的权力。", font=f(26), fill=INK)
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output, "PNG", optimize=True)
    output.with_suffix(".txt").write_text("珍珠潮汐谷第三段导演画板。S03A 野马抵达、S03B 呼气与鬃毛、S03C 踏过浅潮。仅一匹马，无人、无骑具、无产品。", encoding="utf-8")
    return output


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--package", required=True, type=Path)
    args = parser.parse_args()
    print(build_board(args.package, args.package / "board" / "pearl-tidal-valley-horse-board.png").resolve())


if __name__ == "__main__":
    main()
