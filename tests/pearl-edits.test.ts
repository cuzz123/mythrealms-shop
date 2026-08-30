import assert from "node:assert/strict";
import test from "node:test";

import {
  PEARL_EDITS,
  getComplementaryProducts,
  getPearlEditBySlug,
  getPearlEditProducts,
} from "../src/lib/storefront/pearl-edits";
import { getProductType, getStorefrontProducts } from "../src/lib/storefront/catalog";

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

test("curated edit companions are prioritized before type-matched fallbacks", () => {
  const edit = PEARL_EDITS[0];
  const sourceSlug = edit.productSlugs[0];
  const complements = getComplementaryProducts(sourceSlug, products);
  const curatedCompanions = products
    .filter((product) => edit.productSlugs.includes(product.slug) && product.slug !== sourceSlug)
    .map((product) => product.slug);

  assert.deepEqual(
    complements.slice(0, curatedCompanions.length).map((product) => product.slug),
    curatedCompanions,
  );
  assert.equal(complements.length, 4);
  assert.equal(complements.some((product) => product.slug === sourceSlug), false);
});

test("non-curated products use same-type products before catalog-order fallbacks", () => {
  const curatedSlugs = new Set(PEARL_EDITS.flatMap((edit) => edit.productSlugs));
  const source = products.find((product) => !curatedSlugs.has(product.slug));
  assert.ok(source, "the fixture must include a product outside the curated edits");

  const sameType = products
    .filter(
      (product) =>
        product.slug !== source.slug && getProductType(product) === getProductType(source),
    )
    .slice(0, 4)
    .map((product) => product.slug);
  const complements = getComplementaryProducts(source.slug, products);

  assert.deepEqual(complements.slice(0, sameType.length).map((product) => product.slug), sameType);
  assert.equal(complements.length, 4);
});

test("complement selection is deterministic, unique, and ignores unknown slugs", () => {
  const sourceSlug = PEARL_EDITS[0].productSlugs[1];
  const first = getComplementaryProducts(sourceSlug, products).map((product) => product.slug);
  const second = getComplementaryProducts(sourceSlug, products).map((product) => product.slug);

  assert.deepEqual(first, second);
  assert.equal(new Set(first).size, first.length);
  assert.deepEqual(getComplementaryProducts("unknown-product", products), []);
});

test("complement selection deduplicates repeated catalog records", () => {
  const sourceSlug = products[0].slug;
  const duplicatedProducts = [products[0], products[1], products[1], ...products.slice(2)];
  const complements = getComplementaryProducts(sourceSlug, duplicatedProducts);

  assert.equal(new Set(complements.map((product) => product.slug)).size, complements.length);
  assert.equal(complements.some((product) => product.slug === sourceSlug), false);
  assert.equal(complements.length, 4);
});

test("every active storefront product receives four valid complementary links", () => {
  const productSlugs = new Set(products.map((product) => product.slug));

  for (const product of products) {
    const complements = getComplementaryProducts(product.slug, products);
    const complementSlugs = complements.map((complement) => complement.slug);

    assert.equal(complements.length, 4, product.slug);
    assert.equal(new Set(complementSlugs).size, 4, product.slug);
    assert.equal(complementSlugs.includes(product.slug), false, product.slug);
    assert.equal(
      complementSlugs.every((slug) => productSlugs.has(slug)),
      true,
      product.slug,
    );
  }
});
