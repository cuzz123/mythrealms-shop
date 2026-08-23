import assert from "node:assert/strict";
import test from "node:test";

import { buildProductMetadata } from "../src/lib/seo/product-metadata";
import { getStorefrontProductBySlug } from "../src/lib/storefront/catalog";

test("builds canonical Golden Shell metadata from verified catalog fields", () => {
  const product = getStorefrontProductBySlug("new-series-round-shell-gold-cuff");
  assert.ok(product, "expected the Golden Shell product in the storefront catalog");

  const metadata = buildProductMetadata(product);
  const normalizedDescription = product.description.trim().replace(/\s+/g, " ").slice(0, 155).trim();

  assert.equal(metadata.title, `${product.name} | Pearl Bracelet | Maverenne`);
  assert.equal(
    metadata.alternates?.canonical,
    `https://www.maverenne.com/products/${product.slug}`,
  );
  assert.equal(metadata.description, normalizedDescription);
  assert.ok((metadata.description?.length ?? 0) > 40);
  assert.ok((metadata.description?.length ?? 0) <= 155);

  const serializedMetadata = JSON.stringify(metadata);
  assert.doesNotMatch(serializedMetadata, /MythRealms|vercel\.app/);
});

test("preserves the product social metadata shape with one absolute primary image", () => {
  const product = getStorefrontProductBySlug("new-series-round-shell-gold-cuff");
  assert.ok(product, "expected the Golden Shell product in the storefront catalog");

  const metadata = buildProductMetadata(product);
  const openGraph = metadata.openGraph;

  assert.deepEqual(openGraph && "images" in openGraph ? openGraph.images : undefined, [
    { url: `https://www.maverenne.com${product.image}` },
  ]);
  assert.deepEqual(metadata.twitter?.images, [`https://www.maverenne.com${product.image}`]);
});
