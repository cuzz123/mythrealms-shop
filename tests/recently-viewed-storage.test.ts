import assert from "node:assert/strict";
import test from "node:test";

import { readRecentlyViewedSlugs } from "../src/lib/client/recently-viewed";

function storageWith(value: string | null): Pick<Storage, "getItem"> {
  return { getItem: () => value };
}

test("recently viewed storage preserves the first four stored slugs", () => {
  assert.deepEqual(
    readRecentlyViewedSlugs(
      storageWith(JSON.stringify(["pearl-series-01", "pearl-series-02", "pearl-series-03", "pearl-series-04", "pearl-series-05"])),
    ),
    ["pearl-series-01", "pearl-series-02", "pearl-series-03", "pearl-series-04"],
  );
});

test("recently viewed storage treats missing or malformed values as empty", () => {
  assert.deepEqual(readRecentlyViewedSlugs(storageWith(null)), []);
  assert.deepEqual(readRecentlyViewedSlugs(storageWith("not json")), []);
  assert.deepEqual(readRecentlyViewedSlugs(storageWith(JSON.stringify({ slug: "pearl-series-01" }))), []);
});
