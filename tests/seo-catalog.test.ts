import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { metadata as blogMetadata } from "../src/app/blog/page";
import { GET as getLlmsText } from "../src/app/llms.txt/route";
import robots from "../src/app/robots";
import { buildBlogPostingData } from "../src/components/ui/JsonLd";
import {
  buildBlogMetadata,
  isPearlEditorialPost,
} from "../src/lib/seo/blog";
import { buildSitemapEntries } from "../src/lib/seo/sitemap";
import { siteUrl } from "../src/lib/site";
import { PEARL_EDITS } from "../src/lib/storefront/pearl-edits";
import { getStorefrontProducts } from "../src/lib/storefront/catalog";
import { buildStorefrontFeedXml } from "../src/lib/storefront/feed";
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
  "/collections/new-arrivals",
  "/gifts",
  "/guardian-quiz",
  "/pearls",
  "/pearls/care",
  "/pearls/how-to-wear",
  "/pearls/freshwater-pearls",
  "/blog",
  "/about",
  "/faq",
  "/contact",
  "/size-guide",
  "/shipping",
  "/refund",
  "/privacy",
  "/terms",
];

const posts = [
  {
    slug: "pearl-earrings-under-50",
    updatedAt: new Date("2026-07-18T00:00:00Z"),
  },
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

test("the sitemap contains canonical content, products, and journal articles once", () => {
  const products = getStorefrontProducts();
  const entries = buildSitemapEntries(siteUrl, products, posts);
  const urls = new Set(entries.map((entry) => entry.url));
  const expectedUrls = new Set([
    siteUrl,
    ...canonicalContentPaths.map((contentPath) => `${siteUrl}${contentPath}`),
    ...products.map((product) => `${siteUrl}/products/${product.slug}`),
    ...posts.map((entry) => `${siteUrl}/blog/${entry.slug}`),
  ]);

  for (const expectedUrl of expectedUrls) {
    assert.equal(urls.has(expectedUrl), true, `missing ${expectedUrl}`);
  }
  assert.equal([...urls].filter((url) => url.includes("/products/")).length, 45);
  assert.equal([...urls].some((url) => url.includes("/edits/")), false);
  assert.equal([...urls].some((url) => url.includes("?")), false);
  assert.equal(entries.length, urls.size, "sitemap URLs must be unique");
  assert.deepEqual(urls, expectedUrls);
});

test("navigation and sitemap expose only implemented pearl discovery routes", () => {
  const discoveryPaths = ["/pearls/stories", "/pearls/symbolism"];
  const entries = buildSitemapEntries(
    siteUrl,
    getStorefrontProducts(),
    posts,
    PEARL_EDITS.map((edit) => edit.route),
    discoveryPaths,
  );
  const urls = entries.map((entry) => entry.url);
  const navigation = JSON.stringify({ HEADER_MENUS, FOOTER_GROUPS });

  for (const path of [...discoveryPaths, ...PEARL_EDITS.map((edit) => edit.route)]) {
    assert.ok(urls.includes(`${siteUrl}${path}`), `${path} is sitemap-discoverable`);
  }
  assert.match(navigation, /\/pearls\/stories/);
  assert.match(navigation, /\/pearls\/symbolism/);
});

test("the database-backed sitemap revalidates without a redeploy", () => {
  const sitemapSource = readFileSync(
    path.join(process.cwd(), "src/app/sitemap.ts"),
    "utf8",
  );

  assert.match(sitemapSource, /export const revalidate = 3600;/);
  assert.match(sitemapSource, /db\.blogPost\.findMany/);
  assert.match(sitemapSource, /buildSitemapEntries/);
});

test("the root layout does not duplicate homepage content in noscript", () => {
  const source = readFileSync(
    path.join(process.cwd(), "src/app/layout.tsx"),
    "utf8",
  );
  assert.doesNotMatch(source, /<noscript>/);
  assert.doesNotMatch(source, /noscript-shop-by-style-title/);
});

test("the database-backed journal archive is rendered dynamically", () => {
  const blogSource = readFileSync(
    path.join(process.cwd(), "src/app/blog/page.tsx"),
    "utf8",
  );

  assert.match(blogSource, /export const dynamic = "force-dynamic";/);
});

test("the database-backed journal archive is rendered dynamically", () => {
  const blogSource = readFileSync(
    path.join(process.cwd(), "src/app/blog/page.tsx"),
    "utf8",
  );

  assert.match(blogSource, /export const dynamic = "force-dynamic";/);
});

test("the journal archive is indexable", () => {
  const metadataRobots = blogMetadata.robots;
  assert.notEqual(
    metadataRobots &&
      typeof metadataRobots === "object" &&
      "index" in metadataRobots
      ? metadataRobots.index
      : undefined,
    false,
  );
});

test("blog metadata uses the canonical article URL and article Open Graph data", () => {
  const metadata = buildBlogMetadata(post);
  const canonical = metadata.alternates?.canonical;
  const openGraph = metadata.openGraph;

  assert.equal(canonical, `${siteUrl}/blog/${post.slug}`);
  assert.equal(openGraph && "type" in openGraph ? openGraph.type : undefined, "article");
  assert.equal(
    openGraph && "url" in openGraph ? openGraph.url : undefined,
    `${siteUrl}/blog/${post.slug}`,
  );
  assert.equal(
    metadata.robots &&
      typeof metadata.robots === "object" &&
      "index" in metadata.robots
      ? metadata.robots.index
      : undefined,
    undefined,
  );
});

test("the journal publication gate accepts pearl guidance and rejects retired content", () => {
  assert.equal(
    isPearlEditorialPost({
      slug: "how-to-clean-pearl-earrings",
      title: "How to Clean Pearl Earrings",
      excerpt: "A practical freshwater pearl care guide.",
      content: "Use a soft damp cloth and let pearl jewelry air dry.",
      category: "Pearl Care",
    }),
    true,
  );
  assert.equal(
    isPearlEditorialPost({
      slug: "crystal-intentions-101",
      title: "Crystal Intentions 101",
      excerpt: "Choose an energy stone.",
      content: "Pearls and rose quartz for emotional balance.",
      category: "Crystal Wellness",
    }),
    false,
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
  assert.deepEqual(data.publisher, {
    "@type": "Organization",
    name: "MythRealms",
  });
  assert.equal(data.datePublished, datePublished.toISOString());
  assert.equal(data.dateModified, dateModified.toISOString());
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
    "/blog",
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
    assert.match(
      llms,
      new RegExp(`${siteUrl}${resourcePath.replaceAll(".", "\\.")}`),
    );
  }
  assert.match(llms, /The Pearl Edit/);
  assert.match(llms, /product (?:gallery|images)/i);
  assert.match(llms, /shape, luster, surface, tone, and size/i);
  assert.match(llms, /medical/i);
  assert.match(llms, /guaranteed emotional/i);
  assert.match(
    llms,
    /most specific product, guide, collection, or policy page/i,
  );
  assert.doesNotMatch(llms, /\/api\/feed\/(?:google|blog)/);
  assert.doesNotMatch(llms, retiredLanguage);
  assert.equal(existsSync(path.join(process.cwd(), "public/llms.txt")), false);
});

test("the llms route explicitly opts into static generation", () => {
  const source = readFileSync(
    path.join(process.cwd(), "src/app/llms.txt/route.ts"),
    "utf8",
  );
  assert.match(source, /export const dynamic = ["']force-static["'];/);
});

test("navigation, sitemap, llms, and product feed reject retired positioning", async () => {
  const navigation = JSON.stringify({ HEADER_MENUS, HEADER_LINKS, FOOTER_GROUPS });
  const sitemapOutput = JSON.stringify(
    buildSitemapEntries(siteUrl, getStorefrontProducts(), posts),
  );
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
  for (const privatePath of [
    "/api/",
    "/admin/",
    "/account/",
    "/auth/",
    "/checkout/",
    "/studio/",
  ]) {
    assert.equal((aiRule.disallow as string[]).includes(privatePath), true);
    assert.equal((wildcardRule.disallow as string[]).includes(privatePath), true);
  }
});
