from __future__ import annotations

import datetime as _dt
import copy
import json
import re
import shutil
import subprocess
from pathlib import Path
from typing import Any


VIDEO_EXTS = {".mp4", ".mov", ".m4v", ".avi", ".mkv", ".webm"}
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
AUDIO_EXTS = {".mp3", ".wav", ".m4a", ".aac", ".flac"}

DEFAULT_CONFIG: dict[str, Any] = {
    "width": 1080,
    "height": 1920,
    "fps": 60,
    "scene_threshold": 0.35,
    "min_scene_seconds": 0.8,
    "match_threshold": 0.6,
    "assets_dir": "assets",
    "work_dir": "work",
    "final_dir": "final",
    "draft_dir_name": "jianying_draft",
    "caption": {"max_chars_per_line": 18, "max_lines": 2},
}


def pipeline_root() -> Path:
    return Path(__file__).resolve().parents[1]


def load_config(root: Path | None = None) -> dict[str, Any]:
    root = root or pipeline_root()
    config = copy.deepcopy(DEFAULT_CONFIG)
    config_path = root / "config.json"
    if config_path.exists():
        user_config = json.loads(config_path.read_text(encoding="utf-8"))
        deep_update(config, user_config)
    return config


def deep_update(target: dict[str, Any], source: dict[str, Any]) -> None:
    for key, value in source.items():
        if isinstance(value, dict) and isinstance(target.get(key), dict):
            deep_update(target[key], value)
        else:
            target[key] = value


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def run(cmd: list[str], *, check: bool = True, capture: bool = False) -> subprocess.CompletedProcess[str]:
    print("+ " + " ".join(str(part) for part in cmd))
    return subprocess.run(
        [str(part) for part in cmd],
        check=check,
        text=True,
        stdout=subprocess.PIPE if capture else None,
        stderr=subprocess.PIPE if capture else None,
        encoding="utf-8",
        errors="replace",
    )


def ffprobe_duration(path: Path) -> float:
    result = run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        capture=True,
    )
    return float((result.stdout or "0").strip() or 0)


def ffprobe_stream(path: Path) -> dict[str, Any]:
    result = run(
        [
            "ffprobe",
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=width,height,r_frame_rate,duration",
            "-of",
            "json",
            str(path),
        ],
        capture=True,
    )
    payload = json.loads(result.stdout or "{}")
    streams = payload.get("streams") or []
    return streams[0] if streams else {}


def slugify(value: str, fallback: str = "edit") -> str:
    value = re.sub(r"[^A-Za-z0-9._-]+", "-", value).strip("-._")
    return value[:48] or fallback


def default_job_name(reference: Path) -> str:
    stamp = _dt.datetime.now().strftime("%Y-%m-%d-%H%M")
    return f"{stamp}-{slugify(reference.stem)}"


def resolve_under_root(root: Path, maybe_relative: str | Path) -> Path:
    path = Path(maybe_relative)
    return path if path.is_absolute() else root / path


def copy_unique(src: Path, dst_dir: Path, preferred_name: str | None = None) -> Path:
    dst_dir.mkdir(parents=True, exist_ok=True)
    base_name = preferred_name or src.name
    candidate = dst_dir / base_name
    if not candidate.exists():
        shutil.copy2(src, candidate)
        return candidate
    stem = candidate.stem
    suffix = candidate.suffix
    index = 2
    while True:
        candidate = dst_dir / f"{stem}-{index}{suffix}"
        if not candidate.exists():
            shutil.copy2(src, candidate)
            return candidate
        index += 1


def is_video(path: Path) -> bool:
    return path.suffix.lower() in VIDEO_EXTS


def is_image(path: Path) -> bool:
    return path.suffix.lower() in IMAGE_EXTS


def is_audio(path: Path) -> bool:
    return path.suffix.lower() in AUDIO_EXTS


def media_files(root: Path) -> list[Path]:
    if not root.exists():
        return []
    files: list[Path] = []
    for path in root.rglob("*"):
        if path.is_file() and (is_video(path) or is_image(path)):
            files.append(path)
    return sorted(files, key=lambda p: str(p).lower())


def as_abs(path: Path | str | None) -> str | None:
    if path is None:
        return None
    return str(Path(path).resolve())


def rel_to(path: Path, base: Path) -> str:
    try:
        return str(path.resolve().relative_to(base.resolve()))
    except ValueError:
        return str(path.resolve())
