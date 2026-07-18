import assert from "node:assert/strict";
import test from "node:test";

import { classifyReferralSource } from "../src/lib/analytics/referral";

test("classifies only the approved ChatGPT campaign source", () => {
  assert.equal(
    classifyReferralSource("https://shop.example/?utm_source=chatgpt.com"),
    "chatgpt.com",
  );
  assert.equal(
    classifyReferralSource("https://shop.example/?utm_source=perplexity.ai"),
    null,
  );
});

test("does not label ordinary direct traffic as AI referral", () => {
  assert.equal(classifyReferralSource("https://shop.example/"), null);
});
