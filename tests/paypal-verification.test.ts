import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  getPayPalRefundOrderPatch,
  PaymentVerificationError,
  shouldReleasePayPalCaptureReservation,
  verifyPayPalCapture,
  verifyPayPalRefund,
} from "../src/lib/payments/paypal-verification";

const order = {
  id: "db-order-123",
  providerOrderId: "PAYPAL-ORDER-123",
  totalCents: 3198,
};

function capture(overrides: Record<string, unknown> = {}) {
  return {
    id: "PAYPAL-ORDER-123",
    status: "COMPLETED",
    purchase_units: [
      {
        custom_id: "db-order-123",
        payments: {
          captures: [
            {
              id: "PAYPAL-CAPTURE-456",
              status: "COMPLETED",
              amount: { currency_code: "USD", value: "31.98" },
            },
          ],
        },
      },
    ],
    ...overrides,
  };
}

function assertRejected(payload: unknown, pattern: RegExp) {
  assert.throws(
    () => verifyPayPalCapture(payload, order),
    (error: unknown) =>
      error instanceof PaymentVerificationError && pattern.test(error.message),
  );
}

test("rejects a PayPal capture for a different provider order", () => {
  assertRejected(capture({ id: "PAYPAL-ORDER-OTHER" }), /provider order/i);
});

test("rejects a PayPal capture bound to a different database order", () => {
  const payload = capture();
  payload.purchase_units[0].custom_id = "db-order-other";
  assertRejected(payload, /database order/i);
});

test("rejects a PayPal capture that is not completed", () => {
  const payload = capture();
  payload.purchase_units[0].payments.captures[0].status = "PENDING";
  assertRejected(payload, /completed/i);
});

test("rejects a PayPal capture in a different currency", () => {
  const payload = capture();
  payload.purchase_units[0].payments.captures[0].amount.currency_code = "EUR";
  assertRejected(payload, /currency/i);
});

test("rejects a PayPal capture with a different amount", () => {
  const payload = capture();
  payload.purchase_units[0].payments.captures[0].amount.value = "31.97";
  assertRejected(payload, /amount/i);
});

test("returns normalized verified payment facts for a matching capture", () => {
  assert.deepEqual(verifyPayPalCapture(capture(), order), {
    provider: "paypal",
    providerOrderId: "PAYPAL-ORDER-123",
    transactionId: "PAYPAL-CAPTURE-456",
    orderId: "db-order-123",
    currency: "USD",
    amountCents: 3198,
  });
});

test("capture reserves the local order before requesting an idempotent provider capture", () => {
  const source = readFileSync(
    path.join(
      process.cwd(),
      "src/app/api/checkout/paypal/capture/route.ts",
    ),
    "utf8",
  );
  assert.match(source, /status:\s*"PROCESSING_PAYMENT"/);
  assert.match(source, /status:\s*"PENDING"/);
  assert.match(source, /Prefer:\s*"return=representation"/);
  assert.match(source, /"PayPal-Request-Id"/);
  assert.match(source, /fulfillPaidOrderForCheckout/);
  assert.match(source, /stripePaymentStatus/);
});

test("distinguishes full and partial PayPal refunds", () => {
  assert.deepEqual(
    verifyPayPalRefund(
      { amount: { currency_code: "USD", value: "31.98" } },
      { totalCents: 3198 },
    ),
    { outcome: "full", amountCents: 3198, refundedTotalCents: 3198 },
  );
  assert.deepEqual(
    verifyPayPalRefund(
      { amount: { currency_code: "USD", value: "10.00" } },
      { totalCents: 3198 },
    ),
    { outcome: "partial", amountCents: 1000, refundedTotalCents: 1000 },
  );
});

test("uses PayPal's cumulative refunded amount across partial refunds", () => {
  assert.deepEqual(
    verifyPayPalRefund(
      {
        amount: { currency_code: "USD", value: "11.98" },
        seller_payable_breakdown: {
          total_refunded_amount: { currency_code: "USD", value: "31.98" },
        },
      },
      { totalCents: 3198 },
    ),
    { outcome: "full", amountCents: 1198, refundedTotalCents: 3198 },
  );
});

test("builds refund state only from a verified full refund", () => {
  assert.deepEqual(
    getPayPalRefundOrderPatch({ outcome: "full" }, "PAYPAL-CAPTURE-456"),
    {
      status: "REFUNDED",
      stripePaymentStatus: "paypal:refunded:PAYPAL-CAPTURE-456",
    },
  );
  const partial = getPayPalRefundOrderPatch(
    { outcome: "partial" },
    "PAYPAL-CAPTURE-456",
  );
  assert.deepEqual(partial, {
    stripePaymentStatus: "paypal:partial-refund:PAYPAL-CAPTURE-456",
  });
  assert.equal("status" in partial, false);
});

test("releases a capture reservation only for definitive retryable failures", () => {
  assert.equal(
    shouldReleasePayPalCaptureReservation(422, {
      details: [{ issue: "INSTRUMENT_DECLINED" }],
    }),
    true,
  );
  assert.equal(
    shouldReleasePayPalCaptureReservation(422, {
      details: [{ issue: "ORDER_ALREADY_CAPTURED" }],
    }),
    false,
  );
  assert.equal(shouldReleasePayPalCaptureReservation(503, {}), false);
});

test("rejects invalid PayPal refund amounts", () => {
  assert.throws(
    () =>
      verifyPayPalRefund(
        { amount: { currency_code: "EUR", value: "31.98" } },
        { totalCents: 3198 },
      ),
    /currency/i,
  );
  assert.throws(
    () =>
      verifyPayPalRefund(
        { amount: { currency_code: "USD", value: "40.00" } },
        { totalCents: 3198 },
      ),
    /amount/i,
  );
});
