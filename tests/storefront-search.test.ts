import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { searchStorefrontProducts } from "../src/lib/storefront/search";

function source(relativePath: string): string {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

test("storefront search treats short trimmed queries as empty results", () => {
  assert.deepEqual(searchStorefrontProducts(""), []);
  assert.deepEqual(searchStorefrontProducts(" p "), []);
});

test("storefront search returns at most eight matching customer-visible products", () => {
  const results = searchStorefrontProducts("earrings");

  assert.ok(results.length > 0);
  assert.ok(results.length <= 8);
  assert.ok(results.every((result) => result.category === "earrings"));
  assert.ok(results.every((result) => result.slug));
});

test("search overlay derives results from the current query instead of committing stale results in an effect", () => {
  const overlay = source("src/components/layout/SearchOverlay.tsx");

  assert.match(overlay, /useMemo/);
  assert.match(overlay, /searchStorefrontProducts\(query\)/);
  assert.doesNotMatch(overlay, /useState<SearchResult\[\]>/);
  assert.doesNotMatch(overlay, /setResults\(/);
});
