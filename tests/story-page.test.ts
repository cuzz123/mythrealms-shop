import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import AboutPage, { metadata as aboutMetadata } from "../src/app/about/page";
import { STORY_CONTENT } from "../src/lib/editorial/story";
import { absoluteUrl } from "../src/lib/site";

const TITLE = "About Maverenne | Jewelry & Accessories";
const DESCRIPTION =
  "Thoughtful jewelry and accessories for everyday moments that feel like your own.";

test("About uses the approved Maverenne metadata without social images", () => {
  const canonical = absoluteUrl("/about");
  const alternates = JSON.parse(JSON.stringify(aboutMetadata.alternates));
  const openGraph = JSON.parse(JSON.stringify(aboutMetadata.openGraph));
  const twitter = JSON.parse(JSON.stringify(aboutMetadata.twitter));

  assert.equal(aboutMetadata.title, TITLE);
  assert.equal(aboutMetadata.description, DESCRIPTION);
  assert.equal(alternates.canonical, canonical);
  assert.deepEqual(openGraph, {
    title: TITLE,
    description: DESCRIPTION,
    url: canonical,
    type: "website",
    siteName: "Maverenne",
  });
  assert.deepEqual(twitter, {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
  });
});

test("About renders only the approved neutral introduction and matching JSON-LD", () => {
  const canonical = absoluteUrl("/about");
  const html = renderToStaticMarkup(createElement(AboutPage));
  const visibleHtml = html.replace(
    /<script type="application\/ld\+json">.*?<\/script>/g,
    "",
  );

  assert.match(html, /<h1[^>]*>About Maverenne<\/h1>/);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.equal((html.match(/<h2\b/g) ?? []).length, 0);
  assert.match(visibleHtml, new RegExp(DESCRIPTION));
  assert.equal(visibleHtml.split(DESCRIPTION).length - 1, 1);
  const internalLinks = [...visibleHtml.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g)].map(
    ([, href, label]) => ({ href, label }),
  );
  assert.deepEqual(internalLinks, [
    { href: "/collections/pearl-series", label: "Explore the Pearl Series" },
    { href: "/pearls", label: "Read the Pearl Guide" },
  ]);
  assert.doesNotMatch(
    visibleHtml,
    /<img\b|MythRealms|Mediterranean|Pearl Edit|Product Reference|Editorial Styling/i,
  );

  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(
    ([, json]) => JSON.parse(json),
  );
  assert.equal(schemas.some((schema) => schema["@type"] === "Article"), false);

  const aboutSchema = schemas.find((schema) => schema["@type"] === "AboutPage");
  const breadcrumbSchema = schemas.find(
    (schema) => schema["@type"] === "BreadcrumbList",
  );

  assert.deepEqual(aboutSchema, {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Maverenne",
    description: DESCRIPTION,
    url: canonical,
  });
  assert.deepEqual(breadcrumbSchema?.itemListElement, [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: absoluteUrl("/"),
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "About",
      item: canonical,
    },
  ]);
});

test("About content stays within the approved factual boundary", () => {
  const content = JSON.stringify(STORY_CONTENT);

  assert.equal(STORY_CONTENT.seo.title, TITLE);
  assert.equal(STORY_CONTENT.seo.description, DESCRIPTION);
  assert.equal(STORY_CONTENT.heading, "About Maverenne");
  assert.equal("sectionHeading" in STORY_CONTENT, false);
  assert.equal(STORY_CONTENT.statement, DESCRIPTION);
  assert.doesNotMatch(
    content,
    /MythRealms|Mediterranean|founder|history|location|date|material|source|catalog|price|stock|shipping|returns|support|legal/i,
  );
});
