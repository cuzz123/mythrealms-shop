import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


PIPELINE_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PIPELINE_ROOT / "src"))

from breakdown_reference import (
    audit_asset_capabilities,
    build_beat_boundaries,
    build_breakdown_records,
    write_breakdown_artifacts,
)


class BeatTimelineTests(unittest.TestCase):
    def test_build_beat_boundaries_adds_regular_intervals_to_a_continuous_take(self):
        boundaries = build_beat_boundaries(
            duration=2.4,
            cut_boundaries=[0.0, 2.4],
            beat_interval=0.8,
        )

        self.assertEqual(boundaries, [0.0, 0.8, 1.6, 2.4])

    def test_build_beat_boundaries_preserves_an_edit_cut(self):
        boundaries = build_beat_boundaries(
            duration=2.4,
            cut_boundaries=[0.0, 1.1, 2.4],
            beat_interval=0.8,
        )

        self.assertIn(1.1, boundaries)
        self.assertEqual(boundaries[0], 0.0)
        self.assertEqual(boundaries[-1], 2.4)

    def test_build_beat_boundaries_keeps_a_cut_that_is_close_to_a_regular_beat(self):
        boundaries = build_beat_boundaries(
            duration=2.4,
            cut_boundaries=[0.0, 0.85, 2.4],
            beat_interval=0.8,
        )

        self.assertIn(0.85, boundaries)
        self.assertNotIn(0.8, boundaries)


class SemanticRecordTests(unittest.TestCase):
    def test_breakdown_record_has_editable_semantic_shell(self):
        records = build_breakdown_records(
            [0.0, 0.8],
            [Path("keyframes/beat_001.jpg")],
        )

        record = records[0]
        self.assertEqual(record["editing"]["type"], "continuous")
        self.assertEqual(record["camera"]["movement"], "unknown")
        self.assertEqual(record["blocking"]["anchor_object"], "unknown")
        self.assertEqual(record["lighting"]["key_direction"], "unknown")
        self.assertEqual(record["viral_hook"]["visual_hook"], "unknown")
        self.assertIsNone(record["review"]["similarity_score"])


class AssetAuditTests(unittest.TestCase):
    def test_asset_audit_marks_approved_as_ready_and_planned_as_not_ready(self):
        registry = {
            "assets": [
                {"id": "CAM_READY", "category": "camera_rig", "status": "approved", "tags": ["orbit"]},
                {"id": "CAM_PLANNED", "category": "camera_rig", "status": "planned", "tags": ["orbit"]},
            ]
        }
        records = [{"assets": {"required_capabilities": ["orbit"]}}]

        audit = audit_asset_capabilities(registry, records)

        self.assertEqual(audit["requirements"][0]["ready_candidates"], ["CAM_READY"])
        self.assertEqual(audit["requirements"][0]["non_ready_candidates"], ["CAM_PLANNED"])
        self.assertEqual(audit["gaps"], [])


class BreakdownArtifactTests(unittest.TestCase):
    def test_write_breakdown_artifacts_creates_report_and_keyframes(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            job_dir = Path(temp_dir) / "job"
            result = write_breakdown_artifacts(
                job_dir=job_dir,
                duration=1.6,
                cut_boundaries=[0.0, 1.6],
                beat_interval=0.8,
                keyframe_writer=lambda _, path: path.write_bytes(b"frame"),
                registry={"assets": []},
            )

            self.assertTrue((job_dir / "breakdown" / "breakdown.json").exists())
            self.assertTrue((job_dir / "breakdown" / "asset-gaps.json").exists())
            self.assertTrue((job_dir / "breakdown" / "obsidian-report.md").exists())
            self.assertEqual(len(result["records"]), 2)
            report = (job_dir / "breakdown" / "obsidian-report.md").read_text(encoding="utf-8")
            self.assertIn("[[breakdown.json]]", report)
            self.assertIn("[[keyframes/beat_001.jpg]]", report)

    def test_write_breakdown_artifacts_adds_a_review_entry_to_obsidian(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            job_dir = root / "job"
            vault = root / "obsidian-vault"
            result = write_breakdown_artifacts(
                job_dir=job_dir,
                duration=0.8,
                cut_boundaries=[0.0, 0.8],
                beat_interval=0.8,
                keyframe_writer=lambda _, path: path.write_bytes(b"frame"),
                registry={"assets": []},
                obsidian_vault=vault,
            )

            entry = result["obsidian_entry"]
            self.assertEqual(entry, vault / "03-参考拆解" / "拆解｜job.md")
            self.assertTrue(entry.exists())
            self.assertIn(
                (job_dir / "breakdown" / "obsidian-report.md").resolve().as_uri(),
                entry.read_text(encoding="utf-8"),
            )


class BreakdownCliTests(unittest.TestCase):
    def test_cli_writes_review_artifacts_for_a_local_mp4(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            reference = root / "reference.mp4"
            job_dir = root / "job"
            registry = root / "assets.json"
            vault = root / "obsidian-vault"
            registry.write_text(json.dumps({"assets": []}), encoding="utf-8")
            subprocess.run(
                [
                    "ffmpeg",
                    "-hide_banner",
                    "-y",
                    "-f",
                    "lavfi",
                    "-i",
                    "color=c=black:s=320x568:r=24:d=1.6",
                    "-c:v",
                    "libx264",
                    "-pix_fmt",
                    "yuv420p",
                    str(reference),
                ],
                check=True,
                capture_output=True,
                text=True,
            )

            result = subprocess.run(
                [
                    sys.executable,
                    str(PIPELINE_ROOT / "src" / "breakdown_reference.py"),
                    "--reference",
                    str(reference),
                    "--job-dir",
                    str(job_dir),
                    "--beat-interval",
                    "0.8",
                    "--registry",
                    str(registry),
                    "--obsidian-vault",
                    str(vault),
                ],
                check=False,
                capture_output=True,
                text=True,
            )

            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertNotIn("does not contain an image sequence pattern", result.stderr)
            self.assertTrue((job_dir / "breakdown" / "breakdown.json").exists())
            self.assertTrue((job_dir / "breakdown" / "asset-gaps.json").exists())
            self.assertTrue((job_dir / "breakdown" / "obsidian-report.md").exists())
            self.assertTrue((vault / "03-参考拆解" / "拆解｜job.md").exists())

    def test_powershell_wrapper_writes_review_artifacts(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            reference = root / "reference.mp4"
            job_dir = root / "job"
            registry = root / "assets.json"
            vault = root / "obsidian-vault"
            registry.write_text(json.dumps({"assets": []}), encoding="utf-8")
            subprocess.run(
                [
                    "ffmpeg",
                    "-hide_banner",
                    "-y",
                    "-f",
                    "lavfi",
                    "-i",
                    "color=c=black:s=320x568:r=24:d=1.6",
                    "-c:v",
                    "libx264",
                    "-pix_fmt",
                    "yuv420p",
                    str(reference),
                ],
                check=True,
                capture_output=True,
                text=True,
            )

            result = subprocess.run(
                [
                    "powershell.exe",
                    "-NoProfile",
                    "-ExecutionPolicy",
                    "Bypass",
                    "-File",
                    str(PIPELINE_ROOT / "scripts" / "05-breakdown-viral-video.ps1"),
                    "-Reference",
                    str(reference),
                    "-JobDir",
                    str(job_dir),
                    "-BeatInterval",
                    "0.8",
                    "-Registry",
                    str(registry),
                    "-ObsidianVault",
                    str(vault),
                ],
                check=False,
                capture_output=True,
                text=True,
            )

            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertTrue((job_dir / "breakdown" / "obsidian-report.md").exists())
            self.assertTrue((vault / "03-参考拆解" / "拆解｜job.md").exists())


if __name__ == "__main__":
    unittest.main()
