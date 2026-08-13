import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const publicFiles = [
  "src/app/products/[slug]/page.tsx",
  "src/app/products/[slug]/1688-product.tsx",
  "src/app/search/page.tsx",
  "src/app/api/products/route.ts",
  "src/app/api/products/[slug]/route.ts",
  "src/components/layout/SearchOverlay.tsx",
  "src/app/guardian-quiz/quiz-client.tsx",
  "src/app/tiktok/page.tsx",
  "src/components/ui/RecentlyViewed.tsx",
  "src/app/wishlist/page.tsx",
  "src/components/home/HomepageHero.tsx",
  "src/components/ui/JsonLd.tsx",
];

function source(relativePath: string): string {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

test("public product surfaces consume only the storefront catalog", () => {
  for (const relativePath of publicFiles) {
    const text = source(relativePath);
    assert.doesNotMatch(
      text,
      /@\/lib\/1688-products/,
      `${relativePath} imports the unfiltered supplier catalog`,
    );
    assert.doesNotMatch(
      text,
      /\bPRODUCTS\s*\.(?:filter|find|map)/,
      `${relativePath} queries the unfiltered supplier catalog`,
    );
    assert.doesNotMatch(text, /Balance\s*&\s*Light/i);
  }
});

test("public product surfaces omit unsupported trust claims", () => {
  const combined = publicFiles.map(source).join("\n");
  for (const pattern of [
    /Math\.random\(/,
    /viewing this right now/i,
    /\bAfterpay\b/i,
    /\bKlarna\b/i,
    /aggregateRating/,
    /\/api\/reviews/,
  ]) {
    assert.doesNotMatch(combined, pattern);
  }
});

test("product page and APIs expose storefront products with true 404 boundaries", () => {
  const page = source("src/app/products/[slug]/page.tsx");
  const listApi = source("src/app/api/products/route.ts");
  const detailApi = source("src/app/api/products/[slug]/route.ts");

  assert.match(page, /getStorefrontProductBySlug\(/);
  assert.match(page, /notFound\(/);
  assert.match(page, /dynamicParams\s*=\s*false/);
  assert.match(page, /generateStaticParams/);
  assert.match(listApi, /getStorefrontProducts\(/);
  assert.doesNotMatch(listApi, /db\.product/);
  assert.match(detailApi, /getStorefrontProductBySlug\(/);
  assert.match(detailApi, /status:\s*404/);
});

test("in-stock product pages compose the single mobile sticky purchase control", () => {
  const productPage = source("src/app/products/[slug]/1688-product.tsx");
  const stickyControl = source("src/components/storefront/StickyAddToCart.tsx");

  assert.match(productPage, /StickyAddToCart/);
  assert.match(productPage, /primary-add-to-cart/);
  assert.match(productPage, /visible=\{p\.inStock !== false\}/);
  assert.match(stickyControl, /IntersectionObserver/);
  assert.match(stickyControl, /onClick=\{onAdd\}/);
  assert.doesNotMatch(stickyControl, /useCartStore|addItem\(/);
});
