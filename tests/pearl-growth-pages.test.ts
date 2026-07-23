import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { buildItemListSchema } from "../src/lib/seo/schema";
import { buildSitemapEntries } from "../src/lib/seo/sitemap";
import { PEARL_EDITS, getPearlEditProducts } from "../src/lib/storefront/pearl-edits";
import { getStorefrontProducts } from "../src/lib/storefront/catalog";
import { FOOTER_GROUPS, HEADER_MENUS } from "../src/lib/storefront/navigation";
import { absoluteUrl } from "../src/lib/site";

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
  ).map((entry) => entry.url);

  for (const href of ["/pearls/stories", "/pearls/symbolism"]) {
    assert.ok(navigationHrefs.includes(href), href);
  }
  for (const edit of PEARL_EDITS) {
    assert.ok(sitemapUrls.includes(`https://example.com${edit.route}`), edit.route);
  }
  assert.equal(new Set(sitemapUrls).size, sitemapUrls.length);
});

test("stories remain a focused view of current blog entries rather than a second archive", () => {
  const source = readFileSync(
    path.join(process.cwd(), "src/app/pearls/stories/page.tsx"),
    "utf8",
  );

  assert.match(source, /db\.blogPost\.findMany/);
  assert.match(source, /filter\(isPearlEditorialPost\)/);
  assert.match(source, /href=\{`\/blog\/\$\{post\.slug\}`\}/);
});
