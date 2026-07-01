// GET /api/automation/low-stock-alert — Check stock levels & send alert email
// Intended for Vercel Cron: every day at 09:00

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "zheng111321@gmail.com";

export async function GET() {
  try {
    const lowStockVariants = await db.variant.findMany({
      where: { stock: { lte: 5 } },
      include: { product: { select: { name: true, slug: true } } },
      orderBy: { stock: "asc" },
    });

    if (lowStockVariants.length === 0) {
      return NextResponse.json({ checked: true, alerts: [], message: "No low-stock items found." });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        checked: true,
        lowStockItems: lowStockVariants.length,
        error: "RESEND_API_KEY not configured — alert not sent",
      }, { status: 200 });
    }

    const base = process.env.NEXT_PUBLIC_APP_URL || "https://mythrealms-shop.vercel.app";

    const rowsHtml = lowStockVariants
      .map(
        (v) => `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;">${v.product.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;color:#8B7E6B;">${v.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;font-size:13px;font-weight:600;color:${v.stock === 0 ? "#c0392b" : "#e67e22"};">${v.stock}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;font-size:12px;">
            <a href="${base}/admin/products/${v.product.slug}" style="color:#D4A84B;text-decoration:none;">Restock</a>
          </td>
        </tr>`
      )
      .join("");

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8f5f2;font-family:Arial,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 20px;">
  <div style="text-align:center;padding-bottom:24px;">
    <h1 style="font-family:Georgia,serif;font-size:26px;color:#1A1814;margin:0;">MythRealms</h1>
    <p style="font-size:12px;color:#8B7E6B;">Low Stock Alert</p>
  </div>
  <div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #e8e3db;">
    <div style="text-align:center;margin-bottom:16px;">
      <span style="display:inline-block;background:#fef0f0;border-radius:50%;width:48px;height:48px;line-height:48px;font-size:24px;">&#9888;</span>
    </div>
    <h2 style="font-size:18px;color:#1A1814;text-align:center;margin:0 0 4px;">${lowStockVariants.length} Items Low on Stock</h2>
    <p style="font-size:13px;color:#8B7E6B;text-align:center;margin:0 0 20px;">These products need restocking soon.</p>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="background:#f8f5f2;">
          <th style="padding:8px 12px;text-align:left;font-size:11px;color:#8B7E6B;text-transform:uppercase;">Product</th>
          <th style="padding:8px 12px;text-align:left;font-size:11px;color:#8B7E6B;text-transform:uppercase;">Variant</th>
          <th style="padding:8px 12px;text-align:center;font-size:11px;color:#8B7E6B;text-transform:uppercase;">Stock</th>
          <th style="padding:8px 12px;text-align:center;font-size:11px;color:#8B7E6B;text-transform:uppercase;"></th>
        </tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
    </table>
  </div>
  <p style="font-size:10px;color:#c4bab0;text-align:center;margin:20px 0 0;">Automated stock alert from MythRealms operations pipeline.</p>
</div>
</body></html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "MythRealms <onboarding@resend.dev>",
        to: ADMIN_EMAIL,
        subject: `MythRealms Stock Alert — ${lowStockVariants.length} items low`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: "Resend API error", detail: err.slice(0, 300) }, { status: 500 });
    }

    return NextResponse.json({
      sent: true,
      lowStockItems: lowStockVariants.length,
      items: lowStockVariants.map((v) => ({
        product: v.product.name,
        variant: v.name,
        stock: v.stock,
      })),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
