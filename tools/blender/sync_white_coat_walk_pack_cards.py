from __future__ import annotations

import copy
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
LIBRARY = ROOT / "video-pipeline" / "asset-library"
PACK_ID = "WHITE_COAT_WALK_PACK_001"
PACK_DIR = LIBRARY / "06-motions" / PACK_ID
PACK_BLEND = PACK_DIR / "WHITE_COAT_WALK_PACK_v1.blend"
MANIFEST_PATH = PACK_DIR / "motion_manifest.json"
REVIEW_SHEET = PACK_DIR / "preview" / "WHITE_COAT_WALK_REVIEW_SHEET.png"
COMBINED_REEL = PACK_DIR / "preview" / "WHITE_COAT_WALK_ALL_3_REVIEW.mp4"
CHARACTER_ID = "CHAR_HUNYUAN_WHITE_COAT_FULLBODY_001"
CHARACTER_DIR = LIBRARY / "05-characters" / CHARACTER_ID
CARDS_DIR = LIBRARY / "obsidian-vault" / "01-资产卡"
INDEX_PATH = LIBRARY / "obsidian-vault" / "00-首页" / "白色长外套全身模特走路测试包索引.md"
REGISTRY_PATH = LIBRARY / "registry" / "assets.json"
INVALID_FILENAME = re.compile(r'[\\/:*?"<>|]')
SECTION_MARKER = "<!-- WHITE_COAT_WALK_PACK_001 -->"


def file_uri(path: Path) -> str:
    return f"file:///{path.resolve().as_posix()}"


def safe_name(value: str) -> str:
    return INVALID_FILENAME.sub("_", value).strip()


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.rstrip() + "\n", encoding="utf-8")


def merge_unique(existing: list, generated: list) -> list:
    merged = copy.deepcopy(existing)
    for value in generated:
        if value not in merged:
            merged.append(copy.deepcopy(value))
    return merged


def merge_registry_entry(existing: dict | None, generated: dict) -> dict:
    if existing is None:
        return copy.deepcopy(generated)
    merged = copy.deepcopy(existing)
    for key, value in generated.items():
        if key in ("source_paths", "tags", "quality_gate"):
            merged[key] = merge_unique(merged.get(key, []), value)
        elif key == "usage":
            usage = merged.setdefault("usage", {})
            for usage_key, usage_value in value.items():
                if usage_key == "suitable_for":
                    usage[usage_key] = merge_unique(
                        usage.get(usage_key, []), usage_value
                    )
                else:
                    usage.setdefault(usage_key, copy.deepcopy(usage_value))
        else:
            merged.setdefault(key, copy.deepcopy(value))
    return merged


def thumbnail_path(item: dict) -> Path:
    return PACK_DIR / item["checkpoint_dir"] / "frame_0048.png"


def motion_instructions(item: dict) -> str:
    preview = PACK_DIR / item["review_clip"]
    thumbnail = thumbnail_path(item)
    return f"""# {item['action_id']}｜{item['name_zh']}

- **状态：** candidate（候选待审）
- **质检：** pending_visual_review
- **角色：** `{item['character_id']}`
- **骨架：** `{item['rig']}`
- **配套镜头：** `{item['camera_id']}`（{item['camera_name_zh']}）
- **规格：** {item['frames']} 帧 @ {item['fps']} fps，共 4 秒

## 文件

- [动作预览]({file_uri(preview)})
- [动作中段帧]({file_uri(thumbnail)})
- [整包审片视频]({file_uri(COMBINED_REEL)})
- [九帧审片表]({file_uri(REVIEW_SHEET)})
- [Blender 动作包]({file_uri(PACK_BLEND)})
- [动作清单]({file_uri(MANIFEST_PATH)})

## 调用

从动作包 Blend 的 `Action` 数据块追加 `{item['action_id']}`，应用到 `{item['rig']}`。该动作使用 `root` 推进、左右 `foot_ik.*` 落脚和 `knee_pole.*` 膝盖朝向控制；不要直接移动高精度网格。

当前仅作为长外套全身步态候选。正式用于广告前，需要动态复核脚底滑动、膝盖朝向、重心转移和外套遮挡。
"""


def camera_instructions(item: dict) -> str:
    preview = PACK_DIR / item["review_clip"]
    thumbnail = thumbnail_path(item)
    return f"""# {item['camera_id']}｜{item['camera_name_zh']}

- **状态：** candidate（候选待审）
- **质检：** pending_visual_review
- **配套动作：** `{item['action_id']}`（{item['name_zh']}）
- **角色：** `{item['character_id']}`
- **规格：** {item['frames']} 帧 @ {item['fps']} fps，共 4 秒

## 文件

- [镜头预览]({file_uri(preview)})
- [镜头中段帧]({file_uri(thumbnail)})
- [整包审片视频]({file_uri(COMBINED_REEL)})
- [九帧审片表]({file_uri(REVIEW_SHEET)})
- [Blender 动作包]({file_uri(PACK_BLEND)})
- [动作清单]({file_uri(MANIFEST_PATH)})

## 调用

从动作包 Blend 的 `Object` 数据块追加 `{item['camera_id']}` 和对应 `FOCUS_*` 对焦物体，将场景相机切换到该 Camera。焦距保持在 55–75 mm，景深焦点绑定角色上身。
"""


def obsidian_card(item: dict, kind: str) -> str:
    if kind == "motion":
        asset_id = item["action_id"]
        name = item["name_zh"]
        asset_type = "motion"
        pair_label = "配套镜头"
        pair_id = item["camera_id"]
        instructions = LIBRARY / "06-motions" / asset_id / "Instructions.md"
    else:
        asset_id = item["camera_id"]
        name = item["camera_name_zh"]
        asset_type = "camera_rig"
        pair_label = "配套动作"
        pair_id = item["action_id"]
        instructions = LIBRARY / "02-camera-rigs" / asset_id / "Instructions.md"
    preview = PACK_DIR / item["review_clip"]
    thumbnail = thumbnail_path(item)
    return f"""---
id: {asset_id}
asset_type: {asset_type}
status: candidate
qc_status: pending_visual_review
character: {item['character_id']}
tags: [白色长外套, 全身模特, 走路测试, 候选待审]
---

# {name}

![]({file_uri(thumbnail)})

- **{pair_label}：** `{pair_id}`
- [4 秒动态预览]({file_uri(preview)})
- [12 秒整包审片]({file_uri(COMBINED_REEL)})
- [九帧审片表]({file_uri(REVIEW_SHEET)})
- [Blender 动作包]({file_uri(PACK_BLEND)})
- [资产说明]({file_uri(instructions)})

状态：**候选待审**。数值质检不替代动态视觉验收。
"""


def pack_instructions(motions: list[dict]) -> str:
    rows = "\n".join(
        f"| {int(item['index']):02d} | `{item['action_id']}` | {item['name_zh']} | "
        f"`{item['camera_id']}` | {item['camera_name_zh']} |"
        for item in motions
    )
    return f"""# {PACK_ID}｜白色长外套全身走路动作镜头测试包

- **状态：** candidate_review（候选待审）
- **角色：** `{CHARACTER_ID}`
- **内容：** 3 个全身走路 Action + 3 个配套 Camera
- **规格：** 每段 96 帧 @ 24 fps，共 4 秒；合并审片 12 秒

## 资产

| # | 动作 ID | 动作 | 镜头 ID | 镜头 |
|---:|---|---|---|---|
{rows}

## 文件

- [12 秒整包审片]({file_uri(COMBINED_REEL)})
- [3×9 关键帧审片表]({file_uri(REVIEW_SHEET)})
- [Blender 动作包]({file_uri(PACK_BLEND)})
- [动作清单]({file_uri(MANIFEST_PATH)})

## 验收边界

当前仅完成结构、脚底落点、镜头构图和关键帧连续性检查。正式升为 `approved` 前，仍需在连续播放中复核滑步、重心切换、膝盖方向、手臂摆动和长外套变形。
"""


def pack_card(motions: list[dict]) -> str:
    links = "\n".join(
        f"- [[{item['action_id']}｜{item['name_zh']}]] / "
        f"[[{item['camera_id']}｜{item['camera_name_zh']}]]"
        for item in motions
    )
    return f"""---
id: {PACK_ID}
asset_type: motion_camera_pack
status: candidate_review
character: {CHARACTER_ID}
tags: [白色长外套, 全身模特, 走路动作, 镜头包, 候选待审]
---

# 白色长外套全身走路动作镜头测试包

![]({file_uri(REVIEW_SHEET)})

- [12 秒整包审片]({file_uri(COMBINED_REEL)})
- [Blender 动作包]({file_uri(PACK_BLEND)})
- [动作清单]({file_uri(MANIFEST_PATH)})
- [整包说明]({file_uri(PACK_DIR / 'Instructions.md')})

{links}

状态：**候选待审**。三组动作尚未由用户动态验收。
"""


def build_index(motions: list[dict]) -> str:
    rows = "\n".join(
        f"| {int(item['index']):02d} | [[{item['action_id']}｜{item['name_zh']}]] | "
        f"[[{item['camera_id']}｜{item['camera_name_zh']}]] | 候选待审 |"
        for item in motions
    )
    return f"""---
type: asset-index
character: {CHARACTER_ID}
pack: {PACK_ID}
---

# 白色长外套全身模特走路测试包索引

- [12 秒整包审片]({file_uri(COMBINED_REEL)})
- [3×9 关键帧审片表]({file_uri(REVIEW_SHEET)})
- [Blender 动作包]({file_uri(PACK_BLEND)})

| # | 动作资产 | 镜头资产 | 状态 |
|---:|---|---|---|
{rows}
"""


def registry_entry(item: dict, kind: str) -> dict:
    if kind == "motion":
        asset_id = item["action_id"]
        name = item["name_zh"]
        category = "motion"
        suitable_for = ["全身台步预演", "长外套行走测试", "模特广告走位"]
    else:
        asset_id = item["camera_id"]
        name = item["camera_name_zh"]
        category = "camera_rig"
        suitable_for = ["全身走路跟拍", "模特台步预演", "动作验收"]
    return {
        "id": asset_id,
        "name": name,
        "category": category,
        "status": "candidate",
        "version": "v1",
        "source_paths": [
            f"../06-motions/{PACK_ID}/WHITE_COAT_WALK_PACK_v1.blend",
            f"../06-motions/{PACK_ID}/{item['review_clip']}",
            f"../06-motions/{PACK_ID}/preview/WHITE_COAT_WALK_REVIEW_SHEET.png",
        ],
        "tags": ["white-coat", "fullbody", "walk", "candidate"],
        "usage": {
            "default_import": "append",
            "character_id": CHARACTER_ID,
            "paired_asset": item["camera_id"] if kind == "motion" else item["action_id"],
            "suitable_for": suitable_for,
        },
        "quality_gate": [
            "脚底落点数值验证通过",
            "连续播放复核滑步与重心",
            "用户验收后才能升为 approved",
        ],
        "notes": "96 帧、24 fps、4 秒；当前为白色长外套全身模特走路候选资产。",
    }


def sync_registry(motions: list[dict]) -> None:
    registry = json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))
    by_id = {item["id"]: item for item in registry["assets"]}
    for item in motions:
        by_id[item["action_id"]] = merge_registry_entry(
            by_id.get(item["action_id"]), registry_entry(item, "motion")
        )
        by_id[item["camera_id"]] = merge_registry_entry(
            by_id.get(item["camera_id"]), registry_entry(item, "camera")
        )
    generated_pack = {
        "id": PACK_ID,
        "name": "白色长外套全身走路动作镜头测试包",
        "category": "motion_camera_pack",
        "status": "candidate_review",
        "version": "v1",
        "source_paths": [
            f"../06-motions/{PACK_ID}/WHITE_COAT_WALK_PACK_v1.blend",
            f"../06-motions/{PACK_ID}/motion_manifest.json",
            f"../06-motions/{PACK_ID}/preview/WHITE_COAT_WALK_REVIEW_SHEET.png",
            f"../06-motions/{PACK_ID}/preview/WHITE_COAT_WALK_ALL_3_REVIEW.mp4",
        ],
        "tags": ["motion-pack", "camera-pack", "white-coat", "fullbody", "walk"],
        "usage": {
            "default_import": "append",
            "character_id": CHARACTER_ID,
            "suitable_for": ["全身台步预演", "长外套走路测试", "模特镜头调度"],
        },
        "quality_gate": [
            "3个动作与3个镜头完整存在",
            "脚底落点和停步保持数值验证通过",
            "连续播放由用户验收",
        ],
        "notes": "候选测试包；不得在用户动态验收前标记 approved。",
    }
    by_id[PACK_ID] = merge_registry_entry(by_id.get(PACK_ID), generated_pack)
    character = by_id.get(CHARACTER_ID)
    if character is not None:
        character["rig_status"] = "rigged_candidate"
        character.setdefault("usage", {})["walk_pack"] = PACK_ID
        character.setdefault("source_paths", [])
        for source in (
            f"../06-motions/{PACK_ID}/WHITE_COAT_WALK_PACK_v1.blend",
            f"../06-motions/{PACK_ID}/preview/WHITE_COAT_WALK_ALL_3_REVIEW.mp4",
        ):
            if source not in character["source_paths"]:
                character["source_paths"].append(source)
    original_ids = [item["id"] for item in registry["assets"]]
    new_ids = [
        asset_id
        for item in motions
        for asset_id in (item["action_id"], item["camera_id"])
    ] + [PACK_ID]
    registry["assets"] = [by_id[asset_id] for asset_id in original_ids]
    registry["assets"].extend(by_id[asset_id] for asset_id in new_ids if asset_id not in original_ids)
    registry["updated"] = "2026-07-17"
    write_text(REGISTRY_PATH, json.dumps(registry, ensure_ascii=False, indent=2))


def append_character_links() -> None:
    section = f"""

{SECTION_MARKER}
## 走路动作候选包

- [3 组走路动作与镜头审片]({file_uri(COMBINED_REEL)})
- [关键帧审片表]({file_uri(REVIEW_SHEET)})
- [走路动作 Blend]({file_uri(PACK_BLEND)})
- [走路动作清单]({file_uri(MANIFEST_PATH)})

当前 3 组走路动作均为 `candidate`，需要连续播放验收后才能升为正式资产。
"""
    for path in (
        CHARACTER_DIR / "Instructions.md",
        next(CARDS_DIR.glob(f"{CHARACTER_ID}｜*.md")),
    ):
        content = path.read_text(encoding="utf-8")
        if SECTION_MARKER not in content:
            write_text(path, content.rstrip() + section)

    model_path = CHARACTER_DIR / "model.json"
    model = json.loads(model_path.read_text(encoding="utf-8"))
    model["status"] = "rigged_candidate"
    model.setdefault("rig", {})["walk_pack_candidate"] = {
        "id": PACK_ID,
        "file": "../../06-motions/WHITE_COAT_WALK_PACK_001/WHITE_COAT_WALK_PACK_v1.blend",
        "action_count": 3,
        "camera_count": 3,
        "status": "candidate_review",
        "combined_reel": "../../06-motions/WHITE_COAT_WALK_PACK_001/preview/WHITE_COAT_WALK_ALL_3_REVIEW.mp4",
    }
    write_text(model_path, json.dumps(model, ensure_ascii=False, indent=2))


def main() -> None:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    motions = sorted(manifest["motions"], key=lambda item: int(item["index"]))
    if len(motions) != 3:
        raise RuntimeError(f"Expected 3 motions, got {len(motions)}")
    for required in (PACK_BLEND, REVIEW_SHEET, COMBINED_REEL):
        if not required.exists():
            raise FileNotFoundError(required)

    for item in motions:
        for required in (
            PACK_DIR / item["review_clip"],
            thumbnail_path(item),
        ):
            if not required.exists():
                raise FileNotFoundError(required)
        motion_dir = LIBRARY / "06-motions" / item["action_id"]
        camera_dir = LIBRARY / "02-camera-rigs" / item["camera_id"]
        write_text(motion_dir / "Instructions.md", motion_instructions(item))
        write_text(camera_dir / "Instructions.md", camera_instructions(item))
        write_text(
            CARDS_DIR / safe_name(f"{item['action_id']}｜{item['name_zh']}.md"),
            obsidian_card(item, "motion"),
        )
        write_text(
            CARDS_DIR / safe_name(f"{item['camera_id']}｜{item['camera_name_zh']}.md"),
            obsidian_card(item, "camera"),
        )

    write_text(PACK_DIR / "Instructions.md", pack_instructions(motions))
    write_text(
        CARDS_DIR / f"{PACK_ID}｜白色长外套全身走路动作镜头测试包.md",
        pack_card(motions),
    )
    write_text(INDEX_PATH, build_index(motions))
    sync_registry(motions)
    append_character_links()
    print("WHITE_COAT_WALK_CARD_SYNC_OK")
    print(f"WHITE_COAT_WALK_MOTION_CARDS={len(motions)}")
    print(f"WHITE_COAT_WALK_CAMERA_CARDS={len(motions)}")
    print(f"WHITE_COAT_WALK_INDEX={INDEX_PATH}")


if __name__ == "__main__":
    main()
