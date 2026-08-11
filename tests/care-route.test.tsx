import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import PearlCarePage, { metadata } from "../src/app/pearls/care/page";
import { absoluteUrl } from "../src/lib/site";

const canonical = absoluteUrl("/pearls/care");
const title = "How to Care for Pearls | Pearl Care Guide";
const description =
  "Read general pearl care guidance on cleaning, heat, chemicals, and storage boundaries. Check the exact item record for item-specific instructions.";
const heading = "How to Care for Pearls";
const directAnswer =
  "General pearl-care guidance is to reduce contact with fragrance, cosmetics, heat, and harsh cleaners; wipe pearls with a very soft, clean cloth after wear; and avoid ultrasonic or steam cleaning. This is educational guidance for pearls, not a care instruction for any store item, setting, string, or finish.";
const faq = [
  {
    question: "Should I put pearl jewelry on before fragrance or cosmetics?",
    answer:
      "No. GIA’s general guidance is to put pearls on after fragrance and cosmetics. This does not confirm the composition or care requirements of a particular store item.",
  },
  {
    question: "Can I use an ultrasonic or steam cleaner on pearls?",
    answer:
      "No. GIA advises against ultrasonic and steam cleaning for pearls. For any specific item, use only care instructions that have been approved for that item.",
  },
  {
    question: "What should I do after wearing pearls?",
    answer:
      "GIA recommends wiping cultured pearls with a very soft, clean cloth after wear. Do not treat this general advice as a complete cleaning or storage instruction for every finished item.",
  },
  {
    question: "Does this guide tell me how to care for a product on this site?",
    answer:
      "No. It gives general pearl education. Check the exact item record or ask for verified item-specific information when a detail matters.",
  },
] as const;

function schemas(html: string): Array<Record<string, unknown>> {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
    ([, json]) => JSON.parse(json) as Record<string, unknown>,
  );
}

test("care route renders the approved rights-safe text and metadata", () => {
  const html = renderToStaticMarkup(createElement(PearlCarePage));

  assert.equal(metadata.title, title);
  assert.equal(metadata.description, description);
  assert.equal(metadata.alternates?.canonical, canonical);
  assert.equal(metadata.openGraph?.url, canonical);
  assert.equal("images" in (metadata.openGraph ?? {}), false);
  assert.equal("publishedTime" in (metadata.openGraph ?? {}), false);
  assert.equal("modifiedTime" in (metadata.openGraph ?? {}), false);
  assert.equal((metadata.twitter as { card?: string } | undefined)?.card, "summary");
  assert.equal("images" in (metadata.twitter ?? {}), false);
  assert.match(html, new RegExp(`<h1[^>]*>${heading}<\\/h1>`));
  assert.equal(directAnswer.split(/\s+/).length, 48);
  assert.match(html, new RegExp(directAnswer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(html, /<img|href="\/products\/|href="\/collections\//i);
});

test("care route keeps four visible FAQs in exact schema parity", () => {
  const html = renderToStaticMarkup(createElement(PearlCarePage));
  const parsed = schemas(html);
  const article = parsed.find((schema) => schema["@type"] === "Article");
  const faqPage = parsed.find((schema) => schema["@type"] === "FAQPage");
  const breadcrumb = parsed.find((schema) => schema["@type"] === "BreadcrumbList");

  assert.deepEqual(article, {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: heading,
    description: directAnswer,
    url: canonical,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
  });
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
    { "@type": "ListItem", position: 2, name: "Pearl Guide", item: absoluteUrl("/pearls") },
    { "@type": "ListItem", position: 3, name: heading, item: canonical },
  ]);
});

test("care route exposes only the approved ordinary internal and source links", () => {
  const html = renderToStaticMarkup(createElement(PearlCarePage));

  for (const href of [
    "/pearls",
    "/pearls/how-to-wear",
    "/pearls/freshwater-pearls",
    "/contact",
    "https://www.gia.edu/gia-news-research/pearl-care-cleaning",
    "https://www.gia.edu/pearl/buyers-guide",
  ]) {
    assert.match(html, new RegExp(`href="${href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`));
  }
  assert.equal((html.match(/href="https:\/\//g) ?? []).length, 2);
  assert.equal((html.match(/href="\/products\//g) ?? []).length, 0);
});
