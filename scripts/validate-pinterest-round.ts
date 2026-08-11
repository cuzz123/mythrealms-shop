import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getStorefrontProducts } from "../src/lib/storefront/catalog";

export type PinterestCandidate = {
  roundId: string;
  canonicalProductId: string;
  canonicalPath: `/products/${string}`;
  assetPath: string;
  assetSha256: string;
  title: string;
  description: string;
  alt: string;
  cta: string;
  utm: {
    source: "pinterest";
    medium: "organic_social";
    campaign: string;
    content: string;
  };
  status: "candidate_internal";
};

export type ApprovedCopyDigestRegistry = Record<string, string>;

const approvedCta = "View the Maverenne edit";
const prohibitedCopyPatterns = [
  /\b(?:mythrealms|mythrealms-shop\.vercel\.app|price|handcrafted|free\s+shipping|shipping|material|in stock|inventory|limited edition|therapeutic|healing|medical|guarantee(?:d)?|effective(?:ness)?)\b/i,
  /(?:[$€£¥₹₩]\s*\d+(?:[.,]\d{1,2})?|\b(?:usd|eur|gbp|jpy|cny|rmb|cad|aud|nzd|chf|hkd|sgd|krw|inr)\s*\d+(?:[.,]\d{1,2})?\b|\b\d+(?:[.,]\d{1,2})?\s*(?:usd|eur|gbp|jpy|cny|rmb|cad|aud|nzd|chf|hkd|sgd|krw|inr)\b)/i,
  /\b(?:gold|silver|platinum|palladium|titanium|stainless\s+steel|steel|brass|bronze|copper|zinc|nickel|aluminum|alloy|vermeil|rhodium|ceramic|resin|acrylic|glass|enamel|leather|silk|nylon|cotton|polyester|wood|shell|pearl|mother[- ]of[- ]pearl|jade|crystal|gemstone|diamond)\b/i,
];
const normalized = (value: string) => value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "");
const normalizeApprovedCopyField = (value: string) => value
  .normalize("NFKC")
  .trim()
  .toLocaleLowerCase()
  .replace(/\s+/g, " ");

function approvedCopyDigest(candidate: PinterestCandidate): string {
  const approvedCopy = [candidate.title, candidate.description, candidate.alt, candidate.cta]
    .map(normalizeApprovedCopyField)
    .join("\n");
  return createHash("sha256").update(approvedCopy).digest("hex");
}

function hashAsset(assetPath: string): string | undefined {
  if (!assetPath.startsWith("/images/products/") || assetPath.includes("..")) return undefined;
  const localPath = path.join(process.cwd(), "public", assetPath);
  if (!existsSync(localPath)) return undefined;
  return createHash("sha256").update(readFileSync(localPath)).digest("hex");
}

function duplicateErrors(candidates: PinterestCandidate[], field: keyof PinterestCandidate): string[] {
  const seen = new Map<string, number>();
  const errors: string[] = [];
  for (const [index, candidate] of candidates.entries()) {
    const raw = candidate[field];
    const value = typeof raw === "string" && ["title", "description", "alt"].includes(field)
      ? normalized(raw)
      : raw;
    if (typeof value !== "string") continue;
    const first = seen.get(value);
    if (first === undefined) {
      seen.set(value, index);
      continue;
    }
    errors.push(`candidate ${index + 1} duplicates ${String(field)} from candidate ${first + 1}`);
  }
  return errors;
}

export function validatePinterestRound(
  candidates: PinterestCandidate[],
  approvedCopyDigests: ApprovedCopyDigestRegistry,
): string[] {
  const errors: string[] = [];
  const catalogById = new Map(getStorefrontProducts().map((product) => [product.id, product]));
  const candidateIds = new Set(candidates.map((candidate) => candidate.canonicalProductId));
  const registryIds = Object.keys(approvedCopyDigests);
  if (candidates.length !== 12) {
    errors.push(`Pinterest round must contain exactly 12 candidates; found ${candidates.length}`);
  }
  if (new Set(candidates.map((candidate) => candidate.roundId)).size !== 1) {
    errors.push("Pinterest round must use one identical roundId across all candidates");
  }
  if (registryIds.length !== 12) {
    errors.push(`Approved-copy registry must contain exactly 12 entries; found ${registryIds.length}`);
  }
  for (const registryId of registryIds) {
    if (!candidateIds.has(registryId)) errors.push(`Approved-copy registry contains extra product ${registryId}`);
    if (!/^[a-f0-9]{64}$/.test(approvedCopyDigests[registryId])) {
      errors.push(`Approved-copy registry digest for ${registryId} must be lowercase SHA-256`);
    }
  }

  for (const [index, candidate] of candidates.entries()) {
    const label = `candidate ${index + 1}`;
    const product = catalogById.get(candidate.canonicalProductId);
    if (!product) errors.push(`${label} canonicalProductId is not an approved storefront product`);
    if (product && candidate.canonicalPath !== `/products/${product.slug}`) {
      errors.push(`${label} canonicalPath does not match canonicalProductId`);
    }
    if (product && candidate.assetPath !== product.imageRoles?.primary) {
      errors.push(`${label} assetPath must use the product's approved primary asset`);
    }
    if (!/^maverenne-2026-08-10-round-\d{2}$/.test(candidate.roundId)) {
      errors.push(`${label} roundId must use the Maverenne 2026-08-10 round format`);
    }
    if (candidate.status !== "candidate_internal") errors.push(`${label} status must be candidate_internal`);
    if (candidate.cta !== approvedCta) errors.push(`${label} CTA must use the approved internal CTA`);
    const expectedCopyDigest = approvedCopyDigests[candidate.canonicalProductId];
    if (!expectedCopyDigest) {
      errors.push(`${label} is missing from the approved-copy registry`);
    } else if (approvedCopyDigest(candidate) !== expectedCopyDigest) {
      errors.push(`${label} approved-copy digest mismatch`);
    }

    for (const field of ["title", "description", "alt"] as const) {
      if (!candidate[field]?.trim()) errors.push(`${label} ${field} must be non-empty`);
      if (prohibitedCopyPatterns.some((pattern) => pattern.test(candidate[field]))) {
        errors.push(`${label} ${field} contains prohibited copy`);
      }
    }

    const actualHash = hashAsset(candidate.assetPath);
    if (!actualHash) errors.push(`${label} assetPath must reference an existing approved product image`);
    if (actualHash && candidate.assetSha256 !== actualHash) errors.push(`${label} assetSha256 does not match assetPath`);

    if (candidate.utm.source !== "pinterest") errors.push(`${label} UTM source must be pinterest`);
    if (candidate.utm.medium !== "organic_social") errors.push(`${label} UTM medium must be organic_social`);
    if (!/^maverenne-[a-z0-9]+(?:-[a-z0-9]+)*-2026-08-10$/.test(candidate.utm.campaign)) {
      errors.push(`${label} UTM campaign must follow maverenne-<theme>-2026-08-10`);
    }
    if (!/^pin-[a-z0-9]+-[a-z0-9]+-v\d{2}$/.test(candidate.utm.content)) {
      errors.push(`${label} UTM content must follow pin-<account>-<asset>-vNN`);
    }
  }

  for (const field of ["canonicalProductId", "title", "description", "alt", "assetSha256", "canonicalPath"] as const) {
    errors.push(...duplicateErrors(candidates, field));
  }
  return errors;
}

function readRound(filePath: string): PinterestCandidate[] {
  const parsed: unknown = JSON.parse(readFileSync(filePath, "utf8"));
  if (!Array.isArray(parsed)) throw new Error("Pinterest round JSON must be an array of candidates");
  return parsed as PinterestCandidate[];
}

function readApprovedCopyDigests(filePath: string): ApprovedCopyDigestRegistry {
  const parsed: unknown = JSON.parse(readFileSync(filePath, "utf8"));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Approved-copy digest registry must be an object keyed by canonicalProductId");
  }
  return parsed as ApprovedCopyDigestRegistry;
}

function main(): void {
  const requestedPath = process.argv[2];
  if (!requestedPath) {
    console.error("Usage: node --import tsx scripts/validate-pinterest-round.ts <round.json>");
    process.exitCode = 1;
    return;
  }

  const roundPath = path.resolve(process.cwd(), requestedPath);
  const registryPath = roundPath.replace(/\.json$/i, ".approved-copy-digests.json");
  const candidates = readRound(roundPath);
  const approvedCopyDigests = readApprovedCopyDigests(registryPath);
  const errors = validatePinterestRound(candidates, approvedCopyDigests);
  if (errors.length) {
    console.error(`Pinterest round validation failed:\n- ${errors.join("\n- ")}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Pinterest round validation passed: ${candidates.length} unique internal candidates.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
