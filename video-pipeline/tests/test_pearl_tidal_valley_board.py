from __future__ import annotations

import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

from PIL import Image


SCRIPT = (
    Path(__file__).resolve().parents[1]
    / "scripts"
    / "build_pearl_tidal_valley_board.py"
)


def load_builder_module():
    spec = importlib.util.spec_from_file_location("pearl_tidal_valley_board", SCRIPT)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Cannot load board builder: {SCRIPT}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class PearlTidalValleyBoardTest(unittest.TestCase):
    def test_build_board_writes_4k_board_and_accessibility_text(self) -> None:
        module = load_builder_module()

        with tempfile.TemporaryDirectory() as tmp:
            package = Path(tmp)
            (package / "references").mkdir()
            (package / "prompts").mkdir()
            (package / "board").mkdir()

            colours = {
                "world-anchor.png": (51, 67, 82),
                "ravine-anchor.png": (34, 42, 48),
                "villa-anchor.png": (42, 49, 55),
                "material-anchor.png": (22, 26, 30),
            }
            for name, colour in colours.items():
                Image.new("RGB", (1600, 900), colour).save(
                    package / "references" / name
                )

            (package / "manifest.json").write_text(
                json.dumps(
                    {
                        "id": "REF_MR_PEARL_TIDAL_VALLEY_OPENING_001",
                        "title": "珍珠潮汐谷首段分镜",
                    },
                    ensure_ascii=False,
                ),
                encoding="utf-8",
            )
            (package / "prompts" / "seedance-s01.md").write_text(
                "# prompts\n", encoding="utf-8"
            )

            output = package / "board" / "board.png"
            result = module.build_board(package, output)

            self.assertEqual(result, output)
            self.assertTrue(output.exists())
            with Image.open(output) as image:
                self.assertEqual(image.size, (3840, 2160))
                self.assertEqual(image.mode, "RGB")

            accessibility = output.with_suffix(".txt")
            copy = accessibility.read_text(encoding="utf-8")
            self.assertIn("S01A", copy)
            self.assertIn("S01B", copy)
            self.assertIn("S01C", copy)


if __name__ == "__main__":
    unittest.main()
