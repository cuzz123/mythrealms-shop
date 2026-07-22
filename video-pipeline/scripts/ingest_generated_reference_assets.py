"""Ingest generated talent turnarounds and 360-degree environment images.

The source files remain in CODEX_HOME. This script copies them into the
asset library and derives the three Hunyuan input crops non-destructively.
"""

from __future__ import annotations

import json
import shutil
from pathlib import Path

from PIL import Image


ASSET_ROOT = Path(r"D:\mythrealms-shop\video-pipeline\asset-library")
RAW_ROOT = Path(r"C:\Users\11458\.codex\generated_images\019f4467-ba2f-7870-96c2-66c210cfcd72")
GENERATED_ROOT = Path(r"C:\Users\11458\.codex\generated_images\019f5b0c-ae77-7d62-8de7-db5b6f2604e8")
CARD_ROOT = ASSET_ROOT / "obsidian-vault" / "01-资产卡"
DATE = "2026-07-15"

TALENTS = [
    {
        "id": "CHAR_MR_TALENT_EBONY_LINEN_001",
        "title": "深肤色白亚麻全身模特",
        "tags": ["角色", "全身", "白亚麻", "珍珠项链", "多样化模特"],
        "reference": "exec-857fd299-0892-4e5d-b376-3a0aaf1459d0.png",
        "turnaround": "exec-d3aba549-8b72-4d61-bb17-754cf262e6a4.png",
        "description": "深肤色、短自然发、白色亚麻衬衫与阔腿裤，搭配珍珠项链。",
    },
    {
        "id": "CHAR_MR_TALENT_BOB_LINEN_001",
        "title": "短发白亚麻套装全身模特",
        "tags": ["角色", "全身", "短发", "白亚麻", "生活方式"],
        "reference": "exec-3951a0de-d4d1-462a-a1cc-244cdf6dadf3.png",
        "turnaround": "exec-d0a984f4-a91e-4263-9421-4befc94b2c05.png",
        "description": "短深色波波头、暖橄榄肤色、白色亚麻衬衫与阔腿裤。",
    },
    {
        "id": "CHAR_MR_TALENT_CURLY_LINEN_001",
        "title": "卷发珍珠耳饰亚麻长裙全身模特",
        "tags": ["角色", "全身", "卷发", "珍珠耳饰", "亚麻长裙"],
        "reference": "exec-a51f1584-5097-4007-aa51-9c9bd98ba627.png",
        "turnaround": "exec-cbab0638-4847-44c3-80e5-6e9fc09a3574.png",
        "description": "短卷发、白色亚麻长裙与珍珠花朵耳饰，适合耳饰内容预演。",
    },
    {
        "id": "CHAR_MR_TALENT_AUBURN_SATIN_001",
        "title": "红发珍珠项链缎面礼服全身模特",
        "tags": ["角色", "全身", "红发", "珍珠项链", "缎面礼服"],
        "reference": "exec-8671c748-04c8-474b-b3d6-13350108cc7e.png",
        "turnaround": "exec-8deffb95-c68f-49c4-9c11-3297be00f1f3.png",
        "description": "红棕波浪发、浅色雀斑、象牙白缎面礼服与珍珠金色项链。",
    },
]

ENVIRONMENTS = [
    {
        "id": "ENV_MR_OLIVE_COURTYARD_001",
        "title": "橄榄柠檬石灰岩庭院全景",
        "tags": ["场景", "360全景", "庭院", "橄榄", "柠檬", "石灰岩"],
        "reference": "exec-cf7b1d47-dbf0-45a9-a7c9-49a3fefc76af.png",
        "panorama": "exec-d027058a-d5d2-4c3a-8be0-3de10f362a21.png",
        "description": "白色石灰岩墙、橄榄与柠檬树、陶罐和碎石地面；正午斑驳日光。",
    },
    {
        "id": "ENV_MR_POOL_COURTYARD_001",
        "title": "棕榈水池石灰岩庭院全景",
        "tags": ["场景", "360全景", "水池", "棕榈", "石灰岩", "度假"],
        "reference": "exec-d7d229be-0b6a-44dd-81a1-f938c4bfae08.png",
        "panorama": "exec-63819d27-f642-4f91-b0b6-01c56a8e003f.png",
        "description": "浅绿色瓷砖水池、石灰岩平台、棕榈与亚麻躺椅；正午晴光。",
    },
    {
        "id": "ENV_MR_FLOWER_STOREFRONT_001",
        "title": "暖调花艺石材店面全景",
        "tags": ["场景", "360全景", "花艺", "街巷", "石材", "金色小时"],
        "reference": "exec-645bf7d4-a9a2-4f6d-8ecd-6fe30acc1493.png",
        "panorama": "exec-9395a06b-d8dd-4ba8-9efa-81a4875e3944.png",
        "description": "奶油色雨棚、老石材立面、鲜花桶和藤蔓；暖调午后自然光。",
    },
    {
        "id": "ENV_MR_SEASIDE_STAIRS_001",
        "title": "条纹伞海边石阶全景",
        "tags": ["场景", "360全景", "海边", "石阶", "条纹伞", "夏日"],
        "reference": "exec-7b46650f-80bc-4210-b421-763dfa5e8046.png",
        "panorama": "exec-3fc42251-0b2b-4dd7-a2cc-81cf5d544505.png",
        "description": "浅色风化石阶、条纹遮阳伞、海面与迷迭香花盆；明亮海岸日光。",
    },
    {
        "id": "ENV_MR_COASTAL_LINEN_ROOM_001",
        "title": "亚麻帘海景休憩室全景",
        "tags": ["场景", "360全景", "海景", "亚麻", "卧室", "自然光"],
        "reference": "exec-8b20e1bc-22cf-4460-82cc-2941595185a5.png",
        "panorama": "exec-52d3ac00-4acb-4f04-81c1-7e28c1420444.png",
        "description": "半透明亚麻帘、藤编家具、软床和海景开窗；柔和晨光。",
    },
    {
        "id": "ENV_MR_ROOFTOP_OLIVE_SUNSET_001",
        "title": "橄榄树城市屋顶日落全景",
        "tags": ["场景", "360全景", "屋顶", "橄榄", "日落", "城市天际线"],
        "reference": "exec-949a4dde-912f-4f10-8955-b85f8f5ade2c.png",
        "panorama": "exec-15caddbb-3299-48bc-bb25-ccc5da673a84.png",
        "description": "陶罐橄榄树、矮墙、长凳和历史城市天际线；金色日落。",
    },
]


def file_uri(path: Path) -> str:
    return "file:///" + path.as_posix()


def write_json(path: Path, data: dict) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_talent(asset: dict) -> None:
    asset_dir = ASSET_ROOT / "05-characters" / asset["id"]
    original_dir = asset_dir / "source" / "generated-reference"
    turnaround_dir = asset_dir / "source" / "generated-turnaround"
    crops_dir = asset_dir / "source" / "three-view-crops"
    for directory in (original_dir, turnaround_dir, crops_dir):
        directory.mkdir(parents=True, exist_ok=True)
    reference_target = original_dir / "original-reference.png"
    sheet_target = turnaround_dir / "turnaround-sheet.png"
    shutil.copy2(RAW_ROOT / asset["reference"], reference_target)
    shutil.copy2(GENERATED_ROOT / asset["turnaround"], sheet_target)
    shutil.copy2(sheet_target, asset_dir / "Thumbnail.png")

    with Image.open(sheet_target) as image:
        width, height = image.size
        for index, name in enumerate(("front.jpg", "left_front.jpg", "back.jpg")):
            crop = image.crop((index * width // 3, 0, (index + 1) * width // 3, height))
            crop.save(crops_dir / name, quality=96)

    write_json(asset_dir / "reference.json", {
        "id": asset["id"],
        "asset_type": "female_editorial_character_reference",
        "status": "reference_ready_for_hunyuan_web",
        "version": "v1",
        "generator": "Codex image generation",
        "created_at": DATE,
        "description": asset["description"],
        "files": {
            "original_reference": "source/generated-reference/original-reference.png",
            "turnaround_sheet": "source/generated-turnaround/turnaround-sheet.png",
            "front": "source/three-view-crops/front.jpg",
            "left_45": "source/three-view-crops/left_front.jpg",
            "back": "source/three-view-crops/back.jpg",
            "thumbnail": "Thumbnail.png",
        },
        "hunyuan_web_upload_order": ["front.jpg", "left_front.jpg", "back.jpg"],
        "limitations": [
            "这是图像参考资产，不含 GLB、FBX、骨骼或动作。",
            "进入混元图生3D后仍需检查发丝、手指、衣物与背面的一致性。",
        ],
    })
    (asset_dir / "Instructions.md").write_text(f"""# {asset["id"]}

{asset["description"]}

## 混元图生3D使用

1. 选择“多张图片”。
2. 按顺序上传 'front.jpg'、'left_front.jpg'、'back.jpg'。
3. 角色建议先使用 500K 面；下载 GLB 作为主格式。
4. 此卡只提供多视图参考，生成后模型状态再改为 available_unrigged。
""", encoding="utf-8")
    card = CARD_ROOT / f"{asset['id']}｜{asset['title']}.md"
    card.write_text(f"""---
id: {asset["id"]}
asset_type: character_reference
status: reference_ready_for_hunyuan_web
import_mode: image_reference
version: v1
tags: [{", ".join(asset["tags"])}]
---

# {asset["id"]}｜{asset["title"]}

![]({file_uri(asset_dir / "Thumbnail.png")})

- [原始模特参考]({file_uri(reference_target)})
- [三视图整图]({file_uri(sheet_target)})
- [正面]({file_uri(crops_dir / "front.jpg")}) · [左前 45°]({file_uri(crops_dir / "left_front.jpg")}) · [背面]({file_uri(crops_dir / "back.jpg")})
- [混元使用说明]({file_uri(asset_dir / "Instructions.md")})

## 资产状态

- 已完成：统一正面／左前 45°／背面三视图、Obsidian 预览。
- 待完成：用三视图在混元网页端生成 500K GLB，再导入 Blender 做材质和骨骼检查。
""", encoding="utf-8")


def write_environment(asset: dict) -> None:
    asset_dir = ASSET_ROOT / "03-scene-kits" / asset["id"]
    reference_dir = asset_dir / "source" / "generated-reference"
    panorama_dir = asset_dir / "panoramas"
    reference_dir.mkdir(parents=True, exist_ok=True)
    panorama_dir.mkdir(parents=True, exist_ok=True)
    reference_target = reference_dir / "original-reference.png"
    panorama_target = panorama_dir / f"{asset['id']}_360-preview.png"
    shutil.copy2(RAW_ROOT / asset["reference"], reference_target)
    shutil.copy2(GENERATED_ROOT / asset["panorama"], panorama_target)
    shutil.copy2(panorama_target, asset_dir / "Thumbnail.png")
    with Image.open(panorama_target) as image:
        width, height = image.size

    write_json(asset_dir / "environment.json", {
        "id": asset["id"],
        "asset_type": "equirectangular_world_environment",
        "status": "available_360_background",
        "version": "v1",
        "generator": "Codex image generation",
        "created_at": DATE,
        "description": asset["description"],
        "files": {
            "original_reference": "source/generated-reference/original-reference.png",
            "panorama": f"panoramas/{asset['id']}_360-preview.png",
            "thumbnail": "Thumbnail.png",
        },
        "projection": "equirectangular_2_to_1",
        "resolution_px": [width, height],
        "limitations": [
            "这是 Blender World 背景，不是可碰撞或可近景游走的几何场景。",
            "近景地面、桌面和角色投影应另用 Blender 几何与灯光补齐。",
        ],
    })
    (asset_dir / "Instructions.md").write_text(f"""# {asset["id"]}

{asset["description"]}

## Blender 调用

1. 进入 World Properties → Surface → Color。
2. 点击黄色圆点，选择 Environment Texture。
3. 载入 'panoramas/{asset["id"]}_360-preview.png'。
4. 在 Shader Editor 使用 Texture Coordinate → Mapping → Environment Texture 微调朝向。

这是 2:1 equirectangular 世界背景；它负责远景、环境反射与色温，不替代近景几何。
""", encoding="utf-8")
    card = CARD_ROOT / f"{asset['id']}｜{asset['title']}.md"
    card.write_text(f"""---
id: {asset["id"]}
asset_type: environment_background
status: available_360_background
import_mode: append_world_texture
version: v1
tags: [{", ".join(asset["tags"])}]
---

# {asset["id"]}｜{asset["title"]}

![]({file_uri(asset_dir / "Thumbnail.png")})

- [360° 全景]({file_uri(panorama_target)})
- [原始场景参考]({file_uri(reference_target)})
- [Blender 调用说明]({file_uri(asset_dir / "Instructions.md")})

## 资产状态

- 已完成：2:1 equirectangular 360° 全景，可作为 Blender 世界环境贴图。
- 注意：它不是 3D 几何；近景产品台、地面、家具与角色影子需要在 Blender 中补齐。
""", encoding="utf-8")


def main() -> None:
    CARD_ROOT.mkdir(parents=True, exist_ok=True)
    for asset in TALENTS:
        write_talent(asset)
    for asset in ENVIRONMENTS:
        write_environment(asset)
    print(f"Ingested {len(TALENTS)} talent references and {len(ENVIRONMENTS)} world environments.")


if __name__ == "__main__":
    main()
