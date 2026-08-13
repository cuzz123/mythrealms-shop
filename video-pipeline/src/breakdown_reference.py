from __future__ import annotations

import argparse
from pathlib import Path

from analyze_reference import detect_scenes, extract_keyframe
from common import (
    default_job_name,
    ffprobe_duration,
    load_config,
    pipeline_root,
    read_json,
    resolve_under_root,
    write_json,
)


READY_STATUSES = {"approved", "available_static", "available_360_background"}


def build_beat_boundaries(
    duration: float,
    cut_boundaries: list[float],
    beat_interval: float,
    min_interval: float = 0.12,
) -> list[float]:
    """Return the edit cuts plus regular review beats for one reference video."""
    if duration <= 0:
        raise ValueError("duration must be positive")
    if beat_interval <= 0:
        raise ValueError("beat_interval must be positive")

    cuts = {round(value, 3) for value in (0.0, duration, *cut_boundaries) if 0 <= value <= duration}
    candidates = set(cuts)
    tick = beat_interval
    while tick < duration:
        candidate = round(tick, 3)
        if all(abs(candidate - cut) >= min_interval for cut in cuts):
            candidates.add(candidate)
        tick += beat_interval

    return sorted(candidates)


def build_breakdown_records(boundaries: list[float], keyframe_paths: list[object]) -> list[dict]:
    """Create conservative, reviewer-editable director notes for every beat."""
    records = []
    for index, (start, end) in enumerate(zip(boundaries, boundaries[1:]), start=1):
        records.append(
            {
                "id": f"beat_{index:03d}",
                "start": start,
                "end": end,
                "duration": round(end - start, 3),
                "keyframe": str(keyframe_paths[index - 1]),
                "editing": {"type": "continuous"},
                "camera": {
                    "scale": "unknown",
                    "movement": "unknown",
                    "direction": "unknown",
                    "lens_feel": "unknown",
                    "focus_behavior": "unknown",
                },
                "blocking": {
                    "roles": [],
                    "subject_direction": "unknown",
                    "subject_position": "unknown",
                    "product_position": "unknown",
                    "anchor_object": "unknown",
                    "relative_position_notes": "",
                },
                "lighting": {
                    "key_direction": "unknown",
                    "quality": "unknown",
                    "color_temperature": "unknown",
                    "contrast": "unknown",
                    "practicals": [],
                },
                "viral_hook": {
                    "visual_hook": "unknown",
                    "information_change": "unknown",
                    "product_visibility": "unknown",
                    "transition_mechanism": "unknown",
                    "audio_cue": "unknown",
                },
                "assets": {"selected_ids": [], "required_capabilities": []},
                "review": {"similarity_score": None, "notes": ""},
            }
        )
    return records


def audit_asset_capabilities(registry: dict, records: list[dict]) -> dict:
    """Report reusable candidates without changing the asset registry."""
    requirements = sorted(
        {
            capability
            for record in records
            for capability in record["assets"]["required_capabilities"]
        }
    )
    result = {"requirements": [], "gaps": []}
    for capability in requirements:
        candidates = [
            asset
            for asset in registry.get("assets", [])
            if capability in asset.get("tags", [])
        ]
        ready = [asset["id"] for asset in candidates if asset.get("status") in READY_STATUSES]
        non_ready = [
            asset["id"] for asset in candidates if asset.get("status") not in READY_STATUSES
        ]
        result["requirements"].append(
            {
                "capability": capability,
                "ready_candidates": ready,
                "non_ready_candidates": non_ready,
            }
        )
        if not candidates:
            result["gaps"].append({"capability": capability, "status": "proposed"})
    return result


def render_obsidian_report(records: list[dict]) -> str:
    """Render a compact review sheet whose unknown values need human direction."""
    lines = [
        "---",
        "type: viral_video_breakdown",
        "status: needs_review",
        "---",
        "",
        "# 爆款视频拆解审阅",
        "",
        "- 数据：[[breakdown.json]]",
        "- 资产建议：[[asset-gaps.json]]",
        "- 说明：所有视觉语义初始为 `unknown`，请先补全镜头、站位、灯光和爆点，再验收资产缺口。",
        "",
        "| 节拍 | 时间 | 关键帧 | 镜头 / 站位 / 灯光 |",
        "| --- | --- | --- | --- |",
    ]
    for record in records:
        keyframe = record["keyframe"].replace("\\", "/")
        lines.append(
            "| {id} | {start:.3f}–{end:.3f}s | [[{keyframe}]] | "
            "{camera} / {blocking} / {lighting} |".format(
                id=record["id"],
                start=record["start"],
                end=record["end"],
                keyframe=keyframe,
                camera=record["camera"]["movement"],
                blocking=record["blocking"]["subject_position"],
                lighting=record["lighting"]["key_direction"],
            )
        )
    return "\n".join(lines) + "\n"


def write_obsidian_entry(obsidian_vault: Path, job_dir: Path, output_dir: Path) -> Path:
    """Expose a generated review job inside the user's Obsidian asset vault."""
    entry = obsidian_vault / "03-参考拆解" / f"拆解｜{job_dir.name}.md"
    report = output_dir / "obsidian-report.md"
    breakdown = output_dir / "breakdown.json"
    asset_gaps = output_dir / "asset-gaps.json"
    entry.parent.mkdir(parents=True, exist_ok=True)
    entry.write_text(
        "\n".join(
            [
                "---",
                "type: reference_breakdown",
                "status: needs_review",
                f"job: {job_dir.name}",
                "---",
                "",
                f"# 拆解｜{job_dir.name}",
                "",
                f"- [打开完整拆解报告]({report.resolve().as_uri()})",
                f"- [结构化拆解 JSON]({breakdown.resolve().as_uri()})",
                f"- [资产缺口建议]({asset_gaps.resolve().as_uri()})",
                "",
                "> 先在完整报告中补全 `unknown` 视觉字段，再把确认过的资产缺口纳入生产队列。",
                "",
            ]
        ),
        encoding="utf-8",
    )
    return entry


def write_breakdown_artifacts(
    job_dir: Path,
    duration: float,
    cut_boundaries: list[float],
    beat_interval: float,
    keyframe_writer: object,
    registry: dict,
    obsidian_vault: Path | None = None,
) -> dict:
    """Write review-only breakdown files underneath an existing job directory."""
    output_dir = job_dir / "breakdown"
    keyframe_dir = output_dir / "keyframes"
    keyframe_dir.mkdir(parents=True, exist_ok=True)

    boundaries = build_beat_boundaries(duration, cut_boundaries, beat_interval)
    keyframes = []
    for index, at_time in enumerate(boundaries[:-1], start=1):
        frame_path = keyframe_dir / f"beat_{index:03d}.jpg"
        keyframe_writer(at_time, frame_path)
        keyframes.append(frame_path)

    records = build_breakdown_records(
        boundaries,
        [path.relative_to(output_dir).as_posix() for path in keyframes],
    )
    audit = audit_asset_capabilities(registry, records)
    write_json(output_dir / "beat_timeline.json", {"boundaries": boundaries})
    write_json(
        output_dir / "breakdown.json",
        {"schema": "mythrealms.viral-breakdown.v1", "beats": records},
    )
    write_json(output_dir / "asset-gaps.json", audit)
    report_path = output_dir / "obsidian-report.md"
    report_path.write_text(render_obsidian_report(records), encoding="utf-8")
    obsidian_entry = (
        write_obsidian_entry(obsidian_vault, job_dir, output_dir) if obsidian_vault else None
    )
    return {
        "records": records,
        "output_dir": output_dir,
        "obsidian_entry": obsidian_entry,
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Create a review-only viral-video breakdown from a local MP4."
    )
    parser.add_argument("--reference", required=True, help="Path to the local reference MP4.")
    parser.add_argument("--job-name", default="", help="Optional output folder name under work/.")
    parser.add_argument("--job-dir", default="", help="Explicit output job directory.")
    parser.add_argument("--beat-interval", type=float, default=0.8, help="Review beat interval.")
    parser.add_argument("--registry", default="", help="Optional asset registry JSON path.")
    parser.add_argument(
        "--obsidian-vault",
        default="asset-library/obsidian-vault",
        help="Obsidian vault where a review-entry card is written.",
    )
    args = parser.parse_args()

    root = pipeline_root()
    reference = resolve_under_root(root, args.reference).resolve()
    if not reference.exists():
        raise FileNotFoundError(reference)

    config = load_config(root)
    if args.job_dir:
        job_dir = resolve_under_root(root, args.job_dir)
    else:
        job_dir = root / str(config["work_dir"]) / (args.job_name or default_job_name(reference))
    job_dir.mkdir(parents=True, exist_ok=True)

    registry_path = resolve_under_root(
        root,
        args.registry or "asset-library/registry/assets.json",
    ).resolve()
    if not registry_path.exists():
        raise FileNotFoundError(registry_path)

    duration = ffprobe_duration(reference)
    if duration <= 0:
        raise RuntimeError(f"Could not read duration from {reference}")
    cut_boundaries = detect_scenes(
        reference,
        float(config["scene_threshold"]),
        float(config["min_scene_seconds"]),
        duration,
    )
    result = write_breakdown_artifacts(
        job_dir=job_dir,
        duration=duration,
        cut_boundaries=cut_boundaries,
        beat_interval=args.beat_interval,
        keyframe_writer=lambda at_time, path: extract_keyframe(reference, at_time, path),
        registry=read_json(registry_path),
        obsidian_vault=resolve_under_root(root, args.obsidian_vault).resolve(),
    )
    print(f"JOB_DIR={job_dir.resolve()}")
    print(f"BREAKDOWN_DIR={result['output_dir'].resolve()}")
    print(f"OBSIDIAN_ENTRY={result['obsidian_entry']}")
    print(f"BEATS={len(result['records'])}")


if __name__ == "__main__":
    main()
