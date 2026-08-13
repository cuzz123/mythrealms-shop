import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { isPearlStoryPost } from "../src/lib/seo/blog";
import { buildItemListSchema } from "../src/lib/seo/schema";
import { buildSitemapEntries } from "../src/lib/seo/sitemap";
import { PEARL_EDITS, getPearlEditProducts } from "../src/lib/storefront/pearl-edits";
import { getStorefrontProducts } from "../src/lib/storefront/catalog";
import { FOOTER_GROUPS, HEADER_MENUS } from "../src/lib/storefront/navigation";
import { absoluteUrl, siteUrl } from "../src/lib/site";

function parseJsonLd(html: string): Array<Record<string, unknown>> {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
    ([, value]) => JSON.parse(value) as Record<string, unknown>,
  );
}

test("pearl edit ItemList schema keeps the visible product order and canonical URLs", () => {
  const edit = PEARL_EDITS[0];
  const products = getPearlEditProducts(edit, getStorefrontProducts());
  const schema = buildItemListSchema({
    name: edit.title,
    url: absoluteUrl(edit.route),
    products: products.map((product) => ({
      name: product.name,
      url: absoluteUrl(`/products/${product.slug}`),
    })),
  });

  assert.equal(schema["@type"], "ItemList");
  assert.equal(schema.name, edit.title);
  assert.equal(schema.url, absoluteUrl(edit.route));
  assert.deepEqual(
    schema.itemListElement.map(({ position, name, url }) => ({ position, name, url })),
    products.map((product, index) => ({
      position: index + 1,
      name: product.name,
      url: absoluteUrl(`/products/${product.slug}`),
    })),
  );
});

test("everyday light renders its registry title, product links, canonical metadata, and one ItemList", async () => {
  const route = await import("../src/app/edits/[slug]/page");
  const edit = PEARL_EDITS[0];
  const products = getPearlEditProducts(edit, getStorefrontProducts());
  const metadata = await route.generateMetadata({
    params: Promise.resolve({ slug: edit.slug }),
  });
  const page = await route.default({ params: Promise.resolve({ slug: edit.slug }) });
  const html = renderToStaticMarkup(createElement(() => page));
  const itemLists = parseJsonLd(html).filter((schema) => schema["@type"] === "ItemList");

  assert.equal(metadata.alternates?.canonical, absoluteUrl(edit.route));
  assert.equal(metadata.openGraph?.url, absoluteUrl(edit.route));
  assert.match(html, new RegExp(`<h1[^>]*>${edit.title}<\\/h1>`));
  assert.equal(itemLists.length, 1);
  for (const product of products) {
    assert.match(html, new RegExp(`href="/products/${product.slug}"`));
  }
});

test("pearl symbolism stays neutral about personal style and gifting", () => {
  const source = readFileSync(
    path.join(process.cwd(), "src/app/pearls/symbolism/page.tsx"),
    "utf8",
  );

  assert.match(source, /personal style/i);
  assert.match(source, /gift/i);
  assert.doesNotMatch(source, /\b(health|protection|luck|manifestation|healing)\b/i);
});

test("discovery navigation and the sitemap expose routes only after the routes exist", () => {
  const navigationHrefs = [
    ...HEADER_MENUS.flatMap((menu) => menu.links.map((link) => link.href)),
    ...FOOTER_GROUPS.flatMap((group) => group.links.map((link) => link.href)),
  ];
  const sitemapUrls = buildSitemapEntries(
    "https://example.com",
    getStorefrontProducts(),
    [],
    PEARL_EDITS.map((edit) => edit.route),
    ["/pearls/stories", "/pearls/symbolism"],
  ).map((entry) => entry.url);

  for (const href of ["/pearls/stories", "/pearls/symbolism"]) {
    assert.ok(navigationHrefs.includes(href), href);
  }
  for (const edit of PEARL_EDITS) {
    assert.ok(sitemapUrls.includes(`https://example.com${edit.route}`), edit.route);
  }
  for (const href of ["/pearls/stories", "/pearls/symbolism"]) {
    assert.ok(sitemapUrls.includes(`https://example.com${href}`), href);
  }
  assert.equal(new Set(sitemapUrls).size, sitemapUrls.length);
});

test("stories remain a focused view of current blog entries rather than a second archive", () => {
  const source = readFileSync(
    path.join(process.cwd(), "src/app/pearls/stories/page.tsx"),
    "utf8",
  );

  assert.match(source, /db\.blogPost\.findMany/);
  assert.match(source, /filter\(isPearlStoryPost\)/);
  assert.match(source, /slice\(0, 6\)/);
  assert.match(source, /href=\{`\/blog\/\$\{post\.slug\}`\}/);
});

test("story selection keeps pearl styling, care, gifting, and choosing topics out of the full archive", () => {
  const pearlStory = {
    slug: "how-to-wear-pearl-earrings",
    title: "How to Wear Pearl Earrings",
    excerpt: "A practical pearl styling guide.",
    content: "Choose a pearl earring shape that works with your usual neckline.",
    category: "Style Guide",
  };
  const pearlProfile = {
    ...pearlStory,
    slug: "pearl-maker-profile",
    title: "A Pearl Maker Profile",
    excerpt: "A conversation about studio practice.",
    content: "A portrait of a pearl maker and their workshop.",
    category: "Journal",
  };

  assert.equal(isPearlStoryPost(pearlStory), true);
  assert.equal(isPearlStoryPost(pearlProfile), false);
});

test("stories and symbolism metadata use local image-backed social cards", async () => {
  const stories = await import("../src/app/pearls/stories/page");
  const symbolism = await import("../src/app/pearls/symbolism/page");

  for (const metadata of [stories.metadata, symbolism.metadata]) {
    const images = metadata.openGraph?.images;
    assert.ok(Array.isArray(images));
    assert.match(JSON.stringify(images[0]), new RegExp(`${siteUrl}/images/`));
    assert.match(JSON.stringify(metadata.twitter?.images), new RegExp(`${siteUrl}/images/`));
  }
});

test("gifts does not promise a checkout gift note before the feature exists", () => {
  const source = readFileSync(path.join(process.cwd(), "src/app/gifts/page.tsx"), "utf8");

  assert.doesNotMatch(source, /add a personal gift note during checkout/i);
});
