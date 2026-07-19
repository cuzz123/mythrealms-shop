import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import {
  HOMEPAGE_CATEGORY_LINKS,
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
