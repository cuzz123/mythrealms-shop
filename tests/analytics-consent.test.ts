import assert from "node:assert/strict";
import test from "node:test";
import {
  parseConsent,
  serializeConsent,
} from "../src/lib/analytics/consent";

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
  assert.deepEqual(parseConsent(JSON.stringify({ all: true })), {
    analytics: true,
    marketing: true,
  });
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
