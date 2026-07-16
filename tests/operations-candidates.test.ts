import assert from "node:assert/strict";
import test from "node:test";

import {
  CandidateConflictError,
  CandidateNotFoundError,
  CandidateReviewNotesError,
  createSupplierCandidate,
  reviewSupplierCandidate,
  type CandidateRepository,
} from "../src/lib/operations/candidates";

type StoredCandidate = {
  id: string;
  candidateUrl: string;
  supplierName: string;
  material: string;
  purchasePriceCents: number;
  moq: number;
  estimatedShippingCents: number;
  dropshipAvailable: boolean;
  score: number;
  scoreReasons: string;
  suggestedRetailPriceCents: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewNotes: string | null;
};

function createRepository(): CandidateRepository<StoredCandidate> & {
  records: StoredCandidate[];
} {
  const records: StoredCandidate[] = [];

  return {
    records,
    findByCandidateUrl: async (candidateUrl) =>
      records.find((candidate) => candidate.candidateUrl === candidateUrl) ?? null,
    findById: async (id) => records.find((candidate) => candidate.id === id) ?? null,
    create: async (data) => {
      const candidate: StoredCandidate = {
        id: `candidate-${records.length + 1}`,
        ...data,
        status: "PENDING",
        reviewNotes: null,
      };
      records.push(candidate);
      return candidate;
    },
    update: async (id, data) => {
      const candidate = records.find((record) => record.id === id);
      assert.ok(candidate);
      Object.assign(candidate, data);
      return candidate;
    },
  };
}

const scoringConfig = {
  cnyToUsdRate: 0.14,
  targetGrossMargin: 0.7,
};

const candidateInput = {
  "1688Url": "https://detail.1688.com/offer/123456.html",
  supplierName: "Myth Factory",
  materialSpec: "925 silver / 6mm",
  purchasePriceCny: "12.50",
  moq: 3,
  estimatedShippingCny: "3.50",
  supportsDropshipping: true,
};

test("creates a pending candidate with calculated pricing and no Product side effect", async () => {
  const repository = createRepository();

  const candidate = await createSupplierCandidate(
    candidateInput,
    scoringConfig,
    repository,
  );

  assert.equal(candidate.status, "PENDING");
  assert.equal(candidate.candidateUrl, candidateInput["1688Url"]);
  assert.equal(candidate.score, 100);
  assert.match(candidate.scoreReasons, /LANDED_COST/);
  assert.equal(candidate.suggestedRetailPriceCents, 800);
  assert.equal(repository.records.length, 1);
  assert.equal("productId" in candidate, false);
});

test("rejects duplicate candidate links before creating another record", async () => {
  const repository = createRepository();
  await createSupplierCandidate(candidateInput, scoringConfig, repository);

  await assert.rejects(
    () => createSupplierCandidate(candidateInput, scoringConfig, repository),
    CandidateConflictError,
  );
  assert.equal(repository.records.length, 1);
});

test("records review notes and permits returning an approved candidate to pending", async () => {
  const repository = createRepository();
  const candidate = await createSupplierCandidate(
    candidateInput,
    scoringConfig,
    repository,
  );

  const approved = await reviewSupplierCandidate(
    candidate.id,
    "APPROVED",
    "margin looks viable",
    repository,
  );
  assert.equal(approved.status, "APPROVED");
  assert.equal(approved.reviewNotes, "margin looks viable");

  const reopened = await reviewSupplierCandidate(
    candidate.id,
    "PENDING",
    "verify supplier response",
    repository,
  );

  assert.equal(reopened.status, "PENDING");
  assert.equal(reopened.reviewNotes, "verify supplier response");
});

test("does not review candidates that do not exist", async () => {
  const repository = createRepository();

  await assert.rejects(
    () => reviewSupplierCandidate("missing", "APPROVED", "", repository),
    CandidateNotFoundError,
  );
});

test("requires an audit note when approving or rejecting a candidate", async () => {
  const repository = createRepository();
  const candidate = await createSupplierCandidate(
    candidateInput,
    scoringConfig,
    repository,
  );

  await assert.rejects(
    () => reviewSupplierCandidate(candidate.id, "APPROVED", "  ", repository),
    CandidateReviewNotesError,
  );
});
