import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  inspectPaymentSchema,
  type PaymentSchemaState,
  type RawQuery,
} from "../src/lib/launch/database-preflight";

function query(state: PaymentSchemaState, capture: string[]): RawQuery {
  return async (strings) => {
    capture.push(strings.join(""));
    return [state] as never;
  };
}

test("uses information_schema and passes when the payment columns exist", async () => {
  const statements: string[] = [];
  const result = await inspectPaymentSchema(
    query(
      {
        tableExists: true,
        confirmationClaimedAtExists: true,
        confirmationSentAtExists: true,
      },
      statements,
    ),
  );
  assert.deepEqual(result, { ok: true, missing: [] });
  assert.match(statements[0], /information_schema\.tables/);
  assert.match(statements[0], /information_schema\.columns/);
  assert.match(statements[0], /confirmationClaimedAt/);
  assert.match(statements[0], /confirmationSentAt/);
});

test("reports a missing table and both columns without a Prisma model read", async () => {
  const result = await inspectPaymentSchema(
    query(
      {
        tableExists: false,
        confirmationClaimedAtExists: false,
        confirmationSentAtExists: false,
      },
      [],
    ),
  );
  assert.equal(result.ok, false);
  assert.deepEqual(result.missing, [
    "current_schema().Order",
    "current_schema().Order.confirmationClaimedAt",
    "current_schema().Order.confirmationSentAt",
  ]);
});

test("the manual SQL is additive and limited to the two nullable columns", () => {
  const sql = readFileSync(
    path.join(
      process.cwd(),
      "prisma/sql/2026-07-15-order-confirmation-columns.sql",
    ),
    "utf8",
  );
  assert.match(sql, /ADD COLUMN IF NOT EXISTS "confirmationClaimedAt" TIMESTAMP\(3\)/);
  assert.match(sql, /ADD COLUMN IF NOT EXISTS "confirmationSentAt" TIMESTAMP\(3\)/);
  assert.doesNotMatch(sql, /\bDROP\b|\bDELETE\b|\bUPDATE\b|NOT NULL/i);
});
