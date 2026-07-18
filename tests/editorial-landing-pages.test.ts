import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import GiftsPage, { metadata as giftsMetadata } from "../src/app/gifts/page";
import NewArrivalsPage, {
  metadata as arrivalsMetadata,
} from "../src/app/collections/new-arrivals/page";
import {
  getGiftSections,
  getNewArrivalProducts,
  getUniqueGiftProducts,
  selectNewArrivalProducts,
} from "../src/lib/editorial/gifts";
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

  for (const product of getNewArrivalProducts()) {
    assert.match(html, new RegExp(`/products/${product.slug}`));
  }
});

test("new-arrival selection permits the route empty state", () => {
  assert.deepEqual(selectNewArrivalProducts([]), []);
});
