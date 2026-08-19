import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import {
  ACTIVE_PURCHASE_GUIDE_SLUGS,
  PURCHASE_GUIDES,
  PURCHASE_GUIDE_SLUGS,
  getPurchaseGuide,
  isActivePurchaseGuideSlug,
} from "../src/lib/editorial/purchase-guides";

const words = (value: string) => value.trim().split(/\s+/).length;

const approvedSources = new Set([
  "https://www.gia.edu/pearl/buyers-guide",
  "https://consumer.ftc.gov/articles/buying-gemstones-diamonds-and-pearls",
  "https://www.ftc.gov/business-guidance/resources/loupe-advertising-diamond-gemstones-pearls",
  "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
  "https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure?hl=en",
]);

const consumerSourceUrls = [
  "https://www.gia.edu/pearl/buyers-guide",
  "https://consumer.ftc.gov/articles/buying-gemstones-diamonds-and-pearls",
] as const;

const prohibitedCommerceClaims = /(?:[$£€]\s?\d|\b(?:in stock|out of stock|sold out|available now|currently available|inventory (?:is|includes)|ships? (?:today|within)|arrives? (?:by|within)|delivery (?:by|within)|\d+[- ]day (?:shipping|delivery)|free returns?|returns? (?:are )?(?:accepted|guaranteed)|return within|customer reviews?|star rating|rated \d|special offer|limited[- ]time offer|\d+% off|sale price|regular price)\b)/i;

const commonBoundary = "This guide provides general decision steps. Confirm dimensions, materials, pearl description, fastening, care, and compatibility only from the exact approved product record. If a decision-critical fact is missing, ask before buying.";

const approvedRelatedLinks = {
  "how-to-choose-pearl-earrings": [
    ["Pearl Guide", "/pearls"],
    ["How to Wear Pearl Jewelry", "/pearls/how-to-wear"],
    ["Pearl Jewelry Buying Checklist", "/pearls/pearl-jewelry-buying-checklist"],
    ["Shop the Pearl Edit", "/collections/pearl-series"],
  ],
  "pearl-necklace-length-guide": [
    ["Pearl Guide", "/pearls"],
    ["How to Wear Pearl Jewelry", "/pearls/how-to-wear"],
    ["Pearl Jewelry Buying Checklist", "/pearls/pearl-jewelry-buying-checklist"],
    ["Shop the Pearl Edit", "/collections/pearl-series"],
  ],
  "bracelet-size-and-fit-guide": [
    ["Pearl Guide", "/pearls"],
    ["How to Wear Pearl Jewelry", "/pearls/how-to-wear"],
    ["Pearl Jewelry Buying Checklist", "/pearls/pearl-jewelry-buying-checklist"],
    ["Shop the Pearl Edit", "/collections/pearl-series"],
  ],
  "how-to-wear-pearl-hair-accessories": [
    ["Pearl Guide", "/pearls"],
    ["How to Wear Pearl Jewelry", "/pearls/how-to-wear"],
    ["Pearl Jewelry Buying Checklist", "/pearls/pearl-jewelry-buying-checklist"],
    ["View New Arrivals", "/collections/new-arrivals"],
  ],
  "how-to-choose-a-glasses-chain": [
    ["Pearl Guide", "/pearls"],
    ["How to Wear Pearl Jewelry", "/pearls/how-to-wear"],
    ["Pearl Jewelry Buying Checklist", "/pearls/pearl-jewelry-buying-checklist"],
    ["View New Arrivals", "/collections/new-arrivals"],
  ],
  "pearl-jewelry-buying-checklist": [
    ["Pearl Guide", "/pearls"],
    ["What Are Freshwater Cultured Pearls?", "/pearls/freshwater-pearls"],
    ["Shipping Information", "/shipping"],
    ["Refund Policy", "/refund"],
    ["Contact Maverenne", "/contact"],
  ],
} as const;

const approvedContentHashes = {
  "how-to-choose-pearl-earrings": "65cd672e9822b7d9466be21b687712bc5e1bf00403bf7def1063ee0933620d9a",
  "pearl-necklace-length-guide": "b0e74e42c23254572af3d8104e474a1bf0583760ea6c9210569937bb04655615",
  "bracelet-size-and-fit-guide": "1ae48c956bc8781bbf7ca276dcb19ed17da78bbe513d6bebe06a7483c39f23a8",
  "how-to-wear-pearl-hair-accessories": "f7af276a1b779cbd647e707fc3f00fa6c61725cbe9f1c634d88ce41af2cb5943",
  "how-to-choose-a-glasses-chain": "e0cd434eb59ef0ba66da510b46686eee446027a1282138c0dd78a87aaaf7fb96",
  "pearl-jewelry-buying-checklist": "a58e01c157529c196652bc59f5c823c667cc639c8ed6499e8e1d2285f71709e4",
} as const;

test("purchase guides own six unique decision intents", () => {
  assert.equal(PURCHASE_GUIDE_SLUGS.length, 6);
  assert.equal(new Set(PURCHASE_GUIDE_SLUGS).size, 6);
  assert.equal(Object.keys(PURCHASE_GUIDES).length, 6);
  assert.equal(new Set(Object.values(PURCHASE_GUIDES).map((g) => g.seoTitle)).size, 6);
  assert.equal(new Set(Object.values(PURCHASE_GUIDES).map((g) => g.h1)).size, 6);
});

test("the isolated gate activates exactly the founder-approved first three guides", () => {
  assert.deepEqual(ACTIVE_PURCHASE_GUIDE_SLUGS, [
    "how-to-choose-pearl-earrings",
    "pearl-necklace-length-guide",
    "bracelet-size-and-fit-guide",
  ]);
  for (const slug of PURCHASE_GUIDE_SLUGS) {
    assert.equal(
      isActivePurchaseGuideSlug(slug),
      ACTIVE_PURCHASE_GUIDE_SLUGS.includes(slug),
      slug,
    );
  }
});

test("every purchase guide satisfies the editorial shape", () => {
  for (const slug of PURCHASE_GUIDE_SLUGS) {
    const guide = getPurchaseGuide(slug);
    assert.equal(guide.slug, slug);
    assert.ok(words(guide.directAnswer) >= 40 && words(guide.directAnswer) <= 60);
    assert.ok(guide.sections.length >= 3 && guide.sections.length <= 5);
    assert.equal(guide.faq.length, 4);
    assert.equal(guide.boundary, commonBoundary);
    assert.equal(guide.published, "2026-08-12");
    assert.equal(guide.updated, "2026-08-12");
    assert.equal(guide.sourceReviewedOn, "2026-08-12");
    assert.ok(guide.sources.length >= 2);
    assert.ok(guide.sources.every((source) => approvedSources.has(source.href)));
    assert.deepEqual(
      guide.sources.map(({ href }) => href),
      slug === "pearl-jewelry-buying-checklist"
        ? [
            ...consumerSourceUrls,
            "https://www.ftc.gov/business-guidance/resources/loupe-advertising-diamond-gemstones-pearls",
          ]
        : consumerSourceUrls,
    );
    assert.deepEqual(
      guide.relatedLinks.map(({ label, href }) => [label, href]),
      approvedRelatedLinks[slug],
    );
    assert.ok(
      guide.relatedLinks.filter(({ href }) => href.startsWith("/collections/")).length <= 1,
    );
  }
});

test("purchase guides preserve the normative approved content matrix", () => {
  for (const slug of PURCHASE_GUIDE_SLUGS) {
    const digest = createHash("sha256")
      .update(JSON.stringify(getPurchaseGuide(slug)))
      .digest("hex");
    assert.equal(digest, approvedContentHashes[slug], slug);
  }
});

test("purchase guides contain no unsupported commerce or legacy claims", () => {
  const serialized = JSON.stringify(PURCHASE_GUIDES);
  const mutationProbes = [
    "$99",
    "in stock",
    "currently available",
    "delivery within 3 days",
    "returns are accepted",
    "customer reviews",
    "star rating",
    "special offer",
  ];
  for (const claim of mutationProbes) {
    assert.match(claim, prohibitedCommerceClaims, `${claim} mutation probe`);
  }
  assert.doesNotMatch(serialized, /MythRealms|mythrealms-shop.*vercel\.app/i);
  assert.doesNotMatch(serialized, /best[- ]?seller|hypoallergenic|waterproof|handmade|free shipping|guaranteed fit|healing|protective energy/i);
  assert.doesNotMatch(serialized, prohibitedCommerceClaims);
});
