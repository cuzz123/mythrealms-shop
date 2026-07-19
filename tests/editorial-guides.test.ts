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

test("pearl storage guidance distinguishes air-drying from safe storage", () => {
  const care = PEARL_GUIDES.care;
  const storage = care.sections.find((section) => section.id === "storage");
  const storageFaq = care.faq.find((item) => /store pearl jewelry/i.test(item.question));
  assert.ok(storage);
  assert.ok(storageFaq);

  const copy = [
    PEARL_HUB_FAQ.find((item) => /care for pearl jewelry/i.test(item.question))?.answer,
    care.directAnswer,
    storage.answer,
    ...storage.paragraphs,
    storageFaq.answer,
  ].join(" ");

  assert.match(copy, /air-dry fully/i);
  assert.match(copy, /store (?:pearls|the piece|it) flat/i);
  assert.match(copy, /soft (?:pouch|cloth)/i);
  assert.match(copy, /separate/i);
  assert.match(copy, /away from heat/i);
  assert.match(copy, /overly dry environments/i);
  assert.match(copy, /never hang/i);
  assert.doesNotMatch(copy, /keep (?:it|them|pearls|pearl jewelry) dry/i);
  assert.doesNotMatch(copy, /(?:hot,? dry|dry,? hot|dry,? soft place)/i);
});
