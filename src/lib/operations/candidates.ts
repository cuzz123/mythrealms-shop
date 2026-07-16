import {
  type CandidateInputValue,
  type CandidateScoringConfig,
  type CandidateStatus,
  parseCandidateInput,
  scoreCandidate,
  transitionCandidateStatus,
} from "./candidate-scoring";

export type CandidateCreateData = {
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
};

export type CandidateReviewData = {
  status: CandidateStatus;
  reviewNotes: string | null;
};

export type CandidateRecord = CandidateCreateData & {
  id: string;
  status: CandidateStatus;
  reviewNotes: string | null;
};

export interface CandidateRepository<T extends CandidateRecord> {
  findByCandidateUrl(candidateUrl: string): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  create(data: CandidateCreateData): Promise<T>;
  update(id: string, data: CandidateReviewData): Promise<T>;
}

export class CandidateConflictError extends Error {
  constructor() {
    super("A candidate already exists for this source URL.");
    this.name = "CandidateConflictError";
  }
}

export class CandidateNotFoundError extends Error {
  constructor() {
    super("Supplier candidate was not found.");
    this.name = "CandidateNotFoundError";
  }
}

export class CandidateReviewNotesError extends Error {
  constructor() {
    super("Review notes are required for every candidate review.");
    this.name = "CandidateReviewNotesError";
  }
}

function normalizeReviewNotes(value: string): string | null {
  const notes = value.trim();
  return notes || null;
}

export async function createSupplierCandidate<T extends CandidateRecord>(
  input: CandidateInputValue,
  config: CandidateScoringConfig,
  repository: CandidateRepository<T>,
): Promise<T> {
  const candidate = parseCandidateInput(input);
  const existing = await repository.findByCandidateUrl(candidate["1688Url"]);

  if (existing) {
    throw new CandidateConflictError();
  }

  const score = scoreCandidate(candidate, config);

  return repository.create({
    candidateUrl: candidate["1688Url"],
    supplierName: candidate.supplierName,
    material: candidate.materialSpec,
    purchasePriceCents: candidate.purchasePriceCny,
    moq: candidate.moq,
    estimatedShippingCents: candidate.estimatedShippingCny,
    dropshipAvailable: candidate.supportsDropshipping,
    score: score.totalScore,
    scoreReasons: JSON.stringify(score.reasons),
    suggestedRetailPriceCents: score.suggestedRetailUsdCents,
  });
}

export async function reviewSupplierCandidate<T extends CandidateRecord>(
  id: string,
  status: CandidateStatus,
  reviewNotes: string,
  repository: CandidateRepository<T>,
): Promise<T> {
  const candidate = await repository.findById(id);

  if (!candidate) {
    throw new CandidateNotFoundError();
  }

  if (!reviewNotes.trim()) {
    throw new CandidateReviewNotesError();
  }

  return repository.update(id, {
    status: transitionCandidateStatus(candidate.status, status),
    reviewNotes: normalizeReviewNotes(reviewNotes),
  });
}
