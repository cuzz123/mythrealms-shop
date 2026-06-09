// POST /api/email/abandoned-cart — Trigger abandoned cart email sequence

import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/server/rate-limit";

export async function POST(request: NextRequest) {
  const rateLimitResponse = applyRateLimit(request, {
    windowMs: 60_000,
    maxRequests: 5,
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const { email, cartItems, stage } = body;

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.log("Resend not configured — skipping email");
      return NextResponse.json({ skipped: true });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mythrealms-shop.vercel.app";

    const emailConfigs: Record<string, { subject: string; body: string }> = {
      "1h": {
        subject: "Your Guardian is Waiting...",
        body: `Your cart at MythRealms is still waiting. Each piece is handcrafted and limited — once it's gone, it may not return. Free shipping on orders over $69.99. <a href="${baseUrl}/cart">Return to your cart</a>`,
      },
      "24h": {
        subject: "Still Thinking? Here's 15% Off",
        body: `The mythical pieces in your cart are calling. As a thank you for considering us, enjoy 15% off with code MYTH15. <a href="${baseUrl}/cart">Complete your order</a> — this offer expires in 48 hours.`,
      },
      "72h": {
        subject: "Last Chance — Your Mythical Piece",
        body: `This is our final note. Limited edition pieces are not reproduced once sold out. If the guardian you chose is meant for you, now is the time. <a href="${baseUrl}/cart">Return to your cart</a>`,
      },
    };

    const config = emailConfigs[stage || "1h"];
    if (!config) {
      return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "MythRealms <noreply@mythrealms-shop.vercel.app>",
        to: email,
        subject: config.subject,
        html: `<!DOCTYPE html><html><body style="background:#0F0D0E;color:#E8E0D5;font-family:Georgia,serif;padding:40px;max-width:600px;margin:0 auto"><h1 style="color:#D4A84B">MythRealms</h1><p style="font-size:16px;line-height:1.6">${config.body}</p><hr style="border-color:#2A2520;margin:30px 0"><p style="font-size:12px;color:#8A7D6E">MythRealms · Ancient Beasts & Chinese Constellations<br><a href="${baseUrl}" style="color:#D4A84B">${baseUrl}</a><br><br><a href="${baseUrl}/unsubscribe" style="color:#8A7D6E">Unsubscribe</a></p></body></html>`,
      }),
    });

    if (!res.ok) {
      console.error("Resend API error:", await res.text());
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ sent: true, stage });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
