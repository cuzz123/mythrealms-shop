from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path

PIPELINE_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PIPELINE_ROOT / "src"))

from local_asset_library import ensure_library_layout, ingest_asset


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


class LocalAssetLibraryTests(unittest.TestCase):
    def test_initializes_the_local_library_layout_without_replacing_existing_files(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir) / "asset-library"
            existing = root / "10-storyboard-videos" / "keep.txt"
            existing.parent.mkdir(parents=True)
            existing.write_text("keep me", encoding="utf-8")

            ensure_library_layout(root)

            expected = [
                "00-inbox/xiaoyunque",
                "00-inbox/jianying",
                "00-inbox/hunyuan",
                "00-inbox/codex-images",
                "10-storyboard-videos",
                "11-edit-projects",
                "12-final-deliverables",
                "90-proxies",
                "99-manifests",
            ]
            for relative_path in expected:
                self.assertTrue((root / relative_path).is_dir(), relative_path)
            self.assertEqual(existing.read_text(encoding="utf-8"), "keep me")

            manifest = json.loads(
                (root / "99-manifests" / "local-assets.json").read_text(
                    encoding="utf-8"
                )
            )
            self.assertEqual(manifest["schema"], "mythrealms.local-assets.v1")
            self.assertEqual(manifest["assets"], [])

    def test_ingests_a_file_without_mutating_the_source(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            workspace = Path(temp_dir)
            root = workspace / "asset-library"
            vault = root / "obsidian-vault"
            source = workspace / "xiaoyunque-shot.mp4"
            original_bytes = b"local storyboard test bytes"
            source.write_bytes(original_bytes)
            source_stat = source.stat()

            result = ingest_asset(
                source=source,
                asset_type="storyboard-video",
                title="小云雀耳环分镜测试",
                root=root,
                vault=vault,
                generate_preview=False,
            )

            self.assertTrue(source.exists())
            self.assertEqual(source.read_bytes(), original_bytes)
            self.assertEqual(source.stat().st_mtime_ns, source_stat.st_mtime_ns)
            self.assertEqual(result["asset_type"], "storyboard-video")
            self.assertEqual(result["origin"]["path"], str(source.resolve()))
            self.assertEqual(result["origin"]["sha256"], sha256(source))

            asset_dir = root / result["library_path"]
            metadata_path = asset_dir / "metadata.json"
            self.assertTrue(metadata_path.is_file())
            metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
            copied = root / metadata["source_files"][0]["library_path"]
            self.assertTrue(copied.is_file())
            self.assertEqual(copied.read_bytes(), original_bytes)
            self.assertEqual(sha256(copied), sha256(source))

            manifest = json.loads(
                (root / "99-manifests" / "local-assets.json").read_text(
                    encoding="utf-8"
                )
            )
            self.assertEqual(len(manifest["assets"]), 1)
            self.assertEqual(manifest["assets"][0]["id"], result["id"])

            card = vault / result["obsidian_card"]
            self.assertTrue(card.is_file())
            card_text = card.read_text(encoding="utf-8")
            self.assertIn(result["id"], card_text)
            self.assertIn("小云雀耳环分镜测试", card_text)
            self.assertIn(source.as_uri(), card_text)

    def test_duplicate_content_reuses_existing_asset(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            workspace = Path(temp_dir)
            root = workspace / "asset-library"
            vault = root / "obsidian-vault"
            first_source = workspace / "first-name.mp4"
            second_source = workspace / "renamed-copy.mp4"
            first_source.write_bytes(b"same storyboard content")
            second_source.write_bytes(first_source.read_bytes())

            first = ingest_asset(
                source=first_source,
                asset_type="storyboard-video",
                title="第一次导入",
                root=root,
                vault=vault,
                generate_preview=False,
            )
            second = ingest_asset(
                source=second_source,
                asset_type="storyboard-video",
                title="重复内容",
                root=root,
                vault=vault,
                generate_preview=False,
            )

            self.assertEqual(second["id"], first["id"])
            asset_dirs = [
                path
                for path in (root / "10-storyboard-videos").iterdir()
                if path.is_dir()
            ]
            self.assertEqual(asset_dirs, [root / first["library_path"]])
            manifest = json.loads(
                (root / "99-manifests" / "local-assets.json").read_text(
                    encoding="utf-8"
                )
            )
            self.assertEqual(len(manifest["assets"]), 1)

    def test_jianying_project_is_snapshotted_without_source_mutation(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            workspace = Path(temp_dir)
            root = workspace / "asset-library"
            vault = root / "obsidian-vault"
            project = workspace / "Jianying Draft 01"
            nested = project / "Resources"
            nested.mkdir(parents=True)
            draft = project / "draft_content.json"
            media = nested / "cover.txt"
            draft.write_text('{"name": "draft"}', encoding="utf-8")
            media.write_text("linked media record", encoding="utf-8")
            original_files = {
                path.relative_to(project).as_posix(): path.read_bytes()
                for path in project.rglob("*")
                if path.is_file()
            }

            result = ingest_asset(
                source=project,
                asset_type="edit-project",
                title="剪映珍珠广告工程",
                root=root,
                vault=vault,
                generate_preview=False,
            )

            for relative_path, original_bytes in original_files.items():
                self.assertEqual(
                    (project / relative_path).read_bytes(), original_bytes
                )
            self.assertEqual(result["origin"]["kind"], "directory")
            self.assertRegex(result["origin"]["sha256"], r"^[0-9a-f]{64}$")
            snapshot = root / result["project_snapshot"]["library_path"]
            self.assertTrue(snapshot.is_file())
            self.assertEqual(
                result["project_snapshot"]["sha256"], sha256(snapshot)
            )
            with zipfile.ZipFile(snapshot) as archive:
                self.assertEqual(
                    sorted(archive.namelist()),
                    ["Resources/cover.txt", "draft_content.json"],
                )
                self.assertEqual(
                    archive.read("draft_content.json"), original_files["draft_content.json"]
                )

    @unittest.skipUnless(
        shutil.which("ffmpeg") and shutil.which("ffprobe"),
        "FFmpeg and ffprobe are required for video proxy verification",
    )
    def test_video_ingest_generates_a_thumbnail_and_playable_proxy(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            workspace = Path(temp_dir)
            root = workspace / "asset-library"
            vault = root / "obsidian-vault"
            source = workspace / "storyboard-source.mp4"
            subprocess.run(
                [
                    "ffmpeg",
                    "-hide_banner",
                    "-loglevel",
                    "error",
                    "-y",
                    "-f",
                    "lavfi",
                    "-i",
                    "color=c=0x2f5368:s=320x568:r=24:d=1",
                    "-c:v",
                    "libx264",
                    "-pix_fmt",
                    "yuv420p",
                    str(source),
                ],
                check=True,
                capture_output=True,
            )
            source_checksum = sha256(source)

            result = ingest_asset(
                source=source,
                asset_type="storyboard-video",
                title="可预览小云雀分镜",
                root=root,
                vault=vault,
                generate_preview=True,
            )

            thumbnail = root / result["preview"]["thumbnail"]
            preview = root / result["preview"]["video"]
            self.assertGreater(thumbnail.stat().st_size, 0)
            self.assertGreater(preview.stat().st_size, 0)
            self.assertEqual(sha256(source), source_checksum)
            probe = subprocess.run(
                [
                    "ffprobe",
                    "-v",
                    "error",
                    "-select_streams",
                    "v:0",
                    "-show_entries",
                    "stream=codec_name,width,height",
                    "-of",
                    "json",
                    str(preview),
                ],
                check=True,
                capture_output=True,
                text=True,
            )
            stream = json.loads(probe.stdout)["streams"][0]
            self.assertEqual(stream["codec_name"], "h264")
            self.assertLessEqual(stream["width"], 720)
            self.assertLessEqual(stream["height"], 1280)

    def test_cli_initializes_and_ingests_without_preview(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            workspace = Path(temp_dir)
            root = workspace / "asset-library"
            vault = root / "obsidian-vault"
            source = workspace / "shot.mp4"
            source.write_bytes(b"cli test content")

            init_result = subprocess.run(
                [
                    sys.executable,
                    "-m",
                    "src.local_asset_library",
                    "init",
                    "--root",
                    str(root),
                    "--vault",
                    str(vault),
                ],
                cwd=PIPELINE_ROOT,
                check=False,
                capture_output=True,
                text=True,
            )
            self.assertEqual(init_result.returncode, 0, init_result.stderr)
            self.assertEqual(json.loads(init_result.stdout)["root"], str(root.resolve()))

            ingest_result = subprocess.run(
                [
                    sys.executable,
                    "-m",
                    "src.local_asset_library",
                    "ingest",
                    "--source",
                    str(source),
                    "--type",
                    "storyboard-video",
                    "--title",
                    "CLI 分镜",
                    "--root",
                    str(root),
                    "--vault",
                    str(vault),
                    "--no-preview",
                ],
                cwd=PIPELINE_ROOT,
                check=False,
                capture_output=True,
                text=True,
            )
            self.assertEqual(ingest_result.returncode, 0, ingest_result.stderr)
            payload = json.loads(ingest_result.stdout)
            self.assertEqual(payload["asset_type"], "storyboard-video")
            self.assertTrue((root / payload["library_path"]).is_dir())


if __name__ == "__main__":
    unittest.main()
