export class OutlookWebhookVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OutlookWebhookVerificationError";
  }
}

export type GraphMessageNotification = {
  messageId: string;
};

type GraphNotificationEnvelope = {
  value?: unknown;
};

type ExpectedGraphSubscription = {
  clientState: string;
  subscriptionId: string;
};

function readRecord(value: unknown, message: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new OutlookWebhookVerificationError(message);
  }

  return value as Record<string, unknown>;
}

function readRequiredString(
  value: unknown,
  message: string,
): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new OutlookWebhookVerificationError(message);
  }

  return value;
}

export function getGraphValidationResponse(validationToken: string | null): string {
  if (!validationToken) {
    throw new OutlookWebhookVerificationError("Missing Graph validation token.");
  }

  return validationToken;
}

export function parseGraphMessageNotifications(
  envelope: GraphNotificationEnvelope,
  expected: ExpectedGraphSubscription,
): GraphMessageNotification[] {
  const values = envelope.value;

  if (!Array.isArray(values)) {
    throw new OutlookWebhookVerificationError("Graph notification payload is invalid.");
  }

  const messageIds = new Set<string>();

  for (const value of values) {
    const notification = readRecord(value, "Graph notification is invalid.");
    const subscriptionId = readRequiredString(
      notification.subscriptionId,
      "Graph notification is missing a subscription ID.",
    );
    const clientState = readRequiredString(
      notification.clientState,
      "Graph notification is missing client state.",
    );

    if (
      subscriptionId !== expected.subscriptionId ||
      clientState !== expected.clientState
    ) {
      throw new OutlookWebhookVerificationError(
        "Graph notification did not match the configured subscription.",
      );
    }

    if (notification.changeType !== "created") {
      continue;
    }

    const resourceData = readRecord(
      notification.resourceData,
      "Graph message notification is missing resource data.",
    );
    const messageId = readRequiredString(
      resourceData.id,
      "Graph message notification is missing a message ID.",
    );
    messageIds.add(messageId);
  }

  return [...messageIds].map((messageId) => ({ messageId }));
}
