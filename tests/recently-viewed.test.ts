import assert from "node:assert/strict";
import test from "node:test";

import {
  LEGACY_RECENTLY_VIEWED_STORAGE_KEY,
  RECENTLY_VIEWED_STORAGE_KEY,
  readRecentlyViewed,
  recordRecentlyViewed,
} from "../src/lib/recently-viewed";

function storage(seed: Record<string, string> = {}) {
  const values = new Map(Object.entries(seed));
  return {
    getItem(key: string) { return values.get(key) ?? null; },
    setItem(key: string, value: string) { values.set(key, value); },
    value(key: string) { return values.get(key) ?? null; },
  };
}

test("recently viewed merges the legacy key and migrates it to the new key", () => {
  const host = storage({
    [RECENTLY_VIEWED_STORAGE_KEY]: JSON.stringify(["newer", "shared"]),
    [LEGACY_RECENTLY_VIEWED_STORAGE_KEY]: JSON.stringify(["legacy", "shared"]),
  });

  assert.deepEqual(readRecentlyViewed(host, 6), ["newer", "shared", "legacy"]);
  assert.equal(host.value(RECENTLY_VIEWED_STORAGE_KEY), JSON.stringify(["newer", "shared", "legacy"]));
});

test("recently viewed records only to the new key", () => {
  const host = storage({
    [LEGACY_RECENTLY_VIEWED_STORAGE_KEY]: JSON.stringify(["legacy"]),
  });

  assert.deepEqual(recordRecentlyViewed(host, "current", 6), ["current", "legacy"]);
  assert.equal(host.value(RECENTLY_VIEWED_STORAGE_KEY), JSON.stringify(["current", "legacy"]));
  assert.equal(host.value(LEGACY_RECENTLY_VIEWED_STORAGE_KEY), JSON.stringify(["legacy"]));
});
