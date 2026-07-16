import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { metadata as blogMetadata } from "../src/app/blog/page";
import sitemap from "../src/app/sitemap";
import { siteUrl } from "../src/lib/site";
import { buildStorefrontFeedXml } from "../src/lib/storefront/feed";
import { getStorefrontProducts } from "../src/lib/storefront/catalog";

const retiredLanguage =
  /\bcrystals?\b|\bgemstones?\b|stones with intention|the serenity collection|balance\s*&\s*light|emotional balance/i;

test("the root layout does not force the homepage canonical onto every route", () => {
  const source = readFileSync(
    path.join(process.cwd(), "src/app/layout.tsx"),
    "utf8",
  );
  assert.doesNotMatch(source, /alternates:\s*\{\s*canonical:/);
  assert.doesNotMatch(source, /openGraph:\s*\{[\s\S]*?url:\s*siteUrl/);
});

test("the storefront catalog exposes all 45 approved Pearl Edit products", () => {
  const products = getStorefrontProducts();
  assert.equal(products.length, 45);
  for (const product of products) {
    assert.equal(product.categoryName, "The Pearl Edit");
    assert.doesNotMatch(product.description, retiredLanguage);
  }
});

test("the authoritative feed is pearl-only and contains every storefront SKU", () => {
  const products = getStorefrontProducts();
  const xml = buildStorefrontFeedXml("https://example.com");
  assert.doesNotMatch(xml, retiredLanguage);
  assert.equal((xml.match(/<item>/g) || []).length, 45);
  for (const product of products) {
    assert.match(xml, new RegExp(`/products/${product.slug}`));
  }
});

test("the static sitemap includes all approved products and excludes the blog archive", async () => {
  const entries = await sitemap();
  const urls = new Set(entries.map((entry) => entry.url));
  for (const product of getStorefrontProducts()) {
    assert.equal(urls.has(`${siteUrl}/products/${product.slug}`), true);
  }
  assert.equal([...urls].filter((url) => url.includes("/products/")).length, 45);
  assert.equal([...urls].some((url) => url.includes("/blog")), false);
});

test("the legacy blog is explicitly noindex", () => {
  const robots = blogMetadata.robots;
  assert.equal(
    robots && typeof robots === "object" && "index" in robots
      ? robots.index
      : undefined,
    false,
  );
});

test("GEO guidance points to the canonical feed and not retired feeds", () => {
  const llms = readFileSync(path.join(process.cwd(), "public/llms.txt"), "utf8");
  assert.match(llms, /\/api\/feed(?:\s|$)/m);
  assert.doesNotMatch(llms, /\/api\/feed\/(?:google|blog)/);
  assert.doesNotMatch(llms, retiredLanguage);
});

test("public SEO entry files contain no retired positioning", () => {
  const files = [
    "src/app/page.tsx",
    "src/app/opengraph-image.tsx",
    "src/app/api/feed/route.ts",
    "src/app/api/feed/google/route.ts",
    "src/app/faq/page.tsx",
    "src/app/guardian-quiz/page.tsx",
    "src/app/tiktok/page.tsx",
    "src/app/terms/page.tsx",
    "src/app/referral/page.tsx",
    "src/components/layout/Footer.tsx",
    "src/components/layout/SearchOverlay.tsx",
    "src/components/product/ProductCard.tsx",
    "src/app/products/[slug]/1688-product.tsx",
  ];
  const source = files
    .map((file) => readFileSync(path.join(process.cwd(), file), "utf8"))
    .join("\n");
  assert.doesNotMatch(source, retiredLanguage);
});

test("utility and campaign routes declare noindex metadata", () => {
  for (const route of [
    "search",
    "tiktok",
    "wishlist",
    "cart",
    "track-order",
    "returns",
    "referral",
  ]) {
    const layout = path.join(process.cwd(), `src/app/${route}/layout.tsx`);
    assert.equal(existsSync(layout), true, `${route} must define a metadata layout`);
    assert.match(readFileSync(layout, "utf8"), /index:\s*false/);
  }
});

test("robots allows only the exact canonical product feed under api", () => {
  const source = readFileSync(
    path.join(process.cwd(), "src/app/robots.ts"),
    "utf8",
  );
  assert.match(source, /\/api\/feed\$/);
});
