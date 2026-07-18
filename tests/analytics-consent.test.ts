import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  parseConsent,
  requiresConsentReload,
  serializeConsent,
} from "../src/lib/analytics/consent";

const analyticsSource = readFileSync(new URL("../src/components/layout/Analytics.tsx", import.meta.url), "utf8");
const cookieConsentSource = readFileSync(new URL("../src/components/layout/CookieConsent.tsx", import.meta.url), "utf8");

test("missing and malformed consent fail closed", () => {
  assert.deepEqual(parseConsent(null), { analytics: false, marketing: false });
  assert.deepEqual(parseConsent("not-json"), { analytics: false, marketing: false });
});

test("parses essential-only consent", () => {
  assert.deepEqual(
    parseConsent(JSON.stringify({ necessary: true, analytics: false, marketing: false })),
    { analytics: false, marketing: false },
  );
});

test("parses analytics-only consent", () => {
  assert.deepEqual(
    parseConsent(JSON.stringify({ necessary: true, analytics: true, marketing: false })),
    { analytics: true, marketing: false },
  );
});

test("parses all-consent values", () => {
  assert.deepEqual(
    parseConsent(JSON.stringify({ necessary: true, analytics: true, marketing: true })),
    { analytics: true, marketing: true },
  );
});

test("legacy all-only consent fails closed", () => {
  assert.deepEqual(parseConsent(JSON.stringify({ all: true })), {
    analytics: false,
    marketing: false,
  });
});

test("requires a reload only when granted consent is downgraded", () => {
  assert.equal(
    requiresConsentReload(
      { analytics: true, marketing: true },
      { analytics: false, marketing: true },
    ),
    true,
  );
  assert.equal(
    requiresConsentReload(
      { analytics: true, marketing: true },
      { analytics: true, marketing: false },
    ),
    true,
  );
  assert.equal(
    requiresConsentReload(
      { analytics: false, marketing: false },
      { analytics: true, marketing: true },
    ),
    false,
  );
  assert.equal(
    requiresConsentReload(
      { analytics: true, marketing: true },
      { analytics: true, marketing: true },
    ),
    false,
  );
});

test("Analytics keeps platform gates and reactive listener cleanup", () => {
  assert.match(analyticsSource, /gaId && consent\.analytics/);
  assert.match(analyticsSource, /pixelId && consent\.marketing/);
  assert.match(analyticsSource, /pinterestId && consent\.marketing/);
  assert.match(analyticsSource, /window\.addEventListener\(CONSENT_CHANGED_EVENT/);
  assert.match(analyticsSource, /window\.addEventListener\("storage"/);
  assert.match(analyticsSource, /window\.removeEventListener\(CONSENT_CHANGED_EVENT/);
  assert.match(analyticsSource, /window\.removeEventListener\("storage"/);
  assert.match(analyticsSource, /requiresConsentReload/);
  assert.match(analyticsSource, /window\.location\.reload\(\)/);
});

test("CookieConsent reads the shared consent storage key", () => {
  assert.match(cookieConsentSource, /localStorage\.getItem\(CONSENT_STORAGE_KEY\)/);
  assert.doesNotMatch(cookieConsentSource, /import \{ X,/);
});

test("serializes all consent with a timestamp", () => {
  const serialized = JSON.parse(serializeConsent("all"));

  assert.equal(serialized.necessary, true);
  assert.equal(serialized.analytics, true);
  assert.equal(serialized.marketing, true);
  assert.equal(typeof serialized.timestamp, "number");
});

test("serializes essential consent with a timestamp", () => {
  const serialized = JSON.parse(serializeConsent("essential"));

  assert.equal(serialized.necessary, true);
  assert.equal(serialized.analytics, false);
  assert.equal(serialized.marketing, false);
  assert.equal(typeof serialized.timestamp, "number");
});
