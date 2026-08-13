import assert from "node:assert/strict";
import test from "node:test";

import {
  PEARL_EDITS,
  getComplementaryProducts,
  getPearlEditBySlug,
  getPearlEditProducts,
} from "../src/lib/storefront/pearl-edits";
import { getStorefrontProducts } from "../src/lib/storefront/catalog";

const products = getStorefrontProducts();

test("each pearl edit resolves only approved storefront products", () => {
  const approvedSlugs = new Set(products.map((product) => product.slug));

  assert.deepEqual(
    PEARL_EDITS.map((edit) => edit.slug),
    [
      "everyday-light",
      "dinner-by-the-water",
      "a-gift-to-keep",
      "soft-gold-and-pearl",
    ],
  );

  for (const edit of PEARL_EDITS) {
    assert.match(edit.heroImage, /^\/images\//);
    const resolved = getPearlEditProducts(edit, products);
    assert.deepEqual(resolved.map((product) => product.slug), edit.productSlugs);
    for (const product of resolved) {
      assert.equal(approvedSlugs.has(product.slug), true, product.slug);
    }
  }
});

test("pearl edit lookup returns the canonical edit and ignores unknown slugs", () => {
  assert.equal(getPearlEditBySlug("everyday-light"), PEARL_EDITS[0]);
  assert.equal(getPearlEditBySlug("retired-collection"), undefined);
});

test("unavailable pearl edit product slugs are rejected", () => {
  const edit = {
    ...PEARL_EDITS[0],
    productSlugs: ["retired-product"],
  };

  assert.throws(
    () => getPearlEditProducts(edit, products),
    /retired-product.*not part of the storefront catalog/i,
  );
});

test("complements exclude the source SKU and retain catalog order", () => {
  const edit = PEARL_EDITS[0];
  const sourceSlug = edit.productSlugs[0];
  const complements = getComplementaryProducts(sourceSlug, products);
  const expected = products
    .filter((product) => edit.productSlugs.includes(product.slug) && product.slug !== sourceSlug)
    .slice(0, 4)
    .map((product) => product.slug);

  assert.deepEqual(complements.map((product) => product.slug), expected);
  assert.equal(complements.some((product) => product.slug === sourceSlug), false);
  assert.ok(complements.length >= 2 && complements.length <= 4);
});

test("complement selection is deterministic and ignores products outside an edit", () => {
  const sourceSlug = PEARL_EDITS[0].productSlugs[1];
  const first = getComplementaryProducts(sourceSlug, products).map((product) => product.slug);
  const second = getComplementaryProducts(sourceSlug, products).map((product) => product.slug);

  assert.deepEqual(first, second);
  assert.deepEqual(getComplementaryProducts("unknown-product", products), []);
});
