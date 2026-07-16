import { NextRequest, NextResponse } from "next/server";

import { applyRateLimit } from "@/lib/server/rate-limit";
import {
  deliverSupportEmail,
  SupportEmailError,
} from "@/lib/server/support-email";

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "mythrealms@outlook.com";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function readText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = await applyRateLimit(request, {
    windowMs: 5 * 60_000,
    maxRequests: 3,
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const orderId = readText(body.orderId, 100);
    const email = readText(body.email, 254).toLowerCase();
    const reason = readText(body.reason, 100);
    const description = readText(body.description, 3000);

    if (!orderId || !reason || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Order ID, a valid email, and reason are required" },
        { status: 400 },
      );
    }

    await deliverSupportEmail({
      to: SUPPORT_EMAIL,
      replyTo: email,
      subject: `Return Request | Order ${orderId}`,
      html: `<h2>Return Request</h2><p><strong>Order ID:</strong> ${escapeHtml(orderId)}</p><p><strong>Customer Email:</strong> ${escapeHtml(email)}</p><p><strong>Reason:</strong> ${escapeHtml(reason)}</p><p><strong>Details:</strong> ${escapeHtml(description || "N/A").replace(/\n/g, "<br>")}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof SupportEmailError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to submit return request" },
      { status: 500 },
    );
  }
}
