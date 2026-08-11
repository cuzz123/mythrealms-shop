import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  captureFirstUtmAttribution,
  extractUtmAttribution,
  readUtmAttribution,
  UTM_ATTRIBUTION_STORAGE_KEY,
} from "../src/lib/analytics/attribution";

class MemorySessionStorage {
  private values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

test("extracts only standard non-empty UTM parameters", () => {
  assert.deepEqual(
    extractUtmAttribution(
      "https://www.maverenne.com/guardian-quiz?utm_source=Pinterest&utm_medium=organic_social&utm_campaign=maverenne-pearls&utm_term=&utm_content=pin-a&other=value",
    ),
    {
      utm_source: "Pinterest",
      utm_medium: "organic_social",
      utm_campaign: "maverenne-pearls",
      utm_content: "pin-a",
    },
  );
});

test("keeps first-touch UTM only for the consented browser session", () => {
  const storage = new MemorySessionStorage();
  const first = captureFirstUtmAttribution(
    "https://www.maverenne.com/?utm_source=TikTok&utm_medium=organic_social",
    storage,
  );
  const later = captureFirstUtmAttribution(
    "https://www.maverenne.com/guardian-quiz?utm_source=Pinterest&utm_medium=paid",
    storage,
  );

  assert.deepEqual(first, { utm_source: "TikTok", utm_medium: "organic_social" });
  assert.deepEqual(later, first);
  assert.equal(storage.getItem(UTM_ATTRIBUTION_STORAGE_KEY) !== null, true);
  assert.deepEqual(readUtmAttribution(storage), first);
});

test("does not persist empty or malformed attribution", () => {
  const storage = new MemorySessionStorage();
  assert.deepEqual(
    captureFirstUtmAttribution("https://www.maverenne.com/?other=value", storage),
    {},
  );
  assert.equal(storage.getItem(UTM_ATTRIBUTION_STORAGE_KEY), null);

  storage.setItem(UTM_ATTRIBUTION_STORAGE_KEY, "not-json");
  assert.deepEqual(readUtmAttribution(storage), {});
});

test("Analytics captures UTM only after analytics consent", () => {
  const analyticsSource = readFileSync(
    path.join(process.cwd(), "src/components/layout/Analytics.tsx"),
    "utf8",
  );

  assert.match(
    analyticsSource,
    /if \(!consent\.analytics\) return;[\s\S]*captureFirstUtmAttribution\(window\.location\.href, window\.sessionStorage\)/,
  );
});
