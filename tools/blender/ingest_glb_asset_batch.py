from __future__ import annotations

import hashlib
import json
import shutil
import sys
from datetime import date
from pathlib import Path

import bpy
from mathutils import Vector

sys.path.insert(0, str(Path(__file__).resolve().parent))

from glb_asset_batch_specs import (  # noqa: E402
    ASSETS,
    BATCH_DIR,
    BATCH_ID,
    LIBRARY,
    OBSIDIAN_CARDS,
    OBSIDIAN_INDEX,
    REGISTRY,
    asset_dir,
    card_path,
    source_path,
)


def file_uri(path: Path) -> str:
    return f"file:///{path.resolve().as_posix()}"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def audit_glb(path: Path) -> dict[str, object]:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(path))
    meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    armatures = [obj for obj in bpy.context.scene.objects if obj.type == "ARMATURE"]
    if not meshes:
        raise RuntimeError(f"No mesh imported from {path}")

    points = [
        obj.matrix_world @ Vector(corner)
        for obj in meshes
        for corner in obj.bound_box
    ]
    minimum = [min(point[axis] for point in points) for axis in range(3)]
    maximum = [max(point[axis] for point in points) for axis in range(3)]
    dimensions = [maximum[axis] - minimum[axis] for axis in range(3)]
    return {
        "mesh_count": len(meshes),
        "vertex_count": sum(len(obj.data.vertices) for obj in meshes),
        "polygon_count": sum(len(obj.data.polygons) for obj in meshes),
        "material_count": len(bpy.data.materials),
        "armature_count": len(armatures),
        "bone_count": sum(len(obj.data.bones) for obj in armatures),
        "bounds_min": [round(value, 6) for value in minimum],
        "bounds_max": [round(value, 6) for value in maximum],
        "dimensions": [round(value, 6) for value in dimensions],
        "mesh_names": [obj.name for obj in meshes],
        "armature_names": [obj.name for obj in armatures],
    }


def instructions_text(item: dict[str, object], metadata: dict[str, object]) -> str:
    geometry = metadata["geometry"]
    scope = (
        "完整头到脚角色，可进入全身绑定候选流程。"
        if item["walk_rig_candidate"]
        else "原始生成模型，仅按当前几何覆盖范围使用。"
    )
    return f"""# {item['asset_id']}｜{item['name_zh']}

- **类型：** {item['asset_type']}
- **状态：** 原始模型已入库
- **源文件哈希：** `{metadata['source_sha256']}`
- **网格：** {geometry['mesh_count']} 个，{geometry['vertex_count']:,} 顶点，{geometry['polygon_count']:,} 面
- **骨架：** {geometry['armature_count']} 个
- **使用范围：** {scope}

## 文件

- [原始 GLB]({file_uri(asset_dir(item) / 'source.glb')})
- [缩略图]({file_uri(asset_dir(item) / 'preview' / 'thumbnail.png')})
- [模型元数据]({file_uri(asset_dir(item) / 'model.json')})

原始 GLB 保持不变。任何绑定、减面或材质修正必须输出新文件，不能覆盖 `source.glb`。
"""


def card_text(item: dict[str, object]) -> str:
    return f"""---
id: {item['asset_id']}
asset_type: {item['asset_type']}
status: approved_source
walk_rig_candidate: {str(bool(item['walk_rig_candidate'])).lower()}
tags: [混元3D, GLB, {'角色' if item['asset_type'] == 'character' else '场景道具'}]
---

# {item['name_zh']}

![]({file_uri(asset_dir(item) / 'preview' / 'thumbnail.png')})

- [原始 GLB]({file_uri(asset_dir(item) / 'source.glb')})
- [模型元数据]({file_uri(asset_dir(item) / 'model.json')})
- [资产说明]({file_uri(asset_dir(item) / 'Instructions.md')})

{'该模型是本批次唯一的全身走路绑定候选。' if item['walk_rig_candidate'] else '该资产按当前几何覆盖范围使用，不进入全身步态绑定。'}
"""


def index_text() -> str:
    rows = []
    for item in ASSETS:
        card_name = f"{item['asset_id']}｜{item['name_zh']}"
        rows.append(
            f"| {int(item['index']):02d} | [[{card_name}]] | {item['asset_type']} | "
            f"{'全身绑定候选' if item['walk_rig_candidate'] else '已入库'} |"
        )
    return f"""---
type: asset-index
batch: {BATCH_ID}
---

# GLB 模型资产索引

![]({file_uri(BATCH_DIR / 'preview' / 'GLB_MODEL_ASSET_CONTACT_SHEET.png')})

| # | 资产 | 类型 | 用途 |
|---:|---|---|---|
{chr(10).join(rows)}
"""


def update_registry(metadata_rows: list[dict[str, object]]) -> None:
    registry = json.loads(REGISTRY.read_text(encoding="utf-8"))
    existing = {
        row.get("id"): row
        for row in registry.get("assets", [])
        if isinstance(row, dict) and row.get("id")
    }
    for metadata in metadata_rows:
        item = next(row for row in ASSETS if row["asset_id"] == metadata["id"])
        existing[str(metadata["id"])] = {
            "id": metadata["id"],
            "name": metadata["name_zh"],
            "category": metadata["asset_type"],
            "status": "approved_source",
            "version": "v1",
            "source_paths": [
                f"../{item['library_section']}/{item['asset_id']}/source.glb",
                f"../{item['library_section']}/{item['asset_id']}/preview/thumbnail.png",
            ],
            "tags": ["hunyuan3d", "glb", str(metadata["asset_type"])],
            "usage": {
                "default_import": "append",
                "walk_rig_candidate": bool(item["walk_rig_candidate"]),
            },
            "quality_gate": [
                "preserve original source.glb",
                "review generated thumbnail before production use",
            ],
            "notes": "2026-07-17 GLB batch import; source geometry is unrigged.",
        }
    registry["assets"] = list(existing.values())
    registry["updated"] = date.today().isoformat()
    REGISTRY.write_text(
        json.dumps(registry, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def main() -> None:
    metadata_rows: list[dict[str, object]] = []
    for item in ASSETS:
        source = source_path(item)
        root = asset_dir(item)
        preview = root / "preview"
        preview.mkdir(parents=True, exist_ok=True)
        destination = root / "source.glb"
        if not destination.exists() or sha256_file(destination) != sha256_file(source):
            shutil.copy2(source, destination)

        geometry = audit_glb(destination)
        metadata = {
            "id": item["asset_id"],
            "name_zh": item["name_zh"],
            "asset_type": item["asset_type"],
            "source_file": item["source_name"],
            "source_sha256": sha256_file(destination),
            "geometry": geometry,
            "rig": {
                "armature_count": geometry["armature_count"],
                "walk_rig_candidate": bool(item["walk_rig_candidate"]),
            },
            "status": "approved_source",
        }
        (root / "model.json").write_text(
            json.dumps(metadata, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        instructions = root / "Instructions.md"
        if not instructions.exists():
            instructions.write_text(instructions_text(item, metadata), encoding="utf-8")
        card = card_path(item)
        card.parent.mkdir(parents=True, exist_ok=True)
        if not card.exists():
            card.write_text(card_text(item), encoding="utf-8")
        metadata_rows.append(metadata)
        print(f"GLB_INGESTED={item['asset_id']}")

    BATCH_DIR.mkdir(parents=True, exist_ok=True)
    (BATCH_DIR / "batch_manifest.json").write_text(
        json.dumps(
            {"id": BATCH_ID, "status": "approved_source", "assets": metadata_rows},
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    update_registry(metadata_rows)
    OBSIDIAN_INDEX.parent.mkdir(parents=True, exist_ok=True)
    OBSIDIAN_INDEX.write_text(index_text(), encoding="utf-8")
    print(f"GLB_ASSET_BATCH_INGESTED={len(metadata_rows)}")


if __name__ == "__main__":
    main()
