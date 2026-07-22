from __future__ import annotations

import argparse
import json
import re
import shutil
from pathlib import Path

from common import (
    as_abs,
    ffprobe_duration,
    is_image,
    is_video,
    load_config,
    pipeline_root,
    read_json,
    resolve_under_root,
    run,
    write_json,
)


def srt_time(seconds: float) -> str:
    ms = int(round(seconds * 1000))
    hours, rem = divmod(ms, 3600_000)
    minutes, rem = divmod(rem, 60_000)
    secs, millis = divmod(rem, 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"


def load_script_lines(path: Path | None) -> list[str]:
    if not path or not path.exists():
        return []
    lines = []
    for raw in path.read_text(encoding="utf-8").splitlines():
        raw_line = raw.rstrip()
        line = raw_line.strip()
        if not line:
            continue
        if "\t" in raw_line:
            line = raw_line.split("\t", 1)[1].strip()
        elif ":" in line and line.lower().startswith("fragment"):
            line = line.split(":", 1)[1].strip()
        elif re.fullmatch(r"fragment\d+", line, flags=re.IGNORECASE):
            line = ""
        if line:
            lines.append(line)
    return lines


def write_srt(path: Path, timeline: list[dict]) -> None:
    rows = []
    index = 1
    for item in timeline:
        text = (item.get("caption") or "").strip()
        if not text:
            continue
        rows.append(str(index))
        rows.append(f"{srt_time(item['start'])} --> {srt_time(item['end'])}")
        rows.append(text)
        rows.append("")
        index += 1
    path.write_text("\n".join(rows), encoding="utf-8")


def make_clip(media: Path, duration: float, width: int, height: int, fps: int, out_path: Path) -> None:
    vf = (
        f"scale={width}:{height}:force_original_aspect_ratio=decrease,"
        f"pad={width}:{height}:(ow-iw)/2:(oh-ih)/2:black,setsar=1,"
        f"fps={fps},format=yuv420p"
    )
    if is_image(media):
        input_args = ["-loop", "1", "-i", str(media)]
    elif is_video(media):
        input_args = ["-stream_loop", "-1", "-i", str(media)]
    else:
        raise ValueError(f"Unsupported media: {media}")
    run(
        [
            "ffmpeg",
            "-hide_banner",
            "-y",
            *input_args,
            "-t",
            f"{duration:.3f}",
            "-an",
            "-vf",
            vf,
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


def concat_clips(clips: list[Path], out_path: Path) -> None:
    concat_file = out_path.parent / "concat.txt"
    lines = []
    for clip in clips:
        safe = str(clip.resolve()).replace("\\", "/").replace("'", "'\\''")
        lines.append(f"file '{safe}'")
    concat_file.write_text("\n".join(lines), encoding="utf-8")
    run(
        [
            "ffmpeg",
            "-hide_banner",
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(concat_file),
            "-c",
            "copy",
            str(out_path),
        ]
    )


def add_audio(video_path: Path, audio_path: Path, out_path: Path) -> None:
    run(
        [
            "ffmpeg",
            "-hide_banner",
            "-y",
            "-i",
            str(video_path),
            "-i",
            str(audio_path),
            "-map",
            "0:v:0",
            "-map",
            "1:a:0",
            "-shortest",
            "-c:v",
            "copy",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-movflags",
            "+faststart",
            str(out_path),
        ]
    )


def create_jianying_draft(
    job_dir: Path,
    draft_name: str,
    width: int,
    height: int,
    fps: int,
    timeline: list[dict],
    audio_path: Path | None,
    captions_path: Path,
) -> dict:
    report = {"status": "skipped", "path": None, "error": None}
    try:
        import pyJianYingDraft as jy
    except Exception as exc:  # pragma: no cover - optional dependency
        report["error"] = f"pyJianYingDraft import failed: {exc}"
        return report

    try:
        parent = job_dir / "jianying_draft"
        parent.mkdir(parents=True, exist_ok=True)
        folder = jy.DraftFolder(str(parent))
        script = folder.create_draft(draft_name, width, height, fps=fps, allow_replace=True)
        script.add_track(jy.TrackType.video, "main")

        for item in timeline:
            media = item["media_path"]
            material = jy.VideoMaterial(media)
            script.add_material(material)
            segment = jy.VideoSegment(
                material,
                jy.Timerange(int(item["start"] * jy.SEC), int(item["duration"] * jy.SEC)),
            )
            segment.add_background_filling("color", color="#000000")
            script.add_segment(segment, "main")

        if audio_path and audio_path.exists():
            script.add_track(jy.TrackType.audio, "voice")
            audio_material = jy.AudioMaterial(str(audio_path.resolve()))
            script.add_material(audio_material)
            total_duration = sum(float(item["duration"]) for item in timeline)
            script.add_segment(
                jy.AudioSegment(audio_material, jy.Timerange(0, int(total_duration * jy.SEC))),
                "voice",
            )

        if captions_path.exists() and captions_path.read_text(encoding="utf-8").strip():
            script.import_srt(str(captions_path.resolve()), "captions")

        script.save()
        report["status"] = "created"
        report["path"] = str((parent / draft_name).resolve())
    except Exception as exc:
        report["status"] = "failed"
        report["error"] = str(exc)
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description="Render remix.mp4 and optional Jianying draft.")
    parser.add_argument("--recipe", required=True, help="Path to recipe.json.")
    parser.add_argument("--matches", required=True, help="Path to matches.json.")
    parser.add_argument("--output", default="", help="Output video path. Defaults to job/remix.mp4.")
    parser.add_argument("--voice", default="", help="Optional final voice audio.")
    parser.add_argument("--script", default="", help="Optional script.txt for captions.")
    parser.add_argument("--draft", action="store_true", help="Try to create a Jianying draft.")
    parser.add_argument("--draft-name", default="", help="Jianying draft folder name.")
    args = parser.parse_args()

    root = pipeline_root()
    config = load_config(root)
    recipe_path = resolve_under_root(root, args.recipe).resolve()
    matches_path = resolve_under_root(root, args.matches).resolve()
    recipe = read_json(recipe_path)
    matches = read_json(matches_path)
    job_dir = recipe_path.parent
    output = resolve_under_root(root, args.output).resolve() if args.output else job_dir / "remix.mp4"
    output.parent.mkdir(parents=True, exist_ok=True)

    width = int(config["width"])
    height = int(config["height"])
    fps = int(config["fps"])
    script_path = resolve_under_root(root, args.script).resolve() if args.script else job_dir / "script.txt"
    script_lines = load_script_lines(script_path)
    match_by_id = {item["id"]: item for item in matches.get("matches", [])}

    timeline = []
    cursor = 0.0
    for index, clip in enumerate(recipe.get("clips", [])):
        match = match_by_id.get(clip["id"], {})
        media_path = match.get("material_path") or clip.get("keyframe")
        media = Path(media_path)
        caption = script_lines[index] if index < len(script_lines) else clip.get("text", "")
        duration = float(clip["duration"])
        timeline.append(
            {
                "id": clip["id"],
                "start": round(cursor, 3),
                "end": round(cursor + duration, 3),
                "duration": round(duration, 3),
                "media_path": str(media.resolve()),
                "missing_material": not bool(match.get("material_path")),
                "confidence": match.get("confidence", 0.0),
                "caption": caption,
            }
        )
        cursor += duration

    cache_dir = job_dir / "render_cache"
    if cache_dir.exists():
        shutil.rmtree(cache_dir)
    cache_dir.mkdir(parents=True, exist_ok=True)

    rendered_clips = []
    for item in timeline:
        clip_out = cache_dir / f"{item['id']}.mp4"
        make_clip(Path(item["media_path"]), float(item["duration"]), width, height, fps, clip_out)
        rendered_clips.append(clip_out)

    no_audio = cache_dir / "remix-no-audio.mp4"
    concat_clips(rendered_clips, no_audio)

    voice = resolve_under_root(root, args.voice).resolve() if args.voice else job_dir / "voice" / "final_voice.mp3"
    audio_path = voice if voice.exists() else None
    if audio_path:
        add_audio(no_audio, audio_path, output)
    else:
        shutil.copy2(no_audio, output)

    captions_path = job_dir / "captions.srt"
    write_srt(captions_path, timeline)

    manifest = {
        "schema": "mythrealms.video.timeline_manifest.v1",
        "recipe": as_abs(recipe_path),
        "matches": as_abs(matches_path),
        "output": as_abs(output),
        "captions": as_abs(captions_path),
        "audio": as_abs(audio_path) if audio_path else None,
        "width": width,
        "height": height,
        "fps": fps,
        "duration": round(cursor, 3),
        "timeline": timeline,
    }

    draft_report = {"status": "skipped", "path": None, "error": None}
    if args.draft:
        draft_name = args.draft_name or f"{job_dir.name}-remix"
        draft_report = create_jianying_draft(job_dir, draft_name, width, height, fps, timeline, audio_path, captions_path)
    manifest["jianying_draft"] = draft_report
    write_json(job_dir / "timeline_manifest.json", manifest)
    write_json(job_dir / "draft_report.json", draft_report)

    print(f"OUTPUT={output.resolve()}")
    print(f"CAPTIONS={captions_path.resolve()}")
    print(f"MANIFEST={(job_dir / 'timeline_manifest.json').resolve()}")
    print(f"DRAFT_STATUS={draft_report['status']}")
    if draft_report.get("path"):
        print(f"DRAFT_PATH={draft_report['path']}")
    if draft_report.get("error"):
        print(f"DRAFT_ERROR={draft_report['error']}")


if __name__ == "__main__":
    main()
