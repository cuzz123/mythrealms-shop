import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  createPendingOrder,
  type PendingOrderData,
  type PendingOrderRepository,
} from "../src/lib/checkout/create-order";
import type { CheckoutQuote, CheckoutRequest } from "../src/lib/checkout/types";
import {
  getCheckoutSuccessPresentation,
  isPaidOrderStatus,
  shouldPollOrderStatus,
} from "../src/lib/checkout/order-status";

const input: CheckoutRequest = {
  items: [{ productId: "1688-001", quantity: 1 }],
  email: "buyer@example.com",
  shippingAddress: {
    name: "Ada Lovelace",
    address: "123 Pearl Street",
    city: "New York",
    state: "NY",
    country: "US",
    zip: "10001",
  },
  discountCode: "PEARL10",
};

const quote: CheckoutQuote = {
  lines: [
    {
      productId: "1688-001",
      slug: "pearl-series-01",
      name: "The Calm Tide - Ring",
      image: "/images/products/1688-shop/pearl-series/pearl-series-01-main.webp",
      quantity: 1,
      unitPriceCents: 2999,
      lineTotalCents: 2999,
    },
  ],
  subtotalCents: 2999,
  shippingCents: 499,
  discountCents: 300,
  totalCents: 3198,
  appliedDiscounts: [
    { code: "PEARL10", label: "Pearl welcome", amountCents: 300 },
  ],
};

test("persists a pending order from the authoritative quote only", async () => {
  let persisted: PendingOrderData | undefined;
  let loyaltyWrites = 0;
  let discountWrites = 0;
  const repository: PendingOrderRepository & {
    createLoyaltyPoint(): void;
    incrementDiscount(): void;
  } = {
    async createOrder(data) {
      persisted = data;
      return { id: "order-123" };
    },
    createLoyaltyPoint() {
      loyaltyWrites += 1;
    },
    incrementDiscount() {
      discountWrites += 1;
    },
  };

  const order = await createPendingOrder(input, quote, "user-123", repository);

  assert.equal(order.id, "order-123");
  assert.ok(persisted);
  assert.deepEqual(
    {
      email: persisted.email,
      userId: persisted.userId,
      status: persisted.status,
      subtotal: persisted.subtotal,
      shipping: persisted.shipping,
      discount: persisted.discount,
      total: persisted.total,
    },
    {
      email: "buyer@example.com",
      userId: "user-123",
      status: "PENDING",
      subtotal: 29.99,
      shipping: 4.99,
      discount: 3,
      total: 31.98,
    },
  );
  assert.deepEqual(JSON.parse(persisted.shippingAddress), input.shippingAddress);
  assert.equal(persisted.notes, JSON.stringify({ discountCodes: ["PEARL10"] }));
  assert.equal(persisted.items.create.length, 1);

  const item = persisted.items.create[0];
  assert.equal(item.productId, undefined);
  assert.equal(item.variantId, undefined);
  assert.equal(item.quantity, 1);
  assert.equal(item.price, 29.99);
  assert.deepEqual(JSON.parse(item.productSnapshot), {
    id: "1688-001",
    slug: "pearl-series-01",
    name: "The Calm Tide - Ring",
    image: "/images/products/1688-shop/pearl-series/pearl-series-01-main.webp",
    unitPriceCents: 2999,
  });
  assert.equal(loyaltyWrites, 0);
  assert.equal(discountWrites, 0);
});

test("clears carts only for paid or fulfilled order states", () => {
  for (const status of ["PAID", "SHIPPED", "DELIVERED"]) {
    assert.equal(isPaidOrderStatus(status), true);
  }
  for (const status of [undefined, null, "PENDING", "CANCELLED", "REFUNDED"]) {
    assert.equal(isPaidOrderStatus(status), false);
  }
});

test("polls only while payment confirmation is pending", () => {
  assert.equal(shouldPollOrderStatus("PENDING"), true);
  for (const status of [undefined, null, "PAID", "CANCELLED", "REFUNDED"]) {
    assert.equal(shouldPollOrderStatus(status), false);
  }
});

test("shows purchase analytics and fulfillment promises only after payment", () => {
  const pending = getCheckoutSuccessPresentation("PENDING");
  assert.equal(pending.trackPurchase, false);
  assert.equal(pending.showFulfillmentSteps, false);
  assert.match(pending.note, /confirmation email after payment/i);

  const paid = getCheckoutSuccessPresentation("PAID");
  assert.equal(paid.trackPurchase, true);
  assert.equal(paid.showFulfillmentSteps, true);
  assert.match(paid.note, /confirmation email/i);

  const unknown = getCheckoutSuccessPresentation(undefined);
  assert.equal(unknown.trackPurchase, false);
  assert.equal(unknown.showFulfillmentSteps, false);
});

test("reports durable confirmation delivery for paid orders", () => {
  const sent = getCheckoutSuccessPresentation(
    "PAID",
    new Date("2026-07-16T00:00:00.000Z"),
  );
  assert.equal(sent.heading, "Order Confirmed!");
  assert.match(sent.note, /confirmation email (?:has been|was) sent/i);
  assert.doesNotMatch(sent.note, /pending|retry/i);

  const unsent = getCheckoutSuccessPresentation("PAID", null);
  assert.equal(unsent.heading, "Order Confirmed!");
  assert.match(unsent.note, /payment (?:succeeded|was successful)/i);
  assert.match(unsent.note, /confirmation email is pending/i);
  assert.match(unsent.note, /retr/i);
  assert.doesNotMatch(unsent.note, /email (?:has been|was) sent/i);
});

test("checkout success reads durable confirmation delivery from the order", () => {
  const successPage = readFileSync(
    path.join(process.cwd(), "src/app/checkout/success/page.tsx"),
    "utf8",
  );

  assert.match(
    successPage,
    /getCheckoutSuccessPresentation\(\s*order\?\.status,\s*order\?\.confirmationSentAt,?\s*\)/,
  );
  assert.match(successPage, /searchParams:\s*Promise<\{\s*orderId\?: string\s*\}>/);
});
