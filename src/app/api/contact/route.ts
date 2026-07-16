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
    const name = readText(body.name, 100);
    const email = readText(body.email, 254).toLowerCase();
    const subject = readText(body.subject, 160) || "New message";
    const message = readText(body.message, 5000);

    if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Name, a valid email, and message are required" },
        { status: 400 },
      );
    }

    await deliverSupportEmail({
      to: SUPPORT_EMAIL,
      replyTo: email,
      subject: `Contact: ${subject} from ${name}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Subject:</strong> ${escapeHtml(subject)}</p><p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof SupportEmailError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}
