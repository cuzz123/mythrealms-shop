import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

test("PayPal launch runbook contains every safety gate", () => {
  const runbook = readFileSync(
    path.join(process.cwd(), "docs/runbooks/paypal-only-launch.md"),
    "utf8",
  );
  for (const required of [
    "Record the production database backup",
    "Record the current deployment ID",
    "npm run launch:check",
    "prisma/sql/2026-07-15-order-confirmation-columns.sql",
    "PAYMENT.CAPTURE.COMPLETED",
    "PAYMENT.CAPTURE.REFUNDED",
    "explicit user authorization",
    "PENDING",
    "PAID",
    "REFUNDED",
    "never capture the order a second time",
  ]) {
    assert.match(runbook, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.doesNotMatch(runbook, /(?:^|\n)\s*prisma db push\b|DROP COLUMN|PAYPAL_CLIENT_SECRET=/);
});
