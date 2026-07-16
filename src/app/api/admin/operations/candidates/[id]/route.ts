import { NextRequest, NextResponse } from "next/server";

import {
  CandidateNotFoundError,
  type CandidateCreateData,
  type CandidateRecord,
  type CandidateRepository,
  reviewSupplierCandidate,
} from "@/lib/operations/candidates";
import { type CandidateStatus } from "@/lib/operations/candidate-scoring";
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

function parseScoreReasons(value: string): unknown[] {
  try {
    const reasons = JSON.parse(value);
    return Array.isArray(reasons) ? reasons : [];
  } catch {
    return [];
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  let body: { status?: unknown; reviewNotes?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!CANDIDATE_STATUSES.includes(body.status as CandidateStatus)) {
    return NextResponse.json({ error: "Invalid candidate status." }, { status: 400 });
  }

  if (body.reviewNotes !== undefined && typeof body.reviewNotes !== "string") {
    return NextResponse.json({ error: "Review notes must be text." }, { status: 400 });
  }

  if (!body.reviewNotes?.trim()) {
    return NextResponse.json(
      { error: "Review notes are required for every candidate review." },
      { status: 400 },
    );
  }

  const { id } = await params;

  try {
    const candidate = await reviewSupplierCandidate(
      id,
      body.status as CandidateStatus,
      body.reviewNotes ?? "",
      getCandidateRepository(),
    );

    return NextResponse.json({
      ...candidate,
      scoreReasons: parseScoreReasons(candidate.scoreReasons),
    });
  } catch (error) {
    if (error instanceof CandidateNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    const message = error instanceof Error ? error.message : "Candidate review failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
