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
import { BRAND } from "../src/lib/brand-identity";

test("high-intent pages separate general guidance from unverified item and policy facts", () => {
  const howToWearHtml = renderToStaticMarkup(createElement(HowToWearPearlsPage));
  const careHtml = renderToStaticMarkup(createElement(PearlCarePage));
  const giftsHtml = renderToStaticMarkup(createElement(GiftsPage));

  assert.equal(
    howToWearMetadata.title,
    `How to Wear Pearl Jewelry Every Day | Pearl Guide | ${BRAND.name}`,
  );
  assert.equal(
    careMetadata.title,
    "How to Care for Pearls | Pearl Care Guide",
  );
  assert.equal(giftsMetadata.title, `Pearl Jewelry Gift Guide | Everyday Giving | ${BRAND.name}`);

  assert.equal(PEARL_GUIDES["how-to-wear"].editorialStatus, "candidate");
  assert.match(PEARL_GUIDES["how-to-wear"].evidenceBoundary ?? "", /does not establish product material/i);
  assert.match(careHtml, /This is educational guidance for pearls, not a care instruction for any store item, setting, string, or finish\./);
  assert.match(howToWearHtml, /href="\/pearls\/care"/);
  assert.match(howToWearHtml, /A guide cannot confirm composition, dimensions, fastening, price, availability, delivery, return eligibility, or how an item will feel when worn\./);
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
  assert.match(`${howToWearHtml}\n${careHtml}\n${giftsHtml}`, new RegExp(BRAND.name, "i"));
  // The canonical origin remains on the legacy domain until the separately
  // authorized domain cutover; customer-visible and schema brand names must
  // already use the single Phase 1 identity.
  assert.doesNotMatch(
    `${howToWearHtml}\n${careHtml}\n${giftsHtml}`,
    /"name":"MythRealms(?: Editorial)?"|>MythRealms(?: Editorial)?</i,
  );
});

test("pearl care renders the approved general-care answer, legacy canonical, and matching structured data", () => {
  const html = renderToStaticMarkup(createElement(PearlCarePage));
  const directAnswer = "General pearl-care guidance is to reduce contact with fragrance, cosmetics, heat, and harsh cleaners; wipe pearls with a very soft, clean cloth after wear; and avoid ultrasonic or steam cleaning. This is educational guidance for pearls, not a care instruction for any store item, setting, string, or finish.";
  const expectedDescription = "Read general pearl care guidance on cleaning, heat, chemicals, and storage boundaries. Check the exact item record for item-specific instructions.";

  assert.equal(careMetadata.title, "How to Care for Pearls | Pearl Care Guide");
  assert.equal(careMetadata.description, expectedDescription);
  assert.equal(careMetadata.alternates?.canonical, "https://mythrealms-shop.vercel.app/pearls/care");
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<h1[^>]*>How to Care for Pearls<\/h1>/);
  assert.match(html, new RegExp(directAnswer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal(directAnswer.split(/\s+/).length, 48);

  for (const [href, label] of [
    ["/pearls", "Explore the Pearl Guide"],
    ["/pearls/how-to-wear", "Read everyday pearl styling guidance"],
    ["/pearls/freshwater-pearls", "Read general pearl terminology"],
    ["/contact", "Ask about a product detail"],
  ]) {
    assert.match(html, new RegExp(`<a[^>]+href="${href}"[^>]*>${label}<\/a>`));
  }

  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)]
    .map((match) => JSON.parse(match[1]) as Record<string, unknown>);
  const article = schemas.find((schema) => schema["@type"] === "Article");
  const faq = schemas.find((schema) => schema["@type"] === "FAQPage");
  const breadcrumb = schemas.find((schema) => schema["@type"] === "BreadcrumbList");

  assert.equal(article?.headline, "How to Care for Pearls");
  assert.equal(article?.description, directAnswer);
  assert.equal(article?.url, "https://mythrealms-shop.vercel.app/pearls/care");
  assert.equal("author" in (article ?? {}), false);
  assert.equal("datePublished" in (article ?? {}), false);
  assert.equal("image" in (article ?? {}), false);
  assert.deepEqual(
    (faq?.mainEntity as Array<Record<string, unknown>>).map((item) => item.name),
    [
      "Should I put pearl jewelry on before fragrance or cosmetics?",
      "Can I use an ultrasonic or steam cleaner on pearls?",
      "What should I do after wearing pearls?",
      "Does this guide tell me how to care for a product on this site?",
    ],
  );
  assert.equal(
    ((breadcrumb?.itemListElement as Array<Record<string, unknown>>).at(-1)?.item),
    "https://mythrealms-shop.vercel.app/pearls/care",
  );
  for (const [href, label] of [
    ["https://www.gia.edu/gia-news-research/pearl-care-cleaning", "GIA Pearl Care and Cleaning Guide"],
    ["https://www.gia.edu/pearl/buyers-guide", "GIA Pearl Buyer’s Guide"],
  ]) {
    assert.match(html, new RegExp(`<a[^>]+href="${href}"[^>]*>${label}<\\/a>`));
  }
  assert.doesNotMatch(html, /Published|Maverenne Editorial/);

  assert.doesNotMatch(
    html,
    /(?:is|are) (?:waterproof|tarnish resistant|hypoallergenic)|free shipping|in stock|delivery within|returns? accepted|warranty|Guardian|mythology|symbolism|healing|protection|luck/i,
  );
});
