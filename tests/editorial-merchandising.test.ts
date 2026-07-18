import assert from "node:assert/strict";
import test from "node:test";
import {
  EVERYDAY_SLUGS,
  STATEMENT_SLUGS,
  getGiftSections,
  getNewArrivalProducts,
  selectNewArrivalProducts,
} from "../src/lib/editorial/gifts";
import { getStorefrontProducts } from "../src/lib/storefront/catalog";

test("new arrivals are visible in-stock products marked new", () => {
  const products = selectNewArrivalProducts([
    { slug: "visible-new", isNew: true, isActive: true, inStock: true },
    { slug: "old", isNew: false, isActive: true, inStock: true },
    { slug: "inactive", isNew: true, isActive: false, inStock: true },
    { slug: "unavailable", isNew: true, isActive: true, inStock: false },
  ]);

  assert.deepEqual(products.map(({ slug }) => slug), ["visible-new"]);
});

test("new arrivals allow an empty season", () => {
  assert.deepEqual(selectNewArrivalProducts([]), []);
  assert.ok(Array.isArray(getNewArrivalProducts()));
});

test("gift price sections enforce their thresholds", () => {
  const sections = getGiftSections();
  for (const product of sections.find((section) => section.id === "under-50")!.products) {
    assert.ok(product.price < 50);
  }
  for (const product of sections.find((section) => section.id === "under-70")!.products) {
    assert.ok(product.price < 70);
  }
});

test("gift price sections are ordered and do not repeat first-screen products", () => {
  const sections = getGiftSections();
  assert.deepEqual(sections.map(({ id }) => id), ["under-50", "under-70", "everyday", "statement"]);

  const [under50, under70] = sections;
  const under50Slugs = new Set(under50.products.map(({ slug }) => slug));
  assert.ok(under70.products.every(({ slug }) => !under50Slugs.has(slug)));
});

test("gift labels do not claim unverified popularity", () => {
  const copy = JSON.stringify(getGiftSections());
  assert.doesNotMatch(copy, /best seller|most loved|top rated/i);
});

test("every configured editorial gift SKU resolves in the current catalog", () => {
  const catalogSlugs = new Set(getStorefrontProducts().map(({ slug }) => slug));
  for (const slug of [...EVERYDAY_SLUGS, ...STATEMENT_SLUGS]) {
    assert.equal(catalogSlugs.has(slug), true, slug);
  }
});
