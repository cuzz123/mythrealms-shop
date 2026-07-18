import assert from "node:assert/strict";
import test from "node:test";
import { PEARL_GUIDES, PEARL_HUB_FAQ } from "../src/lib/editorial/guides";

test("pearl guide registry contains complete, citable articles", () => {
  assert.deepEqual(Object.keys(PEARL_GUIDES), [
    "care",
    "how-to-wear",
    "freshwater-pearls",
  ]);
  for (const guide of Object.values(PEARL_GUIDES)) {
    assert.equal(guide.author, "MythRealms Editorial");
    assert.match(guide.updated, /^2026-07-18$/);
    assert.ok(guide.sections.length >= 3);
    assert.ok(guide.faq.length >= 3);
    assert.ok(guide.sources.every((source) => source.href.startsWith("https://")));
  }
});

test("pearl hub owns a visible general FAQ set", () => {
  assert.ok(PEARL_HUB_FAQ.length >= 3);
  assert.ok(PEARL_HUB_FAQ.every(({ question, answer }) => question && answer));
});
