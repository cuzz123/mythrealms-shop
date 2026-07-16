import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";
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

function styleReferencePath(styleReferenceRoot: string, reference: string): string {
  assert.equal(isAbsolute(reference), false, `style reference must be relative: ${reference}`);
  assert.equal(reference.split(/[\\/]+/).includes(".."), false, `style reference may not traverse: ${reference}`);

  const resolvedPath = resolve(styleReferenceRoot, reference);
  const pathWithinRoot = relative(styleReferenceRoot, resolvedPath);
  assert.notEqual(pathWithinRoot, "", `style reference must resolve to a file: ${reference}`);
  assert.equal(isAbsolute(pathWithinRoot), false, `style reference escapes the local pack: ${reference}`);
  assert.equal(pathWithinRoot.startsWith(`..${sep}`), false, `style reference escapes the local pack: ${reference}`);
  return resolvedPath;
}

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value === null || typeof value !== "object") return [];
  return Object.values(value).flatMap(collectStrings);
}

function assertPortableManifestStrings(value: unknown, generatedImagesRoot: string): void {
  for (const entry of collectStrings(value)) {
    assert.doesNotMatch(entry, /C:\\Users/);
    assert.equal(entry.includes(generatedImagesRoot), false);
  }
}

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
      assert.equal(existsSync(styleReferencePath(styleReferenceRoot, reference)), true, `${product.slug}: ${reference}`);
    }
  }

  const { referenceRoot: _referenceRoot, ...portableManifest } = manifest;
  assertPortableManifestStrings(portableManifest, manifest.referenceRoot);
});

test("style reference path guard rejects traversal segments", () => {
  const styleReferenceRoot = resolve(process.cwd(), "assets/product-imagery/style-references");

  assert.throws(() => styleReferencePath(styleReferenceRoot, "../escape.png"));
});

test("style reference path guard rejects absolute Windows paths", () => {
  const styleReferenceRoot = resolve(process.cwd(), "assets/product-imagery/style-references");

  assert.throws(() => styleReferencePath(styleReferenceRoot, "C:\\Users\\11458\\escape.png"));
});

test("portable manifest check rejects nested source-machine paths", () => {
  assert.throws(() =>
    assertPortableManifestStrings(
      { nested: { generatedSource: `${manifest.referenceRoot}\\escape.png` } },
      manifest.referenceRoot,
    ),
  );
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
