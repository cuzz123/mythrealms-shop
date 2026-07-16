import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/server/admin-auth";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const [connection, events] = await Promise.all([
    db.mailboxConnection.findFirst({
      orderBy: { updatedAt: "desc" },
      select: {
        email: true,
        status: true,
        subscriptionExpiresAt: true,
        updatedAt: true,
      },
    }),
    db.mailboxAutomationEvent.findMany({
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      take: 100,
      select: {
        id: true,
        graphMessageId: true,
        category: true,
        decision: true,
        action: true,
        priority: true,
        status: true,
        orderId: true,
        senderEmail: true,
        senderName: true,
        subject: true,
        bodyPreview: true,
        receivedAt: true,
        draftBody: true,
        sentBody: true,
        errorMessage: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  return NextResponse.json({ connection, events });
}
