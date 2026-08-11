import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  validatePinterestRound,
  type PinterestCandidate,
} from "../scripts/validate-pinterest-round";

const assetPath = "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-01-hero.png";
const assetSha256 = createHash("sha256")
  .update(readFileSync(path.join(process.cwd(), "public", assetPath)))
  .digest("hex");
const roundPath = path.join(
  process.cwd(),
  "content/pin-library/maverenne-2026-08-10-round-01.json",
);
const roundCandidates = JSON.parse(readFileSync(roundPath, "utf8")) as PinterestCandidate[];
const registryPath = path.join(
  process.cwd(),
  "content/pin-library/maverenne-2026-08-10-round-01.approved-copy-digests.json",
);
const approvedCopyDigests = JSON.parse(
  readFileSync(registryPath, "utf8"),
) as Record<string, string>;
const validateWithRegistry = validatePinterestRound;

function candidate(overrides: Partial<PinterestCandidate> = {}): PinterestCandidate {
  return {
    roundId: "maverenne-2026-08-10-round-01",
    canonicalProductId: "1688-001",
    canonicalPath: "/products/pearl-series-01",
    assetPath,
    assetSha256,
    title: "The Calm Tide Ring",
    description: "A ring shown with a rounded central form and a quiet, close-up styling view.",
    alt: "Close-up product image of the Calm Tide ring against a pale background.",
    cta: "View the Maverenne edit",
    utm: {
      source: "pinterest",
      medium: "organic_social",
      campaign: "maverenne-pearl-edit-2026-08-10",
      content: "pin-internal-001-v01",
    },
    status: "candidate_internal",
    ...overrides,
  };
}

test("Pinterest round validator accepts the real 12-record artifact with one shared round ID", () => {
  assert.equal(roundCandidates.length, 12);
  assert.equal(new Set(roundCandidates.map((entry) => entry.roundId)).size, 1);
  assert.deepEqual(validateWithRegistry(roundCandidates, approvedCopyDigests), []);
});

test("Pinterest round validator rejects every selected-pin uniqueness collision", () => {
  const baseline = candidate();
  const cases: Array<[string, Partial<PinterestCandidate>, RegExp]> = [
    ["canonical product", { canonicalProductId: baseline.canonicalProductId, canonicalPath: "/products/pearl-series-02", title: "The Still Point Ring", description: "A ring shown in a separate close-up view.", alt: "Close-up product image of the Still Point ring." }, /canonicalProductId/i],
    ["normalized title", { canonicalProductId: "1688-002", canonicalPath: "/products/pearl-series-02", title: "  the calm-tide ring ", description: "A ring shown in a separate close-up view.", alt: "Close-up product image of the Still Point ring.", assetPath: "/images/products/1688-shop/pearl-series/pearl-series-02-editorial-v1-01-hero.png", assetSha256: createHash("sha256").update(readFileSync(path.join(process.cwd(), "public", "/images/products/1688-shop/pearl-series/pearl-series-02-editorial-v1-01-hero.png"))).digest("hex") }, /title/i],
    ["description", { canonicalProductId: "1688-003", canonicalPath: "/products/pearl-series-03", title: "The Quiet Centre Ring", description: baseline.description, alt: "Close-up product image of the Quiet Centre ring.", assetPath: "/images/products/1688-shop/pearl-series/pearl-series-03-editorial-v1-01-hero.png", assetSha256: createHash("sha256").update(readFileSync(path.join(process.cwd(), "public", "/images/products/1688-shop/pearl-series/pearl-series-03-editorial-v1-01-hero.png"))).digest("hex") }, /description/i],
    ["alt", { canonicalProductId: "1688-004", canonicalPath: "/products/pearl-series-04", title: "The Deep Peace Set", description: "A paired set shown in a separate close-up view.", alt: baseline.alt, assetPath: "/images/products/1688-shop/pearl-series/pearl-series-04-editorial-v1-01-hero.png", assetSha256: createHash("sha256").update(readFileSync(path.join(process.cwd(), "public", "/images/products/1688-shop/pearl-series/pearl-series-04-editorial-v1-01-hero.png"))).digest("hex") }, /alt/i],
    ["asset SHA", { canonicalProductId: "1688-005", canonicalPath: "/products/pearl-series-05", title: "The First Light Bracelet", description: "A bracelet shown in a separate close-up view.", alt: "Close-up product image of the First Light bracelet.", assetSha256: baseline.assetSha256 }, /assetSha256/i],
    ["canonical path", { canonicalProductId: "1688-006", canonicalPath: baseline.canonicalPath, title: "The Inner Tide Bracelet", description: "A bracelet shown in a separate close-up view.", alt: "Close-up product image of the Inner Tide bracelet.", assetPath: "/images/products/1688-shop/pearl-series/pearl-series-06-editorial-v1-01-hero.png", assetSha256: createHash("sha256").update(readFileSync(path.join(process.cwd(), "public", "/images/products/1688-shop/pearl-series/pearl-series-06-editorial-v1-01-hero.png"))).digest("hex") }, /canonicalPath/i],
  ];

  for (const [label, overrides, message] of cases) {
    const errors = validateWithRegistry([baseline, candidate(overrides)], approvedCopyDigests);
    assert.ok(errors.some((error) => message.test(error)), `expected ${label} collision`);
  }
});

test("Pinterest round validator rejects prohibited copy and an invalid canonical UTM contract", () => {
  const invalid = candidate({
    title: "Handcrafted ring for $50",
    description: "Guaranteed therapeutic styling with free shipping and limited inventory.",
    alt: "MythRealms product image in gold material.",
    utm: {
      source: "instagram",
      medium: "organic",
      campaign: "maverenne-pearl-edit-2026-08-09",
      content: "pin-public-001-v01",
    } as unknown as PinterestCandidate["utm"],
  });

  const errors = validateWithRegistry([invalid], approvedCopyDigests);
  assert.ok(errors.some((error) => /prohibited/i.test(error)));
  assert.ok(errors.some((error) => /utm/i.test(error)));
});

test("Pinterest round validator rejects varied currency amounts and material claims", () => {
  for (const prohibitedPhrase of [
    "$50", "€50", "£50", "¥50", "USD 50", "50 EUR", "GBP 50", "50 GBP",
    "titanium", "platinum", "sterling silver", "14k gold", "copper", "alloy",
    "resin", "glass", "leather", "pearl", "diamond",
  ]) {
    const errors = validateWithRegistry([candidate({
      description: `A close styling view with ${prohibitedPhrase}.`,
    })], approvedCopyDigests);
    assert.ok(
      errors.some((error) => /prohibited/i.test(error)),
      `expected ${prohibitedPhrase} to be rejected`,
    );
  }
});

test("Pinterest round validator requires exactly 12 candidates from one round", () => {
  const wrongRound = roundCandidates.map((entry) => ({ ...entry }));
  wrongRound[11].roundId = "maverenne-2026-08-10-round-02";

  assert.ok(
    validateWithRegistry(roundCandidates.slice(0, 11), approvedCopyDigests).some((error) => /exactly 12/i.test(error)),
  );
  assert.ok(
    validateWithRegistry(wrongRound, approvedCopyDigests).some((error) => /one identical roundId/i.test(error)),
  );
});

test("Pinterest round validator rejects a valid local image that is not the product's approved primary asset", () => {
  const detailPath = "/images/products/1688-shop/pearl-series/pearl-series-01-editorial-v1-02-macro.png";
  const errors = validateWithRegistry([candidate({
    assetPath: detailPath,
    assetSha256: createHash("sha256")
      .update(readFileSync(path.join(process.cwd(), "public", detailPath)))
      .digest("hex"),
  })], approvedCopyDigests);

  assert.ok(errors.some((error) => /approved primary asset/i.test(error)));
});

test("reviewed-copy digests reject unknown material, written price, and arbitrary text mutations", () => {
  for (const mutation of ["tungsten", "fifty dollars", "arbitrary new text"]) {
    const changed = roundCandidates.map((entry, index) => index === 0
      ? { ...entry, description: `${entry.description} ${mutation}` }
      : { ...entry });
    const errors = validateWithRegistry(changed, approvedCopyDigests);
    assert.ok(
      errors.some((error) => /prohibited|digest mismatch/i.test(error)),
      `expected reviewed-copy gate to reject ${mutation}`,
    );
  }
});

test("reviewed-copy registry must contain exactly the 12 artifact product IDs with no extras", () => {
  const missing = { ...approvedCopyDigests };
  delete missing["1688-012"];
  const extra = { ...approvedCopyDigests, "1688-999": "0".repeat(64) };

  assert.ok(validateWithRegistry(roundCandidates, missing).some((error) => /registry.*12|missing/i.test(error)));
  assert.ok(validateWithRegistry(roundCandidates, extra).some((error) => /registry.*12|extra/i.test(error)));
});
