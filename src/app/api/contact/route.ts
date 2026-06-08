// POST /api/contact — receive contact form submissions

import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/server/rate-limit";

export async function POST(request: NextRequest) {
  // Rate limit: 3 requests per 5 minutes per IP
  const rateLimitResponse = applyRateLimit(request, {
    windowMs: 5 * 60_000,
    maxRequests: 3,
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // In production: send to email service, CRM, or database
    console.log("Contact form submission:", { name, email, subject, message });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
