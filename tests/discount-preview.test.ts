import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  buildDiscountPreviewRequest,
  parseDiscountPreviewResponse,
} from "../src/lib/checkout/discount-preview";

test("builds canonical discount-preview input", () => {
  assert.deepEqual(
    buildDiscountPreviewRequest(
      [{ product: { id: "pearl-01" }, quantity: 2 }],
      " myth15 ",
      " BUYER@EXAMPLE.COM ",
    ),
    {
      items: [{ productId: "pearl-01", quantity: 2 }],
      discountCode: "MYTH15",
      email: "buyer@example.com",
    },
  );
});

test("reads authoritative response keys without a percentage fallback", () => {
  assert.deepEqual(
    parseDiscountPreviewResponse({
      valid: true,
      discount: 4.5,
      total: 30.48,
      appliedDiscounts: [{ label: "Welcome 15%" }],
    }),
    { discount: 4.5, label: "Welcome 15%", total: 30.48 },
  );
  assert.throws(
    () => parseDiscountPreviewResponse({ valid: true, total: 30.48 }),
    /invalid discount preview/i,
  );
});

test("cart, checkout, and route use one discountCode contract", () => {
  const files = [
    "src/app/cart/page.tsx",
    "src/app/checkout/page.tsx",
    "src/app/api/discounts/validate/route.ts",
  ].map((file) => readFileSync(path.join(process.cwd(), file), "utf8"));
  for (const value of files) assert.match(value, /discountCode/);
  assert.doesNotMatch(files[0], /subtotal:\s*subtotal\(\)|discountValue\s*\?\?/);
  assert.doesNotMatch(files[2], /body\?\.code/);
});
