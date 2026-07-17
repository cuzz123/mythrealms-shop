from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
LIBRARY = ROOT / "video-pipeline" / "asset-library"
PACK_ID = "RIGHT2_GOLD_JEWELRY_SAFE_PACK_001"
CHARACTER_ID = "CHAR_HUNYUAN_RIGHT2_GOLD_001"
PACK_DIR = LIBRARY / "06-motions" / PACK_ID
MANIFEST_PATH = PACK_DIR / "motion_manifest.json"
CARDS_DIR = LIBRARY / "obsidian-vault" / "01-资产卡"
CHARACTER_DIR = LIBRARY / "05-characters" / CHARACTER_ID
REGISTRY_PATH = LIBRARY / "registry" / "assets.json"


def write_text(path: Path, text: str) -> None:
    path.write_text(text.rstrip() + "\n", encoding="utf-8")


def replace_line(text: str, prefix: str, replacement: str) -> str:
    pattern = rf"(?m)^{re.escape(prefix)}.*$"
    updated, count = re.subn(pattern, replacement, text, count=1)
    if count != 1:
        raise RuntimeError(f"Expected one line beginning with {prefix!r}")
    return updated


def set_frontmatter(text: str, key: str, value: str) -> str:
    pattern = rf"(?m)^{re.escape(key)}:\s*.*$"
    updated, count = re.subn(pattern, f"{key}: {value}", text, count=1)
    if count == 1:
        return updated
    closing = text.find("\n---", 4)
    if closing < 0:
        raise RuntimeError(f"Missing frontmatter while setting {key}")
    return text[:closing] + f"\n{key}: {value}" + text[closing:]


def card_for(asset_id: str) -> Path:
    matches = list(CARDS_DIR.glob(f"{asset_id}｜*.md"))
    if len(matches) != 1:
        raise RuntimeError(f"{asset_id}: expected one card, got {len(matches)}")
    return matches[0]


def promote_instructions(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    text, status_count = re.subn(
        r"(?m)^- \*\*状态[：:]\*\*.*$",
        "- **状态：** approved（已验收）",
        text,
        count=1,
    )
    if status_count != 1:
        raise RuntimeError(f"Expected one status line in {path}")
    text, qc_count = re.subn(
        r"(?m)^- \*\*内部质检[：:]\*\*.*$",
        "- **内部质检：** 已验收",
        text,
        count=1,
    )
    if qc_count == 0:
        text = text.replace(
            "- **状态：** approved（已验收）",
            "- **状态：** approved（已验收）\n- **内部质检：** 已验收",
            1,
        )
    text = text.replace(
        "候选项只有用户验收后才能升级为 `approved`。",
        "该资产已通过内部质检，并已由用户批量验收为 `approved`。",
    )
    text = text.replace("内部质检通过，待用户验收", "已验收")
    text = text.replace("候选项需用户最终验收。", "用户批量验收已完成。")
    write_text(path, text)


def promote_card(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    text = set_frontmatter(text, "status", "approved")
    text = set_frontmatter(text, "qc_status", "approved")
    text = text.replace("候选", "已验收")
    text = text.replace("内部质检通过，待用户验收", "内部质检与用户验收均已完成")
    text = text.replace("已验收项需用户最终验收。", "用户批量验收已完成。")
    write_text(path, text)


def promote_pack_instructions() -> None:
    path = PACK_DIR / "Instructions.md"
    text = path.read_text(encoding="utf-8")
    text = replace_line(text, "- **状态：**", "- **状态：** approved")
    text = replace_line(
        text,
        "- **验收状态：**",
        "- **验收状态：** 30 个已验收，0 个候选；30 个均通过本轮内部动态质检",
    )
    text = text.replace("| 候选 |", "| 已验收 |")
    text = text.replace(
        "候选动作在 56 帧完成并保持到 72 帧。",
        "动作在 56 帧完成并保持到 72 帧。",
    )
    text = text.replace(
        "28 个候选仍等待用户最终验收，不因内部质检自动升级为 `approved`。",
        "30 个动作均已由用户批量验收，状态统一为 `approved`。",
    )
    text = text.replace("candidate_review", "approved")
    write_text(path, text)


def promote_pack_card() -> None:
    path = card_for(PACK_ID)
    text = path.read_text(encoding="utf-8")
    text = set_frontmatter(text, "status", "approved")
    text = text.replace("候选验收", "批量已验收")
    text = text.replace("01、02 已验收；03-30 保持候选状态。", "01-30 已全部验收。")
    text = text.replace("2 个已验收，28 个候选", "30 个已验收，0 个候选")
    write_text(path, text)


def promote_character_metadata() -> None:
    model_path = CHARACTER_DIR / "model.json"
    model = json.loads(model_path.read_text(encoding="utf-8"))
    safe_pack = model["rig"]["rigged_variant"]["safe_motion_pack"]
    safe_pack["approved_count"] = 30
    safe_pack["candidate_count"] = 0
    safe_pack["internal_qc_status"] = "approved"
    model_path.write_text(
        json.dumps(model, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    card_path = card_for(CHARACTER_ID)
    card = card_path.read_text(encoding="utf-8")
    card = card.replace(
        "30 个动作与 30 个镜头；2 个已验收，28 个候选。",
        "30 个动作与 30 个镜头；30 个已验收，0 个候选。",
    )
    write_text(card_path, card)


def promote_registry() -> None:
    registry = json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))
    matches = [row for row in registry["assets"] if row.get("id") == PACK_ID]
    if len(matches) != 1:
        raise RuntimeError(f"Expected one registry row for {PACK_ID}, got {len(matches)}")
    row = matches[0]
    row["status"] = "approved"
    row["notes"] = (
        "30 个动作与 30 个镜头已完成内部质检，并于 2026-07-17 由用户批量验收。"
    )
    REGISTRY_PATH.write_text(
        json.dumps(registry, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def main() -> None:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    motions = manifest.get("motions", [])
    if len(motions) != 30:
        raise RuntimeError(f"Expected 30 manifest rows, got {len(motions)}")
    if any(
        item.get("status") != "approved" or item.get("qc_status") != "approved"
        for item in motions
    ):
        raise RuntimeError("Manifest must be fully approved before metadata promotion")

    for item in motions:
        action_id = item["action_id"]
        camera_id = item["camera_id"]
        promote_instructions(
            LIBRARY / "06-motions" / action_id / "Instructions.md"
        )
        promote_instructions(
            LIBRARY / "02-camera-rigs" / camera_id / "Instructions.md"
        )
        promote_card(card_for(action_id))
        promote_card(card_for(camera_id))

    promote_pack_instructions()
    promote_pack_card()
    promote_character_metadata()
    promote_registry()
    print("RIGHT2_GOLD_SAFE_PACK_METADATA_PROMOTED=30")


if __name__ == "__main__":
    main()
