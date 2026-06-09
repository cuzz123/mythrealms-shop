// POST /api/newsletter — Subscribe to newsletter

import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/server/rate-limit";

export async function POST(request: NextRequest) {
  const rateLimitResponse = applyRateLimit(request, {
    windowMs: 60_000,
    maxRequests: 3,
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { email } = await request.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mythrealms-shop.vercel.app";

    // Send welcome email via Resend
    if (apiKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: "MythRealms <noreply@mythrealms-shop.vercel.app>",
          to: email,
          subject: "A Guardian Awaits — Welcome to MythRealms",
          html: `<!DOCTYPE html><html><body style="background:#0F0D0E;color:#E8E0D5;font-family:Georgia,serif;padding:40px;max-width:600px;margin:0 auto"><h1 style="color:#D4A84B;font-size:28px">MythRealms</h1><p style="font-size:16px;line-height:1.7">Welcome to the realm of ancient beasts and celestial guardians.</p><p style="font-size:16px;line-height:1.7">As a thank you for joining, enjoy <strong style="color:#D4A84B">15% off your first order</strong> with code:</p><p style="font-size:24px;font-weight:bold;color:#D4A84B;letter-spacing:4px;text-align:center;padding:20px;border:2px solid #D4A84B;border-radius:8px">MYTH15</p><p style="font-size:16px;line-height:1.7"><a href="${baseUrl}/collections/beast-pendants" style="color:#D4A84B;font-weight:bold">Explore the Bestiary →</a></p><hr style="border-color:#2A2520;margin:30px 0"><p style="font-size:12px;color:#8A7D6E">MythRealms · Ancient Beasts & Chinese Constellations<br><a href="${baseUrl}" style="color:#D4A84B">${baseUrl}</a></p></body></html>`,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
