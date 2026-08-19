import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import PearlHubPage from "../src/app/pearls/page";
import { buildSitemapEntries } from "../src/lib/seo/sitemap";

const activeSlugs = [
  "how-to-choose-pearl-earrings",
  "pearl-necklace-length-guide",
  "bracelet-size-and-fit-guide",
] as const;
const heldSlugs = [
  "how-to-wear-pearl-hair-accessories",
  "how-to-choose-a-glasses-chain",
  "pearl-jewelry-buying-checklist",
] as const;

test("Pearl Guide hub exposes only founder-approved purchase guides", () => {
  const html = renderToStaticMarkup(createElement(PearlHubPage));

  for (const slug of activeSlugs) {
    assert.match(html, new RegExp(`href="/pearls/${slug}"`));
  }
  for (const slug of heldSlugs) {
    assert.doesNotMatch(html, new RegExp(`href="/pearls/${slug}"`));
  }
});

test("sitemap exposes only founder-approved purchase guides", () => {
  const entries = buildSitemapEntries("https://www.maverenne.com", [], []);
  const urls = new Set(entries.map(({ url }) => url));

  for (const slug of activeSlugs) {
    assert.ok(urls.has(`https://www.maverenne.com/pearls/${slug}`));
  }
  for (const slug of heldSlugs) {
    assert.ok(!urls.has(`https://www.maverenne.com/pearls/${slug}`));
  }
});
