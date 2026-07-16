export interface PaymentOrderBinding {
  id: string;
  providerOrderId: string;
  totalCents: number;
}

export interface VerifiedPayment {
  provider: "paypal";
  providerOrderId: string;
  transactionId: string;
  orderId: string;
  currency: "USD";
  amountCents: number;
}

export class PaymentVerificationError extends Error {
  readonly status = 409;

  constructor(message: string) {
    super(message);
    this.name = "PaymentVerificationError";
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function firstRecord(value: unknown): Record<string, unknown> {
  return Array.isArray(value) ? asRecord(value[0]) : {};
}

function parseUsdCents(value: unknown): number | null {
  if (typeof value !== "string" || !/^\d+(?:\.\d{1,2})?$/.test(value)) {
    return null;
  }

  const [whole, fraction = ""] = value.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(cents) ? cents : null;
}

export function verifyPayPalRefund(
  payload: unknown,
  order: Pick<PaymentOrderBinding, "totalCents">,
): {
  outcome: "full" | "partial";
  amountCents: number;
  refundedTotalCents: number;
} {
  const resource = asRecord(payload);
  const amount = asRecord(resource.amount);
  if (amount.currency_code !== "USD") {
    throw new PaymentVerificationError("PayPal refund currency does not match USD");
  }

  const amountCents = parseUsdCents(amount.value);
  if (
    amountCents === null ||
    amountCents <= 0 ||
    amountCents > order.totalCents
  ) {
    throw new PaymentVerificationError("PayPal refund amount is invalid");
  }

  const sellerBreakdown = asRecord(resource.seller_payable_breakdown);
  const totalRefundedAmount = asRecord(sellerBreakdown.total_refunded_amount);
  let refundedTotalCents = amountCents;
  if (Object.keys(totalRefundedAmount).length > 0) {
    if (totalRefundedAmount.currency_code !== "USD") {
      throw new PaymentVerificationError(
        "PayPal cumulative refund currency does not match USD",
      );
    }
    const parsedTotal = parseUsdCents(totalRefundedAmount.value);
    if (
      parsedTotal === null ||
      parsedTotal < amountCents ||
      parsedTotal > order.totalCents
    ) {
      throw new PaymentVerificationError(
        "PayPal cumulative refund amount is invalid",
      );
    }
    refundedTotalCents = parsedTotal;
  }

  return {
    outcome: refundedTotalCents === order.totalCents ? "full" : "partial",
    amountCents,
    refundedTotalCents,
  };
}

export function getPayPalRefundOrderPatch(
  refund: { outcome: "full" | "partial" },
  captureId: string,
): {
  status?: "REFUNDED";
  stripePaymentStatus: string;
} {
  return {
    ...(refund.outcome === "full" ? { status: "REFUNDED" as const } : {}),
    stripePaymentStatus:
      `paypal:${refund.outcome === "full" ? "refunded" : "partial-refund"}:${captureId}`,
  };
}

const RETRYABLE_CAPTURE_ISSUES = new Set([
  "CARD_EXPIRED",
  "INSTRUMENT_DECLINED",
  "ORDER_NOT_APPROVED",
  "PAYER_ACTION_REQUIRED",
  "PAYMENT_DENIED",
  "PAYMENT_SOURCE_CANNOT_BE_USED",
]);

export function shouldReleasePayPalCaptureReservation(
  responseStatus: number,
  payload: unknown,
): boolean {
  if (responseStatus < 400 || responseStatus >= 500) return false;

  const details = asRecord(payload).details;
  if (!Array.isArray(details)) return false;
  return details.some((detail) => {
    const issue = asRecord(detail).issue;
    return typeof issue === "string" && RETRYABLE_CAPTURE_ISSUES.has(issue);
  });
}

export function verifyPayPalCapture(
  payload: unknown,
  order: PaymentOrderBinding,
): VerifiedPayment {
  const root = asRecord(payload);
  if (root.id !== order.providerOrderId) {
    throw new PaymentVerificationError("PayPal provider order does not match");
  }
  if (root.status !== "COMPLETED") {
    throw new PaymentVerificationError("PayPal order is not completed");
  }

  const purchaseUnit = firstRecord(root.purchase_units);
  if (purchaseUnit.custom_id !== order.id) {
    throw new PaymentVerificationError("PayPal database order does not match");
  }

  const payments = asRecord(purchaseUnit.payments);
  const capturedPayment = firstRecord(payments.captures);
  if (capturedPayment.status !== "COMPLETED") {
    throw new PaymentVerificationError("PayPal capture is not completed");
  }

  const amount = asRecord(capturedPayment.amount);
  if (amount.currency_code !== "USD") {
    throw new PaymentVerificationError("PayPal capture currency does not match USD");
  }
  const amountCents = parseUsdCents(amount.value);
  if (amountCents === null || amountCents !== order.totalCents) {
    throw new PaymentVerificationError("PayPal capture amount does not match the order");
  }
  if (typeof capturedPayment.id !== "string" || capturedPayment.id.length === 0) {
    throw new PaymentVerificationError("PayPal capture transaction is missing");
  }

  return {
    provider: "paypal",
    providerOrderId: order.providerOrderId,
    transactionId: capturedPayment.id,
    orderId: order.id,
    currency: "USD",
    amountCents,
  };
}
