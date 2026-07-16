import { NextRequest, NextResponse } from "next/server";

import {
  CandidateConflictError,
  type CandidateCreateData,
  type CandidateRecord,
  type CandidateRepository,
  createSupplierCandidate,
} from "@/lib/operations/candidates";
import {
  type CandidateInputValue,
  type CandidateStatus,
} from "@/lib/operations/candidate-scoring";
import { getOperationsSourcingConfig } from "@/lib/operations/config";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/server/admin-auth";

const CANDIDATE_STATUSES: CandidateStatus[] = [
  "PENDING",
  "APPROVED",
  "REJECTED",
];

function getCandidateRepository(): CandidateRepository<CandidateRecord> {
  return {
    findByCandidateUrl: (candidateUrl) =>
      db.supplierCandidate.findUnique({ where: { candidateUrl } }),
    findById: (id) => db.supplierCandidate.findUnique({ where: { id } }),
    create: (data: CandidateCreateData) =>
      db.supplierCandidate.create({ data }),
    update: (id, data) => db.supplierCandidate.update({ where: { id }, data }),
  };
}

function parseCandidateInputBody(value: unknown): CandidateInputValue {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Candidate input must be a JSON object.");
  }

  const body = value as Record<string, unknown>;

  return {
    "1688Url": body["1688Url"] as string,
    supplierName: body.supplierName as string,
    materialSpec: body.materialSpec as string,
    purchasePriceCny: body.purchasePriceCny as number | string,
    moq: body.moq as number | string,
    estimatedShippingCny: body.estimatedShippingCny as number | string,
    supportsDropshipping: body.supportsDropshipping as boolean | "true" | "false",
  };
}

function parseScoreReasons(value: string): unknown[] {
  try {
    const reasons = JSON.parse(value);
    return Array.isArray(reasons) ? reasons : [];
  } catch {
    return [];
  }
}

function serializeCandidate(candidate: CandidateRecord) {
  return {
    ...candidate,
    scoreReasons: parseScoreReasons(candidate.scoreReasons),
  };
}

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const statusParam = request.nextUrl.searchParams.get("status");
  const status = CANDIDATE_STATUSES.includes(statusParam as CandidateStatus)
    ? (statusParam as CandidateStatus)
    : undefined;
  const sort = request.nextUrl.searchParams.get("sort");
  const orderBy = sort === "newest"
    ? [{ createdAt: "desc" as const }]
    : [{ score: "desc" as const }, { createdAt: "desc" as const }];

  const candidates = await db.supplierCandidate.findMany({
    where: status ? { status } : undefined,
    orderBy,
  });

  return NextResponse.json(candidates.map(serializeCandidate));
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const candidate = await createSupplierCandidate(
      parseCandidateInputBody(body),
      getOperationsSourcingConfig(),
      getCandidateRepository(),
    );

    return NextResponse.json(serializeCandidate(candidate), { status: 201 });
  } catch (error) {
    if (error instanceof CandidateConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    const message = error instanceof Error ? error.message : "Candidate creation failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
