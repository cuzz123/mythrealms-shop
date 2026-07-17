from __future__ import annotations

import unittest
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from glb_asset_batch_specs import merge_registry_rows


class MergeRegistryRowsTests(unittest.TestCase):
    def test_preserves_unrelated_rows_and_replaces_only_target_ids(self) -> None:
        existing = [
            {"id": "KEEP", "value": 1},
            {"id": "TARGET", "value": "old"},
            {"id": "KEEP", "value": 2},
        ]
        generated = [{"id": "TARGET", "value": "new"}, {"id": "NEW", "value": 3}]

        result = merge_registry_rows(existing, generated, {"TARGET", "NEW"})

        self.assertEqual(
            result,
            [
                {"id": "KEEP", "value": 1},
                {"id": "KEEP", "value": 2},
                {"id": "TARGET", "value": "new"},
                {"id": "NEW", "value": 3},
            ],
        )


if __name__ == "__main__":
    unittest.main()
