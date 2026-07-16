import {
  classifyIncomingMessage,
  decideMailboxAction,
  matchMessageToOrder,
  type EmailAutomationCategory,
  type IncomingMessage,
  type MailboxAction,
  type MailboxPriority,
  type OrderRecordForAutomation,
} from "./email-automation";
import type { GraphInboxMessage } from "./microsoft-graph";

export type ClaimedMailboxEvent = {
  id: string;
  graphMessageId: string;
  connection: {
    id: string;
    refreshTokenEncrypted: string;
  } | null;
};

type CompletedMailboxEvent = {
  category: PersistedMailboxCategory;
  decision: MailboxAction;
  action: "AUTO_REPLIED" | "DRAFTED" | "IGNORED";
  priority: MailboxPriority;
  status: "PROCESSED" | "IGNORED";
  orderId: string | null;
  senderEmail: string;
  senderName: string | null;
  subject: string;
  bodyPreview: string;
  receivedAt: Date | null;
  draftBody: string | null;
  sentBody: string | null;
  processedAt: Date;
};

type FailedMailboxEvent = {
  action: "FAILED";
  status: "FAILED";
  errorMessage: string;
  processedAt: Date;
};

export interface MailboxAutomationEventProcessorDependencies {
  claimEvent(eventId: string): Promise<ClaimedMailboxEvent | null>;
  refreshConnection(connection: ClaimedMailboxEvent["connection"]): Promise<{
    accessToken: string;
    refreshTokenEncrypted: string;
    accessTokenExpiresAt: Date;
  }>;
  saveRefreshedConnection(
    connectionId: string,
    data: {
      refreshTokenEncrypted: string;
      accessTokenExpiresAt: Date;
      subscriptionExpiresAt?: Date;
    },
  ): Promise<void>;
  getMessage(messageId: string, accessToken: string): Promise<GraphInboxMessage>;
  findOrdersByEmail(email: string): Promise<OrderRecordForAutomation[]>;
  sendReply(messageId: string, accessToken: string, body: string): Promise<void>;
  completeEvent(eventId: string, data: CompletedMailboxEvent): Promise<void>;
  failEvent(eventId: string, data: FailedMailboxEvent): Promise<void>;
}

type PersistedMailboxCategory =
  | "ORDER_STATUS"
  | "SHIPPING"
  | "FAQ"
  | "PRODUCT_CARE"
  | "REFUND"
  | "CANCEL"
  | "ADDRESS_CHANGE"
  | "QUALITY"
  | "PAYMENT_DISPUTE"
  | "SUPPLIER"
  | "MARKETING"
  | "UNKNOWN";

function toIncomingMessage(message: GraphInboxMessage): IncomingMessage {
  return {
    id: message.id,
    fromEmail: message.fromEmail,
    fromName: message.fromName,
    subject: message.subject,
    textBody: message.bodyContentType.toLowerCase() === "text" ? message.body : message.bodyPreview,
    htmlBody: message.bodyContentType.toLowerCase() === "html" ? message.body : null,
    receivedAt: message.receivedAt,
  };
}

function toPersistedCategory(
  category: EmailAutomationCategory,
): PersistedMailboxCategory {
  const categories: Record<EmailAutomationCategory, PersistedMailboxCategory> = {
    ORDER_STATUS: "ORDER_STATUS",
    SHIPPING_STATUS: "SHIPPING",
    SIZE_FAQ: "FAQ",
    CARE_FAQ: "PRODUCT_CARE",
    REFUND_REQUEST: "REFUND",
    CANCELLATION_REQUEST: "CANCEL",
    ADDRESS_CHANGE_REQUEST: "ADDRESS_CHANGE",
    QUALITY_COMPLAINT: "QUALITY",
    PAYMENT_DISPUTE: "PAYMENT_DISPUTE",
    SUPPLIER_QUOTE: "SUPPLIER",
    MARKETING: "MARKETING",
    UNKNOWN: "UNKNOWN",
  };

  return categories[category];
}

function readReceivedAt(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function processMailboxAutomationEvent(
  eventId: string,
  dependencies: MailboxAutomationEventProcessorDependencies,
): Promise<"processed" | "skipped" | "failed"> {
  const event = await dependencies.claimEvent(eventId);
  if (!event) return "skipped";

  if (!event.connection) {
    await dependencies.failEvent(event.id, {
      action: "FAILED",
      status: "FAILED",
      errorMessage: "Mailbox connection is unavailable.",
      processedAt: new Date(),
    });
    return "failed";
  }

  try {
    const refreshed = await dependencies.refreshConnection(event.connection);
    await dependencies.saveRefreshedConnection(event.connection.id, {
      refreshTokenEncrypted: refreshed.refreshTokenEncrypted,
      accessTokenExpiresAt: refreshed.accessTokenExpiresAt,
    });

    const message = await dependencies.getMessage(
      event.graphMessageId,
      refreshed.accessToken,
    );
    const incomingMessage = toIncomingMessage(message);
    const category = classifyIncomingMessage(incomingMessage);
    const orders = await dependencies.findOrdersByEmail(message.fromEmail);
    const matchedOrder = matchMessageToOrder(incomingMessage, orders);
    const decision = decideMailboxAction({
      message: incomingMessage,
      category,
      matchedOrder,
    });

    if (decision.action === "AUTO_REPLY" && decision.draft) {
      await dependencies.sendReply(
        event.graphMessageId,
        refreshed.accessToken,
        decision.draft.body,
      );
    }

    const action = decision.action === "AUTO_REPLY"
      ? "AUTO_REPLIED"
      : decision.action === "IGNORE"
        ? "IGNORED"
        : "DRAFTED";
    await dependencies.completeEvent(event.id, {
      category: toPersistedCategory(category),
      decision: decision.action,
      action,
      priority: decision.priority,
      status: decision.action === "IGNORE" ? "IGNORED" : "PROCESSED",
      orderId: matchedOrder?.id ?? null,
      senderEmail: message.fromEmail,
      senderName: message.fromName,
      subject: message.subject,
      bodyPreview: message.bodyPreview,
      receivedAt: readReceivedAt(message.receivedAt),
      draftBody: decision.action === "DRAFT_HIGH_PRIORITY" ? decision.draft?.body ?? null : null,
      sentBody: decision.action === "AUTO_REPLY" ? decision.draft?.body ?? null : null,
      processedAt: new Date(),
    });

    return "processed";
  } catch {
    await dependencies.failEvent(event.id, {
      action: "FAILED",
      status: "FAILED",
      errorMessage: "Mailbox automation could not process this message.",
      processedAt: new Date(),
    });
    return "failed";
  }
}
