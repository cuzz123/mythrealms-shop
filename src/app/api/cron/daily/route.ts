// ============================================================
// SEO 自动化 — 总调度器
// Vercel Cron 每天 01:00 UTC（北京时间 09:00）调此端点 → 分发到各子任务
// 当前: SEO 文章生成 → 后续可加: 库存预警 / 日报 / Pinterest / TikTok
// ============================================================

/**
 * GET /api/cron/daily
 * Master daily cron — runs all automated tasks.
 * Vercel Cron triggers this at 01:00 UTC daily.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireCron } from "@/lib/automation-auth";
import {
  createDailyPinterestDraft,
  publishDuePinterestDrafts,
} from "@/lib/pinterest-drafts";
import {
  processPendingMailboxEvents,
  renewOutlookSubscriptions,
} from "@/lib/operations/mailbox-worker";
import { generateDailyOperationsReport } from "@/lib/operations/report-worker";

const CRON_SECRET = process.env.CRON_SECRET || "";

export async function GET(req: NextRequest) {
  const unauthorized = requireCron(req);
  if (unauthorized) return unauthorized;

  const results: Record<string, unknown> = {};

  // Task 1: Generate SEO blog post
  try {
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || "http://localhost:3000";
    const seoRes = await fetch(`${APP_URL}/api/cron/seo-daily`, {
      method: "POST",
      headers: { authorization: `Bearer ${CRON_SECRET}` },
    });
    results.seo = await seoRes.json();
  } catch (e) {
    results.seo = { error: String(e) };
  }

  // Task 2: Create a daily Pinterest review draft and publish approved, due items.
  try {
    const generated = await createDailyPinterestDraft();
    const published = await publishDuePinterestDrafts();
    results.pinterest = {
      generated: generated.created,
      draftId: generated.draft.id,
      ...published,
    };
  } catch (e) {
    results.pinterest = { error: String(e) };
  }

  // Task 3: Low stock alert (placeholder)
  results.lowStock = { status: "skipped" };

  // Task 4: Renew short-lived Outlook subscriptions and process the durable queue.
  try {
    const [subscriptions, inbox] = await Promise.all([
      renewOutlookSubscriptions(),
      processPendingMailboxEvents(),
    ]);
    results.inbox = { subscriptions, ...inbox };
  } catch (e) {
    results.inbox = { error: String(e) };
  }

  // Task 5: Daily operational report. This is isolated from other automation.
  try {
    const report = await generateDailyOperationsReport();
    results.dailyReport = { status: "generated", id: report.id };
  } catch (e) {
    results.dailyReport = { error: String(e) };
  }

  return NextResponse.json({ success: true, results });
}
