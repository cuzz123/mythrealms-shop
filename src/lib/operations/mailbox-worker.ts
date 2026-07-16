import "server-only";

import { db } from "@/lib/db";

import {
  processMailboxAutomationEvent,
  type MailboxAutomationEventProcessorDependencies,
} from "./mailbox-events";
import { getOperationsOutlookConfig } from "./config";
import {
  getGraphMessage,
  refreshGraphAccessToken,
  renewInboxSubscription,
  replyToGraphMessage,
} from "./microsoft-graph";
import { decryptSecret, encryptSecret } from "./token-crypto";

function getProcessorDependencies(): MailboxAutomationEventProcessorDependencies {
  return {
    async claimEvent(eventId) {
      const claimed = await db.mailboxAutomationEvent.updateMany({
        where: { id: eventId, status: "PENDING" },
        data: { status: "PROCESSING" },
      });

      if (claimed.count !== 1) return null;

      const event = await db.mailboxAutomationEvent.findUnique({
        where: { id: eventId },
        include: { mailboxConnection: true },
      });

      if (!event) return null;
      return {
        id: event.id,
        graphMessageId: event.graphMessageId,
        connection: event.mailboxConnection
          ? {
              id: event.mailboxConnection.id,
              refreshTokenEncrypted: event.mailboxConnection.refreshTokenEncrypted,
            }
          : null,
      };
    },
    async refreshConnection(connection) {
      if (!connection) {
        throw new Error("Mailbox connection is unavailable.");
      }

      const outlook = getOperationsOutlookConfig();
      if (!outlook.enabled) {
        throw new Error("Outlook automation is not configured.");
      }

      const token = await refreshGraphAccessToken(
        decryptSecret(connection.refreshTokenEncrypted, outlook.encryptionKey),
        outlook,
      );
      return {
        accessToken: token.accessToken,
        refreshTokenEncrypted: encryptSecret(token.refreshToken, outlook.encryptionKey),
        accessTokenExpiresAt: new Date(Date.now() + token.expiresInSeconds * 1000),
      };
    },
    async saveRefreshedConnection(connectionId, data) {
      await db.mailboxConnection.update({
        where: { id: connectionId },
        data,
      });
    },
    getMessage: getGraphMessage,
    async findOrdersByEmail(email) {
      const orders = await db.order.findMany({
        where: { email },
        orderBy: { createdAt: "desc" },
        take: 100,
      });
      return orders.map((order) => ({
        id: order.id,
        email: order.email,
        status: order.status,
        trackingNumber: order.trackingNumber,
      }));
    },
    sendReply: replyToGraphMessage,
    async completeEvent(eventId, data) {
      await db.mailboxAutomationEvent.update({
        where: { id: eventId },
        data,
      });
    },
    async failEvent(eventId, data) {
      await db.mailboxAutomationEvent.update({
        where: { id: eventId },
        data,
      });
    },
  };
}

export function processMailboxEvent(eventId: string) {
  return processMailboxAutomationEvent(eventId, getProcessorDependencies());
}

export async function sendMailboxDraft(
  eventId: string,
  draftBody: string,
): Promise<void> {
  const event = await db.mailboxAutomationEvent.findUnique({
    where: { id: eventId },
    include: { mailboxConnection: true },
  });

  if (!event?.mailboxConnection) {
    throw new Error("Mailbox event or connection was not found.");
  }

  const body = draftBody.trim();
  if (!body) {
    throw new Error("A reply draft is required before sending.");
  }

  const dependencies = getProcessorDependencies();
  const refreshed = await dependencies.refreshConnection({
    id: event.mailboxConnection.id,
    refreshTokenEncrypted: event.mailboxConnection.refreshTokenEncrypted,
  });
  await dependencies.saveRefreshedConnection(event.mailboxConnection.id, {
    refreshTokenEncrypted: refreshed.refreshTokenEncrypted,
    accessTokenExpiresAt: refreshed.accessTokenExpiresAt,
  });
  await replyToGraphMessage(event.graphMessageId, refreshed.accessToken, body);
  await db.mailboxAutomationEvent.update({
    where: { id: event.id },
    data: {
      action: "SENT",
      status: "PROCESSED",
      draftBody: body,
      sentBody: body,
      processedAt: new Date(),
      errorMessage: null,
    },
  });
}

export async function processPendingMailboxEvents(limit = 20): Promise<{
  processed: number;
  failed: number;
  skipped: number;
}> {
  const events = await db.mailboxAutomationEvent.findMany({
    where: { status: "PENDING" },
    orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
    take: limit,
    select: { id: true },
  });
  const results = { processed: 0, failed: 0, skipped: 0 };

  for (const event of events) {
    const result = await processMailboxEvent(event.id);
    results[result] += 1;
  }

  return results;
}

export async function renewOutlookSubscriptions(
  renewBefore = new Date(Date.now() + 48 * 60 * 60 * 1000),
): Promise<{ renewed: number; failed: number; skipped: number }> {
  const outlook = getOperationsOutlookConfig();
  if (!outlook.enabled) {
    return { renewed: 0, failed: 0, skipped: 0 };
  }

  const connections = await db.mailboxConnection.findMany({
    where: {
      status: "CONNECTED",
      subscriptionId: { not: null },
      subscriptionExpiresAt: { lte: renewBefore },
    },
    select: {
      id: true,
      refreshTokenEncrypted: true,
      subscriptionId: true,
    },
  });
  const results = { renewed: 0, failed: 0, skipped: 0 };
  const dependencies = getProcessorDependencies();

  for (const connection of connections) {
    if (!connection.subscriptionId) {
      results.skipped += 1;
      continue;
    }

    try {
      const refreshed = await dependencies.refreshConnection(connection);
      const subscription = await renewInboxSubscription(
        connection.subscriptionId,
        refreshed.accessToken,
      );
      await dependencies.saveRefreshedConnection(connection.id, {
        refreshTokenEncrypted: refreshed.refreshTokenEncrypted,
        accessTokenExpiresAt: refreshed.accessTokenExpiresAt,
        subscriptionExpiresAt: subscription.expiresAt,
      });
      results.renewed += 1;
    } catch {
      results.failed += 1;
    }
  }

  return results;
}
