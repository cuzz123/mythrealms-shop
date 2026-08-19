import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ACTIVE_PURCHASE_GUIDE_SLUGS,
  isVisiblePurchaseGuideRelatedHref,
  PURCHASE_GUIDES,
} from "../src/lib/editorial/purchase-guides";
import {
  PurchaseGuidePage,
  buildPurchaseGuideMetadata,
  buildPurchaseGuideSchemas,
} from "../src/lib/editorial/purchase-guide-page";
import { absoluteUrl } from "../src/lib/site";

test("purchase guide metadata and schemas share the canonical route", () => {
  const guide = PURCHASE_GUIDES["how-to-choose-pearl-earrings"];
  const canonical = absoluteUrl(`/pearls/${guide.slug}`);
  const metadata = buildPurchaseGuideMetadata(guide);
  const schemas = buildPurchaseGuideSchemas(guide);
  assert.equal(metadata.alternates?.canonical, canonical);
  assert.equal(metadata.openGraph?.url, canonical);
  assert.ok(schemas.some((schema) => schema["@type"] === "Article"));
  assert.ok(schemas.some((schema) => schema["@type"] === "FAQPage"));
  assert.ok(schemas.some((schema) => schema["@type"] === "BreadcrumbList"));
  const article = schemas.find((schema) => schema["@type"] === "Article");
  assert.ok(article);
  assert.equal(article.description, guide.directAnswer);
  assert.ok(!("author" in article));
  assert.ok(!("publisher" in article));
  assert.ok(!("datePublished" in article));
  assert.ok(!("dateModified" in article));
  assert.ok(!("image" in article));
  assert.doesNotMatch(
    JSON.stringify(schemas),
    /Product|Offer|Review|AggregateRating|HowTo|LocalBusiness|Person/,
  );
});

test("held purchase guides fail closed before rendering", () => {
  assert.throws(
    () => PurchaseGuidePage({ slug: "how-to-wear-pearl-hair-accessories" }),
    (error: unknown) =>
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      error.digest === "NEXT_HTTP_ERROR_FALLBACK;404",
  );
});

test("active purchase guides do not render links to held purchase guides", () => {
  const heldPaths = [
    "/pearls/how-to-wear-pearl-hair-accessories",
    "/pearls/how-to-choose-a-glasses-chain",
    "/pearls/pearl-jewelry-buying-checklist",
  ] as const;

  for (const slug of ACTIVE_PURCHASE_GUIDE_SLUGS) {
    const html = renderToStaticMarkup(
      createElement(PurchaseGuidePage, { slug }),
    );
    for (const path of heldPaths) {
      assert.doesNotMatch(html, new RegExp(`href="${path}"`), slug);
    }
  }
});

test("visible FAQs and source links render from the same record", () => {
  const guide = PURCHASE_GUIDES["how-to-choose-pearl-earrings"];
  const html = renderToStaticMarkup(
    createElement(PurchaseGuidePage, { slug: guide.slug }),
  );
  for (const item of guide.faq) {
    assert.match(
      html,
      new RegExp(item.question.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
    assert.match(
      html,
      new RegExp(item.answer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    );
  }
  for (const source of guide.sources) {
    assert.match(html, new RegExp(source.href));
  }
  assert.match(html, /Before you choose/);
  assert.match(
    html,
    /<nav aria-label="Related reading">\s*<ul[^>]*class="[^"]*space-y-[^"]*"[^>]*>\s*<li[^>]*>/,
  );
  const relatedReading = html.match(
    /<nav aria-label="Related reading">([\s\S]*?)<\/nav>/,
  );
  assert.ok(relatedReading);
  const visibleRelatedLinks = guide.relatedLinks.filter((link) =>
    isVisiblePurchaseGuideRelatedHref(link.href),
  );
  assert.equal(
    (relatedReading[1].match(/<li\b/g) || []).length,
    visibleRelatedLinks.length,
  );
  for (const link of visibleRelatedLinks) {
    assert.match(html, new RegExp(`<li[^>]*>\\s*<a href="${link.href}"`));
  }
  assert.doesNotMatch(html, /<img\b|next\/image/);
});
