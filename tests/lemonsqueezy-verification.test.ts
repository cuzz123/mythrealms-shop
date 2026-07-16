import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  createLemonSqueezyPaymentBinding,
  LemonSqueezyVerificationError,
  verifyLemonSqueezyOrder,
  verifyLemonSqueezyRefund,
} from "../src/lib/payments/lemonsqueezy-verification";

const binding = {
  id: "db-order-123",
  providerCheckoutId: "checkout-456",
  totalCents: 3198,
  storeId: "42",
  paymentBindingSecret: "webhook-secret",
};

function event() {
  return {
    meta: {
      event_name: "order_created",
      custom_data: {
        orderId: "db-order-123",
        paymentBinding: createLemonSqueezyPaymentBinding(
          "db-order-123",
          3198,
          "webhook-secret",
        ),
      },
    },
    data: {
      type: "orders",
      id: "lemon-order-789",
      attributes: {
        store_id: 42,
        status: "paid",
        currency: "USD",
        total: 3198,
      },
    },
  };
}

function refundEvent(
  status: "refunded" | "partial_refund",
  refundedAmount: number,
) {
  const payload = event();
  return {
    ...payload,
    meta: {
      ...payload.meta,
      event_name: "order_refunded",
    },
    data: {
      ...payload.data,
      attributes: {
        ...payload.data.attributes,
        status,
        refunded_amount: refundedAmount,
      },
    },
  };
}

function assertRejected(payload: unknown, pattern: RegExp) {
  assert.throws(
    () => verifyLemonSqueezyOrder(payload, binding),
    (error: unknown) =>
      error instanceof LemonSqueezyVerificationError && pattern.test(error.message),
  );
}

test("rejects Lemon Squeezy custom data for another database order", () => {
  const payload = event();
  payload.meta.custom_data.orderId = "db-order-other";
  assertRejected(payload, /database order/i);
});

test("rejects Lemon Squeezy events from another store", () => {
  const payload = event();
  payload.data.attributes.store_id = 99;
  assertRejected(payload, /store/i);
});

test("rejects events not bound to the server-created checkout", () => {
  const payload = event();
  payload.meta.custom_data.paymentBinding = "attacker-created-checkout";
  assertRejected(payload, /checkout binding/i);
});

test("rejects Lemon Squeezy orders that are not paid in exact USD cents", () => {
  const pending = event();
  pending.data.attributes.status = "pending";
  assertRejected(pending, /paid/i);

  const euro = event();
  euro.data.attributes.currency = "EUR";
  assertRejected(euro, /currency/i);

  const wrongTotal = event();
  wrongTotal.data.attributes.total = 3197;
  assertRejected(wrongTotal, /amount/i);
});

test("returns normalized facts for a matching Lemon Squeezy order", () => {
  assert.deepEqual(verifyLemonSqueezyOrder(event(), binding), {
    provider: "lemonsqueezy",
    providerOrderId: "checkout-456",
    transactionId: "lemon-order-789",
    orderId: "db-order-123",
    currency: "USD",
    amountCents: 3198,
  });
});

test("public Lemon Squeezy checkout is retired while verification remains", () => {
  const source = readFileSync(
    path.join(process.cwd(), "src/app/api/checkout/route.ts"),
    "utf8",
  );
  assert.match(source, /status:\s*410/);
  assert.doesNotMatch(source, /createPendingOrder|createLemonSqueezyPaymentBinding/);
});

test("distinguishes full and partial Lemon Squeezy refunds", () => {
  const full = refundEvent("refunded", 3198);
  assert.deepEqual(verifyLemonSqueezyRefund(full, binding), {
    transactionId: "lemon-order-789",
    outcome: "full",
  });

  const partial = refundEvent("partial_refund", 1000);
  assert.deepEqual(verifyLemonSqueezyRefund(partial, binding), {
    transactionId: "lemon-order-789",
    outcome: "partial",
  });
});

test("rejects inconsistent Lemon Squeezy refund totals", () => {
  const payload = refundEvent("partial_refund", 3198);
  assert.throws(
    () => verifyLemonSqueezyRefund(payload, binding),
    (error: unknown) =>
      error instanceof LemonSqueezyVerificationError && /refund/i.test(error.message),
  );
});
