import assert from "node:assert/strict";
import test from "node:test";

import {
  classifyReferralSource,
  reportAiReferralOnce,
  shouldReportAiReferral,
} from "../src/lib/analytics/referral";

test("classifies only the approved ChatGPT campaign source", () => {
  assert.equal(
    classifyReferralSource("https://shop.example/?utm_source=chatgpt.com"),
    "chatgpt.com",
  );
  assert.equal(
    classifyReferralSource("https://shop.example/?utm_source=perplexity.ai"),
    null,
  );
  assert.equal(
    classifyReferralSource("https://shop.example/?utm_source=ChatGPT.COM"),
    "chatgpt.com",
  );
});

test("does not label ordinary direct traffic as AI referral", () => {
  assert.equal(classifyReferralSource("https://shop.example/"), null);
});

test("requires consent and GA initialization before referral reporting", () => {
  assert.equal(shouldReportAiReferral(false, false), false);
  assert.equal(shouldReportAiReferral(true, false), false);
  assert.equal(shouldReportAiReferral(false, true), false);
  assert.equal(shouldReportAiReferral(true, true), true);
});

test("reports an eligible referral once per session", () => {
  const values = new Map<string, string>();
  const calls: unknown[][] = [];
  const dedupe = { current: false };
  const input = {
    locationHref: "https://shop.example/?utm_source=chatgpt.com",
    sessionStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => {
        values.set(key, value);
      },
    },
    gtag: (...args: unknown[]) => calls.push(args),
    dedupe,
  };

  assert.equal(reportAiReferralOnce(input), true);
  assert.equal(reportAiReferralOnce(input), false);
  assert.equal(
    reportAiReferralOnce({ ...input, dedupe: { current: false } }),
    false,
  );
  assert.deepEqual(calls, [
    ["event", "ai_referral", { source: "chatgpt.com" }],
  ]);
});

test("storage failures do not throw or duplicate referral events", () => {
  const calls: unknown[][] = [];
  const dedupe = { current: false };
  const storage = {
    getItem: () => {
      throw new Error("storage blocked");
    },
    setItem: () => {
      throw new Error("storage blocked");
    },
  };
  const input = {
    locationHref: "https://shop.example/?utm_source=chatgpt.com",
    sessionStorage: storage,
    gtag: (...args: unknown[]) => calls.push(args),
    dedupe,
  };

  assert.doesNotThrow(() => reportAiReferralOnce(input));
  assert.equal(reportAiReferralOnce(input), false);
  assert.equal(calls.length, 1);
});
