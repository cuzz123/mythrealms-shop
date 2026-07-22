from __future__ import annotations

import argparse
import hashlib
import shutil
from dataclasses import dataclass
from pathlib import Path

import cv2
import numpy as np

from common import (
    as_abs,
    is_image,
    is_video,
    load_config,
    media_files,
    pipeline_root,
    read_json,
    resolve_under_root,
    write_json,
)


@dataclass
class Feature:
    hist: np.ndarray
    brightness: float
    aspect: float
    fingerprint: str


@dataclass
class Candidate:
    path: Path
    feature: Feature
    source_folder: str


def frame_feature(frame: np.ndarray) -> Feature:
    h, w = frame.shape[:2]
    resized = cv2.resize(frame, (160, 90), interpolation=cv2.INTER_AREA)
    hsv = cv2.cvtColor(resized, cv2.COLOR_BGR2HSV)
    hist = cv2.calcHist([hsv], [0, 1, 2], None, [8, 8, 8], [0, 180, 0, 256, 0, 256])
    cv2.normalize(hist, hist)
    gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
    tiny = cv2.resize(gray, (8, 8), interpolation=cv2.INTER_AREA)
    bits = tiny > tiny.mean()
    digest = hashlib.sha1(np.packbits(bits).tobytes()).hexdigest()[:16]
    return Feature(
        hist=hist.flatten().astype("float32"),
        brightness=float(gray.mean() / 255.0),
        aspect=float(w / h) if h else 1.0,
        fingerprint=digest,
    )


def feature_from_image(path: Path) -> Feature | None:
    frame = cv2.imread(str(path))
    if frame is None:
        return None
    return frame_feature(frame)


def feature_from_video(path: Path) -> Feature | None:
    capture = cv2.VideoCapture(str(path))
    if not capture.isOpened():
        return None
    count = int(capture.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    positions = [0.15, 0.5, 0.85] if count > 12 else [0.5]
    features: list[Feature] = []
    for pos in positions:
        target = max(0, min(count - 1, int(count * pos))) if count > 0 else 0
        capture.set(cv2.CAP_PROP_POS_FRAMES, target)
        ok, frame = capture.read()
        if ok and frame is not None:
            features.append(frame_feature(frame))
    capture.release()
    if not features:
        return None
    hist = np.mean([item.hist for item in features], axis=0).astype("float32")
    brightness = float(np.mean([item.brightness for item in features]))
    aspect = float(np.mean([item.aspect for item in features]))
    digest = hashlib.sha1(b"".join(item.fingerprint.encode("ascii") for item in features)).hexdigest()[:16]
    return Feature(hist=hist, brightness=brightness, aspect=aspect, fingerprint=digest)


def feature_for_path(path: Path) -> Feature | None:
    if is_image(path):
        return feature_from_image(path)
    if is_video(path):
        return feature_from_video(path)
    return None


def similarity(a: Feature, b: Feature) -> float:
    corr = float(cv2.compareHist(a.hist, b.hist, cv2.HISTCMP_CORREL))
    corr = max(0.0, min(1.0, (corr + 1.0) / 2.0))
    brightness = 1.0 - min(1.0, abs(a.brightness - b.brightness))
    aspect = 1.0 - min(1.0, abs(a.aspect - b.aspect) / max(a.aspect, b.aspect, 0.1))
    return round(0.74 * corr + 0.16 * brightness + 0.10 * aspect, 4)


def build_candidates(assets_dir: Path) -> list[Candidate]:
    candidates: list[Candidate] = []
    for path in media_files(assets_dir):
        feature = feature_for_path(path)
        if feature is None:
            continue
        try:
            folder = str(path.parent.resolve().relative_to(assets_dir.resolve()))
        except ValueError:
            folder = path.parent.name
        candidates.append(Candidate(path=path, feature=feature, source_folder=folder))
    return candidates


def copy_selected(candidate: Candidate, fragment_dir: Path) -> Path:
    fragment_dir.mkdir(parents=True, exist_ok=True)
    target = fragment_dir / candidate.path.name
    if target.exists():
        if target.resolve() == candidate.path.resolve():
            return target
        target = fragment_dir / f"{candidate.path.stem}-{candidate.feature.fingerprint}{candidate.path.suffix}"
    shutil.copy2(candidate.path, target)
    return target


def main() -> None:
    parser = argparse.ArgumentParser(description="Match assets to a reference recipe.")
    parser.add_argument("--recipe", required=True, help="Path to recipe.json.")
    parser.add_argument("--assets", default="", help="Path to the reusable material library.")
    parser.add_argument("--output", default="", help="Job folder. Defaults to recipe parent.")
    parser.add_argument("--threshold", type=float, default=None, help="Minimum confidence.")
    args = parser.parse_args()

    root = pipeline_root()
    config = load_config(root)
    recipe_path = resolve_under_root(root, args.recipe).resolve()
    recipe = read_json(recipe_path)
    job_dir = resolve_under_root(root, args.output).resolve() if args.output else recipe_path.parent
    assets_dir = resolve_under_root(root, args.assets or config["assets_dir"]).resolve()
    threshold = args.threshold if args.threshold is not None else float(config["match_threshold"])

    candidates = build_candidates(assets_dir)
    print(f"Candidates: {len(candidates)} from {assets_dir}")

    fragment_plan = {
        "schema": "mythrealms.video.fragment_plan.v1",
        "recipe": as_abs(recipe_path),
        "assets_dir": as_abs(assets_dir),
        "threshold": threshold,
        "fragments": [],
    }
    matches = {
        "schema": "mythrealms.video.matches.v1",
        "recipe": as_abs(recipe_path),
        "assets_dir": as_abs(assets_dir),
        "threshold": threshold,
        "matches": [],
    }

    recent_fingerprints: list[str] = []
    recent_folders: list[str] = []
    material_dir = job_dir / "material"

    for clip in recipe.get("clips", []):
        fragment_id = clip["id"]
        keyframe = Path(clip["keyframe"])
        ref_feature = feature_for_path(keyframe)
        ranked = []
        if ref_feature is not None:
            for candidate in candidates:
                raw_score = similarity(ref_feature, candidate.feature)
                adjusted = raw_score
                if candidate.feature.fingerprint in recent_fingerprints:
                    adjusted -= 0.18
                if candidate.source_folder in recent_folders:
                    adjusted -= 0.08
                ranked.append((round(max(0.0, adjusted), 4), raw_score, candidate))
            ranked.sort(key=lambda item: item[0], reverse=True)

        best = ranked[0] if ranked else None
        status = "missing"
        copied_path: Path | None = None
        confidence = 0.0
        selected_candidate: Candidate | None = None
        if best and best[0] >= threshold:
            confidence, raw_score, selected_candidate = best
            copied_path = copy_selected(selected_candidate, material_dir / fragment_id)
            status = "matched"
            recent_fingerprints.append(selected_candidate.feature.fingerprint)
            recent_folders.append(selected_candidate.source_folder)
            recent_fingerprints = recent_fingerprints[-2:]
            recent_folders = recent_folders[-2:]

        top_candidates = [
            {
                "path": as_abs(candidate.path),
                "source_folder": candidate.source_folder,
                "score": adjusted,
                "raw_score": raw_score,
                "fingerprint": candidate.feature.fingerprint,
            }
            for adjusted, raw_score, candidate in ranked[:5]
        ]
        fragment_plan["fragments"].append(
            {
                "id": fragment_id,
                "duration": clip["duration"],
                "keyframe": clip["keyframe"],
                "constraints": [
                    "copy selected material; never move originals",
                    "mark missing when confidence is below threshold",
                    "avoid adjacent repetition where possible",
                ],
                "top_candidates": top_candidates,
            }
        )
        matches["matches"].append(
            {
                "id": fragment_id,
                "status": status,
                "confidence": confidence,
                "reference_keyframe": clip["keyframe"],
                "source_path": as_abs(selected_candidate.path) if selected_candidate else None,
                "material_path": as_abs(copied_path) if copied_path else None,
                "source_folder": selected_candidate.source_folder if selected_candidate else None,
                "fingerprint": selected_candidate.feature.fingerprint if selected_candidate else None,
                "top_candidates": top_candidates,
            }
        )
        print(f"{fragment_id}: {status} confidence={confidence:.3f}")

    write_json(job_dir / "fragment_plan.json", fragment_plan)
    write_json(job_dir / "matches.json", matches)
    print(f"FRAGMENT_PLAN={(job_dir / 'fragment_plan.json').resolve()}")
    print(f"MATCHES={(job_dir / 'matches.json').resolve()}")


if __name__ == "__main__":
    main()
