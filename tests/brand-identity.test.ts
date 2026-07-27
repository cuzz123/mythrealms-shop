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

test("public brand surfaces use Maverenne without legacy claims or identities", () => {
  const sources = publicBrandFiles.map((relativePath) => ({
    relativePath,
    source: readFileSync(fileURLToPath(new URL(relativePath, import.meta.url)), "utf8"),
  }));
  const combinedSource = sources.map(({ source }) => source).join("\n");

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

  for (const requiredBrandSurface of [
    "../src/components/layout/Footer.tsx",
    "../src/components/layout/AnnouncementBar.tsx",
    "../src/app/contact/layout.tsx",
  ]) {
    const source = sources.find(({ relativePath }) => relativePath === requiredBrandSurface)?.source;
    assert.ok(source, `missing source fixture for ${requiredBrandSurface}`);
    assert.match(source, /BRAND\./);
  }
});
