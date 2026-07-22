from __future__ import annotations

import argparse
import datetime as dt
import re
import shutil
from pathlib import Path

from common import (
    as_abs,
    default_job_name,
    ffprobe_duration,
    ffprobe_stream,
    load_config,
    pipeline_root,
    resolve_under_root,
    run,
    write_json,
)


def detect_scenes(reference: Path, threshold: float, min_scene_seconds: float, duration: float) -> list[float]:
    result = run(
        [
            "ffmpeg",
            "-hide_banner",
            "-i",
            str(reference),
            "-filter:v",
            f"select='gt(scene,{threshold})',showinfo",
            "-f",
            "null",
            "-",
        ],
        check=False,
        capture=True,
    )
    raw = (result.stderr or "") + "\n" + (result.stdout or "")
    times = [float(match.group(1)) for match in re.finditer(r"pts_time:([0-9.]+)", raw)]
    boundaries = [0.0]
    for value in sorted(set(round(t, 3) for t in times)):
        if value <= 0.05 or value >= duration - 0.05:
            continue
        if value - boundaries[-1] >= min_scene_seconds:
            boundaries.append(value)
    if duration - boundaries[-1] < min_scene_seconds and len(boundaries) > 1:
        boundaries.pop()
    boundaries.append(round(duration, 3))
    return boundaries


def extract_clip(reference: Path, start: float, duration: float, out_path: Path) -> None:
    run(
        [
            "ffmpeg",
            "-hide_banner",
            "-y",
            "-ss",
            f"{start:.3f}",
            "-i",
            str(reference),
            "-t",
            f"{duration:.3f}",
            "-map",
            "0:v:0",
            "-an",
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-crf",
            "20",
            "-pix_fmt",
            "yuv420p",
            str(out_path),
        ]
    )


def extract_keyframe(reference: Path, at_time: float, out_path: Path) -> None:
    run(
        [
            "ffmpeg",
            "-hide_banner",
            "-y",
            "-ss",
            f"{at_time:.3f}",
            "-i",
            str(reference),
            "-frames:v",
            "1",
            "-update",
            "1",
            "-q:v",
            "2",
            str(out_path),
        ]
    )


def extract_audio(reference: Path, out_path: Path) -> Path | None:
    result = run(
        [
            "ffmpeg",
            "-hide_banner",
            "-y",
            "-i",
            str(reference),
            "-vn",
            "-ac",
            "1",
            "-ar",
            "44100",
            "-q:a",
            "3",
            str(out_path),
        ],
        check=False,
        capture=True,
    )
    if result.returncode == 0 and out_path.exists() and out_path.stat().st_size > 0:
        return out_path
    if out_path.exists():
        out_path.unlink()
    print("No usable audio stream was extracted.")
    return None


def main() -> None:
    parser = argparse.ArgumentParser(description="Analyze a reference video into recipe.json.")
    parser.add_argument("--reference", required=True, help="Path to the reference video.")
    parser.add_argument("--job-name", default="", help="Optional job folder name under work/.")
    parser.add_argument("--job-dir", default="", help="Explicit output job directory.")
    parser.add_argument("--threshold", type=float, default=None, help="FFmpeg scene threshold.")
    parser.add_argument("--min-scene-seconds", type=float, default=None, help="Minimum scene duration.")
    args = parser.parse_args()

    root = pipeline_root()
    config = load_config(root)
    reference = resolve_under_root(root, args.reference).resolve()
    if not reference.exists():
        raise FileNotFoundError(reference)

    threshold = args.threshold if args.threshold is not None else float(config["scene_threshold"])
    min_scene_seconds = (
        args.min_scene_seconds if args.min_scene_seconds is not None else float(config["min_scene_seconds"])
    )

    if args.job_dir:
        job_dir = resolve_under_root(root, args.job_dir)
    else:
        job_name = args.job_name or default_job_name(reference)
        job_dir = root / str(config["work_dir"]) / job_name
    job_dir.mkdir(parents=True, exist_ok=True)
    clips_dir = job_dir / "video_clips"
    clips_dir.mkdir(parents=True, exist_ok=True)

    reference_copy = job_dir / "reference.mp4"
    if reference.resolve() != reference_copy.resolve():
        shutil.copy2(reference, reference_copy)
    else:
        reference_copy = reference

    duration = ffprobe_duration(reference_copy)
    if duration <= 0:
        raise RuntimeError(f"Could not read duration from {reference_copy}")

    stream = ffprobe_stream(reference_copy)
    boundaries = detect_scenes(reference_copy, threshold, min_scene_seconds, duration)
    clips = []
    for index, (start, end) in enumerate(zip(boundaries, boundaries[1:]), start=1):
        frag_id = f"fragment{index:02d}"
        clip_duration = max(0.05, end - start)
        clip_path = clips_dir / f"{frag_id}.mp4"
        keyframe_path = clips_dir / f"{frag_id}.jpg"
        extract_clip(reference_copy, start, clip_duration, clip_path)
        extract_keyframe(reference_copy, start + clip_duration / 2, keyframe_path)
        clips.append(
            {
                "id": frag_id,
                "index": index,
                "start": round(start, 3),
                "end": round(end, 3),
                "duration": round(clip_duration, 3),
                "reference_clip": as_abs(clip_path),
                "keyframe": as_abs(keyframe_path),
                "text": "",
            }
        )

    audio_path = extract_audio(reference_copy, job_dir / "reference_audio.mp3")
    recipe = {
        "schema": "mythrealms.video.recipe.v1",
        "created_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "source_reference": as_abs(reference),
        "reference_video": as_abs(reference_copy),
        "reference_audio": as_abs(audio_path) if audio_path else None,
        "video": {
            "duration": round(duration, 3),
            "width": stream.get("width"),
            "height": stream.get("height"),
            "fps": stream.get("r_frame_rate"),
            "scene_threshold": threshold,
            "min_scene_seconds": min_scene_seconds,
        },
        "clips": clips,
    }
    recipe_path = job_dir / "recipe.json"
    write_json(recipe_path, recipe)

    script_path = job_dir / "script.txt"
    if not script_path.exists():
        script_path.write_text(
            "\n".join(f"{clip['id']}\t" for clip in clips) + "\n",
            encoding="utf-8",
        )

    print(f"JOB_DIR={job_dir.resolve()}")
    print(f"RECIPE={recipe_path.resolve()}")
    print(f"SCENES={len(clips)}")


if __name__ == "__main__":
    main()
