import assert from "node:assert/strict";
import test from "node:test";

import {
  getAccountSessionKey,
  loadAccountOrders,
  loadLoyaltyPoints,
} from "../src/lib/client/account-resource";

test("account resource keys authenticated loads to the concrete session", () => {
  assert.equal(
    getAccountSessionKey({ user: { email: "member@example.com" }, expires: "2026-08-01" }),
    "member@example.com:2026-08-01",
  );
  assert.equal(getAccountSessionKey(null), null);
});

test("account orders loader returns the order list and rejects failed responses", async () => {
  const orders = [{ id: "order-1" }];
  assert.deepEqual(
    await loadAccountOrders(async () => Response.json({ orders })),
    orders,
  );
  await assert.rejects(
    loadAccountOrders(async () => Response.json({}, { status: 503 })),
    /Failed to load orders/,
  );
});

test("loyalty loader defaults missing or invalid points to zero", async () => {
  assert.equal(await loadLoyaltyPoints(async () => Response.json({ points: 250 })), 250);
  assert.equal(await loadLoyaltyPoints(async () => Response.json({ points: "250" })), 0);
  assert.equal(await loadLoyaltyPoints(async () => Response.json({})), 0);
});
