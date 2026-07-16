import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { sendMailboxDraft } from "@/lib/operations/mailbox-worker";
import { requireAdminApi } from "@/lib/server/admin-auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  let body: { action?: unknown; draftBody?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { id } = await params;
  if (body.action === "IGNORE") {
    const event = await db.mailboxAutomationEvent.update({
      where: { id },
      data: { action: "IGNORED", status: "IGNORED", processedAt: new Date() },
    });
    return NextResponse.json(event);
  }

  if (body.action === "SEND") {
    if (typeof body.draftBody !== "string") {
      return NextResponse.json({ error: "A text draft is required." }, { status: 400 });
    }

    try {
      await sendMailboxDraft(id, body.draftBody);
      return NextResponse.json({ sent: true });
    } catch {
      return NextResponse.json({ error: "The draft could not be sent." }, { status: 502 });
    }
  }

  return NextResponse.json({ error: "Unsupported inbox action." }, { status: 400 });
}
