from __future__ import annotations

import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
LIBRARY = ROOT / "video-pipeline" / "asset-library"
PACK_ID = "RIGHT2_GOLD_JEWELRY_SAFE_PACK_001"
CHARACTER_ID = "CHAR_HUNYUAN_RIGHT2_GOLD_001"
PACK_DIR = LIBRARY / "06-motions" / PACK_ID
MANIFEST_PATH = PACK_DIR / "motion_manifest.json"
CHARACTER_DIR = LIBRARY / "05-characters" / CHARACTER_ID
CARDS_DIR = LIBRARY / "obsidian-vault" / "01-资产卡"
INDEX_PATH = LIBRARY / "obsidian-vault" / "00-首页" / "右二金色礼服动作与镜头索引.md"
REGISTRY_PATH = LIBRARY / "registry" / "assets.json"
EXPECTED_COUNT = 30


def read_text(path: Path, errors: list[str]) -> str:
    if not path.exists():
        errors.append(f"missing file: {path}")
        return ""
    return path.read_text(encoding="utf-8")


def read_json(path: Path, errors: list[str]):
    text = read_text(path, errors)
    if not text:
        return {}
    try:
        return json.loads(text)
    except json.JSONDecodeError as exc:
        errors.append(f"invalid json {path}: {exc}")
        return {}


def frontmatter_value(text: str, key: str) -> str | None:
    match = re.search(rf"(?m)^{re.escape(key)}:\s*(.+?)\s*$", text)
    return match.group(1) if match else None


def card_for(asset_id: str, errors: list[str]) -> Path | None:
    matches = list(CARDS_DIR.glob(f"{asset_id}｜*.md"))
    if len(matches) != 1:
        errors.append(f"{asset_id}: expected one Obsidian card, got {len(matches)}")
        return None
    return matches[0]


def validate_generated_asset(
    asset_id: str,
    instruction_path: Path,
    errors: list[str],
) -> None:
    text = read_text(instruction_path, errors)
    prefix = f"{asset_id}: "
    if "- **状态：** approved（已验收）" not in text:
        errors.append(prefix + "Instructions status is not approved")
    if "- **内部质检：** 已验收" not in text:
        errors.append(prefix + "Instructions QC status is not approved")
    if "待用户验收" in text or "候选项" in text:
        errors.append(prefix + "Instructions still contain candidate wording")

    card_path = card_for(asset_id, errors)
    if card_path is None:
        return
    card = read_text(card_path, errors)
    if frontmatter_value(card, "status") != "approved":
        errors.append(prefix + "Obsidian card status is not approved")
    if frontmatter_value(card, "qc_status") != "approved":
        errors.append(prefix + "Obsidian card QC status is not approved")
    if "候选" in card or "待用户验收" in card:
        errors.append(prefix + "Obsidian card still contains candidate wording")


def validate() -> list[str]:
    errors: list[str] = []
    manifest = read_json(MANIFEST_PATH, errors)
    motions = manifest.get("motions", [])
    if len(motions) != EXPECTED_COUNT:
        errors.append(f"manifest motion count is {len(motions)}, expected {EXPECTED_COUNT}")
    if manifest.get("status") != "approved":
        errors.append("manifest status must be approved")
    if manifest.get("approved_count") != EXPECTED_COUNT:
        errors.append("manifest approved_count must be 30")
    if manifest.get("candidate_count") != 0:
        errors.append("manifest candidate_count must be 0")

    for item in motions:
        action_id = item.get("action_id", "<missing-action-id>")
        camera_id = item.get("camera_id", "<missing-camera-id>")
        if item.get("status") != "approved" or item.get("qc_status") != "approved":
            errors.append(f"{action_id}: manifest row is not fully approved")
        validate_generated_asset(
            action_id,
            LIBRARY / "06-motions" / action_id / "Instructions.md",
            errors,
        )
        validate_generated_asset(
            camera_id,
            LIBRARY / "02-camera-rigs" / camera_id / "Instructions.md",
            errors,
        )

    pack_instructions = read_text(PACK_DIR / "Instructions.md", errors)
    if "- **状态：** approved" not in pack_instructions:
        errors.append("pack Instructions status is not approved")
    if "- **验收状态：** 30 个已验收，0 个候选" not in pack_instructions:
        errors.append("pack Instructions does not report 30 approved / 0 candidate")
    if "candidate_review" in pack_instructions or "28 个候选" in pack_instructions:
        errors.append("pack Instructions still contain the old candidate state")

    pack_card_path = card_for(PACK_ID, errors)
    if pack_card_path is not None:
        pack_card = read_text(pack_card_path, errors)
        if frontmatter_value(pack_card, "status") != "approved":
            errors.append("pack Obsidian card status is not approved")
        if "28 个候选" in pack_card or "候选验收" in pack_card:
            errors.append("pack Obsidian card still contains the old candidate state")

    character_model = read_json(CHARACTER_DIR / "model.json", errors)
    safe_pack = (
        character_model.get("rig", {})
        .get("rigged_variant", {})
        .get("safe_motion_pack", {})
    )
    expected_fields = {
        "approved_count": EXPECTED_COUNT,
        "candidate_count": 0,
        "internal_qc_status": "approved",
    }
    for key, expected in expected_fields.items():
        if safe_pack.get(key) != expected:
            errors.append(
                f"character model safe_motion_pack.{key} is "
                f"{safe_pack.get(key)!r}, expected {expected!r}"
            )

    character_card_path = card_for(CHARACTER_ID, errors)
    if character_card_path is not None:
        character_card = read_text(character_card_path, errors)
        if "30 个动作与 30 个镜头；30 个已验收，0 个候选" not in character_card:
            errors.append("character Obsidian card does not report 30 approved / 0 candidate")
        if "28 个候选" in character_card:
            errors.append("character Obsidian card still contains the old candidate state")

    registry = read_json(REGISTRY_PATH, errors)
    registry_rows = [
        item for item in registry.get("assets", []) if item.get("id") == PACK_ID
    ]
    if len(registry_rows) != 1:
        errors.append(f"registry contains {len(registry_rows)} rows for {PACK_ID}")
    elif registry_rows[0].get("status") != "approved":
        errors.append("registry pack status is not approved")

    index_text = read_text(INDEX_PATH, errors)
    index_rows = re.findall(r"(?m)^\|\s*\d{2}\s*\|", index_text)
    if len(index_rows) != EXPECTED_COUNT:
        errors.append(f"Obsidian index has {len(index_rows)} asset rows, expected 30")
    if "候选" in index_text:
        errors.append("Obsidian index still contains candidate rows")
    return errors


def main() -> None:
    errors = validate()
    if errors:
        print("RIGHT2_GOLD_APPROVAL_METADATA_VALIDATION_FAILED")
        for error in errors:
            print(f"- {error}")
        raise SystemExit(1)
    print("RIGHT2_GOLD_APPROVAL_METADATA_VALIDATION_OK")


if __name__ == "__main__":
    main()
