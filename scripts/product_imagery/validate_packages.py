import argparse
import json
import sys
from pathlib import Path, PurePosixPath

from PIL import Image, UnidentifiedImageError

try:
    from .lock_source_hashes import (
        normalized_reference,
        repository_root,
        sha256,
        source_path,
    )
except ImportError:
    from lock_source_hashes import (
        normalized_reference,
        repository_root,
        sha256,
        source_path,
    )


EXPECTED_FILES = {
    "main": "01-main.webp",
    "on-model": "02-on-model.webp",
    "macro": "03-macro.webp",
    "lifestyle": "04-lifestyle.webp",
}
EXPECTED_SIZE = (1600, 2000)
MAX_BYTES = 900 * 1024


def output_path(root: Path, reference: str) -> tuple[str, Path]:
    normalized = normalized_reference(reference)
    return normalized, root.joinpath(*PurePosixPath(normalized).parts)


def validate_manifest(manifest_path: Path, require_outputs: bool) -> list[str]:
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        return [f"Could not read manifest {manifest_path}: {error}"]

    try:
        root = repository_root(manifest_path)
    except ValueError as error:
        return [str(error)]

    errors: list[str] = []
    products = manifest.get("products")
    if not isinstance(products, list):
        return ["Manifest products must be a list"]

    saved_hashes = read_saved_hashes(manifest_path, errors)
    for product in products:
        if not isinstance(product, dict):
            errors.append("Manifest product records must be objects")
            continue
        validate_product(product, root, saved_hashes, require_outputs, errors)
    return errors


def read_saved_hashes(manifest_path: Path, errors: list[str]) -> dict[str, str]:
    hash_path = manifest_path.with_name("source-hashes.json")
    try:
        hashes = json.loads(hash_path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        errors.append(f"Missing source hash baseline: {hash_path}")
        return {}
    except (OSError, json.JSONDecodeError) as error:
        errors.append(f"Could not read source hash baseline {hash_path}: {error}")
        return {}

    if not isinstance(hashes, dict):
        errors.append(f"Source hash baseline must be an object: {hash_path}")
        return {}
    return hashes


def validate_product(
    product: dict,
    root: Path,
    saved_hashes: dict[str, str],
    require_outputs: bool,
    errors: list[str],
) -> None:
    slug = product.get("slug")
    if not isinstance(slug, str) or not slug:
        errors.append("Product is missing a slug")
        return

    status = product.get("status")
    if status not in {"draft", "approved"}:
        errors.append(f"{slug}: status must be draft or approved")

    validate_sources(slug, product.get("sourceReferences"), root, saved_hashes, errors)
    validate_outputs(
        slug,
        status,
        product.get("outputs"),
        root,
        require_outputs,
        errors,
    )


def validate_sources(
    slug: str,
    references: object,
    root: Path,
    saved_hashes: dict[str, str],
    errors: list[str],
) -> None:
    if not isinstance(references, list) or not references:
        errors.append(f"{slug}: sourceReferences must be a non-empty list")
        return

    for reference in references:
        try:
            normalized, path = source_path(root, reference)
        except ValueError as error:
            errors.append(f"{slug}: {error}")
            continue

        if not path.is_file():
            errors.append(f"{slug}: missing supplier source {normalized}")
            continue

        expected_hash = saved_hashes.get(normalized)
        if expected_hash is None:
            errors.append(f"{slug}: source hash is missing for {normalized}")
        elif expected_hash != sha256(path):
            errors.append(f"{slug}: source hash changed for {normalized}")


def validate_outputs(
    slug: str,
    status: object,
    outputs: object,
    root: Path,
    require_outputs: bool,
    errors: list[str],
) -> None:
    if not isinstance(outputs, dict):
        errors.append(f"{slug}: outputs must be an object")
        return

    for slot, expected_filename in EXPECTED_FILES.items():
        reference = outputs.get(slot)
        if not isinstance(reference, str):
            errors.append(f"{slug}: missing output path for {slot}")
            continue

        try:
            normalized, path = output_path(root, reference)
        except ValueError as error:
            errors.append(f"{slug}: {error}")
            continue

        if PurePosixPath(normalized).name != expected_filename:
            errors.append(f"{slug}: {slot} must use filename {expected_filename}")
        if f"/editorial-v2/{slug}/" not in f"/{normalized.lstrip('/')}":
            errors.append(f"{slug}: {slot} must be stored in editorial-v2/{slug}")

        if not path.is_file():
            if status == "approved" and require_outputs:
                errors.append(f"{slug}: missing {slot} output {normalized}")
            continue

        validate_image(slug, slot, path, errors)


def validate_image(slug: str, slot: str, path: Path, errors: list[str]) -> None:
    if path.stat().st_size > MAX_BYTES:
        errors.append(f"{slug}: {slot} exceeds {MAX_BYTES} bytes")

    try:
        with Image.open(path) as image:
            if image.format != "WEBP":
                errors.append(f"{slug}: {slot} must be WEBP")
            if image.size != EXPECTED_SIZE:
                errors.append(f"{slug}: {slot} must be {EXPECTED_SIZE[0]}x{EXPECTED_SIZE[1]}")
    except (OSError, UnidentifiedImageError) as error:
        errors.append(f"{slug}: could not open {slot} output {path}: {error}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--require-outputs", action="store_true")
    parser.add_argument("manifest_path", type=Path)
    arguments = parser.parse_args()

    errors = validate_manifest(arguments.manifest_path, arguments.require_outputs)
    for error in errors:
        print(error, file=sys.stderr)
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
