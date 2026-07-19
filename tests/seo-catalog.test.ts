import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { metadata as blogMetadata } from "../src/app/blog/page";
import { buildBlogPostingData } from "../src/components/ui/JsonLd";
import { buildBlogMetadata } from "../src/lib/seo/blog";
import { buildSitemapEntries } from "../src/lib/seo/sitemap";
import { siteUrl } from "../src/lib/site";
import { buildStorefrontFeedXml } from "../src/lib/storefront/feed";
import { getStorefrontProducts } from "../src/lib/storefront/catalog";

const retiredLanguage =
  /\bcrystals?\b|\bgemstones?\b|stones with intention|the serenity collection|balance\s*&\s*light|emotional balance/i;

const posts = [
  { slug: "pearl-earrings-under-50", updatedAt: new Date("2026-07-18T00:00:00Z") },
];

const post = {
  slug: "pearl-earrings-under-50",
  title: "Pearl Earrings Under $50",
  excerpt: "A practical guide to affordable pearl earrings.",
  image: "/images/blog/pearl-earrings-under-50.jpg",
};

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

test("the sitemap includes the journal and published article URLs", () => {
  const entries = buildSitemapEntries(siteUrl, getStorefrontProducts(), posts);
  const urls = new Set(entries.map((entry) => entry.url));

  assert.equal(urls.has(`${siteUrl}/blog`), true);
  assert.equal(urls.has(`${siteUrl}/blog/pearl-earrings-under-50`), true);

  for (const product of getStorefrontProducts()) {
    assert.equal(urls.has(`${siteUrl}/products/${product.slug}`), true);
  }
  assert.equal([...urls].filter((url) => url.includes("/products/")).length, 45);
});

test("the database-backed sitemap revalidates without a redeploy", () => {
  const sitemapSource = readFileSync(
    path.join(process.cwd(), "src/app/sitemap.ts"),
    "utf8",
  );

  assert.match(sitemapSource, /export const revalidate = 3600;/);
});

test("the journal archive is indexable", () => {
  const robots = blogMetadata.robots;
  assert.notEqual(
    robots && typeof robots === "object" && "index" in robots
      ? robots.index
      : undefined,
    false,
  );
});

test("blog metadata uses the canonical article URL and article Open Graph data", () => {
  const metadata = buildBlogMetadata(post);
  const canonical = metadata.alternates?.canonical;
  const openGraph = metadata.openGraph;

  assert.equal(canonical, `${siteUrl}/blog/${post.slug}`);
  assert.equal(openGraph?.type, "article");
  assert.equal(
    openGraph && "url" in openGraph ? openGraph.url : undefined,
    `${siteUrl}/blog/${post.slug}`,
  );
  assert.equal(
    metadata.robots && typeof metadata.robots === "object" && "index" in metadata.robots
      ? metadata.robots.index
      : undefined,
    undefined,
  );
});

test("BlogPosting JSON-LD includes canonical publisher and ISO dates", () => {
  const datePublished = new Date("2026-07-01T12:00:00Z");
  const dateModified = new Date("2026-07-18T00:00:00Z");
  const url = `${siteUrl}/blog/${post.slug}`;
  const data = buildBlogPostingData({
    headline: post.title,
    description: post.excerpt,
    url,
    image: `${siteUrl}${post.image}`,
    datePublished,
    dateModified,
    authorName: "MythRealms Editorial",
  });

  assert.equal(data["@type"], "BlogPosting");
  assert.deepEqual(data.mainEntityOfPage, { "@type": "WebPage", "@id": url });
  assert.deepEqual(data.publisher, { "@type": "Organization", name: "MythRealms" });
  assert.equal(data.datePublished, datePublished.toISOString());
  assert.equal(data.dateModified, dateModified.toISOString());
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
