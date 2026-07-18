import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  readAnalyticsConsent,
  saveConsentPreference,
  subscribeToConsentChanges,
  type ConsentHost,
} from "../src/lib/analytics/consent";

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

test("cookie consent and analytics share the typed consent-change contract", () => {
  const cookieSource = readFileSync(
    path.join(process.cwd(), "src/components/layout/CookieConsent.tsx"),
    "utf8",
  );
  const analyticsSource = readFileSync(
    path.join(process.cwd(), "src/components/layout/Analytics.tsx"),
    "utf8",
  );

  assert.match(cookieSource, /saveConsentPreference/);
  assert.match(analyticsSource, /subscribeToConsentChanges/);
  assert.match(analyticsSource, /shouldReportAiReferral\(consented, gaInitialized\)/);
  assert.match(analyticsSource, /onReady=\{\(\) => setGaInitialized\(true\)\}/);
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
  assert.match(source, /if \(!consented\) return null/);
});
