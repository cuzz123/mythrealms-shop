import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  CONSENT_CHANGED_EVENT,
  CONSENT_STORAGE_KEY,
  createConsentSubscriptionController,
  hasValidStoredConsent,
  parseConsent,
  readAnalyticsConsent,
  saveConsentPreference,
  serializeConsent,
  subscribeToConsentChanges,
  type ConsentHost,
} from "../src/lib/analytics/consent";

type ConsentListener = (event?: { key: string | null }) => void;

class FakeEventTarget {
  readonly added: Array<{ type: string; listener: ConsentListener }> = [];
  readonly removed: Array<{ type: string; listener: ConsentListener }> = [];

  addEventListener(type: string, listener: ConsentListener) {
    this.added.push({ type, listener });
  }

  removeEventListener(type: string, listener: ConsentListener) {
    this.removed.push({ type, listener });
  }
}

function createHost({ storageFails = false } = {}) {
  const values = new Map<string, string>();
  const target = new EventTarget();
  const storage = {
    getItem(key: string) {
      if (storageFails) throw new Error("storage blocked");
      return values.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      if (storageFails) throw new Error("storage blocked");
      values.set(key, value);
    },
  };

  return Object.assign(target, { localStorage: storage }) as ConsentHost;
}

test("missing and malformed consent fail closed", () => {
  assert.deepEqual(parseConsent(null), { analytics: false, marketing: false });
  assert.deepEqual(parseConsent("not-json"), {
    analytics: false,
    marketing: false,
  });
});

test("parses essential-only consent", () => {
  assert.deepEqual(
    parseConsent(
      JSON.stringify({ necessary: true, analytics: false, marketing: false }),
    ),
    { analytics: false, marketing: false },
  );
});

test("parses analytics-only consent", () => {
  assert.deepEqual(
    parseConsent(
      JSON.stringify({ necessary: true, analytics: true, marketing: false }),
    ),
    { analytics: true, marketing: false },
  );
});

test("parses all-consent values", () => {
  assert.deepEqual(
    parseConsent(
      JSON.stringify({ necessary: true, analytics: true, marketing: true }),
    ),
    { analytics: true, marketing: true },
  );
});

test("legacy all-only consent fails closed", () => {
  assert.deepEqual(parseConsent(JSON.stringify({ all: true })), {
    analytics: false,
    marketing: false,
  });
});

test("parser shares strict stored-consent validity", () => {
  const invalid = [
    { analytics: true, marketing: true },
    { necessary: false, analytics: true, marketing: true },
    { necessary: true, analytics: "true", marketing: true },
    { necessary: true, analytics: true, marketing: 1 },
  ];

  for (const value of invalid) {
    assert.deepEqual(parseConsent(JSON.stringify(value)), {
      analytics: false,
      marketing: false,
    });
  }
});

test("stored consent is valid only with necessary and explicit boolean fields", () => {
  const valid = [
    { necessary: true, analytics: false, marketing: false },
    { necessary: true, analytics: true, marketing: false },
    { necessary: true, analytics: true, marketing: true },
  ];
  const invalid = [
    null,
    "not-json",
    JSON.stringify({ all: true }),
    JSON.stringify({ necessary: false, analytics: true, marketing: true }),
    JSON.stringify({ necessary: true, analytics: 1, marketing: false }),
    JSON.stringify({ necessary: true, analytics: true }),
  ];

  for (const value of valid) {
    assert.equal(hasValidStoredConsent(JSON.stringify(value)), true);
  }
  for (const value of invalid) {
    assert.equal(hasValidStoredConsent(value), false);
  }
});

test("consent controller reads grants without reloading and reacts to same-tab changes", () => {
  const target = new FakeEventTarget();
  let raw: string | null = JSON.stringify({
    necessary: true,
    analytics: false,
    marketing: false,
  });
  const changes: Array<{ analytics: boolean; marketing: boolean }> = [];
  let reloads = 0;
  const controller = createConsentSubscriptionController({
    target,
    readConsent: () => raw,
    onConsentChange: (state) => changes.push(state),
    reload: () => reloads++,
  });

  controller.start();
  assert.deepEqual(changes, [{ analytics: false, marketing: false }]);
  assert.equal(reloads, 0);

  raw = JSON.stringify({
    necessary: true,
    analytics: true,
    marketing: false,
  });
  const customHandler = target.added.find(
    ({ type }) => type === CONSENT_CHANGED_EVENT,
  )?.listener;
  assert.ok(customHandler);
  customHandler();
  assert.deepEqual(changes.at(-1), { analytics: true, marketing: false });
  assert.equal(reloads, 0);
});

test("consent controller ignores unrelated storage changes and reloads malformed downgrades", () => {
  const target = new FakeEventTarget();
  let raw: string | null = JSON.stringify({
    necessary: true,
    analytics: true,
    marketing: true,
  });
  const changes: Array<{ analytics: boolean; marketing: boolean }> = [];
  let reloads = 0;
  const controller = createConsentSubscriptionController({
    target,
    readConsent: () => raw,
    onConsentChange: (state) => changes.push(state),
    reload: () => reloads++,
  });

  controller.start();
  const storageHandler = target.added.find(
    ({ type }) => type === "storage",
  )?.listener;
  assert.ok(storageHandler);

  raw = JSON.stringify({
    necessary: true,
    analytics: false,
    marketing: true,
  });
  storageHandler({ key: "unrelated-key" });
  assert.equal(changes.length, 1);
  assert.equal(reloads, 0);

  raw = "not-json";
  storageHandler({ key: CONSENT_STORAGE_KEY });
  assert.deepEqual(changes.at(-1), { analytics: false, marketing: false });
  assert.equal(reloads, 1);
});

test("consent controller cleanup removes the exact registered callbacks", () => {
  const target = new FakeEventTarget();
  const controller = createConsentSubscriptionController({
    target,
    readConsent: () => null,
    onConsentChange: () => {},
    reload: () => {},
  });

  controller.start();
  controller.cleanup();

  assert.equal(target.removed.length, 2);
  assert.equal(target.removed[0].type, CONSENT_CHANGED_EVENT);
  assert.equal(target.removed[0].listener, target.added[0].listener);
  assert.equal(target.removed[1].type, "storage");
  assert.equal(target.removed[1].listener, target.added[1].listener);
});

test("serializes all consent with a timestamp", () => {
  const serialized = JSON.parse(serializeConsent("all"));

  assert.equal(hasValidStoredConsent(JSON.stringify(serialized)), true);
  assert.equal(serialized.necessary, true);
  assert.equal(serialized.analytics, true);
  assert.equal(serialized.marketing, true);
  assert.equal(typeof serialized.timestamp, "number");
});

test("serializes essential consent with a timestamp", () => {
  const serialized = JSON.parse(serializeConsent("essential"));

  assert.equal(hasValidStoredConsent(JSON.stringify(serialized)), true);
  assert.equal(serialized.necessary, true);
  assert.equal(serialized.analytics, false);
  assert.equal(serialized.marketing, false);
  assert.equal(typeof serialized.timestamp, "number");
});

test("accept all notifies analytics immediately while necessary-only does not", () => {
  const host = createHost();
  const analyticsStates: boolean[] = [];
  const unsubscribe = subscribeToConsentChanges(host, (consent) => {
    analyticsStates.push(consent.analytics);
  });

  saveConsentPreference(host, {
    necessary: true,
    analytics: true,
    marketing: true,
    timestamp: 1,
  });
  saveConsentPreference(host, {
    necessary: true,
    analytics: false,
    marketing: false,
    timestamp: 2,
  });
  unsubscribe();

  assert.deepEqual(analyticsStates, [true, false]);
  assert.equal(readAnalyticsConsent(host), false);
});

test("consent notification survives local storage failures", () => {
  const host = createHost({ storageFails: true });
  const analyticsStates: boolean[] = [];
  subscribeToConsentChanges(host, (consent) => {
    analyticsStates.push(consent.analytics);
  });

  assert.doesNotThrow(() =>
    saveConsentPreference(host, {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: 1,
    }),
  );
  assert.deepEqual(analyticsStates, [true]);
  assert.equal(readAnalyticsConsent(host), false);
});

test("cookie consent and analytics share the consent contract", () => {
  const cookieSource = readFileSync(
    path.join(process.cwd(), "src/components/layout/CookieConsent.tsx"),
    "utf8",
  );
  const analyticsSource = readFileSync(
    path.join(process.cwd(), "src/components/layout/Analytics.tsx"),
    "utf8",
  );

  assert.match(cookieSource, /saveConsentPreference/);
  assert.match(analyticsSource, /createConsentSubscriptionController/);
  assert.match(
    analyticsSource,
    /shouldReportAiReferral\(consent\.analytics, gaInitialized\)/,
  );
  assert.match(analyticsSource, /setGaInitialized\(true\)/);
});

test("Meta and Pinterest tracking integrations remain intact", () => {
  const source = readFileSync(
    path.join(process.cwd(), "src/components/layout/Analytics.tsx"),
    "utf8",
  );

  assert.match(source, /id="meta-pixel"/);
  assert.match(source, /fbq\('track','PageView'\)/);
  assert.match(source, /facebook\.com\/tr\?id=/);
  assert.match(source, /id="pinterest-tag"/);
  assert.match(source, /pintrk\('page'\)/);
  assert.match(source, /ct\.pinterest\.com\/v3\/\?event=init/);
  assert.match(source, /consent\.marketing/);
});
