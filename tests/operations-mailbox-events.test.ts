import assert from "node:assert/strict";
import test from "node:test";

import {
  processMailboxAutomationEvent,
  type MailboxAutomationEventProcessorDependencies,
} from "../src/lib/operations/mailbox-events";

function createDependencies(
  overrides: Partial<MailboxAutomationEventProcessorDependencies> = {},
) {
  const completed: Record<string, unknown>[] = [];
  const failed: Record<string, unknown>[] = [];
  const replies: string[] = [];
  const refreshedConnections: Record<string, unknown>[] = [];
  const event = {
    id: "event-1",
    graphMessageId: "message-1",
    connection: {
      id: "connection-1",
      refreshTokenEncrypted: "encrypted-refresh-token",
    },
  };

  const dependencies: MailboxAutomationEventProcessorDependencies = {
    claimEvent: async () => event,
    refreshConnection: async () => ({
      accessToken: "access-token",
      refreshTokenEncrypted: "rotated-refresh-token",
      accessTokenExpiresAt: new Date("2026-07-14T10:00:00.000Z"),
    }),
    saveRefreshedConnection: async (_id, data) => {
      refreshedConnections.push(data);
    },
    getMessage: async () => ({
      id: "message-1",
      subject: "Tracking for ab12cd34",
      bodyPreview: "Can you send my tracking number?",
      body: "Can you send my tracking number for ab12cd34?",
      bodyContentType: "text",
      fromEmail: "buyer@example.com",
      fromName: "Buyer",
      receivedAt: "2026-07-14T09:00:00.000Z",
    }),
    findOrdersByEmail: async () => [
      {
        id: "ord_live_20260714_ab12cd34",
        email: "buyer@example.com",
        status: "SHIPPED",
        trackingNumber: "YT123456789CN",
      },
    ],
    sendReply: async (_messageId, _accessToken, body) => {
      replies.push(body);
    },
    completeEvent: async (_id, data) => {
      completed.push(data);
    },
    failEvent: async (_id, data) => {
      failed.push(data);
    },
    ...overrides,
  };

  return { dependencies, completed, failed, replies, refreshedConnections };
}

test("claims an event once and auto-replies only after an order match with valid tracking", async () => {
  const { dependencies, completed, failed, replies, refreshedConnections } =
    createDependencies();

  const result = await processMailboxAutomationEvent("event-1", dependencies);

  assert.equal(result, "processed");
  assert.equal(replies.length, 1);
  assert.equal(refreshedConnections.length, 1);
  assert.equal(completed.length, 1);
  assert.equal(completed[0]?.action, "AUTO_REPLIED");
  assert.equal(completed[0]?.status, "PROCESSED");
  assert.equal(completed[0]?.orderId, "ord_live_20260714_ab12cd34");
  assert.equal(failed.length, 0);
});

test("creates an auditable high-priority draft for refunds without sending Graph mail", async () => {
  const { dependencies, completed, replies } = createDependencies({
    getMessage: async () => ({
      id: "message-1",
      subject: "Refund request for ab12cd34",
      bodyPreview: "I need a refund.",
      body: "I need a refund for ab12cd34.",
      bodyContentType: "text",
      fromEmail: "buyer@example.com",
      fromName: "Buyer",
      receivedAt: "2026-07-14T09:00:00.000Z",
    }),
  });

  const result = await processMailboxAutomationEvent("event-1", dependencies);

  assert.equal(result, "processed");
  assert.equal(replies.length, 0);
  assert.equal(completed[0]?.action, "DRAFTED");
  assert.equal(completed[0]?.priority, "HIGH");
  assert.equal(completed[0]?.category, "REFUND");
  assert.match(String(completed[0]?.draftBody), /review/i);
  assert.doesNotMatch(String(completed[0]?.draftBody), /refund will be issued|approved/i);
});

test("skips an event that another worker already claimed", async () => {
  const { dependencies, replies } = createDependencies({
    claimEvent: async () => null,
  });

  const result = await processMailboxAutomationEvent("event-1", dependencies);

  assert.equal(result, "skipped");
  assert.equal(replies.length, 0);
});

test("records a failure without leaking the refresh token when Graph processing fails", async () => {
  const { dependencies, failed } = createDependencies({
    getMessage: async () => {
      throw new Error("Graph 503 for refresh-token-value");
    },
  });

  const result = await processMailboxAutomationEvent("event-1", dependencies);

  assert.equal(result, "failed");
  assert.equal(failed.length, 1);
  assert.doesNotMatch(String(failed[0]?.errorMessage), /refresh-token-value/);
});
