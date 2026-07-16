import hashlib
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).parents[1]))

from scripts.product_imagery.lock_source_hashes import lock_source_hashes
from scripts.product_imagery.normalize_image import normalize_image
from scripts.product_imagery.validate_packages import MAX_BYTES, validate_manifest


EXPECTED_OUTPUTS = {
    "main": "01-main.webp",
    "on-model": "02-on-model.webp",
    "macro": "03-macro.webp",
    "lifestyle": "04-lifestyle.webp",
}


class NormalizeImageTest(unittest.TestCase):
    def test_normalizes_four_by_five_without_cropping(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "source.png"
            output = root / "output.webp"
            Image.new("RGB", (800, 1000), "white").save(source)

            normalize_image(source, output)

            with Image.open(output) as image:
                self.assertEqual(image.size, (1600, 2000))
                self.assertEqual(image.format, "WEBP")

    def test_rejects_an_image_that_would_need_cropping(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "square.png"
            Image.new("RGB", (1000, 1000), "white").save(source)

            with self.assertRaisesRegex(ValueError, "4:5"):
                normalize_image(source, root / "output.webp")

    def test_rejects_an_identical_source_and_destination_without_mutating_source(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / "source.png"
            Image.new("RGB", (800, 1000), "white").save(source)
            source_bytes = source.read_bytes()

            with self.assertRaisesRegex(ValueError, "source and destination"):
                normalize_image(source, source)

            self.assertEqual(source.read_bytes(), source_bytes)

    def test_rejects_a_hard_link_destination_without_mutating_source(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            source = root / "source.png"
            destination = root / "source-alias.png"
            Image.new("RGB", (800, 1000), "white").save(source)
            os.link(source, destination)
            source_bytes = source.read_bytes()

            with self.assertRaisesRegex(ValueError, "source and destination"):
                normalize_image(source, destination)

            self.assertEqual(source.read_bytes(), source_bytes)
            self.assertEqual(destination.read_bytes(), source_bytes)


class ProductImageryRepositoryTestCase(unittest.TestCase):
    def setUp(self):
        self.temporary_directory = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary_directory.name)
        self.manifest_path = self.root / "assets" / "product-imagery" / "pilot-manifest.json"
        self.hash_path = self.manifest_path.with_name("source-hashes.json")
        self.source_path = self.root / "public" / "images" / "products" / "source.jpg"
        self.source_path.parent.mkdir(parents=True)
        Image.new("RGB", (20, 20), "white").save(self.source_path)

    def tearDown(self):
        self.temporary_directory.cleanup()

    def source_reference(self):
        return self.source_path.relative_to(self.root).as_posix()

    def write_manifest(self, *, status="approved", outputs=None, source_references=None):
        slug = "test-product"
        output_paths = outputs or {
            slot: f"public/images/products/editorial-v2/{slug}/{filename}"
            for slot, filename in EXPECTED_OUTPUTS.items()
        }
        manifest = {
            "schemaVersion": 1,
            "products": [
                {
                    "slug": slug,
                    "sourceReferences": source_references or [self.source_reference()],
                    "outputs": output_paths,
                    "status": status,
                }
            ],
        }
        self.manifest_path.parent.mkdir(parents=True, exist_ok=True)
        self.manifest_path.write_text(json.dumps(manifest), encoding="utf-8")
        return output_paths

    def write_hashes(self, hashes=None):
        source_hashes = hashes or {self.source_reference(): self.sha256(self.source_path)}
        self.hash_path.write_text(
            json.dumps(source_hashes, indent=2, sort_keys=True) + "\n", encoding="utf-8"
        )

    def write_valid_outputs(self, outputs):
        for output_path in outputs.values():
            destination = self.root / output_path
            destination.parent.mkdir(parents=True, exist_ok=True)
            Image.new("RGB", (1600, 2000), "white").save(destination, "WEBP")

    @staticmethod
    def sha256(path):
        return hashlib.sha256(path.read_bytes()).hexdigest()


class SourceHashLockingTest(ProductImageryRepositoryTestCase):
    def test_locks_sorted_hashes_for_each_unique_source(self):
        second_source = self.root / "public" / "images" / "products" / "second.jpg"
        Image.new("RGB", (20, 20), "black").save(second_source)
        self.write_manifest(source_references=[second_source.relative_to(self.root).as_posix(), self.source_reference()])

        locked_hashes = lock_source_hashes(self.manifest_path, self.hash_path)

        self.assertEqual(list(locked_hashes), sorted(locked_hashes))
        self.assertEqual(locked_hashes[self.source_reference()], self.sha256(self.source_path))
        self.assertEqual(json.loads(self.hash_path.read_text(encoding="utf-8")), locked_hashes)

    def test_refuses_to_overwrite_a_baseline(self):
        self.write_manifest()
        self.write_hashes()

        with self.assertRaises(FileExistsError):
            lock_source_hashes(self.manifest_path, self.hash_path)

    def test_verify_reports_mismatch_without_rewriting_the_baseline(self):
        self.write_manifest()
        self.write_hashes({self.source_reference(): "0" * 64})
        original_baseline = self.hash_path.read_bytes()

        with self.assertRaises(ValueError):
            lock_source_hashes(self.manifest_path, self.hash_path, verify=True)

        self.assertEqual(self.hash_path.read_bytes(), original_baseline)

    def test_verify_cli_exits_nonzero_without_rewriting_the_baseline(self):
        self.write_manifest()
        self.write_hashes({self.source_reference(): "0" * 64})
        original_baseline = self.hash_path.read_bytes()
        script = Path(__file__).parents[1] / "scripts" / "product_imagery" / "lock_source_hashes.py"

        result = subprocess.run(
            [sys.executable, script, "--verify", self.manifest_path, self.hash_path],
            capture_output=True,
            text=True,
            check=False,
        )

        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(self.hash_path.read_bytes(), original_baseline)


class PackageValidationTest(ProductImageryRepositoryTestCase):
    def test_validate_cli_runs_from_the_repository_root(self):
        self.write_manifest(status="draft")
        self.write_hashes()
        script = Path(__file__).parents[1] / "scripts" / "product_imagery" / "validate_packages.py"

        result = subprocess.run(
            [sys.executable, script, self.manifest_path],
            capture_output=True,
            text=True,
            check=False,
        )

        self.assertEqual(result.returncode, 0, result.stderr)

    def test_accepts_an_approved_package_with_valid_outputs_and_hashes(self):
        outputs = self.write_manifest()
        self.write_valid_outputs(outputs)
        self.write_hashes()

        self.assertEqual(validate_manifest(self.manifest_path, require_outputs=True), [])

    def test_draft_package_permits_missing_output_files_with_complete_mappings(self):
        outputs = self.write_manifest(status="draft")
        self.write_hashes()

        self.assertEqual(set(outputs), set(EXPECTED_OUTPUTS))
        self.assertEqual(validate_manifest(self.manifest_path, require_outputs=True), [])

    def test_rejects_an_invalid_slot_filename(self):
        outputs = self.write_manifest(
            outputs={
                **{
                    slot: f"public/images/products/editorial-v2/test-product/{filename}"
                    for slot, filename in EXPECTED_OUTPUTS.items()
                },
                "main": "public/images/products/editorial-v2/test-product/wrong.webp",
            }
        )
        self.write_valid_outputs(outputs)
        self.write_hashes()

        self.assertTrue(validate_manifest(self.manifest_path, require_outputs=True))

    def test_rejects_an_image_with_invalid_dimensions(self):
        outputs = self.write_manifest()
        self.write_valid_outputs(outputs)
        Image.new("RGB", (1000, 1000), "white").save(self.root / outputs["macro"], "WEBP")
        self.write_hashes()

        self.assertTrue(validate_manifest(self.manifest_path, require_outputs=True))

    def test_rejects_an_oversized_image(self):
        outputs = self.write_manifest()
        self.write_valid_outputs(outputs)
        oversized_path = self.root / outputs["lifestyle"]
        Image.effect_noise((1600, 2000), 100).convert("RGB").save(
            oversized_path, "WEBP", lossless=True, method=6
        )
        self.assertGreater(oversized_path.stat().st_size, MAX_BYTES)
        self.write_hashes()

        self.assertTrue(validate_manifest(self.manifest_path, require_outputs=True))

    def test_rejects_a_missing_supplier_source(self):
        missing_source = "public/images/products/missing.jpg"
        self.write_manifest(source_references=[missing_source])
        self.write_hashes({missing_source: "0" * 64})

        self.assertTrue(validate_manifest(self.manifest_path, require_outputs=False))

    def test_rejects_a_changed_supplier_source_hash(self):
        self.write_manifest()
        self.write_hashes({self.source_reference(): "0" * 64})

        self.assertTrue(validate_manifest(self.manifest_path, require_outputs=False))

    def test_collects_multiple_package_errors(self):
        outputs = self.write_manifest(
            outputs={
                **{
                    slot: f"public/images/products/editorial-v2/test-product/{filename}"
                    for slot, filename in EXPECTED_OUTPUTS.items()
                },
                "main": "public/images/products/editorial-v2/test-product/wrong.webp",
            }
        )
        self.write_valid_outputs(outputs)
        Image.new("RGB", (1000, 1000), "white").save(self.root / outputs["macro"], "WEBP")
        self.write_hashes({self.source_reference(): "0" * 64})

        errors = validate_manifest(self.manifest_path, require_outputs=True)

        self.assertGreaterEqual(len(errors), 3)


if __name__ == "__main__":
    unittest.main()
