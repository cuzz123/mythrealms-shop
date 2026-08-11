import { PinterestDraftStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/server/admin-auth";
import { db } from "@/lib/db";
import {
  serializePinterestDraft,
} from "@/lib/pinterest-drafts";
import {
  getPinterestPublishBlock,
  PINTEREST_PUBLISHING_DISABLED_STATUS,
} from "@/lib/pinterest-publisher";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

type RouteContext = { params: Promise<{ id: string }> };
type DraftAction = "save" | "approve" | "reject" | "publish" | "retry";

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const body = await readJson(request);
  const action = body.action as DraftAction | undefined;

  if (action === "publish" || action === "retry") {
    return NextResponse.json(
      getPinterestPublishBlock(action === "publish" ? "admin_publish" : "admin_retry"),
      { status: PINTEREST_PUBLISHING_DISABLED_STATUS },
    );
  }

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  if (!action || !["save", "approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Unsupported draft action" }, { status: 400 });
  }

  const { id } = await params;

  try {
    if (action === "reject") {
      const rejected = await db.pinterestContentDraft.updateMany({
        where: {
          id,
          status: { in: [PinterestDraftStatus.DRAFT, PinterestDraftStatus.APPROVED, PinterestDraftStatus.FAILED] },
        },
        data: { status: PinterestDraftStatus.REJECTED, error: null },
      });
      if (rejected.count === 0) {
        return NextResponse.json({ error: "This draft cannot be rejected" }, { status: 409 });
      }

      const draft = await db.pinterestContentDraft.findUnique({ where: { id } });
      if (!draft) return NextResponse.json({ error: "Pinterest draft not found" }, { status: 404 });
      return NextResponse.json({ draft: serializePinterestDraft(draft) });
    }

    const fields = parseEditableFields(body);
    if ("error" in fields) return NextResponse.json({ error: fields.error }, { status: 400 });

    if (action === "approve") {
      const approved = await db.pinterestContentDraft.updateMany({
        where: { id, status: { in: [PinterestDraftStatus.DRAFT, PinterestDraftStatus.FAILED] } },
        data: { ...fields, status: PinterestDraftStatus.APPROVED, error: null },
      });
      if (approved.count === 0) {
        return NextResponse.json({ error: "Only draft or failed items can be approved" }, { status: 409 });
      }
    } else {
      const saved = await db.pinterestContentDraft.updateMany({
        where: { id, status: { in: [PinterestDraftStatus.DRAFT, PinterestDraftStatus.APPROVED, PinterestDraftStatus.FAILED] } },
        data: fields,
      });
      if (saved.count === 0) {
        return NextResponse.json({ error: "This draft can no longer be edited" }, { status: 409 });
      }
    }

    const draft = await db.pinterestContentDraft.findUnique({ where: { id } });
    if (!draft) return NextResponse.json({ error: "Pinterest draft not found" }, { status: 404 });
    return NextResponse.json({ draft: serializePinterestDraft(draft) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update Pinterest draft" },
      { status: 500 }
    );
  }
}

function parseEditableFields(body: Record<string, unknown>) {
  const title = typeof body.title === "string" ? body.title.replace(/\s+/g, " ").trim() : undefined;
  const description = typeof body.description === "string"
    ? body.description.replace(/\s+/g, " ").trim()
    : undefined;

  if (title !== undefined && (!title || title.length > 100)) {
    return { error: "Title must be between 1 and 100 characters" };
  }
  if (description !== undefined && (!description || description.length > 500)) {
    return { error: "Description must be between 1 and 500 characters" };
  }

  let scheduledFor: Date | null | undefined;
  if (body.scheduledFor === null || body.scheduledFor === "") {
    scheduledFor = null;
  } else if (typeof body.scheduledFor === "string") {
    const date = new Date(body.scheduledFor);
    if (Number.isNaN(date.getTime())) return { error: "Scheduled time is invalid" };
    scheduledFor = date;
  }

  return { title, description, scheduledFor };
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
