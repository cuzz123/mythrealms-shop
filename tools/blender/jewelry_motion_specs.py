from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Dict


@dataclass(frozen=True)
class MotionBeat:
    frame: int
    phase: str
    hand_target: str | None = None
    head_response: str | None = None


@dataclass(frozen=True)
class MotionSpec:
    id: str
    name_zh: str
    frames: int
    fps: int
    beats: tuple[MotionBeat, ...]
    targets: Dict[str, str]
    paired_camera_id: str


def load_motion_specs(path: Path) -> Dict[str, MotionSpec]:
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f, object_pairs_hook=_reject_duplicate_keys)

    specs: Dict[str, MotionSpec] = {}
    for spec_id, spec_data in data.items():
        if spec_id in specs:
            raise ValueError(f"Duplicate motion spec ID: {spec_id}")

        frames = spec_data["frames"]
        if frames != 72:
            raise ValueError(
                f"Motion spec '{spec_id}' has {frames} frames, expected 72"
            )

        fps = spec_data["fps"]
        if fps != 24:
            raise ValueError(f"Motion spec '{spec_id}' has {fps} fps, expected 24")

        if "paired_camera_id" not in spec_data:
            raise ValueError(
                f"Motion spec '{spec_id}' is missing paired_camera_id"
            )

        targets = spec_data.get("targets", {})
        if "hand" not in targets:
            raise ValueError(f"Motion spec '{spec_id}' is missing hand target")

        beat_frames = [b["frame"] for b in spec_data["beats"]]
        for i in range(1, len(beat_frames)):
            if beat_frames[i] <= beat_frames[i - 1]:
                raise ValueError(
                    f"Motion spec '{spec_id}' has unordered or duplicate beat frames"
                )

        beats = tuple(
            MotionBeat(
                frame=beat["frame"],
                phase=beat["phase"],
                hand_target=beat.get("hand_target"),
                head_response=beat.get("head_response"),
            )
            for beat in spec_data["beats"]
        )

        spec = MotionSpec(
            id=spec_id,
            name_zh=spec_data["name_zh"],
            frames=frames,
            fps=fps,
            beats=beats,
            targets=targets,
            paired_camera_id=spec_data["paired_camera_id"],
        )
        specs[spec_id] = spec

    return specs


def _reject_duplicate_keys(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f"Duplicate motion spec ID or JSON key: {key}")
        result[key] = value
    return result
