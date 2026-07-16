import { after, NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getOperationsOutlookConfig } from "@/lib/operations/config";
import {
  OutlookWebhookVerificationError,
  getGraphValidationResponse,
  parseGraphMessageNotifications,
} from "@/lib/operations/outlook-webhook";
import { processMailboxEvent } from "@/lib/operations/mailbox-worker";

export async function POST(request: NextRequest) {
  const validationToken = request.nextUrl.searchParams.get("validationToken");
  if (validationToken) {
    return new NextResponse(getGraphValidationResponse(validationToken), {
      status: 200,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const outlook = getOperationsOutlookConfig();
  if (!outlook.enabled) {
    return NextResponse.json(
      { error: "Outlook automation is unavailable." },
      { status: 503 },
    );
  }

  const connection = await db.mailboxConnection.findFirst({
    where: {
      status: "CONNECTED",
      subscriptionId: { not: null },
    },
    orderBy: { updatedAt: "desc" },
  });

  if (!connection?.subscriptionId) {
    return NextResponse.json(
      { error: "No active Outlook subscription." },
      { status: 503 },
    );
  }

  try {
    const notifications = parseGraphMessageNotifications(
      await request.json(),
      {
        clientState: outlook.webhookClientState,
        subscriptionId: connection.subscriptionId,
      },
    );

    if (notifications.length > 0) {
      await db.mailboxAutomationEvent.createMany({
        data: notifications.map((notification) => ({
          mailboxConnectionId: connection.id,
          graphMessageId: notification.messageId,
          category: "UNKNOWN" as const,
          decision: "DRAFT_HIGH_PRIORITY" as const,
          action: "RECEIVED" as const,
          priority: "HIGH" as const,
          status: "PENDING" as const,
        })),
        skipDuplicates: true,
      });
      const queuedEvents = await db.mailboxAutomationEvent.findMany({
        where: {
          graphMessageId: { in: notifications.map((notification) => notification.messageId) },
        },
        select: { id: true },
      });

      after(async () => {
        await Promise.allSettled(
          queuedEvents.map((event) =>
            processMailboxEvent(event.id),
          ),
        );
      });
    }

    return NextResponse.json({ accepted: notifications.length }, { status: 202 });
  } catch (error) {
    if (error instanceof OutlookWebhookVerificationError) {
      return NextResponse.json({ error: "Invalid Outlook notification." }, { status: 401 });
    }

    return NextResponse.json({ error: "Invalid Outlook notification payload." }, { status: 400 });
  }
}
