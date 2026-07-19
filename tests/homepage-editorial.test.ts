import assert from "node:assert/strict";
import { existsSync } from "node:fs";
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

test("homepage product media uses visually accurate descriptions", () => {
  assert.equal(
    HOMEPAGE_MEDIA.hero.alt,
    "Model wearing shell-and-pearl drop earrings in warm studio light",
  );
  assert.equal(HOMEPAGE_MEDIA.earrings.alt, HOMEPAGE_MEDIA.hero.alt);
  assert.equal(
    HOMEPAGE_MEDIA.necklaces.alt,
    "Pearl necklace displayed on a black jewelry stand",
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
