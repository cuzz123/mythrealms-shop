import assert from "node:assert/strict";
import test from "node:test";
import { getComplementaryProductsForSources } from "../src/components/storefront/ComplementaryProducts";
import { getFreeShippingProgress } from "../src/components/storefront/FreeShippingProgress";
import { getStorefrontProducts } from "../src/lib/storefront/catalog";
import { STORE_POLICY_FACTS } from "../src/lib/storefront/policies";

test("complementary products are stable, approved, and exclude all source products", () => {
  const products = getStorefrontProducts();
  const sourceSlugs = ["pearl-series-05", "pearl-series-13"];
  const first = getComplementaryProductsForSources(sourceSlugs, products);
  const second = getComplementaryProductsForSources(sourceSlugs, products);

  assert.deepEqual(first.map((product) => product.slug), second.map((product) => product.slug));
  assert.ok(first.length >= 2 && first.length <= 4);
  assert.ok(first.every((product) => !sourceSlugs.includes(product.slug)));
  assert.ok(first.every((product) => products.some((candidate) => candidate.slug === product.slug)));
});

test("shipping progress uses the centralized threshold and remains bounded", () => {
  const threshold = STORE_POLICY_FACTS.freeShippingThresholdUsd;

  assert.deepEqual(getFreeShippingProgress(-10), {
    threshold,
    subtotal: 0,
    remaining: threshold,
    progress: 0,
    isUnlocked: false,
  });
  assert.equal(getFreeShippingProgress(threshold - 0.01).remaining, 0.01);
  assert.deepEqual(getFreeShippingProgress(threshold), {
    threshold,
    subtotal: threshold,
    remaining: 0,
    progress: 100,
    isUnlocked: true,
  });
  assert.equal(getFreeShippingProgress(threshold * 2).progress, 100);
});
