import crypto from "crypto";

import type { FulfillmentPayment } from "@/lib/payments/fulfillment";

export interface LemonSqueezyOrderBinding {
  id: string;
  providerCheckoutId: string;
  totalCents: number;
  storeId: string;
  paymentBindingSecret: string;
}

export class LemonSqueezyVerificationError extends Error {
  readonly status = 409;

  constructor(message: string) {
    super(message);
    this.name = "LemonSqueezyVerificationError";
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

export function createLemonSqueezyPaymentBinding(
  orderId: string,
  totalCents: number,
  secret: string,
): string {
  return crypto
    .createHmac("sha256", secret)
    .update(`${orderId}:${totalCents}`)
    .digest("hex");
}

function hasMatchingPaymentBinding(
  value: unknown,
  expected: string,
): boolean {
  if (typeof value !== "string") return false;
  const valueBuffer = Buffer.from(value, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  return (
    valueBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(valueBuffer, expectedBuffer)
  );
}

export function verifyLemonSqueezyOrder(
  payload: unknown,
  order: LemonSqueezyOrderBinding,
): FulfillmentPayment {
  const root = asRecord(payload);
  const meta = asRecord(root.meta);
  const customData = asRecord(meta.custom_data);
  const data = asRecord(root.data);
  const attributes = asRecord(data.attributes);

  if (meta.event_name !== "order_created" || data.type !== "orders") {
    throw new LemonSqueezyVerificationError("Lemon Squeezy order event is invalid");
  }
  if (customData.orderId !== order.id) {
    throw new LemonSqueezyVerificationError(
      "Lemon Squeezy database order does not match",
    );
  }
  const expectedBinding = createLemonSqueezyPaymentBinding(
    order.id,
    order.totalCents,
    order.paymentBindingSecret,
  );
  if (!hasMatchingPaymentBinding(customData.paymentBinding, expectedBinding)) {
    throw new LemonSqueezyVerificationError(
      "Lemon Squeezy checkout binding does not match",
    );
  }
  if (String(attributes.store_id) !== order.storeId) {
    throw new LemonSqueezyVerificationError("Lemon Squeezy store does not match");
  }
  if (attributes.status !== "paid") {
    throw new LemonSqueezyVerificationError("Lemon Squeezy order is not paid");
  }
  if (attributes.currency !== "USD") {
    throw new LemonSqueezyVerificationError(
      "Lemon Squeezy order currency does not match USD",
    );
  }
  if (
    !Number.isSafeInteger(attributes.total) ||
    attributes.total !== order.totalCents
  ) {
    throw new LemonSqueezyVerificationError(
      "Lemon Squeezy order amount does not match",
    );
  }
  if (typeof data.id !== "string" || data.id.length === 0) {
    throw new LemonSqueezyVerificationError(
      "Lemon Squeezy transaction is missing",
    );
  }

  return {
    provider: "lemonsqueezy",
    providerOrderId: order.providerCheckoutId,
    transactionId: data.id,
    orderId: order.id,
    currency: "USD",
    amountCents: order.totalCents,
  };
}

export function verifyLemonSqueezyRefund(
  payload: unknown,
  order: LemonSqueezyOrderBinding,
): { transactionId: string; outcome: "full" | "partial" } {
  const root = asRecord(payload);
  const meta = asRecord(root.meta);
  const customData = asRecord(meta.custom_data);
  const data = asRecord(root.data);
  const attributes = asRecord(data.attributes);

  if (meta.event_name !== "order_refunded" || data.type !== "orders") {
    throw new LemonSqueezyVerificationError("Lemon Squeezy refund event is invalid");
  }
  if (customData.orderId !== order.id) {
    throw new LemonSqueezyVerificationError(
      "Lemon Squeezy database order does not match",
    );
  }
  const expectedBinding = createLemonSqueezyPaymentBinding(
    order.id,
    order.totalCents,
    order.paymentBindingSecret,
  );
  if (!hasMatchingPaymentBinding(customData.paymentBinding, expectedBinding)) {
    throw new LemonSqueezyVerificationError(
      "Lemon Squeezy checkout binding does not match",
    );
  }
  if (String(attributes.store_id) !== order.storeId) {
    throw new LemonSqueezyVerificationError("Lemon Squeezy store does not match");
  }
  if (attributes.currency !== "USD") {
    throw new LemonSqueezyVerificationError(
      "Lemon Squeezy refund currency does not match USD",
    );
  }
  if (typeof data.id !== "string" || data.id.length === 0) {
    throw new LemonSqueezyVerificationError(
      "Lemon Squeezy transaction is missing",
    );
  }

  const refundedAmount = attributes.refunded_amount;
  if (!Number.isSafeInteger(refundedAmount) || Number(refundedAmount) <= 0) {
    throw new LemonSqueezyVerificationError(
      "Lemon Squeezy refund amount is invalid",
    );
  }
  if (attributes.status === "refunded" && refundedAmount === order.totalCents) {
    return { transactionId: data.id, outcome: "full" };
  }
  if (
    attributes.status === "partial_refund" &&
    Number(refundedAmount) < order.totalCents
  ) {
    return { transactionId: data.id, outcome: "partial" };
  }
  throw new LemonSqueezyVerificationError(
    "Lemon Squeezy refund status and amount do not match",
  );
}
