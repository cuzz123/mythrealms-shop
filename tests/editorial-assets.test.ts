import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
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

test("every manifest style reference is available from the curated local pack", () => {
  const styleReferenceRoot = resolve(process.cwd(), "assets/product-imagery/style-references");

  for (const product of manifest.products) {
    for (const reference of product.styleReferences) {
      assert.equal(existsSync(resolve(styleReferenceRoot, reference)), true, `${product.slug}: ${reference}`);
    }
  }

  const { referenceRoot: _referenceRoot, ...portableManifest } = manifest;
  assert.doesNotMatch(JSON.stringify(portableManifest), /C:\\Users/);
});

test("review generator renders missing outputs as visible empty states", async () => {
  const generatorPath = resolve(process.cwd(), "scripts/product_imagery/build_review.ts");
  assert.equal(existsSync(generatorPath), true, "review generator is present");

  const { buildReviewHtml } = await import("../scripts/product_imagery/build_review");
  const reviewHtml = buildReviewHtml(manifest, new Map());

  assert.equal((reviewHtml.match(/data-product-slug=/g) ?? []).length, 5);
  assert.equal((reviewHtml.match(/>Not generated</g) ?? []).length, 20);
  assert.equal((reviewHtml.match(/data-reference-kind="source"/g) ?? []).length, 17);
  assert.doesNotMatch(reviewHtml, /C:\\Users/);
  assert.doesNotMatch(reviewHtml, /<img[^>]+editorial-v2/);
  assert.match(reviewHtml, /Rejection history/);
  assert.match(reviewHtml, /Identity checklist/);
});
