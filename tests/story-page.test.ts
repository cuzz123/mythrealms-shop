import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import AboutPage, { metadata as aboutMetadata } from "../src/app/about/page";
import { STORY_CONTENT } from "../src/lib/editorial/story";

test("Story states the approved point of view and avoids invented claims", () => {
  const content = JSON.stringify(STORY_CONTENT);

  assert.equal(STORY_CONTENT.hero.eyebrow, "Our Story");
  assert.equal(STORY_CONTENT.hero.title, "Pearls, edited for real life.");
  assert.match(content, /digitally created/i);
  assert.match(content, /source-supplied product photos/i);
  assert.doesNotMatch(
    content,
    /our founder|our studio|handmade by us|sustainably sourced|ethical sourcing/i,
  );
  assert.doesNotThrow(() => structuredClone(STORY_CONTENT));
});

test("Story keeps the approved narrative order and storefront destinations", () => {
  assert.deepEqual(
    STORY_CONTENT.sections.map((section) => section.id),
    ["why-pearls", "how-the-edit-is-built", "product-reference", "what-we-promise"],
  );
  assert.deepEqual(
    STORY_CONTENT.actions.map(({ label, href }) => ({ label, href })),
    [
      { label: "Shop the Pearl Edit", href: "/collections/pearl-series" },
      { label: "Read the Pearl Guide", href: "/pearls" },
      { label: "Explore Gifts", href: "/gifts" },
    ],
  );
  assert.equal(STORY_CONTENT.editorialImages.length, 3);
});

test("About owns unique canonical and social metadata", () => {
  assert.match(JSON.stringify(aboutMetadata.alternates), /\/about/);
  assert.match(JSON.stringify(aboutMetadata.openGraph), /\/about/);
  assert.match(JSON.stringify(aboutMetadata.openGraph), /Mediterranean/i);
  assert.match(JSON.stringify(aboutMetadata.twitter), /summary_large_image/);
  assert.match(JSON.stringify(aboutMetadata.twitter), /Mediterranean/i);
});

test("About renders the approved Story and page-specific structured data", () => {
  const html = renderToStaticMarkup(createElement(AboutPage));

  assert.match(html, /<h1[^>]*>Pearls, edited for real life\.<\/h1>/);
  assert.match(html, /Why should pearls wait for an occasion\?/);
  assert.match(html, /Product reference and editorial styling/);
  assert.match(html, /What we promise/);
  assert.match(html, /"@type":"AboutPage"/);
  assert.match(html, /"@type":"BreadcrumbList"/);
  assert.equal((html.match(/<main/g) ?? []).length, 0);
});
