import assert from "node:assert/strict";
import test from "node:test";

import { buildOperationsReport } from "../src/lib/operations/report";

test("builds a daily report from orders, candidates, inbox activity, and optional GA4", () => {
  const report = buildOperationsReport({
    dateKey: "2026-07-13",
    sales: { orders: 4, paidOrders: 3, revenueCents: 18997 },
    sourcing: { created: 5, approved: 2, dropshipping: 3 },
    inbox: { autoReplied: 2, drafts: 1, failed: 1 },
    ga4: { configured: false, reason: "GA4 is not configured." },
    issues: ["1 mailbox event failed and needs review."],
  });

  assert.equal(report.dateKey, "2026-07-13");
  assert.equal(report.sections.sales.revenueCents, 18997);
  assert.equal(report.sections.sourcing.approved, 2);
  assert.equal(report.sections.inbox.failed, 1);
  assert.match(report.text, /\$189\.97/);
  assert.match(report.text, /GA4 is not configured/);
  assert.match(report.html, /1 mailbox event failed/);
});

test("builds a report with real GA4 metrics when they are available", () => {
  const report = buildOperationsReport({
    dateKey: "2026-07-13",
    sales: { orders: 0, paidOrders: 0, revenueCents: 0 },
    sourcing: { created: 0, approved: 0, dropshipping: 0 },
    inbox: { autoReplied: 0, drafts: 0, failed: 0 },
    ga4: { configured: true, activeUsers: 42, sessions: 55, purchases: 3 },
    issues: [],
  });

  assert.match(report.text, /42 active users/);
  assert.match(report.text, /55 sessions/);
  assert.match(report.html, /3 purchases/);
});
