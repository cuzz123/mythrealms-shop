import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const source = readFileSync(
  path.join(process.cwd(), "src/app/api/webhooks/paypal/route.ts"),
  "utf8",
);

test("PayPal verification embeds the signed raw event without reserializing it", () => {
  assert.match(source, /rawBody\s*=\s*await request\.text\(\)/);
  assert.match(source, /verifyPayPalWebhook\(request,\s*rawBody\)/);
  assert.match(source, /"webhook_event":\$\{rawEvent\}/);
  assert.doesNotMatch(source, /webhook_event:\s*event/);
});

test("PayPal refunds include delivered orders and delegate refund state patches", () => {
  assert.match(source, /"DELIVERED"/);
  assert.match(source, /verifyPayPalRefund\(/);
  assert.match(source, /getPayPalRefundOrderPatch/);
});

test("admin cannot claim a refund and the webhook owns refund patches", () => {
  const adminPage = readFileSync(
    path.join(process.cwd(), "src/app/admin/orders/[id]/page.tsx"),
    "utf8",
  );
  assert.doesNotMatch(adminPage, /updateStatus\("REFUNDED"\)|Refund Order/);
  assert.match(adminPage, /Issue refunds in PayPal/);
  assert.match(source, /getPayPalRefundOrderPatch/);
});
