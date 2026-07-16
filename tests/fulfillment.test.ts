import assert from "node:assert/strict";
import test from "node:test";

import { sendOrderConfirmation } from "../src/lib/email";

import {
  FulfillmentError,
  fulfillPaidOrder,
  fulfillPaidOrderForCheckout,
  type FulfillmentOrder,
  type FulfillmentRepository,
} from "../src/lib/payments/fulfillment";

const payment = {
  provider: "paypal",
  providerOrderId: "PAYPAL-ORDER-123",
  transactionId: "PAYPAL-CAPTURE-456",
  orderId: "db-order-123",
  currency: "USD",
  amountCents: 3198,
} as const;

const order: FulfillmentOrder = {
  id: "db-order-123",
  status: "PAID",
  email: "buyer@example.com",
  userId: "user-123",
  total: 31.98,
  discount: 3,
  notes: JSON.stringify({ discountCodes: ["PEARL10"] }),
  items: [
    {
      quantity: 1,
      price: 31.98,
      variantId: "variant-123",
      productSnapshot: JSON.stringify({ name: "Pearl Ring" }),
    },
  ],
};

function buildRepository(initialStatus = "PENDING") {
  let status = initialStatus;
  let databaseBundles = 0;
  let emails = 0;
  let confirmationClaimed = false;
  let confirmationSent = false;

  const repository: FulfillmentRepository = {
    async applyPaidOrderAtomically() {
      if (["PENDING", "PROCESSING_PAYMENT"].includes(status)) {
        status = "PAID";
        databaseBundles += 1;
        return { outcome: "fulfilled", order };
      }
      if (["PAID", "SHIPPED", "DELIVERED"].includes(status)) {
        return { outcome: "already-fulfilled", order };
      }
      throw new FulfillmentError(`Order cannot be fulfilled from ${status}`);
    },
    async claimConfirmation() {
      if (confirmationClaimed || confirmationSent) return false;
      confirmationClaimed = true;
      return true;
    },
    async markConfirmationSent() {
      confirmationClaimed = false;
      confirmationSent = true;
    },
    async releaseConfirmationClaim() {
      confirmationClaimed = false;
    },
    async sendConfirmation() {
      emails += 1;
    },
  };

  return {
    repository,
    counts: () => ({ databaseBundles, emails }),
  };
}

test("fulfills database side effects and confirmation once under concurrent callbacks", async () => {
  const { repository, counts } = buildRepository();

  const results = await Promise.all([
    fulfillPaidOrder("db-order-123", payment, repository),
    fulfillPaidOrder("db-order-123", payment, repository),
  ]);

  assert.deepEqual(results.sort(), ["already-fulfilled", "fulfilled"]);
  assert.deepEqual(counts(), { databaseBundles: 1, emails: 1 });
});

test("retries idempotent confirmation for an already paid order", async () => {
  const { repository, counts } = buildRepository("PAID");

  assert.equal(
    await fulfillPaidOrder("db-order-123", payment, repository),
    "already-fulfilled",
  );
  assert.deepEqual(counts(), { databaseBundles: 0, emails: 1 });
});

test("does not resend confirmation after the durable sent marker exists", async () => {
  const { repository, counts } = buildRepository("PAID");

  await fulfillPaidOrder("db-order-123", payment, repository);
  await fulfillPaidOrder("db-order-123", payment, repository);

  assert.deepEqual(counts(), { databaseBundles: 0, emails: 1 });
});

test("releases the durable email claim when delivery fails", async () => {
  let claimed = false;
  let attempts = 0;
  const repository: FulfillmentRepository = {
    async applyPaidOrderAtomically() {
      return { outcome: "already-fulfilled", order };
    },
    async claimConfirmation() {
      if (claimed) return false;
      claimed = true;
      return true;
    },
    async markConfirmationSent() {},
    async releaseConfirmationClaim() {
      claimed = false;
    },
    async sendConfirmation() {
      attempts += 1;
      if (attempts === 1) throw new Error("mail provider unavailable");
    },
  };

  await assert.rejects(
    fulfillPaidOrder("db-order-123", payment, repository),
    /mail provider unavailable/,
  );
  assert.equal(
    await fulfillPaidOrder("db-order-123", payment, repository),
    "already-fulfilled",
  );
  assert.equal(attempts, 2);
});

test("can retry after an atomic database bundle rolls back", async () => {
  let attempts = 0;
  const repository: FulfillmentRepository = {
    async applyPaidOrderAtomically() {
      attempts += 1;
      if (attempts === 1) throw new Error("transaction rolled back");
      return { outcome: "fulfilled", order };
    },
    async claimConfirmation() { return true; },
    async markConfirmationSent() {},
    async releaseConfirmationClaim() {},
    async sendConfirmation() {},
  };

  await assert.rejects(
    fulfillPaidOrder("db-order-123", payment, repository),
    /transaction rolled back/,
  );
  assert.equal(
    await fulfillPaidOrder("db-order-123", payment, repository),
    "fulfilled",
  );
  assert.equal(attempts, 2);
});

test("rejects a payment bound to another order", async () => {
  const { repository } = buildRepository();
  await assert.rejects(
    fulfillPaidOrder(
      "db-order-123",
      { ...payment, orderId: "db-order-other" },
      repository,
    ),
    /different order/,
  );
});

test("does not treat a missing email provider key as successful delivery", async () => {
  const previous = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;
  try {
    await assert.rejects(
      sendOrderConfirmation("buyer@example.com", "order-123", 31.98, []),
      /RESEND_API_KEY/,
    );
  } finally {
    if (previous === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previous;
  }
});

test("does not treat a missing verified sender as successful delivery", async () => {
  const previousApiKey = process.env.RESEND_API_KEY;
  const previousFrom = process.env.RESEND_FROM_EMAIL;
  process.env.RESEND_API_KEY = "resend-key";
  delete process.env.RESEND_FROM_EMAIL;
  try {
    await assert.rejects(
      sendOrderConfirmation(
        "buyer@example.com",
        "order-123",
        31.98,
        [],
        undefined,
        {
          transport: {
            async send() {
              throw new Error("transport must not be called");
            },
          },
        },
      ),
      /RESEND_FROM_EMAIL/,
    );
  } finally {
    if (previousApiKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previousApiKey;
    if (previousFrom === undefined) delete process.env.RESEND_FROM_EMAIL;
    else process.env.RESEND_FROM_EMAIL = previousFrom;
  }
});

test("checkout reports a paid order as successful while confirmation remains retryable", async () => {
  let claimed = false;
  let attempts = 0;
  const repository: FulfillmentRepository = {
    async applyPaidOrderAtomically() {
      return { outcome: "fulfilled", order };
    },
    async claimConfirmation() {
      if (claimed) return false;
      claimed = true;
      return true;
    },
    async markConfirmationSent() {
      claimed = false;
    },
    async releaseConfirmationClaim() {
      claimed = false;
    },
    async sendConfirmation() {
      attempts += 1;
      if (attempts === 1) throw new Error("mail provider unavailable");
    },
  };

  assert.deepEqual(
    await fulfillPaidOrderForCheckout("db-order-123", payment, repository),
    { outcome: "fulfilled", confirmationPending: true },
  );
  assert.deepEqual(
    await fulfillPaidOrderForCheckout("db-order-123", payment, repository),
    { outcome: "fulfilled", confirmationPending: false },
  );
  assert.equal(attempts, 2);
});
