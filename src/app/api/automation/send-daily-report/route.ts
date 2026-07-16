// GET /api/automation/send-daily-report — Fetch metrics & send via Resend email
// Intended for Vercel Cron: every day at 08:00

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireCron } from "@/lib/automation-auth";
import { getErrorMessage } from "@/lib/error-message";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "zheng111321@gmail.com";
const BRAND = "MythRealms";

function buildHtml(date: string, metrics: Record<string, unknown>, alerts: string[]): string {
  const itemsHtml = Object.entries(metrics)
    .map(([k, v]) => `<tr>
      <td style="padding:10px 0;border-bottom:1px solid #eee;color:#1A1814;font-size:14px;">${k}</td>
      <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;color:#1A1814;font-size:16px;font-weight:600;">${v}</td>
    </tr>`)
    .join("");

  const alertsHtml = alerts.length
    ? alerts.map((a) => `<p style="color:#c0392b;font-size:13px;">&#9888; ${a}</p>`).join("")
    : "";

  const base = process.env.NEXT_PUBLIC_APP_URL || "https://mythrealms-shop.vercel.app";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8f5f2;font-family:Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 20px;">
  <div style="text-align:center;padding-bottom:24px;">
    <h1 style="font-family:Georgia,serif;font-size:26px;color:#1A1814;margin:0;">${BRAND}</h1>
    <p style="font-size:12px;color:#8B7E6B;">Daily Operations Report</p>
  </div>
  <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e8e3db;">
    <h2 style="font-size:18px;color:#1A1814;margin:0 0 16px;">&#128202; ${date}</h2>
    <table style="width:100%;border-collapse:collapse;">${itemsHtml}</table>
    ${alertsHtml ? `<div style="margin-top:20px;padding-top:16px;border-top:2px solid #1A1814;">${alertsHtml}</div>` : ""}
    <div style="text-align:center;margin-top:24px;">
      <a href="${base}/admin/orders" style="display:inline-block;padding:10px 28px;background:#1A1814;color:#fff;text-decoration:none;border-radius:9999px;font-size:13px;font-weight:600;">View Orders</a>
    </div>
  </div>
  <p style="font-size:10px;color:#c4bab0;text-align:center;margin:20px 0 0;">Automated daily report from ${BRAND} operations pipeline.</p>
</div>
</body></html>`;
}

export async function GET(request: NextRequest) {
  const unauthorized = requireCron(request);
  if (unauthorized) return unauthorized;

  try {
    const [ordersToday, ordersPending, totalOrders, lowStock, totalProducts] = await Promise.all([
      db.order.count({ where: { createdAt: { gte: new Date(Date.now() - 86400000) } } }),
      db.order.count({ where: { status: "PAID" } }),
      db.order.count(),
      db.variant.count({ where: { stock: { lte: 5 } } }),
      db.product.count({ where: { isActive: true } }),
    ]);

    const revenue = await db.order.aggregate({
      _sum: { total: true },
      where: { status: "PAID" },
    });

    const date = new Date().toISOString().slice(0, 10);
    const metrics = {
      "Orders Today": ordersToday,
      "Pending Shipment": ordersPending,
      "Total Orders": totalOrders,
      "Total Revenue": `$${Number(revenue._sum.total || 0).toFixed(2)}`,
      "Low Stock Items": lowStock,
      "Active Products": totalProducts,
    };

    const alerts: string[] = [];
    if (lowStock > 0) alerts.push(`${lowStock} products are low on stock (<=5 units).`);

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ...metrics, error: "RESEND_API_KEY not configured — email not sent" }, { status: 200 });
    }

    const html = buildHtml(date, metrics, alerts);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "MythRealms <onboarding@resend.dev>",
        to: ADMIN_EMAIL,
        subject: `${BRAND} Daily Report — ${date}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: "Resend API error", detail: err.slice(0, 300) }, { status: 500 });
    }

    return NextResponse.json({ sent: true, date, metrics, alerts });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error, "Failed to send daily report") }, { status: 500 });
  }
}
