from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from glb_asset_batch_specs import (
    ASSETS,
    BATCH_DIR,
    CONTACT_SHEET,
    OBSIDIAN_INDEX,
    REGISTRY,
    asset_dir,
    card_path,
)


def main() -> None:
    errors: list[str] = []
    registry_assets: list[dict] = []
    if REGISTRY.is_file():
        try:
            registry_assets = json.loads(REGISTRY.read_text(encoding="utf-8"))["assets"]
        except (json.JSONDecodeError, KeyError, TypeError) as exc:
            errors.append(f"invalid registry: {exc}")
    else:
        errors.append(f"missing registry: {REGISTRY}")

    for item in ASSETS:
        root = asset_dir(item)
        required = (
            root / "source.glb",
            root / "model.json",
            root / "Instructions.md",
            root / "preview" / "thumbnail.png",
            card_path(item),
        )
        for path in required:
            if not path.is_file():
                errors.append(f"missing {item['asset_id']}: {path}")

        metadata_path = root / "model.json"
        if metadata_path.is_file():
            try:
                metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
            except json.JSONDecodeError as exc:
                errors.append(f"invalid model.json for {item['asset_id']}: {exc}")
            else:
                if metadata.get("id") != item["asset_id"]:
                    errors.append(f"wrong metadata id for {item['asset_id']}")
                if metadata.get("rig", {}).get("walk_rig_candidate") is not item["walk_rig_candidate"]:
                    errors.append(f"wrong rig candidacy for {item['asset_id']}")
                if not metadata.get("source_sha256"):
                    errors.append(f"missing sha256 for {item['asset_id']}")

        registry_matches = [row for row in registry_assets if row.get("id") == item["asset_id"]]
        if len(registry_matches) != 1:
            errors.append(
                f"registry entry count for {item['asset_id']} must be 1, got {len(registry_matches)}"
            )

    if not CONTACT_SHEET.is_file():
        errors.append(f"missing contact sheet: {CONTACT_SHEET}")
    if not OBSIDIAN_INDEX.is_file():
        errors.append(f"missing Obsidian index: {OBSIDIAN_INDEX}")
    if not (BATCH_DIR / "batch_manifest.json").is_file():
        errors.append(f"missing batch manifest: {BATCH_DIR / 'batch_manifest.json'}")

    if errors:
        raise RuntimeError("GLB asset batch validation failed:\n" + "\n".join(errors))
    print("GLB_ASSET_BATCH_VALIDATION_OK")


if __name__ == "__main__":
    main()
