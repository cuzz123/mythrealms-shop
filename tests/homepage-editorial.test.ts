import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import {
  HOMEPAGE_MEDIA,
  HOMEPAGE_CATEGORY_LINKS,
  HOMEPAGE_EDITORIAL_LINKS,
  homepageEditorialSources,
} from "../src/lib/homepage-editorial";

test("homepage editorial media exists under public and stays portable", () => {
  for (const source of homepageEditorialSources()) {
    assert.match(source, /^\/images\/brand\//);
    assert.equal(existsSync(resolve("public", source.slice(1))), true, source);
  }
});

test("homepage exposes all approved pearl shopping categories", () => {
  assert.deepEqual(
    HOMEPAGE_CATEGORY_LINKS.map(({ label, href }) => [label, href]),
    [
      ["Everyday Pearl", "/collections/pearl-series"],
      ["Pearl Earrings", "/collections/pearl-series?type=earrings"],
      ["Pearl Necklaces", "/collections/pearl-series?type=necklaces"],
      ["Pearl Bracelets", "/collections/pearl-series?type=bracelets"],
      ["Pearl Eyewear Chains", "/collections/pearl-series?type=eyewear-chains"],
    ],
  );
});

test("homepage promotes only the two approved editorial destinations", () => {
  assert.deepEqual(
    HOMEPAGE_EDITORIAL_LINKS.map(({ label, href }) => [label, href]),
    [
      ["Pearl Gift Guide", "/gifts"],
      ["Pearl Knowledge", "/pearls"],
    ],
  );
  assert.deepEqual(
    HOMEPAGE_EDITORIAL_LINKS[1].links.map(({ href }) => href),
    ["/pearls", "/pearls/care", "/pearls/how-to-wear"],
  );
});

test("homepage editorial cards use the dedicated model-led replacement imagery", () => {
  assert.match(HOMEPAGE_MEDIA.earrings.src, /category-earrings-model-v3\.png$/);
  assert.match(HOMEPAGE_EDITORIAL_LINKS[0].image.src, /editorial-gift-guide-model-v3\.png$/);
  assert.match(HOMEPAGE_EDITORIAL_LINKS[1].image.src, /editorial-pearl-knowledge-model-v3\.png$/);
  assert.doesNotMatch(HOMEPAGE_EDITORIAL_LINKS[0].image.src, /pearl-earrings-editorial\.png$/);
  assert.doesNotMatch(HOMEPAGE_EDITORIAL_LINKS[1].image.src, /scene-seaside-stairs\.png$/);
});

test("homepage product media uses visually accurate descriptions", () => {
  assert.equal(
    HOMEPAGE_MEDIA.hero.alt,
    "Model wearing shell-and-pearl drop earrings in warm studio light",
  );
  assert.equal(
    HOMEPAGE_MEDIA.earrings.alt,
    "Model wearing pearl drop earrings in a sunlit limestone courtyard",
  );
  assert.equal(
    HOMEPAGE_MEDIA.necklaces.alt,
    "Model wearing a pearl and gold lariat necklace in a sunlit courtyard",
  );
  assert.equal(
    HOMEPAGE_MEDIA.bracelets.alt,
    "Gold wire pearl bracelet displayed on dark fabric",
  );
  assert.equal(
    HOMEPAGE_MEDIA.eyewear.alt,
    "Pearl eyewear chain attached to eyeglasses on a dark background",
  );
});

test("homepage growth surfaces use approved brand and storefront imagery", () => {
  const sources = [
    "src/components/home/HomepageOccasionEdit.tsx",
    "src/components/home/HomepageGiftSets.tsx",
    "src/components/home/HomepageWhyPearls.tsx",
  ].map((path) => readFileSync(resolve(path), "utf8"));

  for (const componentSource of sources) {
    assert.match(componentSource, /@\/lib\//);
    assert.doesNotMatch(componentSource, /https?:\/\//);
  }
});
