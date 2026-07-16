import assert from "node:assert/strict";
import test from "node:test";

import {
  CheckoutQuoteError,
  quoteCheckout,
  quoteStorefrontCart,
  type DiscountRecord,
  type DiscountRepository,
} from "../src/lib/checkout/quote";
import { CheckoutInputError } from "../src/lib/checkout/validation";
import type { CheckoutRequest } from "../src/lib/checkout/types";

const NOW = new Date("2026-07-14T00:00:00.000Z");

function checkoutRequest(overrides: Partial<CheckoutRequest> = {}): CheckoutRequest {
  return {
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
    ...overrides,
  };
}

function repository(
  discount: DiscountRecord | null,
  paidOrderCount = 0,
): DiscountRepository {
  return {
    findDiscountByCode: async () => discount,
    countPaidOrdersByEmail: async () => paidOrderCount,
  };
}

function discount(overrides: Partial<DiscountRecord> = {}): DiscountRecord {
  return {
    code: "PEARL10",
    label: "Pearl welcome",
    type: "percentage",
    value: 10,
    minSubtotal: 0,
    maxUses: 0,
    usedCount: 0,
    firstOrderOnly: false,
    isActive: true,
    startsAt: new Date("2026-01-01T00:00:00.000Z"),
    expiresAt: null,
    ...overrides,
  };
}

test("uses catalog prices and ignores a tampered client price", () => {
  const quote = quoteStorefrontCart([
    { productId: "1688-001", quantity: 2, price: 1 } as never,
  ]);

  assert.equal(quote.lines[0].unitPriceCents, 2999);
  assert.equal(quote.subtotalCents, 5998);
  assert.equal(quote.shippingCents, 499);
  assert.equal(quote.totalCents, 6497);
});

test("revalidates cart boundaries when the quote function is called directly", () => {
  const invalidLines = [
    [],
    [{ productId: "1688-001", quantity: -5 }],
    [{ productId: "1688-001", quantity: 1.5 }],
    [{ productId: "1688-001", quantity: 11 }],
    [{ productId: "1688-001", quantity: 1, variantId: "invented" }],
  ];

  for (const lines of invalidLines) {
    assert.throws(
      () => quoteStorefrontCart(lines as never),
      (error: unknown) => {
        assert.ok(error instanceof CheckoutInputError);
        assert.equal(error.status, 400);
        return true;
      },
    );
  }
});

test("applies free shipping at the 6999-cent threshold", () => {
  const quote = quoteStorefrontCart([{ productId: "1688-004", quantity: 1 }]);

  assert.equal(quote.subtotalCents, 6999);
  assert.equal(quote.shippingCents, 0);
  assert.equal(quote.totalCents, 6999);
});

test("applies percentage and fixed discounts in integer cents", async () => {
  const percentage = await quoteCheckout(
    checkoutRequest({ discountCode: "PEARL10" }),
    repository(discount()),
    NOW,
  );
  assert.equal(percentage.discountCents, 300);
  assert.equal(percentage.totalCents, 3198);

  const fixed = await quoteCheckout(
    checkoutRequest({ discountCode: "SAVE100" }),
    repository(discount({ code: "SAVE100", type: "fixed", value: 100 })),
    NOW,
  );
  assert.equal(fixed.discountCents, 2999);
  assert.equal(fixed.totalCents, 499);
});

test("fails closed for discounts that require reservation semantics", async () => {
  for (const record of [
    discount({ maxUses: 5, usedCount: 0 }),
    discount({ firstOrderOnly: true }),
  ]) {
    await assert.rejects(
      () =>
        quoteCheckout(
          checkoutRequest({ discountCode: record.code }),
          repository(record, 0),
          NOW,
        ),
      (error: unknown) => {
        assert.ok(error instanceof CheckoutQuoteError);
        assert.equal(error.status, 400);
        assert.equal(
          error.message,
          "Limited and first-order promotions are temporarily unavailable",
        );
        return true;
      },
    );
  }
});

test("rejects unusable discount codes", async () => {
  const cases: Array<[DiscountRecord | null, number]> = [
    [null, 0],
    [discount({ isActive: false }), 0],
    [discount({ startsAt: new Date("2026-08-01T00:00:00.000Z") }), 0],
    [discount({ expiresAt: new Date("2026-07-01T00:00:00.000Z") }), 0],
    [discount({ maxUses: 2, usedCount: 2 }), 0],
    [discount({ minSubtotal: 50 }), 0],
    [discount({ firstOrderOnly: true }), 1],
  ];

  for (const [record, paidOrders] of cases) {
    await assert.rejects(
      () => quoteCheckout(
        checkoutRequest({ discountCode: "PEARL10" }),
        repository(record, paidOrders),
        NOW,
      ),
      (error: unknown) => {
        assert.ok(error instanceof CheckoutQuoteError);
        assert.equal(error.status, 400);
        return true;
      },
    );
  }
});
