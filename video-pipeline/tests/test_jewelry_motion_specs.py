import sys
import tempfile
import unittest
from pathlib import Path

TOOLS_BLENDER = Path(__file__).resolve().parents[2] / "tools" / "blender"
sys.path.insert(0, str(TOOLS_BLENDER))

from jewelry_motion_specs import load_motion_specs


SPECS_PATH = (
    Path(__file__).resolve().parents[1]
    / "asset-library"
    / "06-motions"
    / "jewelry-model-actions"
    / "motion_specs.json"
)


class JewelryMotionSpecTests(unittest.TestCase):
    def test_left_earring_touch_spec_is_complete(self):
        specs = load_motion_specs(SPECS_PATH)
        spec = specs["ACT_JEWELRY_TOUCH_EARRING_LEFT_001"]
        self.assertEqual(spec.id, "ACT_JEWELRY_TOUCH_EARRING_LEFT_001")
        self.assertEqual(spec.name_zh, "左手轻触左耳饰")
        self.assertEqual((spec.frames, spec.fps), (72, 24))
        self.assertEqual([beat.frame for beat in spec.beats], [1, 12, 24, 52, 60, 61, 72])
        self.assertEqual(
            [beat.phase for beat in spec.beats],
            [
                "start_hold",
                "start_hold",
                "anticipation",
                "touch",
                "settle",
                "final_hold",
                "final_hold",
            ],
        )
        self.assertEqual(spec.targets["hand"], "ear_left")
        self.assertEqual(spec.paired_camera_id, "CAM_JEWELRY_EARRING_TOUCH_LEFT_ARC_85MM_001")

    def _load_text(self, contents):
        with tempfile.TemporaryDirectory() as tmp_dir:
            path = Path(tmp_dir) / "specs.json"
            path.write_text(contents, encoding="utf-8")
            return load_motion_specs(path)

    def test_duplicate_ids_are_rejected_before_json_collapses_them(self):
        duplicate = """{
          \"ACT_DUPLICATE\": {\"name_zh\": \"甲\", \"frames\": 72, \"fps\": 24,
            \"beats\": [{\"frame\": 1, \"phase\": \"start\"}],
            \"targets\": {\"hand\": \"ear_left\"}, \"paired_camera_id\": \"CAM_A\"},
          \"ACT_DUPLICATE\": {\"name_zh\": \"乙\", \"frames\": 72, \"fps\": 24,
            \"beats\": [{\"frame\": 1, \"phase\": \"start\"}],
            \"targets\": {\"hand\": \"ear_left\"}, \"paired_camera_id\": \"CAM_B\"}
        }"""
        with self.assertRaisesRegex(ValueError, "Duplicate motion spec ID"):
            self._load_text(duplicate)

    def test_invalid_timing_and_required_fields_are_rejected(self):
        cases = {
            "frame count": ("frames", '"frames": 71'),
            "frame rate": ("fps", '"fps": 25'),
            "beat order": (
                "beats",
                '"beats": [{"frame": 12, "phase": "a"}, {"frame": 12, "phase": "b"}]',
            ),
            "hand target": ("targets", '"targets": {}'),
            "paired camera": ("camera", ""),
        }
        template = """{{
          \"ACT_TEST\": {{\"name_zh\": \"测试\", {frames}, {fps},
            {beats}, {targets} {camera}}}
        }}"""
        defaults = {
            "frames": '"frames": 72',
            "fps": '"fps": 24',
            "beats": '"beats": [{"frame": 1, "phase": "start"}]',
            "targets": '"targets": {"hand": "ear_left"}',
            "camera": ', "paired_camera_id": "CAM_TEST"',
        }
        for label, (key, replacement) in cases.items():
            values = defaults.copy()
            values[key] = replacement
            with self.subTest(label=label), self.assertRaises(ValueError):
                self._load_text(template.format(**values))


if __name__ == "__main__":
    unittest.main()
