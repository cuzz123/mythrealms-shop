import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import AboutPage, { metadata as aboutMetadata } from "../src/app/about/page";
import { STORY_CONTENT } from "../src/lib/editorial/story";
import { HOMEPAGE_MEDIA } from "../src/lib/homepage-editorial";
import { absoluteUrl } from "../src/lib/site";

test("Story states the approved point of view and avoids invented claims", () => {
  const content = JSON.stringify(STORY_CONTENT);
  const promise = STORY_CONTENT.sections.find(
    (section) => section.id === "what-we-promise",
  );

  assert.equal(STORY_CONTENT.hero.eyebrow, "Our Story");
  assert.equal(STORY_CONTENT.hero.title, "Pearls, edited for real life.");
  assert.match(content, /digitally created/i);
  assert.match(content, /source-supplied product photos/i);
  assert.ok(promise && promise.kind === "details" && promise.closing);
  assert.match(
    promise.closing,
    /does not add material, sourcing, or certification claims/i,
  );

  const contentWithoutApprovedBoundary = content.replace(promise.closing, "");
  assert.doesNotMatch(
    contentWithoutApprovedBoundary,
    /our founder|meet the founder|founded by|founder-led|our studio|studio-made|handmade|hand-crafted|crafted by hand|sustainably sourced|ethically sourced|ethical sourcing|responsibly sourced|traceable sourcing|our sourcing|materials? (?:are|is|include)|made (?:of|from|with)|solid gold|sterling silver|gold vermeil|gold-filled|hypoallergenic|nickel-free|certified|certification/i,
  );
  assert.doesNotThrow(() => structuredClone(STORY_CONTENT));
});

test("Story uses distinct truthful images for its hero, reference, and editorial context", () => {
  assert.deepEqual(STORY_CONTENT.hero.image, {
    src: HOMEPAGE_MEDIA.everyday.src,
    alt: "Model in pale linen wearing pearl jewelry outdoors",
    objectPosition: "center 38%",
  });

  const comparison = STORY_CONTENT.sections.find(
    (section) => section.id === "product-reference",
  );
  assert.ok(comparison && comparison.kind === "reference");
  assert.deepEqual(comparison.reference.image, {
    src: "/images/products/1688-shop/pearl-series/pearl-series-13-main.webp",
    alt: "Source-supplied product reference photo of pearl earrings",
  });
  assert.deepEqual(comparison.editorial.image, {
    src: HOMEPAGE_MEDIA.hero.src,
    alt: "Model wearing shell-and-pearl drop earrings in warm studio light",
    objectPosition: "center 38%",
  });
  assert.notEqual(comparison.editorial.image.src, comparison.reference.image.src);
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
  const canonical = absoluteUrl("/about");
  const socialImage = absoluteUrl(HOMEPAGE_MEDIA.everyday.src);
  const socialAlt = "Model in pale linen wearing pearl jewelry outdoors";
  const alternates = JSON.parse(JSON.stringify(aboutMetadata.alternates));
  const openGraph = JSON.parse(JSON.stringify(aboutMetadata.openGraph));
  const twitter = JSON.parse(JSON.stringify(aboutMetadata.twitter));

  assert.equal(alternates.canonical, canonical);
  assert.equal(openGraph.url, canonical);
  assert.deepEqual(openGraph.images, [{ url: socialImage, alt: socialAlt }]);
  assert.equal(twitter.card, "summary_large_image");
  assert.deepEqual(twitter.images, [{ url: socialImage, alt: socialAlt }]);
});

test("About renders the approved Story and page-specific structured data", () => {
  const html = renderToStaticMarkup(createElement(AboutPage));

  assert.match(html, /<h1[^>]*>Pearls, edited for real life\.<\/h1>/);
  assert.match(html, /Why should pearls wait for an occasion\?/);
  assert.match(html, /Product reference and editorial styling/);
  assert.match(html, /What we promise/);
  assert.equal((html.match(/<main/g) ?? []).length, 0);

  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(
    ([, json]) => JSON.parse(json),
  );
  const aboutSchema = schemas.find((schema) => schema["@type"] === "AboutPage");
  const breadcrumbSchema = schemas.find(
    (schema) => schema["@type"] === "BreadcrumbList",
  );

  assert.ok(aboutSchema);
  assert.equal(aboutSchema.name, "Our Story | MythRealms");
  assert.equal(aboutSchema.url, absoluteUrl("/about"));
  assert.ok(breadcrumbSchema);
  assert.deepEqual(breadcrumbSchema.itemListElement, [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: absoluteUrl("/"),
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Our Story",
      item: absoluteUrl("/about"),
    },
  ]);
});
