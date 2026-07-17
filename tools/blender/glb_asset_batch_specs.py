from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
LIBRARY = ROOT / "video-pipeline" / "asset-library"
SOURCE_ROOT = Path(r"D:\Chrome_Download")
BATCH_ID = "GLB_MODEL_BATCH_20260717"
BATCH_DIR = LIBRARY / "docs" / BATCH_ID
BATCH_PREVIEW_DIR = BATCH_DIR / "preview"
CONTACT_SHEET = BATCH_PREVIEW_DIR / "GLB_MODEL_ASSET_CONTACT_SHEET.png"
OBSIDIAN_CARDS = LIBRARY / "obsidian-vault" / "01-资产卡"
OBSIDIAN_INDEX = LIBRARY / "obsidian-vault" / "00-首页" / "GLB模型资产索引.md"
REGISTRY = LIBRARY / "registry" / "assets.json"
FULLBODY_ID = "CHAR_HUNYUAN_WHITE_COAT_FULLBODY_001"


ASSETS: list[dict[str, object]] = [
    {
        "index": 1,
        "source_name": "9102900ee726384b29739ff33aa09e1b.glb",
        "asset_id": "CHAR_HUNYUAN_WHITE_DRESS_HALF_001",
        "name_zh": "白色礼服半身女模特",
        "asset_type": "character",
        "library_section": "05-characters",
        "walk_rig_candidate": False,
    },
    {
        "index": 2,
        "source_name": "588470d1c1906aa16bad61684fd8e7b7.glb",
        "asset_id": "PROP_WHITE_BED_DRAPED_001",
        "name_zh": "白色垂布床",
        "asset_type": "prop",
        "library_section": "03-scene-kits",
        "walk_rig_candidate": False,
    },
    {
        "index": 3,
        "source_name": "dd50b213d03f54c25d8abe75570bab4a.glb",
        "asset_id": "PROP_NECKLACE_BUST_WHITE_001",
        "name_zh": "白色项链展示架",
        "asset_type": "prop",
        "library_section": "03-scene-kits",
        "walk_rig_candidate": False,
    },
    {
        "index": 4,
        "source_name": "b0a70d953d242b065e613b5ba99560bd.glb",
        "asset_id": "PROP_POTTED_BRANCH_001",
        "name_zh": "陶盆枯枝陈设",
        "asset_type": "prop",
        "library_section": "03-scene-kits",
        "walk_rig_candidate": False,
    },
    {
        "index": 5,
        "source_name": "e517b68016fb0ffdcc1b7ac57f742f1c.glb",
        "asset_id": "PROP_WHITE_CHAIR_001",
        "name_zh": "白色休闲椅",
        "asset_type": "prop",
        "library_section": "03-scene-kits",
        "walk_rig_candidate": False,
    },
    {
        "index": 6,
        "source_name": "6442506e913de55fdcc9e68494138d9d.glb",
        "asset_id": "PROP_WICKER_STORAGE_BOX_001",
        "name_zh": "藤编收纳箱",
        "asset_type": "prop",
        "library_section": "03-scene-kits",
        "walk_rig_candidate": False,
    },
    {
        "index": 7,
        "source_name": "cfe79b6e8550979df70c5ef1135b9dfe.glb",
        "asset_id": "PROP_PATIO_UMBRELLA_CLOSED_001",
        "name_zh": "收拢庭院遮阳伞",
        "asset_type": "prop",
        "library_section": "03-scene-kits",
        "walk_rig_candidate": False,
    },
    {
        "index": 8,
        "source_name": "65850450fdda91b92b1ff0b9b7fc079b.glb",
        "asset_id": "PROP_FLOWER_PLANTER_WHITE_001",
        "name_zh": "白花木箱花架",
        "asset_type": "prop",
        "library_section": "03-scene-kits",
        "walk_rig_candidate": False,
    },
    {
        "index": 9,
        "source_name": "85848780b48a738fbe785543a8cbb05a.glb",
        "asset_id": FULLBODY_ID,
        "name_zh": "白色长外套全身女模特",
        "asset_type": "character",
        "library_section": "05-characters",
        "walk_rig_candidate": True,
    },
]


def asset_dir(item: dict[str, object]) -> Path:
    return LIBRARY / str(item["library_section"]) / str(item["asset_id"])


def source_path(item: dict[str, object]) -> Path:
    return SOURCE_ROOT / str(item["source_name"])


def card_path(item: dict[str, object]) -> Path:
    return OBSIDIAN_CARDS / f"{item['asset_id']}｜{item['name_zh']}.md"


def validate_specs() -> None:
    if len(ASSETS) != 9:
        raise RuntimeError(f"Expected 9 GLB assets, got {len(ASSETS)}")
    ids = [str(item["asset_id"]) for item in ASSETS]
    sources = [str(item["source_name"]) for item in ASSETS]
    indexes = [int(item["index"]) for item in ASSETS]
    if len(set(ids)) != len(ids):
        raise RuntimeError("Duplicate asset IDs in GLB batch")
    if len(set(sources)) != len(sources):
        raise RuntimeError("Duplicate source files in GLB batch")
    if indexes != list(range(1, 10)):
        raise RuntimeError(f"Unexpected GLB batch order: {indexes}")
    candidates = [item for item in ASSETS if item["walk_rig_candidate"]]
    if len(candidates) != 1 or candidates[0]["asset_id"] != FULLBODY_ID:
        raise RuntimeError("Exactly the white-coat fullbody model must be rig candidate")
    missing = [str(source_path(item)) for item in ASSETS if not source_path(item).is_file()]
    if missing:
        raise FileNotFoundError("Missing GLB sources: " + "; ".join(missing))


validate_specs()
