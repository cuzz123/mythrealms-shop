// ============================================================
// SEO 自动化 — 总调度器
// Vercel Cron 每天 2am UTC 调此端点 → 分发到各子任务
// 当前: SEO 文章生成 → 后续可加: 库存预警 / 日报 / Pinterest / TikTok
// ============================================================

/**
 * GET /api/cron/daily
 * Master daily cron — runs all automated tasks.
 * Vercel Cron triggers this at 2am UTC daily.
 */

import { NextRequest, NextResponse } from "next/server";

const CRON_SECRET = process.env.CRON_SECRET || "";

export async function GET(req: NextRequest) {
  if (CRON_SECRET) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

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

  // Task 2: Low stock alert (placeholder)
  results.lowStock = { status: "skipped" };

  // Task 3: Daily report (placeholder)
  results.dailyReport = { status: "skipped" };

  return NextResponse.json({ success: true, results });
}
