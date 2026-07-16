import assert from "node:assert/strict";
import test from "node:test";

import {
  CheckoutInputError,
  parseCheckoutRequest,
} from "../src/lib/checkout/validation";

function validRequest() {
  return {
    items: [
      {
        productId: "1688-001",
        quantity: 1,
        variantId: undefined as string | undefined,
        price: 0.01,
        name: "Tampered",
      },
    ],
    email: " Buyer@Example.com ",
    shippingAddress: {
      name: " Ada Lovelace ",
      phone: " +1 202 555 0102 ",
      address: " 123 Pearl Street ",
      city: " New York ",
      state: " NY ",
      country: " us ",
      zip: " 10001 ",
    },
    discountCode: " pearl10 ",
    total: 0.01,
  };
}

function assertInvalid(mutator: (request: ReturnType<typeof validRequest>) => void) {
  const request = validRequest();
  mutator(request);
  assert.throws(
    () => parseCheckoutRequest(request),
    (error: unknown) => {
      assert.ok(error instanceof CheckoutInputError);
      assert.equal(error.status, 400);
      return true;
    },
  );
}

test("normalizes valid checkout input and drops client-owned totals", () => {
  const result = parseCheckoutRequest(validRequest());

  assert.deepEqual(result, {
    items: [{ productId: "1688-001", quantity: 1 }],
    email: "buyer@example.com",
    shippingAddress: {
      name: "Ada Lovelace",
      phone: "+1 202 555 0102",
      address: "123 Pearl Street",
      city: "New York",
      state: "NY",
      country: "US",
      zip: "10001",
    },
    discountCode: "PEARL10",
  });
});

test("rejects empty and oversized carts", () => {
  assertInvalid((request) => {
    request.items = [];
  });
  assertInvalid((request) => {
    request.items = Array.from({ length: 21 }, () => ({
      productId: "1688-001",
      quantity: 1,
      variantId: undefined,
      price: 0.01,
      name: "Tampered",
    }));
  });
  assertInvalid((request) => {
    request.items = Array.from({ length: 6 }, () => ({
      productId: "1688-001",
      quantity: 9,
      variantId: undefined,
      price: 0.01,
      name: "Tampered",
    }));
  });
});

test("rejects invalid quantities and unknown products", () => {
  for (const quantity of [0, 1.5, 11]) {
    assertInvalid((request) => {
      request.items[0].quantity = quantity;
    });
  }
  assertInvalid((request) => {
    request.items[0].productId = "1688-035";
  });
  assertInvalid((request) => {
    request.items[0].variantId = "client-invented-variant";
  });
});

test("rejects invalid email and incomplete shipping addresses", () => {
  assertInvalid((request) => {
    request.email = "not-an-email";
  });

  for (const field of ["name", "address", "city", "country", "zip"] as const) {
    assertInvalid((request) => {
      request.shippingAddress[field] = "";
    });
  }
});
