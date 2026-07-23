import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import GiftsPage, { metadata as giftsMetadata } from "../src/app/gifts/page";
import { GiftProductSections } from "../src/components/editorial/GiftProductSections";
import NewArrivalsPage, {
  metadata as arrivalsMetadata,
} from "../src/app/collections/new-arrivals/page";
import {
  type GiftSection,
  getGiftSections,
  getNewArrivalProducts,
  getUniqueGiftProducts,
  selectNewArrivalProducts,
} from "../src/lib/editorial/gifts";
import { HOMEPAGE_MEDIA } from "../src/lib/homepage-editorial";
import { absoluteUrl } from "../src/lib/site";

test("gift and new-arrival routes declare unique social and canonical metadata", () => {
  assert.match(JSON.stringify(giftsMetadata.alternates), new RegExp(absoluteUrl("/gifts")));
  assert.match(
    JSON.stringify(arrivalsMetadata.alternates),
    new RegExp(absoluteUrl("/collections/new-arrivals")),
  );
  assert.ok(giftsMetadata.openGraph && giftsMetadata.twitter);
  assert.ok(arrivalsMetadata.openGraph && arrivalsMetadata.twitter);
  assert.equal(giftsMetadata.title, "Pearl Jewelry Gifts | MythRealms Gift Guide");
  assert.equal(arrivalsMetadata.title, "New Pearl Jewelry Arrivals | MythRealms");
  assert.match(JSON.stringify(giftsMetadata.twitter), /summary_large_image/);
  assert.match(JSON.stringify(arrivalsMetadata.twitter), /summary_large_image/);
});

test("gifts route renders the approved four edits and truthful support links", () => {
  const html = renderToStaticMarkup(createElement(GiftsPage));

  assert.match(html, /<h1[^>]*>Pearl gifts, chosen by how they will be worn\.<\/h1>/);
  for (const id of ["under-50", "under-70", "everyday", "statement"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /Under \$50/);
  assert.match(html, /Under \$70/);
  assert.match(html, /href="\/shipping"/);
  assert.match(html, /href="\/returns"/);
  assert.match(html, /href="\/pearls\/care"/);
  assert.match(html, /"@type":"CollectionPage"/);
  assert.match(html, /"@type":"ItemList"/);
  assert.doesNotMatch(html, /best seller|most loved|top rated/i);
  assert.doesNotMatch(html, /<main(?:\s|>)/);

  const productHeadingIds = ["under-50", "under-70", "everyday", "statement"].map(
    (id) => `${id}-products-title`,
  );
  for (const headingId of productHeadingIds) {
    assert.equal((html.match(new RegExp(`id="${headingId}"`, "g")) ?? []).length, 1);
    assert.match(html, new RegExp(`aria-labelledby="${headingId}"`));
  }
});

test("gift sections omit empty edits completely", () => {
  const sections: GiftSection[] = getGiftSections().map((section) =>
    section.id === "under-50" ? { ...section, products: [] } : section,
  );
  const html = renderToStaticMarkup(createElement(GiftProductSections, { sections }));

  for (const section of sections.filter((section) => section.products.length > 0)) {
    assert.match(html, new RegExp(`id="${section.id}"`));
    assert.match(html, new RegExp(`>${section.title.replace("$", "\\$")}<`));
  }
  assert.doesNotMatch(html, /id="under-50"/);
  assert.doesNotMatch(html, />Under \$50</);
  assert.doesNotMatch(html, /There are no pieces available in this edit right now\./);
});

test("gift schemas list each rendered product only once", () => {
  const renderedProducts = getUniqueGiftProducts(getGiftSections());
  const renderedSlugs = renderedProducts.map(({ slug }) => slug);

  assert.equal(new Set(renderedSlugs).size, renderedSlugs.length);
});

test("new-arrivals route describes the active catalog and renders its collection schema", () => {
  const html = renderToStaticMarkup(createElement(NewArrivalsPage));

  assert.match(html, /<h1[^>]*>New pearl arrivals\.<\/h1>/);
  assert.match(html, /recently added pieces in the active catalog/i);
  assert.match(html, /"@type":"CollectionPage"/);
  assert.match(html, /"@type":"ItemList"/);
  assert.doesNotMatch(html, /<main(?:\s|>)/);

  for (const product of getNewArrivalProducts()) {
    assert.match(html, new RegExp(`/products/${product.slug}`));
  }
});

test("new-arrivals social metadata and hero share the truthful Mediterranean image", () => {
  const html = renderToStaticMarkup(createElement(NewArrivalsPage));
  const image = HOMEPAGE_MEDIA.everyday;
  const imageUrl = absoluteUrl(image.src);
  const openGraph = JSON.stringify(arrivalsMetadata.openGraph);
  const twitter = JSON.stringify(arrivalsMetadata.twitter);

  assert.ok(openGraph.includes(imageUrl));
  assert.ok(openGraph.includes(image.alt));
  assert.ok(twitter.includes(imageUrl));
  assert.ok(twitter.includes(image.alt));
  assert.ok(html.includes(encodeURIComponent(image.src)));
  assert.match(html, new RegExp(`alt="${image.alt}"`));
});

test("new-arrival selection permits the route empty state", () => {
  assert.deepEqual(selectNewArrivalProducts([]), []);
});
