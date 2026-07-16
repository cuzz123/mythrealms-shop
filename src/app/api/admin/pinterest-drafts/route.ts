import { PinterestDraftStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/server/admin-auth";
import { db } from "@/lib/db";
import {
  createPinterestDraft,
  serializePinterestDraft,
} from "@/lib/pinterest-drafts";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const validStatuses = new Set(Object.values(PinterestDraftStatus));

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const status = request.nextUrl.searchParams.get("status");
  const where = status && validStatuses.has(status as PinterestDraftStatus)
    ? { status: status as PinterestDraftStatus }
    : undefined;

  try {
    const drafts = await db.pinterestContentDraft.findMany({
      where,
      orderBy: [{ scheduledFor: "asc" }, { updatedAt: "desc" }],
      take: 60,
    });

    return NextResponse.json({ drafts: drafts.map(serializePinterestDraft) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load Pinterest drafts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const body = await readJson(request);
    const productSlug = readText(body.productSlug, 160);
    const mood = readText(body.mood, 80);
    const result = await createPinterestDraft({ productSlug, mood });

    return NextResponse.json(
      { draft: serializePinterestDraft(result.draft), created: result.created },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create Pinterest draft" },
      { status: 500 }
    );
  }
}

function readText(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const text = value.trim().slice(0, maxLength);
  return text || undefined;
}

async function readJson(request: NextRequest): Promise<Record<string, unknown>> {
  try {
    const value = await request.json();
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}
