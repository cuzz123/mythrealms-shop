import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { metadata as blogMetadata } from "../src/app/blog/page";
import { GET as getLlmsText } from "../src/app/llms.txt/route";
import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";
import { siteUrl } from "../src/lib/site";
import { buildStorefrontFeedXml } from "../src/lib/storefront/feed";
import { getStorefrontProducts } from "../src/lib/storefront/catalog";
import {
  FOOTER_GROUPS,
  HEADER_LINKS,
  HEADER_MENUS,
} from "../src/lib/storefront/navigation";

const retiredLanguage =
  /\bcrystals?\b|\bgemstones?\b|stones with intention|the serenity collection|balance\s*&\s*light|the intention stones|luxe collection|pearl\s*&\s*crystal|the archetypes|curated singles|emotional balance/i;

const canonicalContentPaths = [
  "/collections",
  "/collections/pearl-series",
  "/gifts",
  "/collections/new-arrivals",
  "/guardian-quiz",
  "/pearls",
  "/pearls/care",
  "/pearls/how-to-wear",
  "/pearls/freshwater-pearls",
  "/about",
  "/faq",
  "/contact",
  "/size-guide",
  "/shipping",
  "/refund",
  "/privacy",
  "/terms",
];

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
  const expectedUrls = new Set([
    siteUrl,
    ...canonicalContentPaths.map((contentPath) => `${siteUrl}${contentPath}`),
    ...getStorefrontProducts().map(
      (product) => `${siteUrl}/products/${product.slug}`,
    ),
  ]);
  for (const product of getStorefrontProducts()) {
    assert.equal(urls.has(`${siteUrl}/products/${product.slug}`), true);
  }
  for (const contentPath of canonicalContentPaths) {
    assert.equal(urls.has(`${siteUrl}${contentPath}`), true);
  }
  assert.equal([...urls].filter((url) => url.includes("/products/")).length, 45);
  assert.equal([...urls].some((url) => url.includes("/blog")), false);
  assert.equal([...urls].some((url) => url.includes("?")), false);
  assert.equal(entries.length, urls.size, "sitemap URLs must be unique");
  assert.deepEqual(urls, expectedUrls);
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

test("generated GEO guidance covers canonical sources and truth guardrails", async () => {
  const response = getLlmsText();
  const llms = await response.text();

  assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
  for (const resourcePath of [
    "/collections/pearl-series",
    "/collections/new-arrivals",
    "/gifts",
    "/about",
    "/pearls",
    "/pearls/care",
    "/pearls/how-to-wear",
    "/pearls/freshwater-pearls",
    "/shipping",
    "/refund",
    "/contact",
    "/sitemap.xml",
    "/robots.txt",
    "/api/feed",
  ]) {
    assert.match(llms, new RegExp(`${siteUrl}${resourcePath.replaceAll(".", "\\.")}`));
  }
  assert.match(llms, /The Pearl Edit/);
  assert.match(llms, /product (?:gallery|images)/i);
  assert.match(llms, /shape, luster, surface, tone, and size/i);
  assert.match(llms, /medical/i);
  assert.match(llms, /guaranteed emotional/i);
  assert.match(llms, /most specific product, guide, collection, or policy page/i);
  assert.doesNotMatch(llms, /\/api\/feed\/(?:google|blog)/);
  assert.doesNotMatch(llms, retiredLanguage);
  assert.equal(existsSync(path.join(process.cwd(), "public/llms.txt")), false);
});

test("navigation, sitemap, llms, and product feed reject retired positioning", async () => {
  const navigation = JSON.stringify({ HEADER_MENUS, HEADER_LINKS, FOOTER_GROUPS });
  const sitemapOutput = JSON.stringify(await sitemap());
  const llms = await getLlmsText().text();
  const feed = buildStorefrontFeedXml(siteUrl);

  for (const surface of [navigation, sitemapOutput, llms, feed]) {
    assert.doesNotMatch(surface, retiredLanguage);
  }
});

test("the pearl collection page uses the pure collection schema builder", () => {
  const source = readFileSync(
    path.join(process.cwd(), "src/app/collections/[slug]/page.tsx"),
    "utf8",
  );

  assert.match(source, /buildCollectionSchema\(/);
  assert.doesNotMatch(source, /data=\{\{\s*"@context"/);
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

  const rules = robots().rules;
  assert.equal(Array.isArray(rules), true);
  if (!Array.isArray(rules)) return;

  const aiRule = rules[0];
  const wildcardRule = rules[1];
  assert.equal(Array.isArray(aiRule.userAgent), true);
  assert.equal((aiRule.userAgent as string[]).includes("OAI-SearchBot"), true);
  assert.equal((aiRule.userAgent as string[]).includes("OAI-AdsBot"), true);
  assert.deepEqual(aiRule.allow, ["/", "/api/feed$"]);
  assert.deepEqual(wildcardRule.allow, ["/", "/api/feed$"]);
  assert.equal(wildcardRule.userAgent, "*");
  for (const privatePath of ["/api/", "/admin/", "/account/", "/auth/", "/checkout/", "/studio/"]) {
    assert.equal((aiRule.disallow as string[]).includes(privatePath), true);
    assert.equal((wildcardRule.disallow as string[]).includes(privatePath), true);
  }
});
