import sys
import tempfile
import unittest
from io import BytesIO
from pathlib import Path
from unittest.mock import ANY

from PIL import Image


PIPELINE_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PIPELINE_ROOT / "src"))

from hunyuan3d_character import build_hunyuan_pro_payload, post_json, split_three_view_reference


class SplitThreeViewReferenceTests(unittest.TestCase):
    def test_creates_front_three_quarter_and_back_images(self):
        """The C-position contact sheet must become the three views accepted by Hunyuan."""
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            reference = root / "c_position.jpg"
            output_dir = root / "views"

            contact_sheet = Image.new("RGB", (900, 240))
            contact_sheet.paste((255, 0, 0), (0, 0, 300, 240))
            contact_sheet.paste((0, 255, 0), (300, 0, 600, 240))
            contact_sheet.paste((0, 0, 255), (600, 0, 900, 240))
            contact_sheet.save(reference, quality=95)

            views = split_three_view_reference(reference, output_dir, max_long_edge=512)

            self.assertEqual(set(views), {"front", "right_front", "back"})
            self.assertEqual(views["front"].name, "front.jpg")
            self.assertEqual(views["right_front"].name, "right_front.jpg")
            self.assertEqual(views["back"].name, "back.jpg")
            self.assertTrue(all(path.exists() for path in views.values()))
            with Image.open(views["front"]) as front:
                self.assertEqual(front.size, (300, 240))
                self.assertGreater(front.getpixel((150, 120))[0], 240)
            with Image.open(views["right_front"]) as right_front:
                self.assertEqual(right_front.size, (300, 240))
                self.assertGreater(right_front.getpixel((150, 120))[1], 240)
            with Image.open(views["back"]) as back:
                self.assertEqual(back.size, (300, 240))
                self.assertGreater(back.getpixel((150, 120))[2], 240)

    def test_builds_api_key_payload_from_local_three_views(self):
        """The API-key transport uses the documented 3.1 image + multi-view fields."""
        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            views = {}
            for index, view in enumerate(("front", "right_front", "back")):
                path = root / f"{view}.jpg"
                Image.new("RGB", (256, 256), (index * 60, 20, 40)).save(path)
                views[view] = path

            payload = build_hunyuan_pro_payload(views, face_count=100000)

            self.assertEqual(payload["Model"], "3.1")
            self.assertTrue(payload["EnablePBR"])
            self.assertEqual(payload["GenerateType"], "Normal")
            self.assertEqual(payload["FaceCount"], 100000)
            self.assertIn("ImageBase64", payload)
            self.assertNotIn("ImageUrl", payload)
            self.assertFalse(payload["ImageBase64"].startswith("data:"))
            self.assertEqual(
                payload["MultiViewImages"],
                [
                    {"ViewType": "right_front", "ViewImageBase64": ANY},
                    {"ViewType": "back", "ViewImageBase64": ANY},
                ],
            )
            self.assertFalse(payload["MultiViewImages"][0]["ViewImageBase64"].startswith("data:"))

    def test_posts_json_with_api_key_only_in_authorization_header(self):
        """The request must not put the API key into query strings or JSON bodies."""
        captured = {}

        class Response:
            def __enter__(self):
                return self

            def __exit__(self, *_):
                return False

            def read(self):
                return b'{"Response": {"JobId": "job-123"}}'

        def opener(request, timeout):
            captured["request"] = request
            captured["timeout"] = timeout
            return Response()

        result = post_json(
            "https://api.ai3d.cloud.tencent.com/v1/ai3d/submit",
            {"Prompt": "test"},
            api_key="sk-example",
            opener=opener,
            timeout_seconds=21,
        )

        self.assertEqual(result["Response"]["JobId"], "job-123")
        self.assertEqual(captured["request"].get_header("Authorization"), "sk-example")
        self.assertNotIn("sk-example", captured["request"].data.decode("utf-8"))
        self.assertEqual(captured["timeout"], 21)


if __name__ == "__main__":
    unittest.main()
