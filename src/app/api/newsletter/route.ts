import { NextRequest, NextResponse } from "next/server";

import { applyRateLimit } from "@/lib/server/rate-limit";
import { isSameOriginRequest } from "@/lib/server/admin-auth";

export async function POST(request: NextRequest) {
  const rateLimitResponse = await applyRateLimit(request, {
    windowMs: 60_000,
    maxRequests: 3,
  });
  if (rateLimitResponse) return rateLimitResponse;

  if (!isSameOriginRequest(request.url, request.headers.get("origin"))) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as { email?: unknown };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (!apiKey || !audienceId) {
      return NextResponse.json(
        { error: "Newsletter signup is temporarily unavailable" },
        { status: 503 },
      );
    }

    const response = await fetch(
      `https://api.resend.com/audiences/${encodeURIComponent(audienceId)}/contacts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      },
    );
    if (!response.ok) {
      console.error("Resend contact creation failed:", response.status);
      return NextResponse.json(
        { error: "Newsletter signup is temporarily unavailable" },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Newsletter signup failed:", error);
    return NextResponse.json({ error: "Newsletter signup failed" }, { status: 500 });
  }
}
