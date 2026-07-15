import argparse
import hashlib
import json
import sys
from pathlib import Path, PurePosixPath


def repository_root(manifest_path: Path) -> Path:
    for parent in manifest_path.resolve().parents:
        if parent.name == "assets":
            return parent.parent
    raise ValueError(f"Manifest must be stored beneath an assets directory: {manifest_path}")


def normalized_reference(reference: str) -> str:
    if not isinstance(reference, str):
        raise ValueError("Source references must be strings")

    normalized = reference.replace("\\", "/")
    path = PurePosixPath(normalized)
    if path.is_absolute() or ".." in path.parts:
        raise ValueError(f"Source reference must stay within the repository: {reference}")
    return path.as_posix()


def source_path(root: Path, reference: str) -> tuple[str, Path]:
    normalized = normalized_reference(reference)
    return normalized, root.joinpath(*PurePosixPath(normalized).parts)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def collect_source_hashes(manifest_path: Path) -> dict[str, str]:
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    root = repository_root(manifest_path)
    references = {
        normalized_reference(reference)
        for product in manifest.get("products", [])
        for reference in product.get("sourceReferences", [])
    }

    missing = [reference for reference in sorted(references) if not source_path(root, reference)[1].is_file()]
    if missing:
        raise FileNotFoundError("Missing supplier source files: " + ", ".join(missing))

    return {
        reference: sha256(source_path(root, reference)[1])
        for reference in sorted(references)
    }


def lock_source_hashes(
    manifest_path: Path, hash_path: Path, verify: bool = False
) -> dict[str, str]:
    hashes = collect_source_hashes(manifest_path)
    if verify:
        if not hash_path.is_file():
            raise FileNotFoundError(f"Source hash baseline does not exist: {hash_path}")
        saved_hashes = json.loads(hash_path.read_text(encoding="utf-8"))
        if saved_hashes != hashes:
            raise ValueError(f"Source hash baseline does not match: {hash_path}")
        return hashes

    if hash_path.exists():
        raise FileExistsError(f"Refusing to overwrite source hash baseline: {hash_path}")

    hash_path.parent.mkdir(parents=True, exist_ok=True)
    hash_path.write_text(json.dumps(hashes, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return hashes


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--verify", action="store_true")
    parser.add_argument("manifest_path", type=Path)
    parser.add_argument("hash_path", type=Path)
    arguments = parser.parse_args()

    try:
        hashes = lock_source_hashes(
            arguments.manifest_path, arguments.hash_path, verify=arguments.verify
        )
    except (FileNotFoundError, FileExistsError, ValueError, json.JSONDecodeError) as error:
        print(error, file=sys.stderr)
        return 1

    action = "Verified" if arguments.verify else "Wrote"
    print(f"{action} {len(hashes)} source hashes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
