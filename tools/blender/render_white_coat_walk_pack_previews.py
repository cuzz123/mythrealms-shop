from __future__ import annotations

import hashlib
import json
import subprocess
import sys
from functools import lru_cache
from pathlib import Path

import bpy
from mathutils import Vector


ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from white_coat_walk_specs import FPS, FRAMES, RIG_NAME, WALKS  # noqa: E402


PACK_DIR = (
    ROOT
    / "video-pipeline"
    / "asset-library"
    / "06-motions"
    / "WHITE_COAT_WALK_PACK_001"
)
MANIFEST_PATH = PACK_DIR / "motion_manifest.json"
PREVIEW_DIR = PACK_DIR / "preview"
COMBINED_REEL = PREVIEW_DIR / "WHITE_COAT_WALK_ALL_3_REVIEW.mp4"
STAGE_PREFIX = "WHITE_COAT_PREVIEW_"
SCRIPT_PATH = Path(__file__).resolve()


@lru_cache(maxsize=None)
def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def render_fingerprint(spec: dict) -> dict[str, object]:
    blend_path = Path(bpy.data.filepath).resolve()
    return {
        "version": 1,
        "blend_sha256": sha256_file(blend_path),
        "renderer_sha256": sha256_file(SCRIPT_PATH),
        "action_id": spec["action_id"],
        "camera_id": spec["camera_id"],
        "frames": FRAMES,
        "fps": FPS,
    }


def point_at(obj: bpy.types.Object, target: Vector) -> None:
    obj.rotation_euler = (target - obj.location).to_track_quat("-Z", "Y").to_euler()


def remove_old_stage() -> None:
    for obj in list(bpy.data.objects):
        if obj.name.startswith(STAGE_PREFIX):
            bpy.data.objects.remove(obj, do_unlink=True)


def make_material(name: str, color: tuple[float, float, float, float], roughness: float):
    material = bpy.data.materials.new(name)
    material.diffuse_color = color
    material.use_nodes = True
    node = material.node_tree.nodes.get("Principled BSDF")
    if node is not None:
        node.inputs["Base Color"].default_value = color
        node.inputs["Roughness"].default_value = roughness
    return material


def setup_stage(height: float) -> None:
    remove_old_stage()
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 640
    scene.render.resolution_y = 360
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGB"
    scene.render.film_transparent = False
    scene.render.fps = FPS
    scene.render.image_settings.color_depth = "8"
    scene.view_settings.look = "AgX - Medium High Contrast"
    if scene.world is None:
        scene.world = bpy.data.worlds.new(f"{STAGE_PREFIX}WORLD")
    scene.world.use_nodes = True
    background = scene.world.node_tree.nodes.get("Background")
    if background is None:
        scene.world.node_tree.nodes.clear()
        background = scene.world.node_tree.nodes.new("ShaderNodeBackground")
        output = scene.world.node_tree.nodes.new("ShaderNodeOutputWorld")
        scene.world.node_tree.links.new(background.outputs["Background"], output.inputs["Surface"])
    background.inputs["Color"].default_value = (0.018, 0.022, 0.028, 1.0)
    background.inputs["Strength"].default_value = 0.32

    bpy.ops.mesh.primitive_plane_add(size=12.0 * height, location=(0, 0, -0.003))
    floor = bpy.context.object
    floor.name = f"{STAGE_PREFIX}FLOOR"
    floor.data.materials.append(
        make_material(
            f"{STAGE_PREFIX}FLOOR_MAT",
            (0.055, 0.062, 0.072, 1.0),
            0.38,
        )
    )

    for name, location, energy, size in (
        ("KEY", (-1.15 * height, -1.8 * height, 1.55 * height), 420, 1.15),
        ("FILL", (1.2 * height, -1.1 * height, 0.95 * height), 250, 1.00),
        ("RIM", (0.55 * height, 1.1 * height, 1.35 * height), 360, 0.90),
    ):
        bpy.ops.object.light_add(type="AREA", location=location)
        light = bpy.context.object
        light.name = f"{STAGE_PREFIX}{name}"
        light.data.energy = energy
        light.data.shape = "DISK"
        light.data.size = size * height
        point_at(light, Vector((0.0, -0.18 * height, 0.55 * height)))


def valid_frame_set(frame_dir: Path, fingerprint: dict[str, object]) -> bool:
    expected_names = {f"frame_{frame:04d}.png" for frame in range(1, FRAMES + 1)}
    actual_names = {path.name for path in frame_dir.glob("frame_*.png")}
    fingerprint_path = frame_dir / ".render_fingerprint.json"
    if actual_names != expected_names or not fingerprint_path.exists():
        return False
    try:
        cached_fingerprint = json.loads(fingerprint_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return False
    return cached_fingerprint == fingerprint


def encode_clip(frame_dir: Path, output: Path) -> None:
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-framerate",
            str(FPS),
            "-i",
            str(frame_dir / "frame_%04d.png"),
            "-c:v",
            "libx264",
            "-preset",
            "medium",
            "-crf",
            "19",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            str(output),
        ],
        check=True,
    )


def render_action(spec: dict, manifest_entry: dict, rig, height: float) -> Path:
    action = bpy.data.actions[spec["action_id"]]
    camera = bpy.data.objects[spec["camera_id"]]
    frame_dir = PACK_DIR / manifest_entry["checkpoint_dir"]
    output = PACK_DIR / manifest_entry["review_clip"]
    frame_dir.mkdir(parents=True, exist_ok=True)
    output.parent.mkdir(parents=True, exist_ok=True)
    rig.animation_data.action = action
    bpy.context.scene.camera = camera
    fingerprint = render_fingerprint(spec)
    if not valid_frame_set(frame_dir, fingerprint):
        for old in frame_dir.glob("frame_*.png"):
            old.unlink()
        fingerprint_path = frame_dir / ".render_fingerprint.json"
        if fingerprint_path.exists():
            fingerprint_path.unlink()
        for frame in range(1, FRAMES + 1):
            bpy.context.scene.frame_set(frame)
            bpy.context.scene.render.filepath = str(frame_dir / f"frame_{frame:04d}.png")
            bpy.ops.render.render(write_still=True)
        fingerprint_path.write_text(
            json.dumps(fingerprint, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print(f"WHITE_COAT_WALK_FRAMES_RENDERED={spec['action_id']}:{FRAMES}")
    encode_clip(frame_dir, output)
    print(f"WHITE_COAT_WALK_PREVIEW={output}")
    return output


def combine_clips(clips: list[Path]) -> None:
    concat_file = PREVIEW_DIR / "concat.txt"
    concat_file.write_text(
        "\n".join(f"file '{path.as_posix()}'" for path in clips) + "\n",
        encoding="utf-8",
    )
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(concat_file),
            "-c",
            "copy",
            str(COMBINED_REEL),
        ],
        check=True,
    )
    concat_file.unlink(missing_ok=True)
    print(f"WHITE_COAT_WALK_COMBINED_REEL={COMBINED_REEL}")


def main() -> None:
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    entries = {item["action_id"]: item for item in manifest["motions"]}
    rig = bpy.data.objects[RIG_NAME]
    height = float(rig["body_height"])
    setup_stage(height)
    clips = [
        render_action(spec, entries[spec["action_id"]], rig, height)
        for spec in WALKS
    ]
    combine_clips(clips)


if __name__ == "__main__":
    main()
