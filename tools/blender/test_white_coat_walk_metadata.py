from __future__ import annotations

import unittest

import sync_white_coat_walk_pack_cards as sync


class RegistryMergeTests(unittest.TestCase):
    def test_existing_approved_entry_keeps_status_and_custom_fields(self) -> None:
        self.assertTrue(
            hasattr(sync, "merge_registry_entry"),
            "sync module must provide merge_registry_entry",
        )
        existing = {
            "id": "ACT_TEST",
            "name": "人工修订名称",
            "category": "motion",
            "status": "approved",
            "version": "v2",
            "source_paths": ["existing.blend"],
            "tags": ["human-reviewed"],
            "usage": {
                "default_import": "link",
                "custom_rule": "keep-me",
                "suitable_for": ["人工用途"],
            },
            "quality_gate": ["人工验收"],
            "notes": "人工备注必须保留",
            "custom_field": {"owner": "user"},
        }
        generated = {
            "id": "ACT_TEST",
            "name": "生成名称",
            "category": "motion",
            "status": "candidate",
            "version": "v1",
            "source_paths": ["generated.blend"],
            "tags": ["walk"],
            "usage": {
                "default_import": "append",
                "character_id": "CHAR_TEST",
                "suitable_for": ["生成用途"],
            },
            "quality_gate": ["脚底检查"],
            "notes": "生成备注",
        }

        merged = sync.merge_registry_entry(existing, generated)

        self.assertEqual(merged["status"], "approved")
        self.assertEqual(merged["version"], "v2")
        self.assertEqual(merged["name"], "人工修订名称")
        self.assertEqual(merged["notes"], "人工备注必须保留")
        self.assertEqual(merged["custom_field"], {"owner": "user"})
        self.assertEqual(merged["usage"]["default_import"], "link")
        self.assertEqual(merged["usage"]["custom_rule"], "keep-me")
        self.assertEqual(merged["usage"]["character_id"], "CHAR_TEST")
        self.assertEqual(
            merged["source_paths"], ["existing.blend", "generated.blend"]
        )
        self.assertEqual(merged["tags"], ["human-reviewed", "walk"])
        self.assertEqual(
            merged["usage"]["suitable_for"], ["人工用途", "生成用途"]
        )
        self.assertEqual(merged["quality_gate"], ["人工验收", "脚底检查"])


if __name__ == "__main__":
    unittest.main()
