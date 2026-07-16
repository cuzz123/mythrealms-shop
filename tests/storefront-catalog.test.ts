import assert from "node:assert/strict";
import test from "node:test";

import {
  getProductType,
  getStorefrontProductById,
  getStorefrontProductBySlug,
  getStorefrontProducts,
} from "../src/lib/storefront/catalog";

const EXPECTED_TYPES = {
  rings: ["pearl-series-01", "pearl-series-02", "pearl-series-03"],
  bracelets: [
    "pearl-series-04",
    "pearl-series-05",
    "pearl-series-06",
    "pearl-series-07",
    "pearl-series-08",
    "pearl-series-09",
    "pearl-series-10",
    "pearl-series-11",
    "pearl-series-12",
    "new-series-pearl-jade-bracelet",
    "new-series-purple-gem-bangle",
    "new-series-shell-twist-pearl-cuff",
    "new-series-leaf-turquoise-pearl-cuff",
    "new-series-leaf-pearl-bracelet",
    "new-series-round-shell-gold-cuff",
  ],
  earrings: [
    "pearl-series-13",
    "pearl-series-14",
    "pearl-series-15",
    "pearl-series-16",
    "new-series-white-shell-flower-drops",
    "new-series-gold-shell-teardrops",
    "new-series-baroque-pearl-hoops",
    "new-series-purple-gem-pearl-drops",
    "new-series-white-petal-flower-earrings",
    "new-series-mother-of-pearl-cluster-earrings",
    "new-series-white-shell-triple-drops",
    "new-series-round-shell-disc-drops",
  ],
  necklaces: [
    "pearl-series-17",
    "pearl-series-18",
    "pearl-series-19",
    "pearl-series-20",
    "new-series-purple-stone-pendant-necklace",
    "new-series-pearl-y-lariat",
    "new-series-green-layered-pendant-necklace",
    "new-series-pearl-dreamcatcher-lariat",
    "new-series-pearl-drop-choker",
    "new-series-multi-strand-pearl-choker",
    "new-series-black-drop-pearl-choker",
  ],
  "eyewear-chains": [
    "new-series-pearl-glasses-chain",
    "new-series-shell-drop-glasses-chain",
    "new-series-classic-pearl-chain",
    "new-series-turquoise-bead-chain",
  ],
} as const;

const NEW_SERIES_SLUGS = Object.values(EXPECTED_TYPES)
  .flat()
  .filter((slug) => slug.startsWith("new-series-"));

test("storefront exposes the 20 core products and 25 approved new-series products", () => {
  const products = getStorefrontProducts();

  assert.equal(products.length, 45);
  assert.equal(new Set(products.map((product) => product.id)).size, 45);
  assert.equal(new Set(products.map((product) => product.slug)).size, 45);
  assert.ok(
    products.every(
      (product) =>
        product.category === "pearl-series" && product.isActive && product.inStock,
    ),
  );
});

test("retired and unknown products cannot be resolved", () => {
  assert.equal(getStorefrontProductBySlug("pearl-crystal-series-03"), undefined);
  assert.equal(getStorefrontProductBySlug("curated-singles-01"), undefined);
  assert.equal(getStorefrontProductBySlug("test-product"), undefined);
  assert.equal(getStorefrontProductById("1688-035"), undefined);
  assert.equal(getStorefrontProductById("missing"), undefined);
});

test("every storefront product has a deterministic merchandise type", () => {
  for (const [type, slugs] of Object.entries(EXPECTED_TYPES)) {
    for (const slug of slugs) {
      const product = getStorefrontProductBySlug(slug);
      assert.ok(product, `Expected storefront product ${slug}`);
      assert.equal(getProductType(product), type);
    }
  }

  const classified = Object.values(EXPECTED_TYPES).flat();
  assert.equal(classified.length, 45);
  assert.deepEqual(
    [...classified].sort(),
    getStorefrontProducts().map((product) => product.slug).sort(),
  );
});

test("catalog results cannot mutate the source collection or lookups", () => {
  const firstRead = getStorefrontProducts();
  const original = firstRead[0];

  firstRead.pop();
  original.slug = "curated-singles-01";
  original.images.push("/tampered.webp");

  assert.equal(getStorefrontProducts().length, 45);
  assert.equal(getStorefrontProductBySlug("curated-singles-01"), undefined);

  const freshProduct = getStorefrontProductById(original.id);
  assert.ok(freshProduct);
  assert.notEqual(freshProduct.slug, "curated-singles-01");
  assert.ok(!freshProduct.images.includes("/tampered.webp"));
});

test("approved new-series products use only their own source-preserved galleries", () => {
  assert.equal(NEW_SERIES_SLUGS.length, 25);

  for (const slug of NEW_SERIES_SLUGS) {
    const product = getStorefrontProductBySlug(slug);
    assert.ok(product, `Expected approved new-series product ${slug}`);
    const sourceRoot = `/images/products/new-series/${slug}/`;
    assert.equal(product.image, `${sourceRoot}main.jpg`);
    assert.ok(product.images.length >= 1);
    assert.ok(
      product.images.every((image) => image.startsWith(sourceRoot)),
      `${slug} must not reuse another product's images`,
    );
  }
});
