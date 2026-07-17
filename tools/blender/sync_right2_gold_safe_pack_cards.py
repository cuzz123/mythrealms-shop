from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
LIBRARY = ROOT / "video-pipeline" / "asset-library"
PACK_DIR = LIBRARY / "06-motions" / "RIGHT2_GOLD_JEWELRY_SAFE_PACK_001"
MANIFEST_PATH = PACK_DIR / "motion_manifest.json"
PACK_BLEND = PACK_DIR / "RIGHT2_GOLD_JEWELRY_SAFE_PACK_v1.blend"
OBSIDIAN_CARDS = LIBRARY / "obsidian-vault" / "01-资产卡"
OBSIDIAN_INDEX = LIBRARY / "obsidian-vault" / "00-首页" / "右二金色礼服动作与镜头索引.md"
INVALID_FILENAME = re.compile(r'[\\/:*?"<>|]')


def file_uri(path: Path) -> str:
    return f"file:///{path.resolve().as_posix()}"


def safe_name(value: str) -> str:
    return INVALID_FILENAME.sub("_", value).strip()


def status_zh(status: str) -> str:
    return "已验收" if status == "approved" else "候选"


def qc_zh(qc_status: str) -> str:
    if qc_status == "approved":
        return "已验收"
    if qc_status == "passed_internal_qc":
        return "内部质检通过，待用户验收"
    return qc_status


def approval_note(status: str) -> str:
    if status == "approved":
        return "该资产已通过内部质检，并已由用户批量验收为 `approved`。"
    return "候选项只有用户验收后才能升级为 `approved`。"


def card_approval_note(status: str) -> str:
    if status == "approved":
        return "内部质检与用户验收均已完成。"
    return "内部质检通过，待用户验收。候选项需用户最终验收。"


def write_missing(path: Path, content: str, counters: dict[str, int]) -> None:
    if path.exists():
        counters["skipped"] += 1
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.rstrip() + "\n", encoding="utf-8")
    counters["created"] += 1


def motion_instructions(item: dict, thumbnail: Path, review_clip: Path) -> str:
    return f"""# {item['action_id']}｜{item['name_zh']}

- **状态：** {item['status']}（{status_zh(item['status'])}）
- **内部质检：** {qc_zh(item['qc_status'])}
- **角色：** `{item['character_id']}`
- **骨架：** `{item['rig']}`
- **配套镜头：** `{item['camera_id']}`（{item['camera_name_zh']}）
- **规格：** {item['frames']} 帧 @ {item['fps']} fps

## 文件

- [完整动作预览]({file_uri(review_clip)})
- [动作缩略图]({file_uri(thumbnail)})
- [Blender 整包]({file_uri(PACK_BLEND)})
- [动作与镜头清单]({file_uri(MANIFEST_PATH)})

## 调用

从整包 Blend 的 `Action` 中追加 `{item['action_id']}`，应用到 `{item['rig']}`；再追加配套镜头 `{item['camera_id']}` 与对应 `FOCUS_*` 对象。

该动作使用原始混元高精度网格的安全头、颈、胸、脊柱与极小肩线范围，双臂锁定。{approval_note(item['status'])}
"""


def camera_instructions(item: dict, thumbnail: Path, review_clip: Path) -> str:
    return f"""# {item['camera_id']}｜{item['camera_name_zh']}

- **状态：** {item['status']}（{status_zh(item['status'])}）
- **内部质检：** {qc_zh(item['qc_status'])}
- **配套动作：** `{item['action_id']}`（{item['name_zh']}）
- **角色：** `{item['character_id']}`
- **规格：** {item['frames']} 帧 @ {item['fps']} fps

## 文件

- [完整镜头预览]({file_uri(review_clip)})
- [镜头缩略图]({file_uri(thumbnail)})
- [Blender 整包]({file_uri(PACK_BLEND)})
- [动作与镜头清单]({file_uri(MANIFEST_PATH)})

## 调用

从整包 Blend 的 `Object` 中追加 `{item['camera_id']}` 与对应 `FOCUS_*` 对象，并把场景相机切换到该 Camera。该镜头与 `{item['action_id']}` 一一配套。
"""


def obsidian_card(item: dict, kind: str, thumbnail: Path, review_clip: Path) -> str:
    if kind == "motion":
        asset_id = item["action_id"]
        name = item["name_zh"]
        pair_label = "配套镜头"
        pair_id = item["camera_id"]
        asset_type = "motion"
    else:
        asset_id = item["camera_id"]
        name = item["camera_name_zh"]
        pair_label = "配套动作"
        pair_id = item["action_id"]
        asset_type = "camera_rig"
    return f"""---
id: {asset_id}
asset_type: {asset_type}
status: {item['status']}
qc_status: {item['qc_status']}
character: {item['character_id']}
tags: [右二金色礼服, 首饰模特, 上半身, {status_zh(item['status'])}]
---

# {name}

![]({file_uri(thumbnail)})

- [{pair_label}：{pair_id}]({file_uri(PACK_BLEND)})
- [完整 3 秒预览]({file_uri(review_clip)})
- [Blender 整包]({file_uri(PACK_BLEND)})
- [资产说明]({file_uri((LIBRARY / ('06-motions' if kind == 'motion' else '02-camera-rigs') / asset_id / 'Instructions.md'))})

状态：**{status_zh(item['status'])}**；{card_approval_note(item['status'])}
"""


def build_index(motions: list[dict]) -> str:
    rows = []
    for item in motions:
        motion_card = f"{item['action_id']}｜{item['name_zh']}"
        camera_card = f"{item['camera_id']}｜{item['camera_name_zh']}"
        rows.append(
            f"| {int(item['index']):02d} | [[{motion_card}]] | "
            f"[[{camera_card}]] | {status_zh(item['status'])} | "
            f"{qc_zh(item['qc_status'])} |"
        )
    return """---
type: asset-index
character: CHAR_HUNYUAN_RIGHT2_GOLD_001
pack: RIGHT2_GOLD_JEWELRY_SAFE_PACK_001
---

# 右二金色礼服动作与镜头索引

- [90 秒全量总审片]({reel})
- [Blender 整包]({blend})
- [动作清单]({manifest})

| # | 动作资产 | 镜头资产 | 状态 | 内部质检 |
|---:|---|---|---|---|
{rows}
""".format(
        reel=file_uri(PACK_DIR / "preview" / "RIGHT2_GOLD_ALL_30_ACTIONS_REVIEW.mp4"),
        blend=file_uri(PACK_BLEND),
        manifest=file_uri(MANIFEST_PATH),
        rows="\n".join(rows),
    )


def main() -> None:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    motions = sorted(manifest["motions"], key=lambda item: int(item["index"]))
    if len(motions) != 30:
        raise RuntimeError(f"Expected 30 motions, got {len(motions)}")

    counters = {"created": 0, "skipped": 0}
    for item in motions:
        thumbnail = PACK_DIR / item["thumbnail"]
        review_clip = PACK_DIR / item["review_clip"]
        if not thumbnail.exists() or not review_clip.exists():
            raise FileNotFoundError(f"Missing preview for {item['action_id']}")

        motion_dir = LIBRARY / "06-motions" / item["action_id"]
        camera_dir = LIBRARY / "02-camera-rigs" / item["camera_id"]
        write_missing(
            motion_dir / "Instructions.md",
            motion_instructions(item, thumbnail, review_clip),
            counters,
        )
        write_missing(
            camera_dir / "Instructions.md",
            camera_instructions(item, thumbnail, review_clip),
            counters,
        )

        motion_obsidian = OBSIDIAN_CARDS / safe_name(
            f"{item['action_id']}｜{item['name_zh']}.md"
        )
        camera_obsidian = OBSIDIAN_CARDS / safe_name(
            f"{item['camera_id']}｜{item['camera_name_zh']}.md"
        )
        write_missing(
            motion_obsidian,
            obsidian_card(item, "motion", thumbnail, review_clip),
            counters,
        )
        write_missing(
            camera_obsidian,
            obsidian_card(item, "camera", thumbnail, review_clip),
            counters,
        )

    OBSIDIAN_INDEX.parent.mkdir(parents=True, exist_ok=True)
    OBSIDIAN_INDEX.write_text(build_index(motions).rstrip() + "\n", encoding="utf-8")
    print(f"RIGHT2_GOLD_CARD_SYNC_CREATED={counters['created']}")
    print(f"RIGHT2_GOLD_CARD_SYNC_SKIPPED={counters['skipped']}")
    print(f"RIGHT2_GOLD_CARD_INDEX={OBSIDIAN_INDEX}")


if __name__ == "__main__":
    main()
