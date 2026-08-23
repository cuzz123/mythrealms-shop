import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { BRAND } from "../src/lib/brand-identity";
import { SITE_NAME } from "../src/lib/site";

test("Maverenne identity exposes approved copy", () => {
  assert.equal(BRAND.name, "Maverenne");
  assert.equal(BRAND.tagline, "Come back to yourself.");
  assert.equal(BRAND.descriptor, "Jewelry & Accessories");
  assert.equal(BRAND.heroTitle, "A little something for yourself.");
  assert.equal(BRAND.primaryCta.label, "Find Your Piece");
  assert.equal(BRAND.primaryCta.href, "/collections/pearl-series");
  assert.equal(SITE_NAME, BRAND.name);
});

const publicBrandFiles = [
  "../src/components/layout/Footer.tsx",
  "../src/components/layout/AnnouncementBar.tsx",
  "../src/components/layout/CartDrawer.tsx",
  "../src/app/contact/layout.tsx",
] as const;

const INDEXABLE_BRAND_FILES = [
  "../src/app/collections/page.tsx",
  "../src/app/collections/[slug]/page.tsx",
  "../src/app/faq/layout.tsx",
  "../src/app/faq/page.tsx",
  "../src/app/blog/page.tsx",
  "../src/app/blog/[slug]/page.tsx",
  "../src/app/edits/[slug]/page.tsx",
  "../src/app/size-guide/page.tsx",
  "../src/app/guardian-quiz/page.tsx",
  "../src/app/pearls/stories/page.tsx",
  "../src/app/pearls/symbolism/page.tsx",
] as const;

test("indexable public route sources do not expose the retired brand", () => {
  for (const relativePath of INDEXABLE_BRAND_FILES) {
    const source = readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");
    assert.doesNotMatch(source, /MythRealms/i, relativePath);
  }
});

test("FAQ and size guide support CTAs route through the contact form", () => {
  const supportFiles = [
    "../src/app/faq/page.tsx",
    "../src/app/size-guide/page.tsx",
  ] as const;

  for (const relativePath of supportFiles) {
    const source = readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8");
    assert.doesNotMatch(source, /\.invalid|mythrealms@/i, relativePath);
    assert.match(source, /\/contact/, relativePath);
  }
});

test("public brand surfaces use Maverenne without legacy claims or identities", () => {
  const sources = new Map(publicBrandFiles.map((relativePath) => [
    relativePath,
    readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8"),
  ]));
  const footer = sources.get("../src/components/layout/Footer.tsx") ?? "";
  const announcement = sources.get("../src/components/layout/AnnouncementBar.tsx") ?? "";
  const cart = sources.get("../src/components/layout/CartDrawer.tsx") ?? "";
  const contact = sources.get("../src/app/contact/layout.tsx") ?? "";
  const combinedSource = [...sources.values()].join("\n");

  for (const bannedResidue of [
    /MythRealms/i,
    /mythrealms@/i,
    /mythrealms\.shop/i,
    /free shipping/i,
    /30-day returns/i,
    /subscriber-only offers/i,
    /Secure checkout in USD/i,
  ]) {
    assert.doesNotMatch(combinedSource, bannedResidue);
  }

  for (const brandField of [/BRAND\.name/, /BRAND\.tagline/, /BRAND\.newsletterTitle/]) {
    assert.match(footer, brandField);
  }
  assert.doesNotMatch(
    footer,
    /socialLinks|tiktok\.com|instagram\.com|facebook\.com|youtube\.com|mailto:|Mon\s*&ndash;\s*Fri|subscriber-only offers|Secure checkout in USD/i,
  );

  assert.match(announcement, /BRAND\.tagline/);
  assert.match(announcement, /BRAND\.descriptor/);
  assert.doesNotMatch(announcement, /free shipping|30-day returns/i);

  assert.match(contact, /BRAND\.name/);
  assert.match(contact, /absoluteUrl\(["']\/contact["']\)/);

  assert.match(cart, /\bsubtotal\b/);
  assert.match(cart, /href=["']\/cart["']/);
  assert.match(cart, /href=["']\/checkout["']/);
  assert.doesNotMatch(cart, /FREE_SHIPPING_THRESHOLD|free shipping/i);
});
