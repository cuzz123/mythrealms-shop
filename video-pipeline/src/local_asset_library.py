from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import uuid
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


MANIFEST_SCHEMA = "mythrealms.local-assets.v1"
ASSET_SCHEMA = "mythrealms.local-asset.v1"
MANIFEST_RELATIVE_PATH = Path("99-manifests") / "local-assets.json"

LAYOUT_DIRECTORIES = (
    "00-inbox/xiaoyunque",
    "00-inbox/jianying",
    "00-inbox/hunyuan",
    "00-inbox/codex-images",
    "10-storyboard-videos",
    "11-edit-projects",
    "12-final-deliverables",
    "90-proxies",
    "99-manifests",
)

ASSET_TYPE_CONFIG = {
    "storyboard-video": ("10-storyboard-videos", "VID_STORYBOARD"),
    "edit-project": ("11-edit-projects", "EDIT_PROJECT"),
    "edit-export": ("12-final-deliverables", "VID_EDIT"),
    "final-video": ("12-final-deliverables", "VID_FINAL"),
}


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def iter_directory_files(source: Path) -> list[Path]:
    excluded_directories = {".git", "__pycache__", "cache", "caches", "logs"}
    excluded_files = {".ds_store", "thumbs.db"}
    files: list[Path] = []
    for path in source.rglob("*"):
        relative = path.relative_to(source)
        if any(part.lower() in excluded_directories for part in relative.parts[:-1]):
            continue
        if (
            path.is_file()
            and not path.is_symlink()
            and path.name.lower() not in excluded_files
            and path.suffix.lower() not in {".tmp", ".cache"}
        ):
            files.append(path)
    return sorted(files, key=lambda path: path.relative_to(source).as_posix())


def sha256_directory(source: Path) -> tuple[str, int]:
    digest = hashlib.sha256()
    size_bytes = 0
    for path in iter_directory_files(source):
        relative = path.relative_to(source).as_posix()
        digest.update(relative.encode("utf-8"))
        digest.update(b"\0")
        with path.open("rb") as handle:
            for chunk in iter(lambda: handle.read(1024 * 1024), b""):
                digest.update(chunk)
                size_bytes += len(chunk)
        digest.update(b"\0")
    return digest.hexdigest(), size_bytes


def create_deterministic_zip(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(
        destination, mode="w", compression=zipfile.ZIP_DEFLATED, compresslevel=6
    ) as archive:
        for path in iter_directory_files(source):
            relative = path.relative_to(source).as_posix()
            info = zipfile.ZipInfo(relative, date_time=(1980, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            with path.open("rb") as source_handle, archive.open(
                info, mode="w"
            ) as destination_handle:
                shutil.copyfileobj(source_handle, destination_handle, 1024 * 1024)


def run_ffmpeg(arguments: list[str]) -> None:
    try:
        subprocess.run(
            ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *arguments],
            check=True,
            capture_output=True,
            text=True,
        )
    except FileNotFoundError as error:
        raise RuntimeError("FFmpeg is required to generate local previews") from error
    except subprocess.CalledProcessError as error:
        message = error.stderr.strip() or error.stdout.strip() or str(error)
        raise RuntimeError(f"FFmpeg preview generation failed: {message}") from error


def generate_video_preview(
    source: Path, temporary_dir: Path, final_library_path: Path
) -> dict[str, str]:
    thumbnail = temporary_dir / "Thumbnail.jpg"
    preview = temporary_dir / "Preview.mp4"
    scale_filter = (
        "scale=720:1280:force_original_aspect_ratio=decrease,"
        "scale=trunc(iw/2)*2:trunc(ih/2)*2"
    )
    run_ffmpeg(
        [
            "-ss",
            "0.2",
            "-i",
            str(source),
            "-frames:v",
            "1",
            "-vf",
            scale_filter,
            "-q:v",
            "3",
            str(thumbnail),
        ]
    )
    run_ffmpeg(
        [
            "-i",
            str(source),
            "-map",
            "0:v:0",
            "-map",
            "0:a?",
            "-vf",
            scale_filter,
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-crf",
            "25",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-b:a",
            "96k",
            "-movflags",
            "+faststart",
            str(preview),
        ]
    )
    return {
        "thumbnail": (final_library_path / thumbnail.name).as_posix(),
        "video": (final_library_path / preview.name).as_posix(),
    }


def write_json_atomic(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.{uuid.uuid4().hex}.tmp")
    temporary.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    temporary.replace(path)


def ensure_library_layout(root: Path) -> None:
    root = root.resolve()
    for relative_path in LAYOUT_DIRECTORIES:
        (root / relative_path).mkdir(parents=True, exist_ok=True)

    manifest_path = root / MANIFEST_RELATIVE_PATH
    if not manifest_path.exists():
        write_json_atomic(
            manifest_path,
            {
                "schema": MANIFEST_SCHEMA,
                "updated_at": utc_now(),
                "assets": [],
            },
        )


def load_manifest(root: Path) -> dict[str, Any]:
    manifest_path = root / MANIFEST_RELATIVE_PATH
    payload = json.loads(manifest_path.read_text(encoding="utf-8-sig"))
    if payload.get("schema") != MANIFEST_SCHEMA or not isinstance(
        payload.get("assets"), list
    ):
        raise ValueError(f"Invalid local asset manifest: {manifest_path}")
    return payload


def normalize_identifier(value: str) -> str:
    normalized = re.sub(r"[^A-Za-z0-9]+", "_", value).strip("_").upper()
    return normalized[:64]


def make_asset_id(
    source: Path, asset_type: str, checksum: str, requested_id: str | None
) -> str:
    if requested_id:
        normalized = normalize_identifier(requested_id)
        if not normalized:
            raise ValueError("asset_id must contain at least one ASCII letter or digit")
        return normalized

    _, prefix = ASSET_TYPE_CONFIG[asset_type]
    source_slug = normalize_identifier(source.stem) or "ASSET"
    return f"{prefix}_{source_slug[:32]}_{checksum[:8].upper()}"


def safe_title(value: str) -> str:
    cleaned = re.sub(r'[<>:"/\\|?*\x00-\x1f]', "-", value).strip(" .")
    return cleaned[:80] or "未命名资产"


def to_posix_relative(path: Path, root: Path) -> str:
    return path.resolve().relative_to(root.resolve()).as_posix()


def write_instructions(asset_dir: Path, metadata: dict[str, Any]) -> None:
    lines = [
        f"# {metadata['title']}",
        "",
        f"- 资产 ID：`{metadata['id']}`",
        f"- 类型：`{metadata['asset_type']}`",
        f"- 来源：`{metadata['origin']['path']}`",
        f"- SHA-256：`{metadata['origin']['sha256']}`",
        "- 导入策略：复制并校验；来源文件未移动、未删除、未覆盖。",
        "",
    ]
    (asset_dir / "Instructions.md").write_text("\n".join(lines), encoding="utf-8")


def write_obsidian_card(
    vault: Path, root: Path, metadata: dict[str, Any]
) -> str:
    cards_dir = vault.resolve() / "01-资产卡"
    cards_dir.mkdir(parents=True, exist_ok=True)
    card_name = f"{metadata['id']}｜{safe_title(metadata['title'])}.md"
    card_path = cards_dir / card_name
    asset_dir = root / metadata["library_path"]
    source_path = Path(metadata["origin"]["path"])
    lines = [
        "---",
        f"id: {metadata['id']}",
        f"asset_type: {metadata['asset_type']}",
        "status: available",
        f"imported_at: {metadata['imported_at']}",
        "tags: [本地资产库, 已校验]",
        "---",
        "",
        f"# {metadata['title']}",
        "",
    ]
    thumbnail_path = metadata.get("preview", {}).get("thumbnail")
    preview_path = metadata.get("preview", {}).get("video")
    if thumbnail_path:
        thumbnail = root / thumbnail_path
        lines.extend([f"![]({thumbnail.resolve().as_uri()})", ""])
    if preview_path:
        preview = root / preview_path
        lines.append(f"- [低码率预览视频]({preview.resolve().as_uri()})")
    lines.extend(
        [
        f"- [来源文件]({source_path.resolve().as_uri()})",
        f"- [正式资产目录]({asset_dir.resolve().as_uri()})",
        f"- [资产说明]({(asset_dir / 'Instructions.md').resolve().as_uri()})",
        f"- SHA-256：`{metadata['origin']['sha256']}`",
        "- 入库方式：复制并校验，来源文件保持原位。",
        "",
        ]
    )
    project_snapshot = metadata.get("project_snapshot")
    if project_snapshot:
        snapshot = root / project_snapshot["library_path"]
        lines.insert(-1, f"- [剪映工程快照]({snapshot.resolve().as_uri()})")
    card_path.write_text("\n".join(lines), encoding="utf-8")
    return card_path.relative_to(vault.resolve()).as_posix()


def ingest_asset(
    source: Path,
    asset_type: str,
    title: str,
    root: Path,
    vault: Path,
    asset_id: str | None = None,
    generate_preview: bool = True,
) -> dict[str, Any]:
    source = source.resolve()
    root = root.resolve()
    vault = vault.resolve()

    if asset_type not in ASSET_TYPE_CONFIG:
        raise ValueError(f"Unsupported asset type: {asset_type}")
    if not source.exists():
        raise FileNotFoundError(source)
    if source.is_dir() and asset_type != "edit-project":
        raise ValueError("Directory ingestion is only supported for edit-project assets")
    if not source.is_file() and not source.is_dir():
        raise ValueError(f"Unsupported source type: {source}")

    ensure_library_layout(root)
    if source.is_dir():
        checksum, source_size = sha256_directory(source)
        origin_kind = "directory"
    else:
        checksum = sha256_file(source)
        source_size = source.stat().st_size
        origin_kind = "file"
    manifest = load_manifest(root)
    duplicate = next(
        (
            entry
            for entry in manifest["assets"]
            if entry.get("origin", {}).get("sha256") == checksum
        ),
        None,
    )
    if duplicate is not None:
        metadata_path = root / duplicate["library_path"] / "metadata.json"
        if metadata_path.is_file():
            return json.loads(metadata_path.read_text(encoding="utf-8-sig"))
        return duplicate

    category_folder, _ = ASSET_TYPE_CONFIG[asset_type]
    resolved_id = make_asset_id(source, asset_type, checksum, asset_id)
    category_dir = root / category_folder
    asset_dir = category_dir / resolved_id
    if asset_dir.exists():
        raise FileExistsError(f"Asset directory already exists: {asset_dir}")

    temporary_dir = category_dir / f".{resolved_id}.{uuid.uuid4().hex}.tmp"
    try:
        source_files: list[dict[str, Any]] = []
        project_snapshot: dict[str, Any] | None = None
        if source.is_dir():
            snapshot_name = f"{safe_title(source.name)}.zip"
            snapshot_file = temporary_dir / "project" / snapshot_name
            create_deterministic_zip(source, snapshot_file)
            snapshot_checksum = sha256_file(snapshot_file)
            snapshot_relative = (
                Path(category_folder) / resolved_id / "project" / snapshot_name
            ).as_posix()
            project_snapshot = {
                "name": snapshot_name,
                "library_path": snapshot_relative,
                "size_bytes": snapshot_file.stat().st_size,
                "sha256": snapshot_checksum,
            }
        else:
            copied_file = temporary_dir / "source" / source.name
            copied_file.parent.mkdir(parents=True, exist_ok=False)
            shutil.copy2(source, copied_file)
            copied_checksum = sha256_file(copied_file)
            if copied_checksum != checksum:
                raise IOError(
                    f"SHA-256 mismatch after copy: {checksum} != {copied_checksum}"
                )
            copied_relative = (
                Path(category_folder) / resolved_id / "source" / source.name
            ).as_posix()
            source_files.append(
                {
                    "name": source.name,
                    "library_path": copied_relative,
                    "size_bytes": copied_file.stat().st_size,
                    "sha256": copied_checksum,
                }
            )

        imported_at = utc_now()
        library_path = (Path(category_folder) / resolved_id).as_posix()
        preview = {"thumbnail": None, "video": None}
        if source.is_file() and generate_preview:
            preview = generate_video_preview(
                source=source,
                temporary_dir=temporary_dir,
                final_library_path=Path(category_folder) / resolved_id,
            )
        metadata: dict[str, Any] = {
            "schema": ASSET_SCHEMA,
            "id": resolved_id,
            "title": title,
            "asset_type": asset_type,
            "status": "available",
            "imported_at": imported_at,
            "library_path": library_path,
            "origin": {
                "kind": origin_kind,
                "path": str(source),
                "size_bytes": source_size,
                "sha256": checksum,
            },
            "source_files": source_files,
            "preview": preview,
            "project_snapshot": project_snapshot,
        }
        write_json_atomic(temporary_dir / "metadata.json", metadata)
        write_instructions(temporary_dir, metadata)
        temporary_dir.replace(asset_dir)

        metadata["obsidian_card"] = write_obsidian_card(
            vault=vault, root=root, metadata=metadata
        )
        write_json_atomic(asset_dir / "metadata.json", metadata)

        manifest["assets"].append(metadata)
        manifest["updated_at"] = imported_at
        write_json_atomic(root / MANIFEST_RELATIVE_PATH, manifest)
        return metadata
    except Exception:
        if temporary_dir.exists():
            shutil.rmtree(temporary_dir)
        raise


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="MythRealms 本地影视资产库无损导入工具"
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    init_parser = subparsers.add_parser("init", help="初始化本地资产库目录")
    init_parser.add_argument("--root", type=Path, required=True)
    init_parser.add_argument("--vault", type=Path)

    ingest_parser = subparsers.add_parser("ingest", help="复制校验并导入资产")
    ingest_parser.add_argument("--source", type=Path, required=True)
    ingest_parser.add_argument(
        "--type",
        dest="asset_type",
        choices=sorted(ASSET_TYPE_CONFIG),
        required=True,
    )
    ingest_parser.add_argument("--title", required=True)
    ingest_parser.add_argument("--root", type=Path, required=True)
    ingest_parser.add_argument("--vault", type=Path)
    ingest_parser.add_argument("--asset-id")
    ingest_parser.add_argument("--no-preview", action="store_true")
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    root = args.root.resolve()
    vault = (args.vault or (root / "obsidian-vault")).resolve()

    if args.command == "init":
        ensure_library_layout(root)
        vault.mkdir(parents=True, exist_ok=True)
        print(
            json.dumps(
                {"root": str(root), "vault": str(vault), "status": "initialized"},
                ensure_ascii=False,
            )
        )
        return 0

    metadata = ingest_asset(
        source=args.source,
        asset_type=args.asset_type,
        title=args.title,
        root=root,
        vault=vault,
        asset_id=args.asset_id,
        generate_preview=not args.no_preview,
    )
    print(json.dumps(metadata, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
