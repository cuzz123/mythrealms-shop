import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import PearlHubPage, { metadata as hubMetadata } from "../src/app/pearls/page";
import { PEARL_GUIDES, PEARL_HUB_FAQ } from "../src/lib/editorial/guides";
import { absoluteUrl } from "../src/lib/site";
import { getProductType } from "../src/lib/storefront/catalog";

function parseJsonLd(html: string): Array<Record<string, unknown>> {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
    ([, value]) => JSON.parse(value) as Record<string, unknown>,
  );
}

const EXPECTED_TITLES = {
  care: "How to Care for Pearl Jewelry | MythRealms",
  "how-to-wear": "How to Wear Pearl Jewelry | MythRealms",
  "freshwater-pearls": "What Are Freshwater Cultured Pearls? | MythRealms",
} as const;

for (const slug of Object.keys(PEARL_GUIDES) as Array<keyof typeof PEARL_GUIDES>) {
  test(`${slug} has exact canonical and social metadata`, async () => {
    const route = await import(`../src/app/pearls/${slug}/page`);
    const guide = PEARL_GUIDES[slug];
    const published = (guide as typeof guide & { published?: string }).published;
    const canonical = absoluteUrl(`/pearls/${slug}`);
    const image = absoluteUrl(guide.image.src);

    assert.equal(route.metadata.title, EXPECTED_TITLES[slug]);
    assert.equal(route.metadata.description, guide.description);
    assert.equal(route.metadata.alternates?.canonical, canonical);
    assert.equal(route.metadata.openGraph?.url, canonical);
    assert.equal(
      (route.metadata.openGraph as { publishedTime?: string } | undefined)?.publishedTime,
      published,
    );
    assert.match(JSON.stringify(route.metadata.openGraph?.images), new RegExp(image));
    assert.match(JSON.stringify(route.metadata.openGraph?.images), new RegExp(guide.image.alt));
    assert.equal((route.metadata.twitter as { card?: string } | undefined)?.card, "summary_large_image");
    assert.match(JSON.stringify(route.metadata.twitter?.images), new RegExp(image));
  });
}

test("hub metadata and visible content use the approved registries and truthful hero", () => {
  const title = "Pearl Jewelry Guide: Care, Styling & Freshwater Pearls | MythRealms";
  const heroSrc = "/images/brand/editorial/model-short-bob-blue-linen.png";
  const heroAlt = "Model in pale linen wearing pearl jewelry outdoors";
  const html = renderToStaticMarkup(createElement(PearlHubPage));

  assert.equal(hubMetadata.title, title);
  assert.equal(hubMetadata.alternates?.canonical, absoluteUrl("/pearls"));
  assert.equal(hubMetadata.openGraph?.url, absoluteUrl("/pearls"));
  assert.match(JSON.stringify(hubMetadata.openGraph?.images), new RegExp(heroSrc));
  assert.equal((hubMetadata.twitter as { card?: string } | undefined)?.card, "summary_large_image");
  assert.match(JSON.stringify(hubMetadata.twitter?.images), new RegExp(heroSrc));
  assert.match(html, /<h1[^>]*>Pearl knowledge for choosing, wearing, and caring\.<\/h1>/);
  assert.match(html, new RegExp(`alt="${heroAlt}"`));
  assert.equal((html.match(/<h1/g) ?? []).length, 1);
  assert.doesNotMatch(html, /<main/);

  for (const guide of Object.values(PEARL_GUIDES)) {
    assert.match(html, new RegExp(`href="/pearls/${guide.slug}"`));
    assert.match(html, new RegExp(guide.description.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(html, new RegExp(`alt="${guide.image.alt}"`));
  }
  for (const item of PEARL_HUB_FAQ) {
    assert.match(html, new RegExp(item.answer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(html, /href="\/faq"[^>]*>Read all customer FAQs[\s\S]*?<\/a>/);
  assert.match(html, /href="\/collections\/pearl-series"[^>]*>Shop The Pearl Edit/);
});

test("guide media roles describe what the approved images actually show", () => {
  assert.deepEqual(PEARL_GUIDES.care.image, {
    src: "/images/brand/hero/pearl-bracelet-editorial.png",
    alt: "Gold wire pearl bracelet displayed on dark fabric",
    objectPosition: "center",
  });
  assert.deepEqual(PEARL_GUIDES["freshwater-pearls"].image, {
    src: "/images/brand/hero/pearl-necklace-editorial.png",
    alt: "Pearl necklace displayed on a black jewelry stand",
    objectPosition: "center",
  });
});

test("each guide opens with a 40-70 word direct answer", () => {
  for (const guide of Object.values(PEARL_GUIDES)) {
    const wordCount = guide.directAnswer.trim().split(/\s+/).length;
    assert.ok(wordCount >= 40 && wordCount <= 70, `${guide.slug}: ${wordCount} words`);
  }
});

test("guide registry records truthful publication and update dates separately", () => {
  for (const guide of Object.values(PEARL_GUIDES)) {
    const published = (guide as typeof guide & { published?: string }).published;
    assert.equal(published, "2026-07-18", `${guide.slug}: published`);
    assert.equal(guide.updated, "2026-07-18", `${guide.slug}: updated`);
  }
});

test("every article section uses a clear user-question heading", () => {
  for (const guide of Object.values(PEARL_GUIDES)) {
    for (const section of guide.sections) {
      assert.match(
        section.heading,
        /^(Are|Can|Do|How|Is|Should|What|When|Where|Which|Why)\b.*\?$/,
        `${guide.slug}#${section.id}`,
      );
    }
  }
});

test("guide pillars explicitly cover the approved care, styling, and pearl-type questions", () => {
  const care = JSON.stringify(PEARL_GUIDES.care);
  assert.match(care, /shower/i);
  assert.match(care, /swim/i);

  const styling = JSON.stringify(PEARL_GUIDES["how-to-wear"]);
  assert.match(styling, /facial proportion/i);
  assert.match(styling, /formal occasion/i);

  const freshwater = JSON.stringify(PEARL_GUIDES["freshwater-pearls"]);
  for (const pearlType of ["Akoya", "South Sea", "Tahitian"]) {
    assert.match(freshwater, new RegExp(pearlType));
  }
  assert.match(freshwater, /https:\/\/www\.gia\.edu\/pearl-description/);
});

test("one selector returns 4-6 active in-stock products matching each guide", async () => {
  const guidesModule = await import("../src/lib/editorial/guides");
  const selector = (guidesModule as typeof guidesModule & {
    getRelatedGuideProducts: (guide: (typeof PEARL_GUIDES)[keyof typeof PEARL_GUIDES]) => ReturnType<typeof import("../src/lib/storefront/catalog").getStorefrontProducts>;
  }).getRelatedGuideProducts;

  assert.equal(typeof selector, "function");
  for (const guide of Object.values(PEARL_GUIDES)) {
    const products = selector(guide);
    assert.ok(products.length >= 4 && products.length <= 6);
    assert.ok(products.every((product) => product.isActive && product.inStock));
    assert.ok(products.every((product) => guide.relatedTypes.some((type) => type === getProductType(product))));
  }
});

for (const slug of Object.keys(PEARL_GUIDES) as Array<keyof typeof PEARL_GUIDES>) {
  test(`${slug} server-renders the guide contract without a nested main`, async () => {
    const route = await import(`../src/app/pearls/${slug}/page`);
    const html = renderToStaticMarkup(createElement(route.default));
    const guide = PEARL_GUIDES[slug];
    const published = (guide as typeof guide & { published?: string }).published;
    const schemas = parseJsonLd(html);
    const article = schemas.find((schema) => schema["@type"] === "Article");
    const faq = schemas.find((schema) => schema["@type"] === "FAQPage");

    assert.equal((html.match(/<h1/g) ?? []).length, 1);
    assert.doesNotMatch(html, /<main/);
    assert.match(html, /Table of contents/);
    assert.match(html, /Frequently asked questions/);
    assert.match(html, /MythRealms Editorial/);
    assert.match(html, /Published July 18, 2026/);
    assert.match(html, /Updated July 18, 2026/);
    assert.match(html, /rel="noopener noreferrer"/);
    assert.match(html, /Related guides/);
    assert.match(html, /Related products/);
    assert.match(html, /"@type":"Article"/);
    assert.match(html, /"@type":"BreadcrumbList"/);
    assert.match(html, /"@type":"FAQPage"/);
    assert.ok(article);
    assert.equal(article.headline, guide.title);
    assert.equal(article.description, guide.directAnswer);
    assert.equal(article.datePublished, published);
    assert.equal(article.dateModified, guide.updated);
    assert.ok(faq);
    assert.deepEqual(
      (faq.mainEntity as Array<{ name: string; acceptedAnswer: { text: string } }>).map(
        ({ name, acceptedAnswer }) => ({ question: name, answer: acceptedAnswer.text }),
      ),
      guide.faq,
    );
    for (const item of guide.faq) assert.match(html, new RegExp(item.answer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
}
