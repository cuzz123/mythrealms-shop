import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  AdminOrderTransitionError,
  getAdminOrderTransition,
} from "../src/lib/orders/admin-order-transition";

test("rejects cancellation once payment capture has reserved the order", () => {
  assert.throws(
    () => getAdminOrderTransition("PROCESSING_PAYMENT", "CANCELLED"),
    (error: unknown) =>
      error instanceof AdminOrderTransitionError && error.status === 409,
  );
});

test("allows only fulfillment transitions in the admin", () => {
  assert.deepEqual(getAdminOrderTransition("PENDING", "CANCELLED"), {
    restock: false,
  });
  assert.deepEqual(getAdminOrderTransition("PAID", "SHIPPED"), {
    restock: false,
  });
  assert.deepEqual(getAdminOrderTransition("SHIPPED", "DELIVERED"), {
    restock: false,
  });
});

test("keeps paid, paid cancellation, and refunded states provider-owned", () => {
  for (const [current, next] of [
    ["PENDING", "PAID"],
    ["PAID", "CANCELLED"],
    ["PAID", "REFUNDED"],
    ["SHIPPED", "REFUNDED"],
    ["DELIVERED", "REFUNDED"],
  ]) {
    assert.throws(
      () => getAdminOrderTransition(current, next),
      (error: unknown) =>
        error instanceof AdminOrderTransitionError &&
        error.status === 409 &&
        /PayPal/i.test(error.message),
    );
  }
});

test("admin status writes compare-and-swap the status inside a transaction", () => {
  const source = readFileSync(
    path.join(process.cwd(), "src/app/api/admin/orders/[id]/route.ts"),
    "utf8",
  );
  assert.match(source, /db\.\$transaction/);
  assert.match(source, /updateMany\([\s\S]*status:\s*order\.status/);
  assert.match(source, /claimed\.count\s*!==\s*1/);
});
