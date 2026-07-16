import "server-only";

import { Resend } from "resend";

import { db } from "@/lib/db";

import { getOperationsConfig } from "./config";
import { getGa4Snapshot } from "./ga4";
import { buildOperationsReport } from "./report";

function beijingDateKey(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  return `${values.year}-${values.month}-${values.day}`;
}

function getReportWindow(now: Date): { dateKey: string; start: Date; end: Date } {
  const dateKey = beijingDateKey(new Date(now.getTime() - 24 * 60 * 60 * 1000));
  const start = new Date(`${dateKey}T00:00:00.000+08:00`);
  return { dateKey, start, end: new Date(start.getTime() + 24 * 60 * 60 * 1000) };
}

export async function generateDailyOperationsReport(now = new Date()) {
  const config = getOperationsConfig();
  const { dateKey, start, end } = getReportWindow(now);
  const existing = await db.operationsReport.findUnique({
    where: { reportDate: start },
  });
  if (existing) return existing;

  const [orders, createdCandidates, approvedCandidates, dropshippingCandidates, autoReplied, drafts, failedEvents, failedSamples, ga4] = await Promise.all([
    db.order.findMany({ where: { createdAt: { gte: start, lt: end } } }),
    db.supplierCandidate.count({ where: { createdAt: { gte: start, lt: end } } }),
    db.supplierCandidate.count({ where: { createdAt: { gte: start, lt: end }, status: "APPROVED" } }),
    db.supplierCandidate.count({ where: { createdAt: { gte: start, lt: end }, dropshipAvailable: true } }),
    db.mailboxAutomationEvent.count({ where: { processedAt: { gte: start, lt: end }, action: "AUTO_REPLIED" } }),
    db.mailboxAutomationEvent.count({ where: { processedAt: { gte: start, lt: end }, action: "DRAFTED" } }),
    db.mailboxAutomationEvent.count({ where: { processedAt: { gte: start, lt: end }, status: "FAILED" } }),
    db.mailboxAutomationEvent.findMany({
      where: { processedAt: { gte: start, lt: end }, status: "FAILED" },
      take: 5,
      select: { subject: true, errorMessage: true },
    }),
    getGa4Snapshot(config.ga4, dateKey),
  ]);
  const paidOrders = orders.filter((order) =>
    ["PAID", "SHIPPED", "DELIVERED"].includes(order.status),
  );
  const issues = failedSamples.map(
    (event) => event.subject
      ? `Mailbox event failed: ${event.subject}`
      : "Mailbox event failed and needs review.",
  );
  if (failedEvents > failedSamples.length) {
    issues.push(`${failedEvents - failedSamples.length} additional mailbox failures need review.`);
  }

  const report = buildOperationsReport({
    dateKey,
    sales: {
      orders: orders.length,
      paidOrders: paidOrders.length,
      revenueCents: paidOrders.reduce(
        (sum, order) => sum + Math.round(order.total * 100),
        0,
      ),
    },
    sourcing: {
      created: createdCandidates,
      approved: approvedCandidates,
      dropshipping: dropshippingCandidates,
    },
    inbox: { autoReplied, drafts, failed: failedEvents },
    ga4,
    issues,
  });

  let deliveryResult: Record<string, string>;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    deliveryResult = { status: "skipped", reason: "RESEND_API_KEY is not configured." };
  } else {
    try {
      const resend = new Resend(apiKey);
      const result = await resend.emails.send({
        from: process.env.OPERATIONS_REPORT_FROM || "MythRealms <onboarding@resend.dev>",
        to: config.reporting.recipient,
        subject: `MythRealms operations report - ${dateKey}`,
        text: report.text,
        html: report.html,
      }, { idempotencyKey: `operations-report/${dateKey}` });
      deliveryResult = result.error
        ? { status: "failed", reason: result.error.message }
        : { status: "sent", id: result.data?.id || "accepted" };
    } catch (error) {
      deliveryResult = {
        status: "failed",
        reason: error instanceof Error ? error.message : "Report delivery failed.",
      };
    }
  }

  return db.operationsReport.create({
    data: {
      reportDate: start,
      sectionsJson: JSON.stringify(report.sections),
      deliveryResult: JSON.stringify(deliveryResult),
    },
  });
}
