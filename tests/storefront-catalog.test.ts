import assert from "node:assert/strict";
import test from "node:test";

import {
  getProductType,
  getStorefrontProductById,
  getStorefrontProductBySlug,
  getStorefrontProducts,
} from "../src/lib/storefront/catalog";
import { shouldShowStickyAddToCart } from "../src/components/storefront/StickyAddToCart";

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

test("the calm tide pilot uses its complete editorial gallery without changing other pearl source galleries", () => {
  const pilot = getStorefrontProductBySlug("pearl-series-01");
  assert.ok(pilot);
  assert.equal(
    pilot.image,
    "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-01-hero.png",
  );
  assert.deepEqual(pilot.images, [
    "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-01-hero.png",
    "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-02-macro.png",
    "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-03-worn.png",
    "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-04-profile.png",
    "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-05-atmosphere.png",
  ]);
  assert.deepEqual(pilot.imageRoles, {
    primary: "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-01-hero.png",
    wearing: "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-03-worn.png",
    detail: "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-02-macro.png",
  });

  const coreEditorialSlugs = [
    "pearl-series-02", "pearl-series-03", "pearl-series-04", "pearl-series-05",
    "pearl-series-06", "pearl-series-07", "pearl-series-08", "pearl-series-09",
    "pearl-series-10", "pearl-series-11", "pearl-series-12", "pearl-series-13",
    "pearl-series-14", "pearl-series-15", "pearl-series-16", "pearl-series-17",
    "pearl-series-18", "pearl-series-19", "pearl-series-20",
  ];

  for (const slug of coreEditorialSlugs) {
    const product = getStorefrontProductBySlug(slug);
    assert.ok(product, `Expected ${slug} to be available`);
    const imageRoot = `/images/products/1688-shop/pearl-series/${slug}-editorial-v1-`;
    assert.deepEqual(product.images, [
      `${imageRoot}01-hero.png`,
      `${imageRoot}02-macro.png`,
      `${imageRoot}03-worn.png`,
    ]);
    assert.deepEqual(product.imageRoles, {
      primary: `${imageRoot}01-hero.png`,
      detail: `${imageRoot}02-macro.png`,
      wearing: `${imageRoot}03-worn.png`,
    });
  }
});

test("approved new-series products use their own approved galleries", () => {
  assert.equal(NEW_SERIES_SLUGS.length, 25);

  for (const slug of NEW_SERIES_SLUGS) {
    const product = getStorefrontProductBySlug(slug);
    assert.ok(product, `Expected approved new-series product ${slug}`);
    const sourceRoot = `/images/products/new-series/${slug}/`;
    const editorialRoot = `${sourceRoot}editorial-v1-`;
    const expectedPrimary = [
      "new-series-white-shell-flower-drops", "new-series-gold-shell-teardrops",
      "new-series-baroque-pearl-hoops", "new-series-purple-gem-pearl-drops",
      "new-series-white-petal-flower-earrings", "new-series-mother-of-pearl-cluster-earrings",
      "new-series-white-shell-triple-drops", "new-series-round-shell-disc-drops",
      "new-series-pearl-jade-bracelet", "new-series-purple-gem-bangle",
      "new-series-shell-twist-pearl-cuff", "new-series-leaf-turquoise-pearl-cuff",
      "new-series-leaf-pearl-bracelet", "new-series-round-shell-gold-cuff",
      "new-series-purple-stone-pendant-necklace", "new-series-pearl-y-lariat",
      "new-series-green-layered-pendant-necklace", "new-series-pearl-dreamcatcher-lariat",
      "new-series-pearl-drop-choker", "new-series-multi-strand-pearl-choker",
      "new-series-black-drop-pearl-choker", "new-series-pearl-glasses-chain",
      "new-series-shell-drop-glasses-chain", "new-series-classic-pearl-chain",
      "new-series-turquoise-bead-chain",
    ].includes(slug)
      ? `${editorialRoot}01-hero.png`
      : `${sourceRoot}main.jpg`;
    assert.equal(product.image, expectedPrimary);
    assert.ok(product.images.length >= 1);
    assert.ok(
      product.images.every((image) => image.startsWith(sourceRoot)),
      `${slug} must not reuse another product's images`,
    );
  }
});

test("storefront products expose truthful card image roles", () => {
  const editorialCore = getStorefrontProductBySlug("pearl-series-13");
  const editorialWorn = getStorefrontProductBySlug("pearl-series-18");
  const newSeries = getStorefrontProductBySlug("new-series-round-shell-disc-drops");

  assert.equal(editorialCore?.imageRoles?.wearing, "/images/products/1688-shop/pearl-series/pearl-series-13-editorial-v1-03-worn.png");
  assert.equal(editorialWorn?.imageRoles?.wearing, "/images/products/1688-shop/pearl-series/pearl-series-18-editorial-v1-03-worn.png");
  assert.equal(newSeries?.imageRoles?.wearing, undefined);
  assert.equal(newSeries?.imageRoles?.primary, newSeries?.images[0]);
});

test("sticky purchase controls remain absent when the product is unavailable", () => {
  assert.equal(shouldShowStickyAddToCart(false, false, true), false);
  assert.equal(shouldShowStickyAddToCart(true, true, true), false);
  assert.equal(shouldShowStickyAddToCart(true, false, false), false);
  assert.equal(shouldShowStickyAddToCart(true, false, true), true);
});
