import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { PRODUCTS } from "../src/lib/1688-products";
import { getStorefrontProducts } from "../src/lib/storefront/catalog";

const SOURCE_ROOT = "/images/products/1688-shop/pearl-series";

const approvedGallerySources: Record<string, [string, string, string]> = {
  "pearl-series-01": ["main", "detail3", "detail1"],
  "pearl-series-02": ["main", "detail2", "detail1"],
  "pearl-series-03": ["main", "detail2", "detail1"],
  "pearl-series-04": ["main", "detail3", "detail1"],
  "pearl-series-05": ["main", "detail3", "detail1"],
  "pearl-series-06": ["main", "detail3", "detail1"],
  "pearl-series-07": ["main", "detail4", "detail1"],
  "pearl-series-08": ["main", "detail3", "detail1"],
  "pearl-series-09": ["main", "detail3", "detail1"],
  "pearl-series-10": ["main", "detail3", "detail1"],
  "pearl-series-11": ["main", "detail3", "detail1"],
  "pearl-series-12": ["main", "detail3", "detail1"],
  "pearl-series-13": ["main", "detail4", "detail1"],
  "pearl-series-14": ["main", "detail5", "detail1"],
  "pearl-series-15": ["main", "detail2", "detail1"],
  "pearl-series-16": ["main", "detail2", "detail1"],
  "pearl-series-17": ["main", "detail3", "detail1"],
  // This SKU has no source-supplied wearing photo. The gallery intentionally
  // uses an alternate static product view instead of an invented model image.
  "pearl-series-18": ["main", "detail1", "detail2"],
  "pearl-series-19": ["main", "detail3", "detail1"],
  "pearl-series-20": ["main", "detail3", "detail1"],
};

const activePearlProducts = PRODUCTS.filter(
  (product) => product.category === "pearl-series" && product.isActive && product.inStock,
);

assert.equal(activePearlProducts.length, 20, "all 20 pearl SKUs should remain active");

for (const product of activePearlProducts) {
  const approvedSources = approvedGallerySources[product.slug];
  assert.ok(approvedSources, `${product.slug} needs an approved source mapping`);

  const expectedImages = approvedSources.map(
    (source) => `${SOURCE_ROOT}/${product.slug}-${source}.webp`,
  );

  assert.equal(product.image, expectedImages[0], `${product.slug} main image must be source-preserved`);
  assert.deepEqual(
    product.images,
    expectedImages,
    `${product.slug} gallery must only contain its approved supplier source images`,
  );
}

assert.equal(
  getStorefrontProducts().some((product) => product.images.some((image) => image.includes("/images/brand/products/"))),
  false,
  "active product galleries must not use generated brand product images",
);

const storefrontProducts = getStorefrontProducts();
const newSeriesProducts = storefrontProducts.filter((product) => product.slug.startsWith("new-series-"));
assert.equal(storefrontProducts.length, 45, "the storefront should contain 45 approved products");
assert.equal(newSeriesProducts.length, 25, "the approved new-series edit should contain 25 products");

for (const product of newSeriesProducts) {
  const expectedRoot = `/images/products/new-series/${product.slug}/`;
  assert.equal(product.image, `${expectedRoot}main.jpg`);
  for (const image of product.images) {
    assert.ok(image.startsWith(expectedRoot), `${product.slug} contains a cross-product image`);
    assert.equal(
      existsSync(path.join(process.cwd(), "public", image.replace(/^\//, ""))),
      true,
      `${image} must exist on disk`,
    );
  }
}

console.log(`Verified ${storefrontProducts.length} source-preserved product galleries.`);
