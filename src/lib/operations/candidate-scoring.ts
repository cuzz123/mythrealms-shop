export type CandidateStatus = "PENDING" | "APPROVED" | "REJECTED";

type CandidateMoneyInput = number | string;

export interface CandidateInputValue {
  "1688Url": string;
  supplierName: string;
  materialSpec: string;
  purchasePriceCny: CandidateMoneyInput;
  moq: number | string;
  estimatedShippingCny: CandidateMoneyInput;
  supportsDropshipping: boolean | "true" | "false";
}

export interface ParsedCandidateInput {
  "1688Url": string;
  supplierName: string;
  materialSpec: string;
  purchasePriceCny: number;
  moq: number;
  estimatedShippingCny: number;
  supportsDropshipping: boolean;
}

export interface CandidateScoringConfig {
  cnyToUsdRate: number;
  targetGrossMargin: number;
}

export type CandidateScoreReasonCode =
  | "LANDED_COST"
  | "MOQ"
  | "DROPSHIPPING"
  | "COMPLETENESS"
  | "COST_MOQ_COMBO";

export interface CandidateScoreReason {
  code: CandidateScoreReasonCode;
  label: string;
  points: number;
  maxPoints: number;
  detail: string;
}

export interface CandidateScoreResult {
  totalScore: number;
  landedUsdCents: number;
  suggestedRetailUsdCents: number;
  reasons: CandidateScoreReason[];
}

const VALID_HOSTS = new Set(["1688.com", "alibaba.com"]);

export function parseCandidateInput(
  value: CandidateInputValue,
): ParsedCandidateInput {
  const normalizedUrl = normalizeCandidateUrl(value["1688Url"]);
  const supplierName = normalizeRequiredText(value.supplierName, "supplier name");
  const materialSpec = normalizeRequiredText(value.materialSpec, "material spec");

  return {
    "1688Url": normalizedUrl,
    supplierName,
    materialSpec,
    purchasePriceCny: parseMoneyToFen(value.purchasePriceCny, "purchase price"),
    moq: parsePositiveInteger(value.moq, "moq"),
    estimatedShippingCny: parseMoneyToFen(
      value.estimatedShippingCny,
      "estimated shipping",
    ),
    supportsDropshipping: parseBooleanFlag(
      value.supportsDropshipping,
      "supportsDropshipping",
    ),
  };
}

export function scoreCandidate(
  candidate: ParsedCandidateInput,
  config: CandidateScoringConfig,
): CandidateScoreResult {
  validateScoringConfig(config);

  const landedCnyFen =
    candidate.purchasePriceCny + candidate.estimatedShippingCny;
  const landedUsdCents = Math.round(landedCnyFen * config.cnyToUsdRate);
  const suggestedRetailUsdCents =
    Math.ceil(
      landedUsdCents / 100 / (1 - config.targetGrossMargin),
    ) * 100;

  const reasons: CandidateScoreReason[] = [
    buildReason(
      "LANDED_COST",
      "到岸成本",
      scoreLandedCost(landedUsdCents),
      30,
      `Landed cost is $${formatUsd(landedUsdCents)}.`,
    ),
    buildReason(
      "MOQ",
      "起订量",
      scoreMoq(candidate.moq),
      20,
      `MOQ is ${candidate.moq}.`,
    ),
    buildReason(
      "DROPSHIPPING",
      "一件代发",
      candidate.supportsDropshipping ? 20 : 0,
      20,
      candidate.supportsDropshipping
        ? "Supplier supports dropshipping."
        : "Supplier does not support dropshipping.",
    ),
    buildReason(
      "COMPLETENESS",
      "资料完整度",
      20,
      20,
      "All required supplier candidate fields are present.",
    ),
    buildReason(
      "COST_MOQ_COMBO",
      "低成本低 MOQ 组合奖励",
      scoreCostMoqCombo(landedUsdCents, candidate.moq),
      10,
      `Combo evaluated from landed cost $${formatUsd(landedUsdCents)} and MOQ ${candidate.moq}.`,
    ),
  ];

  return {
    totalScore: reasons.reduce((sum, reason) => sum + reason.points, 0),
    landedUsdCents,
    suggestedRetailUsdCents,
    reasons,
  };
}

export function transitionCandidateStatus(
  from: CandidateStatus,
  to: CandidateStatus,
): CandidateStatus {
  if (from === "PENDING" && (to === "APPROVED" || to === "REJECTED")) {
    return to;
  }

  if (
    (from === "APPROVED" || from === "REJECTED") &&
    to === "PENDING"
  ) {
    return to;
  }

  throw new Error(`Invalid candidate status transition: ${from} -> ${to}`);
}

function normalizeCandidateUrl(value: string): string {
  let parsed: URL;

  try {
    parsed = new URL(value);
  } catch {
    throw new Error("Candidate URL must be a valid http(s) 1688.com or alibaba.com URL.");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Candidate URL must use http or https on 1688.com or alibaba.com.");
  }

  const hostname = parsed.hostname.toLowerCase();
  const isAllowedHost =
    VALID_HOSTS.has(hostname) ||
    Array.from(VALID_HOSTS).some((host) => hostname.endsWith(`.${host}`));

  if (!isAllowedHost) {
    throw new Error("Candidate URL must target 1688.com or alibaba.com.");
  }

  return parsed.toString();
}

function normalizeRequiredText(value: string, fieldName: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required.`);
  }

  return normalized;
}

function parseMoneyToFen(value: CandidateMoneyInput, fieldName: string): number {
  const normalized = normalizeMoneyInput(value, fieldName);
  const matches = normalized.match(/^\d+(?:\.\d{1,2})?$/);

  if (!matches) {
    throw new Error(`${fieldName} must be a non-negative amount with up to 2 decimals.`);
  }

  const [wholePart, fractionalPart = ""] = normalized.split(".");
  const fen = Number.parseInt(wholePart, 10) * 100 +
    Number.parseInt((fractionalPart + "00").slice(0, 2), 10);

  if (!Number.isSafeInteger(fen)) {
    throw new Error(`${fieldName} is too large.`);
  }

  return fen;
}

function normalizeMoneyInput(
  value: CandidateMoneyInput,
  fieldName: string,
): string {
  if (typeof value === "number") {
    if (!Number.isFinite(value) || value < 0) {
      throw new Error(`${fieldName} must be a non-negative amount with up to 2 decimals.`);
    }

    const normalized = value.toString();

    if (/e/i.test(normalized)) {
      throw new Error(`${fieldName} must be a non-negative amount with up to 2 decimals.`);
    }

    return normalized;
  }

  return value.trim();
}

function parsePositiveInteger(value: number | string, fieldName: string): number {
  const normalized = typeof value === "number" ? value.toString() : value.trim();

  if (!/^[1-9]\d*$/.test(normalized)) {
    throw new Error(`${fieldName} must be a positive integer.`);
  }

  const parsed = Number.parseInt(normalized, 10);

  if (!Number.isSafeInteger(parsed)) {
    throw new Error(`${fieldName} is too large.`);
  }

  return parsed;
}

function parseBooleanFlag(
  value: boolean | "true" | "false",
  fieldName: string,
): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new Error(`${fieldName} must be a boolean.`);
}

function validateScoringConfig(config: CandidateScoringConfig): void {
  if (!(config.cnyToUsdRate > 0)) {
    throw new Error("cnyToUsdRate must be greater than 0.");
  }

  if (!(config.targetGrossMargin > 0 && config.targetGrossMargin < 1)) {
    throw new Error("targetGrossMargin must be between 0 and 1.");
  }
}

function buildReason(
  code: CandidateScoreReasonCode,
  label: string,
  points: number,
  maxPoints: number,
  detail: string,
): CandidateScoreReason {
  return {
    code,
    label,
    points,
    maxPoints,
    detail,
  };
}

function scoreLandedCost(landedUsdCents: number): number {
  if (landedUsdCents <= 300) {
    return 30;
  }

  if (landedUsdCents <= 500) {
    return 24;
  }

  if (landedUsdCents <= 800) {
    return 18;
  }

  if (landedUsdCents <= 1200) {
    return 12;
  }

  if (landedUsdCents <= 1800) {
    return 6;
  }

  return 0;
}

function scoreMoq(moq: number): number {
  if (moq <= 3) {
    return 20;
  }

  if (moq <= 5) {
    return 16;
  }

  if (moq <= 10) {
    return 12;
  }

  if (moq <= 20) {
    return 8;
  }

  if (moq <= 50) {
    return 4;
  }

  return 0;
}

function scoreCostMoqCombo(landedUsdCents: number, moq: number): number {
  if (landedUsdCents <= 500 && moq <= 5) {
    return 10;
  }

  if (landedUsdCents <= 800 && moq <= 10) {
    return 5;
  }

  return 0;
}

function formatUsd(cents: number): string {
  return (cents / 100).toFixed(2);
}
