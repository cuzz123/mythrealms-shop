import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import GiftsPage, { metadata as giftsMetadata } from "../src/app/gifts/page";
import HowToWearPearlsPage, {
  metadata as howToWearMetadata,
} from "../src/app/pearls/how-to-wear/page";
import PearlCarePage, {
  metadata as careMetadata,
} from "../src/app/pearls/care/page";
import { PEARL_GUIDES } from "../src/lib/editorial/guides";

test("high-intent pages separate general guidance from unverified item and policy facts", () => {
  const howToWearHtml = renderToStaticMarkup(createElement(HowToWearPearlsPage));
  const careHtml = renderToStaticMarkup(createElement(PearlCarePage));
  const giftsHtml = renderToStaticMarkup(createElement(GiftsPage));

  assert.equal(
    howToWearMetadata.title,
    "How to Wear Pearl Jewelry Every Day | Pearl Guide | MythRealms",
  );
  assert.equal(
    careMetadata.title,
    "How to Care for Pearl Jewelry | Pearl Care Guide | MythRealms",
  );
  assert.equal(giftsMetadata.title, "Pearl Jewelry Gift Guide | Everyday Giving | MythRealms");

  assert.match(
    PEARL_GUIDES["how-to-wear"].directAnswer,
    /only if (?:it is|they are) explicitly stated on the exact item page/i,
  );
  assert.match(
    PEARL_GUIDES.care.directAnswer,
    /only if (?:it is|they are) explicitly stated on the exact item page/i,
  );
  assert.match(howToWearHtml, /href="\/pearls\/care"/);
  assert.match(careHtml, /href="\/contact"/);
  for (const html of [howToWearHtml, careHtml]) {
    assert.doesNotMatch(html, /href="\/products\//);
    assert.doesNotMatch(html, /Related products/);
    assert.doesNotMatch(html, /\$\d+(?:\.\d{2})?/);
  }

  assert.match(giftsHtml, /<h1[^>]*>A Pearl Jewelry Gift Guide for Everyday Giving<\/h1>/);
  for (const href of ["/pearls/how-to-wear", "/shipping", "/refund", "/contact"]) {
    assert.match(giftsHtml, new RegExp(`href="${href}"`));
  }

  const evergreenGiftCopy = `${String(giftsMetadata.description)}\n${giftsHtml}`;
  assert.doesNotMatch(evergreenGiftCopy, /\b(?:verified|active|current)\b/i);
  assert.doesNotMatch(evergreenGiftCopy, /Under \$\d+|\bbelow \$\d+/i);
  assert.doesNotMatch(giftsHtml, /href="\/products\/|"@type":"(?:CollectionPage|ItemList)"/);
  assert.match(
    giftsHtml,
    /only if (?:it is|they are) explicitly stated on the exact item page/i,
  );
  assert.doesNotMatch(
    evergreenGiftCopy,
    /delivery guarantee|best seller|hypoallergenic|one-size/i,
  );
  assert.match(giftsHtml, /cannot make a delivery promise/i);
  assert.doesNotMatch(
    `${howToWearHtml}\n${careHtml}\n${giftsHtml}`,
    /Maverenne/i,
  );
});
