import assert from "node:assert/strict";
import test from "node:test";
import { BRAND } from "../src/lib/brand-identity";
import { SITE_NAME } from "../src/lib/site";

test("Maverenne identity exposes approved copy", () => {
  assert.equal(BRAND.name, "Maverenne");
  assert.equal(BRAND.tagline, "Come back to yourself.");
  assert.equal(BRAND.descriptor, "Jewelry & Accessories");
  assert.equal(BRAND.heroTitle, "A little something for yourself.");
  assert.equal(BRAND.primaryCta.label, "Find Your Piece");
  assert.equal(BRAND.primaryCta.href, "/collections/pearl-series");
  assert.equal(SITE_NAME, BRAND.name);
});
