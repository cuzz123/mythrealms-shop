from __future__ import annotations

import json
import hashlib
import math
import subprocess
import sys
from functools import lru_cache
from pathlib import Path

import bpy
from bpy_extras.object_utils import world_to_camera_view


ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from white_coat_walk_specs import (  # noqa: E402
    CAMERA_CATALOG_ID,
    FPS,
    FRAMES,
    MOTION_CATALOG_ID,
    RIG_NAME,
    WALKS,
)


PACK_DIR = (
    ROOT
    / "video-pipeline"
    / "asset-library"
    / "06-motions"
    / "WHITE_COAT_WALK_PACK_001"
)
PACK_BLEND = PACK_DIR / "WHITE_COAT_WALK_PACK_v1.blend"
MANIFEST_PATH = PACK_DIR / "motion_manifest.json"
CARDS_DIR = ROOT / "video-pipeline" / "asset-library" / "obsidian-vault" / "01-资产卡"
INDEX_PATH = (
    ROOT
    / "video-pipeline"
    / "asset-library"
    / "obsidian-vault"
    / "00-首页"
    / "白色长外套全身模特走路测试包索引.md"
)
REGISTRY_PATH = ROOT / "video-pipeline" / "asset-library" / "registry" / "assets.json"
CHARACTER_MODEL = (
    ROOT
    / "video-pipeline"
    / "asset-library"
    / "05-characters"
    / "CHAR_HUNYUAN_WHITE_COAT_FULLBODY_001"
    / "model.json"
)
PREVIEW_SCRIPT = ROOT / "tools" / "blender" / "render_white_coat_walk_pack_previews.py"
REVIEW_BUILDER = ROOT / "tools" / "blender" / "build_white_coat_walk_review_sheet.py"
REVIEW_FINGERPRINT = PACK_DIR / "preview" / ".review_fingerprint.json"


@lru_cache(maxsize=None)
def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def expected_render_fingerprint(action_id: str, camera_id: str) -> dict[str, object]:
    return {
        "version": 1,
        "blend_sha256": sha256_file(PACK_BLEND),
        "renderer_sha256": sha256_file(PREVIEW_SCRIPT),
        "action_id": action_id,
        "camera_id": camera_id,
        "frames": FRAMES,
        "fps": FPS,
    }


def expected_review_fingerprint(manifest: dict, review_sheet: Path) -> dict[str, object]:
    return {
        "version": 1,
        "builder_sha256": sha256_file(REVIEW_BUILDER),
        "sheet_sha256": sha256_file(review_sheet),
        "source_fingerprints": {
            item["action_id"]: sha256_file(
                PACK_DIR / item["checkpoint_dir"] / ".render_fingerprint.json"
            )
            for item in manifest["motions"]
        },
    }


def probe_video(path: Path) -> tuple[int, float, str] | None:
    if not path.exists():
        return None
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-count_frames",
            "-show_entries",
            "stream=nb_read_frames,r_frame_rate:format=duration",
            "-of",
            "json",
            str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    payload = json.loads(result.stdout)
    stream = payload["streams"][0]
    return (
        int(stream.get("nb_read_frames", 0)),
        float(payload.get("format", {}).get("duration", 0.0)),
        stream.get("r_frame_rate", ""),
    )


def iter_action_fcurves(action):
    if hasattr(action, "fcurves"):
        yield from action.fcurves
        return
    for layer in action.layers:
        for strip in layer.strips:
            for slot in action.slots:
                channelbag = strip.channelbag(slot, ensure=False)
                if channelbag:
                    yield from channelbag.fcurves


def curve_keyframes(action, path_fragment: str) -> set[int]:
    frames: set[int] = set()
    for curve in iter_action_fcurves(action):
        if path_fragment in curve.data_path:
            frames.update(round(point.co.x) for point in curve.keyframe_points)
    return frames


def sample_action(rig, action, frames: range | list[int]):
    rig.animation_data_create()
    rig.animation_data.action = action
    rows = []
    for frame in frames:
        bpy.context.scene.frame_set(frame)
        bpy.context.view_layer.update()
        rows.append(
            {
                "frame": frame,
                "root": rig.matrix_world @ rig.pose.bones["root"].head,
                "L": rig.matrix_world @ rig.pose.bones["foot_ik.L"].head,
                "R": rig.matrix_world @ rig.pose.bones["foot_ik.R"].head,
                "foot_L": rig.matrix_world @ rig.pose.bones["foot.L"].head,
                "foot_R": rig.matrix_world @ rig.pose.bones["foot.R"].head,
                "toe_L": rig.matrix_world @ rig.pose.bones["toe.L"].tail,
                "toe_R": rig.matrix_world @ rig.pose.bones["toe.R"].tail,
                "pelvis": rig.pose.bones["pelvis"].matrix.copy(),
            }
        )
    return rows


def validate() -> list[str]:
    errors: list[str] = []
    if not PACK_BLEND.exists():
        return [f"missing walk pack Blend: {PACK_BLEND}"]
    if not MANIFEST_PATH.exists():
        return [f"missing walk manifest: {MANIFEST_PATH}"]
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    entries = manifest.get("motions", [])
    expected_actions = {item["action_id"] for item in WALKS}
    expected_cameras = {item["camera_id"] for item in WALKS}
    if {item.get("action_id") for item in entries} != expected_actions:
        errors.append("manifest action IDs do not match white coat walk specs")
    if {item.get("camera_id") for item in entries} != expected_cameras:
        errors.append("manifest camera IDs do not match white coat walk specs")
    if len(entries) != 3:
        errors.append(f"manifest has {len(entries)} rows, expected 3")
    if manifest.get("status") != "candidate_review":
        errors.append("walk pack status must remain candidate_review")
    if not (PACK_DIR / "Instructions.md").exists():
        errors.append("missing walk pack Instructions.md")
    if len(list(CARDS_DIR.glob("WHITE_COAT_WALK_PACK_001｜*.md"))) != 1:
        errors.append("expected one walk pack Obsidian card")
    if not INDEX_PATH.exists():
        errors.append(f"missing walk pack Obsidian index: {INDEX_PATH}")

    scene = bpy.context.scene
    if (scene.frame_start, scene.frame_end, scene.render.fps) != (1, FRAMES, FPS):
        errors.append("scene timing must be frames 1..96 at 24 fps")
    rig = bpy.data.objects.get(RIG_NAME)
    if rig is None or rig.type != "ARMATURE":
        errors.append(f"missing armature {RIG_NAME}")
        return errors
    height = float(rig.get("body_height", 0.0))
    if height <= 0.0:
        errors.append("rig body_height metadata is missing")
        return errors

    by_action = {item.get("action_id"): item for item in entries}
    for spec in WALKS:
        action_id = spec["action_id"]
        camera_id = spec["camera_id"]
        prefix = f"{action_id}: "
        entry = by_action.get(action_id, {})
        action = bpy.data.actions.get(action_id)
        camera = bpy.data.objects.get(camera_id)
        if action is None:
            errors.append(prefix + "missing Action")
            continue
        if camera is None or camera.type != "CAMERA":
            errors.append(prefix + f"missing Camera {camera_id}")
            continue
        if action.get("status") != spec["status"]:
            errors.append(prefix + "Action status does not match spec")
        if action.get("paired_camera_id") != camera_id:
            errors.append(prefix + "paired_camera_id is wrong")
        if action.asset_data is None:
            errors.append(prefix + "Action is not marked as an asset")
        elif str(action.asset_data.catalog_id) != MOTION_CATALOG_ID:
            errors.append(prefix + "Action catalog is wrong")
        if camera.get("status") != spec["status"]:
            errors.append(prefix + "Camera status does not match spec")
        if camera.get("paired_action_id") != action_id:
            errors.append(prefix + "Camera paired_action_id is wrong")
        if camera.asset_data is None:
            errors.append(prefix + "Camera is not marked as an asset")
        elif str(camera.asset_data.catalog_id) != CAMERA_CATALOG_ID:
            errors.append(prefix + "Camera catalog is wrong")
        if not camera.data.dof.use_dof or camera.data.dof.focus_object is None:
            errors.append(prefix + "Camera is missing object-based depth of field")
        focus = camera.data.dof.focus_object
        camera_action = camera.animation_data.action if camera.animation_data else None
        lens_action = (
            camera.data.animation_data.action if camera.data.animation_data else None
        )
        focus_action = focus.animation_data.action if focus and focus.animation_data else None
        for label, animated_action, path_fragment in (
            ("camera location", camera_action, "location"),
            ("camera rotation", camera_action, "rotation_euler"),
            ("camera lens", lens_action, "lens"),
            ("focus location", focus_action, "location"),
        ):
            keys = (
                curve_keyframes(animated_action, path_fragment)
                if animated_action is not None
                else set()
            )
            expected_camera_keys = set(range(1, FRAMES + 1))
            if not expected_camera_keys.issubset(keys):
                missing = sorted(expected_camera_keys - keys)
                errors.append(prefix + f"{label} is missing frame keys {missing}")

        root_keys = curve_keyframes(action, 'pose.bones["root"].location')
        if not {1, FRAMES}.issubset(root_keys):
            errors.append(prefix + "root translation is not keyed at frames 1 and 96")
        required_boundaries = {1, FRAMES}
        for side in ("L", "R"):
            for start, end in spec["planted_intervals"][side]:
                required_boundaries.update((start, end))
            foot_keys = curve_keyframes(action, f'pose.bones["foot_ik.{side}"].location')
            missing = sorted(required_boundaries - foot_keys)
            if missing:
                errors.append(prefix + f"foot_ik.{side} missing keys at {missing}")

        samples = sample_action(rig, action, list(range(1, FRAMES + 1)))
        root_displacement = samples[-1]["root"].y - samples[0]["root"].y
        if root_displacement > -0.20 * height:
            errors.append(prefix + f"forward root displacement is too small: {root_displacement:.4f}")
        for side in ("L", "R"):
            for start, end in spec["planted_intervals"][side]:
                planted = [row[side] for row in samples[start - 1 : end]]
                origin = planted[0]
                horizontal_drift = max(
                    math.hypot(point.x - origin.x, point.y - origin.y)
                    for point in planted
                )
                floor_error = max(abs(point.z - origin.z) for point in planted)
                if horizontal_drift > 0.01 * height:
                    errors.append(
                        prefix
                        + f"foot {side} planted drift {horizontal_drift:.5f} at {start}-{end}"
                    )
                if floor_error > 0.005 * height:
                    errors.append(
                        prefix
                        + f"foot {side} floor error {floor_error:.5f} at {start}-{end}"
                    )
                for actual_key in (f"foot_{side}", f"toe_{side}"):
                    actual = [row[actual_key] for row in samples[start - 1 : end]]
                    actual_origin = actual[0]
                    actual_drift = max(
                        math.hypot(point.x - actual_origin.x, point.y - actual_origin.y)
                        for point in actual
                    )
                    actual_z_span = max(point.z for point in actual) - min(
                        point.z for point in actual
                    )
                    if actual_drift > 0.012 * height:
                        errors.append(
                            prefix
                            + f"actual {actual_key} planted drift {actual_drift:.5f} "
                            + f"at {start}-{end}"
                        )
                    if actual_z_span > 0.007 * height:
                        errors.append(
                            prefix
                            + f"actual {actual_key} z span {actual_z_span:.5f} "
                            + f"at {start}-{end}"
                        )
                planted_toes = [row[f"toe_{side}"] for row in samples[start - 1 : end]]
                if max(point.z for point in planted_toes) > 0.05 * height:
                    errors.append(prefix + f"toe {side} floats above floor at {start}-{end}")

            ik_divergence = max(
                (row[f"foot_{side}"] - row[side]).length for row in samples
            )
            if ik_divergence > 0.015 * height:
                errors.append(
                    prefix
                    + f"actual foot {side} does not follow foot IK: {ik_divergence:.5f}"
                )
            if min(row[f"toe_{side}"].z for row in samples) < -0.005 * height:
                errors.append(prefix + f"toe {side} penetrates the floor")

        scene.camera = camera
        rig.animation_data.action = action
        camera_locations = []
        for frame in range(1, FRAMES + 1):
            scene.frame_set(frame)
            camera_locations.append(camera.matrix_world.translation.copy())
        camera_travel = max(
            (location - camera_locations[0]).length for location in camera_locations
        )
        if camera_travel < 0.05 * height:
            errors.append(prefix + f"camera travel is too small: {camera_travel:.5f}")
        for frame in (1, 24, 48, 72, FRAMES):
            scene.frame_set(frame)
            bpy.context.view_layer.update()
            points = {
                "head_top": rig.matrix_world @ rig.pose.bones["head"].tail,
                "left_toe": rig.matrix_world @ rig.pose.bones["toe.L"].tail,
                "right_toe": rig.matrix_world @ rig.pose.bones["toe.R"].tail,
                "left_shoulder": rig.matrix_world
                @ rig.pose.bones["upper_arm.L"].head,
                "right_shoulder": rig.matrix_world
                @ rig.pose.bones["upper_arm.R"].head,
            }
            for point_name, point in points.items():
                projected = world_to_camera_view(scene, camera, point)
                if (
                    projected.z <= 0.0
                    or not 0.01 <= projected.x <= 0.99
                    or not 0.01 <= projected.y <= 0.99
                ):
                    errors.append(
                        prefix
                        + f"{point_name} leaves camera frame at frame {frame}: "
                        + f"({projected.x:.3f}, {projected.y:.3f}, {projected.z:.3f})"
                    )
            if focus is not None:
                focus_projection = world_to_camera_view(scene, camera, focus.location)
                if not (
                    0.35 <= focus_projection.x <= 0.65
                    and 0.35 <= focus_projection.y <= 0.65
                    and 0.35 * height <= focus.location.z <= 0.80 * height
                ):
                    errors.append(prefix + f"focus target is misplaced at frame {frame}")

        if action_id == "ACT_WHITE_COAT_WALK_IN_STOP_01":
            tail = samples[-12:]
            root_span = max((row["root"] - tail[0]["root"]).length for row in tail)
            pelvis_span = max(
                (row["pelvis"].translation - tail[0]["pelvis"].translation).length
                for row in tail
            )
            foot_spans = {
                key: max((row[key] - tail[0][key]).length for row in tail)
                for key in ("L", "R", "foot_L", "foot_R", "toe_L", "toe_R")
            }
            if (
                root_span > 0.001 * height
                or pelvis_span > 0.001 * height
                or any(span > 0.001 * height for span in foot_spans.values())
            ):
                errors.append(prefix + "final 12-frame hold is not stable")

        lens_values = []
        for frame in range(1, FRAMES + 1):
            scene.frame_set(frame)
            lens_values.append(camera.data.lens)
        if min(lens_values) < 55.0 or max(lens_values) > 75.0:
            errors.append(prefix + "Camera lens must stay between 55 and 75 mm")
        if entry.get("planted_intervals") != {
            side: [list(pair) for pair in intervals]
            for side, intervals in spec["planted_intervals"].items()
        }:
            errors.append(prefix + "manifest planted_intervals do not match spec")

        preview = PACK_DIR / entry.get("review_clip", "")
        frame_dir = PACK_DIR / entry.get("checkpoint_dir", "")
        fingerprint_path = frame_dir / ".render_fingerprint.json"
        if not fingerprint_path.exists():
            errors.append(prefix + f"missing render fingerprint {fingerprint_path}")
        else:
            fingerprint = json.loads(fingerprint_path.read_text(encoding="utf-8"))
            expected_fingerprint = expected_render_fingerprint(action_id, camera_id)
            if fingerprint != expected_fingerprint:
                errors.append(prefix + "render fingerprint is stale")
        probe = probe_video(preview)
        if probe is None:
            errors.append(prefix + f"missing preview video {preview}")
        else:
            frame_count, duration, rate = probe
            if frame_count != FRAMES or abs(duration - 4.0) > 0.03 or rate != "24/1":
                errors.append(
                    prefix
                    + f"preview must be 96 frames / 4.0 s / 24 fps, got "
                    f"{frame_count} / {duration:.3f} / {rate}"
                )
        for kind, asset_id, directory in (
            ("motion", action_id, ROOT / "video-pipeline" / "asset-library" / "06-motions"),
            ("camera", camera_id, ROOT / "video-pipeline" / "asset-library" / "02-camera-rigs"),
        ):
            if not (directory / asset_id / "Instructions.md").exists():
                errors.append(prefix + f"missing {kind} Instructions for {asset_id}")
            cards = list(CARDS_DIR.glob(f"{asset_id}｜*.md"))
            if len(cards) != 1:
                errors.append(prefix + f"expected one {kind} card for {asset_id}, got {len(cards)}")

    review_sheet = PACK_DIR / manifest.get("review_sheet", "")
    if not review_sheet.exists():
        errors.append(f"missing walk review sheet: {review_sheet}")
    elif not REVIEW_FINGERPRINT.exists():
        errors.append(f"missing walk review fingerprint: {REVIEW_FINGERPRINT}")
    else:
        review_fingerprint = json.loads(
            REVIEW_FINGERPRINT.read_text(encoding="utf-8")
        )
        if review_fingerprint != expected_review_fingerprint(manifest, review_sheet):
            errors.append("walk review sheet fingerprint is stale")
    combined = PACK_DIR / manifest.get("combined_reel", "")
    combined_probe = probe_video(combined)
    if combined_probe is None:
        errors.append(f"missing combined walk reel: {combined}")
    else:
        frame_count, duration, rate = combined_probe
        if frame_count != 288 or abs(duration - 12.0) > 0.05 or rate != "24/1":
            errors.append(
                "combined reel must be 288 frames / 12.0 s / 24 fps, got "
                f"{frame_count} / {duration:.3f} / {rate}"
            )

    if not REGISTRY_PATH.exists():
        errors.append(f"missing asset registry: {REGISTRY_PATH}")
    else:
        registry = json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))
        by_id = {item.get("id"): item for item in registry.get("assets", [])}
        expected_registry = {
            **{action_id: "candidate" for action_id in expected_actions},
            **{camera_id: "candidate" for camera_id in expected_cameras},
            "WHITE_COAT_WALK_PACK_001": "candidate_review",
        }
        for asset_id, status in expected_registry.items():
            entry = by_id.get(asset_id)
            if entry is None:
                errors.append(f"asset registry missing {asset_id}")
            elif entry.get("status") != status:
                errors.append(
                    f"asset registry status for {asset_id} must be {status}, "
                    f"got {entry.get('status')}"
                )
        character = by_id.get("CHAR_HUNYUAN_WHITE_COAT_FULLBODY_001")
        if character is None:
            errors.append("asset registry missing fullbody white coat character")
        else:
            if character.get("status") != "approved_source":
                errors.append("fullbody character source approval status was overwritten")
            if character.get("rig_status") != "rigged_candidate":
                errors.append("fullbody character rig status must remain rigged_candidate")
            if character.get("usage", {}).get("walk_pack") != "WHITE_COAT_WALK_PACK_001":
                errors.append("fullbody character registry entry is not linked to walk pack")

    if not CHARACTER_MODEL.exists():
        errors.append(f"missing fullbody character model metadata: {CHARACTER_MODEL}")
    else:
        character_model = json.loads(CHARACTER_MODEL.read_text(encoding="utf-8"))
        walk_pack = character_model.get("rig", {}).get("walk_pack_candidate", {})
        if walk_pack.get("id") != "WHITE_COAT_WALK_PACK_001":
            errors.append("fullbody character model metadata is not linked to walk pack")
        if walk_pack.get("status") != "candidate_review":
            errors.append("fullbody character walk pack metadata must remain candidate_review")
    return errors


def main() -> None:
    errors = validate()
    if errors:
        print("WHITE_COAT_WALK_PACK_VALIDATION_FAILED")
        for error in errors:
            print(f"- {error}")
        raise SystemExit(1)
    print("WHITE_COAT_WALK_PACK_VALIDATION_OK")


if __name__ == "__main__":
    main()
