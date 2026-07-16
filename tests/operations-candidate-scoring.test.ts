import assert from "node:assert/strict";
import test from "node:test";

import {
  parseCandidateInput,
  scoreCandidate,
  transitionCandidateStatus,
} from "../src/lib/operations/candidate-scoring";

const SCORING_CONFIG = {
  cnyToUsdRate: 0.14,
  targetGrossMargin: 0.6,
} as const;

test("parseCandidateInput normalizes a supported supplier candidate into integer fen", () => {
  const parsed = parseCandidateInput({
    "1688Url": "https://detail.1688.com/offer/123456.html",
    supplierName: "  Myth Factory  ",
    materialSpec: "  925 silver / 6mm  ",
    purchasePriceCny: "12.50",
    moq: "3",
    estimatedShippingCny: 3.5,
    supportsDropshipping: true,
  });

  assert.deepEqual(parsed, {
    "1688Url": "https://detail.1688.com/offer/123456.html",
    supplierName: "Myth Factory",
    materialSpec: "925 silver / 6mm",
    purchasePriceCny: 1250,
    moq: 3,
    estimatedShippingCny: 350,
    supportsDropshipping: true,
  });
});

test("parseCandidateInput rejects unsupported urls and invalid required fields", () => {
  assert.throws(
    () =>
      parseCandidateInput({
        "1688Url": "ftp://detail.1688.com/offer/123456.html",
        supplierName: "Myth Factory",
        materialSpec: "925 silver",
        purchasePriceCny: "10.00",
        moq: 1,
        estimatedShippingCny: "0.00",
        supportsDropshipping: false,
      }),
    /1688\.com or alibaba\.com/i,
  );

  assert.throws(
    () =>
      parseCandidateInput({
        "1688Url": "https://example.com/item/1",
        supplierName: "Myth Factory",
        materialSpec: "925 silver",
        purchasePriceCny: "10.00",
        moq: 1,
        estimatedShippingCny: "0.00",
        supportsDropshipping: false,
      }),
    /1688\.com or alibaba\.com/i,
  );

  assert.throws(
    () =>
      parseCandidateInput({
        "1688Url": "https://www.alibaba.com/product-detail/example_1.html",
        supplierName: " ",
        materialSpec: "925 silver",
        purchasePriceCny: "10.00",
        moq: 1,
        estimatedShippingCny: "0.00",
        supportsDropshipping: false,
      }),
    /supplier name/i,
  );

  assert.throws(
    () =>
      parseCandidateInput({
        "1688Url": "https://www.alibaba.com/product-detail/example_1.html",
        supplierName: "Myth Factory",
        materialSpec: "",
        purchasePriceCny: "10.00",
        moq: 1,
        estimatedShippingCny: "0.00",
        supportsDropshipping: false,
      }),
    /material spec/i,
  );
});

test("parseCandidateInput rejects negative money values without being masked by other fields", () => {
  assert.throws(
    () =>
      parseCandidateInput({
        "1688Url": "https://www.alibaba.com/product-detail/example_1.html",
        supplierName: "Myth Factory",
        materialSpec: "925 silver",
        purchasePriceCny: "-0.01",
        moq: 1,
        estimatedShippingCny: "0.00",
        supportsDropshipping: false,
      }),
    /non-negative/i,
  );
});

test("parseCandidateInput rejects non-positive moq without being masked by other fields", () => {
  assert.throws(
    () =>
      parseCandidateInput({
        "1688Url": "https://www.alibaba.com/product-detail/example_1.html",
        supplierName: "Myth Factory",
        materialSpec: "925 silver",
        purchasePriceCny: "10.00",
        moq: 0,
        estimatedShippingCny: "0.00",
        supportsDropshipping: false,
      }),
    /positive integer/i,
  );
});

test("parseCandidateInput rejects number money values that would be rounded by toFixed", () => {
  assert.throws(
    () =>
      parseCandidateInput({
        "1688Url": "https://detail.1688.com/offer/123456.html",
        supplierName: "Myth Factory",
        materialSpec: "925 silver",
        purchasePriceCny: 3.456,
        moq: 1,
        estimatedShippingCny: 0,
        supportsDropshipping: true,
      }),
    /up to 2 decimals/i,
  );

  assert.throws(
    () =>
      parseCandidateInput({
        "1688Url": "https://detail.1688.com/offer/123456.html",
        supplierName: "Myth Factory",
        materialSpec: "925 silver",
        purchasePriceCny: 10,
        moq: 1,
        estimatedShippingCny: 0.004,
        supportsDropshipping: true,
      }),
    /up to 2 decimals/i,
  );

  assert.deepEqual(
    parseCandidateInput({
      "1688Url": "https://detail.1688.com/offer/123456.html",
      supplierName: "Myth Factory",
      materialSpec: "925 silver",
      purchasePriceCny: 3.4,
      moq: 1,
      estimatedShippingCny: 0.6,
      supportsDropshipping: true,
    }),
    parseCandidateInput({
      "1688Url": "https://detail.1688.com/offer/123456.html",
      supplierName: "Myth Factory",
      materialSpec: "925 silver",
      purchasePriceCny: "3.40",
      moq: "1",
      estimatedShippingCny: "0.60",
      supportsDropshipping: true,
    }),
  );
});

test("scoreCandidate returns deterministic landed cost, suggested retail, and stable reasons", () => {
  const parsed = parseCandidateInput({
    "1688Url": "https://www.alibaba.com/product-detail/example_1.html",
    supplierName: "Myth Factory",
    materialSpec: "925 silver / 6mm",
    purchasePriceCny: "12.50",
    moq: 3,
    estimatedShippingCny: "3.50",
    supportsDropshipping: true,
  });

  const firstScore = scoreCandidate(parsed, SCORING_CONFIG);
  const secondScore = scoreCandidate(parsed, SCORING_CONFIG);

  assert.deepEqual(firstScore, secondScore);
  assert.equal(firstScore.totalScore, 100);
  assert.equal(firstScore.landedUsdCents, 224);
  assert.equal(firstScore.suggestedRetailUsdCents, 600);
  assert.deepEqual(
    firstScore.reasons.map((reason) => ({
      code: reason.code,
      points: reason.points,
      maxPoints: reason.maxPoints,
    })),
    [
      { code: "LANDED_COST", points: 30, maxPoints: 30 },
      { code: "MOQ", points: 20, maxPoints: 20 },
      { code: "DROPSHIPPING", points: 20, maxPoints: 20 },
      { code: "COMPLETENESS", points: 20, maxPoints: 20 },
      { code: "COST_MOQ_COMBO", points: 10, maxPoints: 10 },
    ],
  );
});

test("scoreCandidate applies the fixed score buckets when cost, moq, and dropshipping are weaker", () => {
  const parsed = parseCandidateInput({
    "1688Url": "https://detail.1688.com/offer/99887766.html",
    supplierName: "Myth Factory",
    materialSpec: "alloy / 12mm",
    purchasePriceCny: "40.00",
    moq: 25,
    estimatedShippingCny: "10.00",
    supportsDropshipping: false,
  });

  const score = scoreCandidate(parsed, SCORING_CONFIG);

  assert.equal(score.totalScore, 42);
  assert.equal(score.landedUsdCents, 700);
  assert.equal(score.suggestedRetailUsdCents, 1800);
  assert.deepEqual(
    score.reasons.map((reason) => reason.points),
    [18, 4, 0, 20, 0],
  );
});

test("transitionCandidateStatus allows reviewed candidates to return to pending", () => {
  assert.equal(transitionCandidateStatus("PENDING", "APPROVED"), "APPROVED");
  assert.equal(transitionCandidateStatus("PENDING", "REJECTED"), "REJECTED");
  assert.equal(transitionCandidateStatus("APPROVED", "PENDING"), "PENDING");
  assert.equal(transitionCandidateStatus("REJECTED", "PENDING"), "PENDING");

  assert.throws(
    () => transitionCandidateStatus("PENDING", "PENDING"),
    /invalid candidate status transition/i,
  );
  assert.throws(
    () => transitionCandidateStatus("APPROVED", "APPROVED"),
    /invalid candidate status transition/i,
  );
  assert.throws(
    () => transitionCandidateStatus("REJECTED", "REJECTED"),
    /invalid candidate status transition/i,
  );
  assert.throws(
    () => transitionCandidateStatus("APPROVED", "REJECTED"),
    /invalid candidate status transition/i,
  );
  assert.throws(
    () => transitionCandidateStatus("REJECTED", "APPROVED"),
    /invalid candidate status transition/i,
  );
});
