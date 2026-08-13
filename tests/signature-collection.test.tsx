import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { collectionRenderOrder } from "../src/app/collections/[slug]/1688-collection";
import { EditorialDivider } from "../src/components/storefront/EditorialDivider";
import { ProductCard } from "../src/components/product/ProductCard";

test("editorial divider is not a product or interactive merchandising card", () => {
  const html = renderToStaticMarkup(
    createElement(EditorialDivider, {
      image: {
        src: "/images/brand/editorial/scene-seaside-stairs.png",
        alt: "Sunlit limestone steps near the sea",
      },
      eyebrow: "Maverenne Notes",
      title: "Made for the life around them.",
      description: "A quiet pause between pieces.",
    }),
  );

  assert.doesNotMatch(html, /<(?:a|button)\b|\$|price|stock/i);
  assert.match(html, /data-editorial-divider="true"/);
});

test("collection render order leaves 11 products untouched", () => {
  const products = Array.from({ length: 11 }, (_, index) => ({ slug: `product-${index + 1}` }));

  const entries = collectionRenderOrder(products);

  assert.deepEqual(entries, products.map((product) => ({ kind: "product", product })));
  assert.ok(entries.every((entry) => entry.kind === "product"));
});

test("collection render order places the divider between rendered products eight and nine at 12 products", () => {
  const products = Array.from({ length: 12 }, (_, index) => ({ slug: `product-${index + 1}` }));

  const entries = collectionRenderOrder(products);

  assert.equal(entries.length, 13);
  assert.equal(entries[7]?.kind, "product");
  assert.equal(entries[7]?.kind === "product" && entries[7].product, products[7]);
  assert.deepEqual(entries[8], { kind: "editorial-divider" });
  assert.equal(entries[9]?.kind, "product");
  assert.equal(entries[9]?.kind === "product" && entries[9].product, products[8]);
  assert.deepEqual(
    entries.flatMap((entry) => (entry.kind === "product" ? [entry.product.slug] : [])),
    products.map((product) => product.slug),
  );
});

test("product cards retain merchandise facts and action surfaces", () => {
  const html = renderToStaticMarkup(
    createElement(ProductCard, {
      product: {
        id: "1688-001",
        name: "Calm Tide Pearl Ring",
        slug: "calm-tide-pearl-ring",
        images: ["/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-01-hero.png"],
        variants: [{ price: 42 }],
        comparePrice: 56,
      },
    }),
  );

  assert.match(html, /Calm Tide Pearl Ring/);
  assert.match(html, /\$42\.00/);
  assert.match(html, /Sale/);
  assert.match(html, /Save \$14\.00/);
  assert.match(html, /aria-label="Add to wishlist"/);
  assert.match(html, /aria-label="Add Calm Tide Pearl Ring to cart"/);
});

test("product card action surfaces remain bound to their existing handlers", () => {
  const source = readFileSync("src/components/product/ProductCard.tsx", "utf8");

  assert.match(source, /onClick=\{handleToggleWishlist\}/);
  assert.match(source, /onClick=\{handleQuickAdd\}/);
});
