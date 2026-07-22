from pathlib import Path
import math

from PIL import Image, ImageDraw, ImageFont, ImageEnhance


ROOT = Path("D:/Chrome_Download")
FRAME_DIR = ROOT / "mythrealms_bracelet_storyboard_frames_v3_detected_crop"
OUT_DIR = ROOT / "mythrealms_blender_renders/storyboard_transitions"
SEQ_DIR = OUT_DIR / "frame_02_to_03_motion_guide_sequence"
SEQ_DIR.mkdir(parents=True, exist_ok=True)

FRAME_02 = FRAME_DIR / "bracelet_v3_detected_frame_02.png"
FRAME_03 = FRAME_DIR / "bracelet_v3_detected_frame_03.png"
BOARD_OUT = OUT_DIR / "bracelet_frame_02_to_03_motion_board.png"
PROMPT_OUT = OUT_DIR / "bracelet_frame_02_to_03_seedance_prompt.txt"

W, H = 1080, 1920
FPS = 24
N = 96


def font(size):
    for candidate in (
        "C:/Windows/Fonts/msyh.ttc",
        "C:/Windows/Fonts/simhei.ttf",
        "C:/Windows/Fonts/arial.ttf",
    ):
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


FONT_L = font(42)
FONT_M = font(30)
FONT_S = font(24)


def smoothstep(x):
    x = max(0.0, min(1.0, x))
    return x * x * (3 - 2 * x)


def cover(im, scale_extra=1.0, dx=0, dy=0, width=W, height=H):
    iw, ih = im.size
    base = max(width / iw, height / ih) * scale_extra
    nw, nh = int(iw * base), int(ih * base)
    resized = im.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (width, height), (13, 10, 8))
    x = (width - nw) // 2 + int(dx)
    y = (height - nh) // 2 + int(dy)
    canvas.paste(resized, (x, y))
    return canvas


def arrow(draw, xy1, xy2, color=(255, 214, 117), width=8):
    x1, y1 = xy1
    x2, y2 = xy2
    draw.line((x1, y1, x2, y2), fill=color, width=width)
    angle = math.atan2(y2 - y1, x2 - x1)
    head = 28
    spread = 0.55
    p1 = (x2 - head * math.cos(angle - spread), y2 - head * math.sin(angle - spread))
    p2 = (x2 - head * math.cos(angle + spread), y2 - head * math.sin(angle + spread))
    draw.polygon((xy2, p1, p2), fill=color)


def label(draw, xy, text, fill=(255, 244, 219)):
    x, y = xy
    pad = 12
    bbox = draw.multiline_textbbox((x, y), text, font=FONT_S, spacing=6)
    draw.rounded_rectangle(
        (bbox[0] - pad, bbox[1] - pad, bbox[2] + pad, bbox[3] + pad),
        radius=14,
        fill=(0, 0, 0, 150),
        outline=(255, 214, 117, 180),
        width=2,
    )
    draw.multiline_text((x, y), text, font=FONT_S, fill=fill, spacing=6)


def annotate(frame, t, phase_text, strong=False):
    overlay = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay, "RGBA")
    d.rectangle((0, 0, W, 145), fill=(0, 0, 0, 110))
    d.text((42, 34), phase_text, font=FONT_L, fill=(255, 244, 219, 255))
    d.text((42, 92), "02 -> 03: 右前方推近 + 模特低头整理头发 + 手链始终面向镜头", font=FONT_S, fill=(255, 225, 170, 255))

    # Camera move: screen-space direction from frame 02 side profile to frame 03 close-up.
    arrow(d, (165, 1660), (390, 1460), color=(90, 204, 255, 230), width=10)
    label(d, (82, 1688), "CAMERA\n向右前方推近\n从侧脸到脸侧近景", fill=(220, 246, 255, 255))

    # Head/chin movement.
    arrow(d, (775, 515), (708, 650), color=(255, 207, 95, 230), width=8)
    label(d, (735, 390), "HEAD\n下颌微收\n视线向下", fill=(255, 241, 205, 255))

    # Wrist/bracelet movement: shoulder to hairline.
    arrow(d, (646, 1050), (497, 600), color=(95, 255, 182, 230), width=10)
    label(d, (625, 1090), "WRIST\n手从锁骨滑向发髻\n手链停在脸侧高光区", fill=(220, 255, 238, 255))

    # Product lock zone.
    d.ellipse((420, 635, 675, 890), outline=(95, 255, 182, 230), width=5)
    d.text((438, 885), "bracelet hero zone", font=FONT_S, fill=(220, 255, 238, 255))

    if strong:
        d.rectangle((32, 160, W - 32, H - 32), outline=(255, 214, 117, 220), width=5)

    return Image.alpha_composite(frame.convert("RGBA"), overlay).convert("RGB")


def make_motion_frame(img2, img3, i):
    t = i / (N - 1)
    action = smoothstep((t - 0.18) / 0.64)

    # This is not a fake final animation; it is a director's blocking preview.
    # The frame mix only shows timing and framing while annotations explain the real action.
    f2 = cover(img2, 1.00 + 0.08 * t, dx=-46 * t, dy=18 * t)
    f3 = cover(img3, 1.055 - 0.02 * t, dx=50 * (1 - t), dy=-14 * (1 - t))
    mixed = Image.blend(f2, f3, action)
    mixed = ImageEnhance.Brightness(mixed).enhance(1.0 + 0.03 * math.sin(math.pi * t))

    if t < 0.18:
        phase = "1 起势：手在肩颈，侧脸闭眼，先停 0.5 秒"
    elif t < 0.42:
        phase = "2 动作启动：镜头向右前推，手腕离开肩颈"
    elif t < 0.68:
        phase = "3 主动作：手指进入发髻，手链经过脸侧高光"
    elif t < 0.86:
        phase = "4 收束：模特低头，脸部变近，手链稳定在画面中心"
    else:
        phase = "5 落幅：保持第 3 帧构图，不要跳切"
    return annotate(mixed, t, phase, strong=(i % 24 == 0))


def make_board(img2, img3):
    thumb_w, thumb_h = 420, 746
    board = Image.new("RGB", (1440, 1960), (16, 12, 10))
    draw = ImageDraw.Draw(board, "RGBA")
    draw.text((46, 34), "Frame 02 -> 03 Motion Blocking", font=FONT_L, fill=(255, 242, 218, 255))
    draw.text((46, 92), "目标不是淡化转场，而是给视频模型明确：镜头怎样动，模特怎样动，手链在哪里成为主角。", font=FONT_S, fill=(230, 205, 170, 255))

    times = [0, 0.18, 0.36, 0.58, 0.78, 1.0]
    titles = [
        "A 起幅",
        "B 镜头启动",
        "C 手腕上移",
        "D 近脸高光",
        "E 手入发髻",
        "F 落幅",
    ]
    notes = [
        "侧脸闭眼，手搭肩颈",
        "相机右前方推近",
        "手腕从锁骨向耳后移动",
        "手链掠过脸侧光区",
        "手指插入发髻，低头",
        "定格第3帧近景",
    ]
    for idx, t in enumerate(times):
        i = int(t * (N - 1))
        panel = make_motion_frame(img2, img3, i).resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        x = 46 + (idx % 3) * 464
        y = 168 + (idx // 3) * 858
        board.paste(panel, (x, y))
        draw.rectangle((x, y, x + thumb_w, y + thumb_h), outline=(255, 214, 117, 180), width=3)
        draw.text((x, y + thumb_h + 18), titles[idx], font=FONT_M, fill=(255, 240, 215, 255))
        draw.text((x, y + thumb_h + 60), notes[idx], font=FONT_S, fill=(225, 205, 178, 255))
    board.save(BOARD_OUT)


def write_prompt():
    PROMPT_OUT.write_text(
        """严格使用起幅图片和落幅图片生成 5 秒竖屏珠宝广告镜头。不要做淡入淡出，不要跳切，不要突然换姿势。

镜头运动：
从第 2 帧的侧脸中景开始，镜头向模特右前方缓慢推近并轻微右移，最终到第 3 帧的脸侧近景。运动是连续一镜到底，速度前慢后稳，不能闪白、不能交叉淡化。

模特动作：
模特从闭眼侧脸姿态开始，右手原本搭在肩颈/锁骨附近。她缓慢低头，手腕离开肩颈，手指沿着耳后方向滑入发髻，像是在整理头发。动作幅度优雅克制，不要双手抬起，不要新增另一只手。

产品要求：
手链是画面主角。保持白色珍珠、珍珠花簇、深绿色珠子、金色链扣的结构不变。手腕上移时，手链必须始终清晰可见，并在脸侧暖光区域形成高光。不要让手链融化、变成项链、变成戒指或消失。

画面风格：
真实奢侈品广告，温室暖阳，浅奶油色蕾丝裙，浅景深，柔和金色逆光。保持同一个成年女性模特、同一发型、同一场景、同一光线方向。

禁止：
禁止跳切、闪烁、黑屏、淡化转场、突然变脸、手指畸形、手链变形、两只手同时抬起、产品丢失、文字、水印、logo。
""",
        encoding="utf-8",
    )


def main():
    img2 = Image.open(FRAME_02).convert("RGB")
    img3 = Image.open(FRAME_03).convert("RGB")
    make_board(img2, img3)
    write_prompt()
    for i in range(N):
        make_motion_frame(img2, img3, i).save(SEQ_DIR / f"frame_{i + 1:04d}.png")
    print(BOARD_OUT)
    print(SEQ_DIR)
    print(PROMPT_OUT)


if __name__ == "__main__":
    main()
