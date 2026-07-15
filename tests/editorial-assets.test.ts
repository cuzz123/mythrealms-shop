import assert from "node:assert/strict";
import test from "node:test";
import manifest from "../assets/product-imagery/pilot-manifest.json";
import {
  EDITORIAL_SLOTS,
  getApprovedEditorialGallery,
} from "../src/lib/product-imagery/editorial-assets";

const PILOT_SLUGS = [
  "pearl-series-01",
  "new-series-round-shell-disc-drops",
  "new-series-shell-twist-pearl-cuff",
  "new-series-pearl-dreamcatcher-lariat",
  "new-series-pearl-glasses-chain",
];

test("pilot manifest defines five representative products and four ordered slots", () => {
  assert.deepEqual(manifest.products.map((product) => product.slug), PILOT_SLUGS);
  assert.deepEqual(EDITORIAL_SLOTS, ["main", "on-model", "macro", "lifestyle"]);
  for (const product of manifest.products) {
    assert.equal(Object.keys(product.outputs).length, 4);
    assert.equal(product.status, "draft");
    assert.equal(product.sourceReferences.length >= 2, true);
  }
});

test("draft packages never replace source-preserved storefront galleries", () => {
  for (const slug of PILOT_SLUGS) {
    assert.equal(getApprovedEditorialGallery(slug), undefined);
  }
});
