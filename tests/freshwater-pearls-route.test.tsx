import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import FreshwaterPearlsPage, {
  metadata,
} from "../src/app/pearls/freshwater-pearls/page";
import { absoluteUrl, SITE_NAME } from "../src/lib/site";

const canonical = absoluteUrl("/pearls/freshwater-pearls");
const heading = "Freshwater Cultured Pearl Basics";
const title = `${heading} | ${SITE_NAME}`;
const description =
  "Learn what “freshwater cultured pearls” means in general education, which details to compare, and why a category term cannot verify a specific jewelry item.";
const directAnswer =
  "Freshwater cultured pearls are a general pearl category usually cultivated in freshwater lakes and ponds. They can occur in varied sizes, shapes, and colors. This guide explains the terminology and the questions to ask; it does not identify, classify, or describe the materials, origin, treatment, or quality of any specific jewelry item.";

const faq = [
  {
    question: "What does “freshwater cultured pearl” mean?",
    answer:
      "In general education, it describes a cultured-pearl category usually cultivated in freshwater lakes and ponds. It does not identify the material, origin, treatment, or quality of a specific jewelry item.",
  },
  {
    question: "Does “freshwater” tell me what a specific item contains?",
    answer:
      "No. A category term or photograph cannot establish whether a specific item is freshwater, cultured, natural, imitation, treated, or of a particular quality. Use only the exact item’s verified information for those facts.",
  },
  {
    question: "What details are useful to compare when they are disclosed?",
    answer:
      "GIA’s general vocabulary includes size, shape, color, luster, surface, nacre, and matching. These are comparison questions, not a grade assigned by this guide or evidence about an item without a verified description.",
  },
  {
    question: "Why does precise pearl terminology matter?",
    answer:
      "The FTC distinguishes natural, cultured, and imitation pearls and advises clear identification in advertising. This guide therefore uses category terms only for general education; it does not make a compliance conclusion about any seller or listing.",
  },
] as const;

function schemas(html: string): Array<Record<string, unknown>> {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
    ([, json]) => JSON.parse(json) as Record<string, unknown>,
  );
}

test("freshwater route renders the approved text-only metadata and answer", () => {
  const html = renderToStaticMarkup(createElement(FreshwaterPearlsPage));

  assert.equal(metadata.title, title);
  assert.equal(metadata.description, description);
  assert.equal(metadata.alternates?.canonical, canonical);
  assert.equal(metadata.openGraph?.url, canonical);
  assert.equal((metadata.openGraph as { type?: string } | undefined)?.type, "article");
  assert.equal("images" in (metadata.openGraph ?? {}), false);
  assert.equal("publishedTime" in (metadata.openGraph ?? {}), false);
  assert.equal("modifiedTime" in (metadata.openGraph ?? {}), false);
  assert.equal((metadata.twitter as { card?: string } | undefined)?.card, "summary");
  assert.equal("images" in (metadata.twitter ?? {}), false);

  assert.match(html, new RegExp(`<h1[^>]*>${heading}<\\/h1>`));
  assert.equal(directAnswer.split(/\s+/).length, 52);
  assert.match(html, new RegExp(directAnswer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(
    html,
    /<img|Published|Maverenne Editorial|Related products|href="\/products\//i,
  );
});

test("freshwater route keeps visible FAQ text and structured data in exact parity", () => {
  const html = renderToStaticMarkup(createElement(FreshwaterPearlsPage));
  const parsed = schemas(html);
  const breadcrumb = parsed.find((schema) => schema["@type"] === "BreadcrumbList");
  const article = parsed.find((schema) => schema["@type"] === "Article");
  const faqPage = parsed.find((schema) => schema["@type"] === "FAQPage");

  assert.equal(article?.headline, heading);
  assert.equal(article?.description, description);
  assert.equal(article?.url, canonical);
  assert.deepEqual(article?.mainEntityOfPage, { "@type": "WebPage", "@id": canonical });
  for (const field of [
    "author",
    "publisher",
    "datePublished",
    "dateModified",
    "image",
    "thumbnailUrl",
    "sameAs",
  ]) {
    assert.equal(field in (article ?? {}), false, field);
  }

  assert.deepEqual(
    (faqPage?.mainEntity as Array<Record<string, unknown>>).map(({ name, acceptedAnswer }) => ({
      question: name,
      answer: (acceptedAnswer as Record<string, unknown>).text,
    })),
    faq,
  );
  for (const item of faq) {
    assert.match(html, new RegExp(item.question.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(html, new RegExp(item.answer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.deepEqual(breadcrumb?.itemListElement, [
    { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
    { "@type": "ListItem", position: 2, name: "Pearl Knowledge", item: absoluteUrl("/pearls") },
    { "@type": "ListItem", position: 3, name: heading, item: canonical },
  ]);
});

test("freshwater route keeps four sources and two related-reading links ahead of FAQ", () => {
  const html = renderToStaticMarkup(createElement(FreshwaterPearlsPage));
  const sourcesIndex = html.indexOf(">Sources<");
  const relatedReadingIndex = html.indexOf('aria-label="Related reading"');
  const faqIndex = html.indexOf(">Frequently asked questions<");

  assert.ok(sourcesIndex >= 0);
  assert.ok(sourcesIndex < relatedReadingIndex);
  assert.ok(relatedReadingIndex < faqIndex);

  for (const [href, label] of [
    ["https://www.gia.edu/pearl-description", "GIA: Different Pearl Types & Colors"],
    ["https://www.gia.edu/pearl/buyers-guide", "GIA: Pearl Buyer’s Guide"],
    [
      "https://consumer.ftc.gov/articles/buying-gemstones-diamonds-and-pearls",
      "FTC: Buying Gemstones, Diamonds, and Pearls",
    ],
    [
      "https://www.ftc.gov/business-guidance/resources/loupe-advertising-diamond-gemstones-pearls",
      "FTC: In the Loupe: Advertising Diamonds, Gemstones and Pearls",
    ],
    ["/pearls/care", "Read the general pearl care guide"],
    ["/pearls/how-to-wear", "Read everyday styling ideas"],
  ]) {
    assert.match(html, new RegExp(`href="${href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
    assert.match(html, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/&/g, "&amp;")));
  }
});
