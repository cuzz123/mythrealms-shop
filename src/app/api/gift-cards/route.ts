// POST /api/gift-cards — Purchase and send a digital gift card

import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/server/rate-limit";

function generateGiftCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `MYTH-GIFT-${code}`;
}

export async function POST(request: NextRequest) {
  // Rate limit: 3 gift card purchases per 5 minutes per IP
  const rateLimitResponse = await applyRateLimit(request, {
    windowMs: 5 * 60_000,
    maxRequests: 3,
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const { amount, recipientName, recipientEmail, message, senderEmail } = body;

    // Validate required fields
    if (!amount || typeof amount !== "number" || amount < 1) {
      return NextResponse.json(
        { error: "A valid gift card amount is required." },
        { status: 400 }
      );
    }
    if (!recipientName || typeof recipientName !== "string" || !recipientName.trim()) {
      return NextResponse.json(
        { error: "Recipient name is required." },
        { status: 400 }
      );
    }
    if (
      !recipientEmail ||
      typeof recipientEmail !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)
    ) {
      return NextResponse.json(
        { error: "A valid recipient email is required." },
        { status: 400 }
      );
    }
    if (
      !senderEmail ||
      typeof senderEmail !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)
    ) {
      return NextResponse.json(
        { error: "A valid sender email is required." },
        { status: 400 }
      );
    }

    const code = generateGiftCode();
    const safeMessage = message?.trim() || "";
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://mythrealms-shop.vercel.app";

    // TODO: Future DB model — create a GiftCard table with fields:
    //   id, code, amount, recipientName, recipientEmail, message, senderEmail,
    //   purchasedAt, redeemedAt, redeemedByOrderId, status (active/redeemed/expired)
    // For now, we generate the code and send the email without persistence.

    // Send gift card email to recipient via Resend
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const senderName = senderEmail.split("@")[0] || "Someone";
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: "MythRealms <onboarding@resend.dev>",
          to: recipientEmail,
          subject: `${senderName} sent you a $${amount} MythRealms Gift Card!`,
          html: `<!DOCTYPE html><html><body style="background:#0A0808;color:#E8E0D5;font-family:Georgia,serif;padding:40px;max-width:600px;margin:0 auto"><h1 style="color:#D4A84B;font-size:28px">You've Received a MythRealms Gift Card</h1><p style="font-size:16px;line-height:1.7">${senderName} has sent you a <strong style="color:#D4A84B">$${amount} gift card</strong> to MythRealms — where every stone carries an intention.</p>${
            safeMessage
              ? `<div style="background:#1A1510;border-left:3px solid #D4A84B;padding:16px 20px;margin:20px 0;border-radius:4px"><p style="font-size:16px;line-height:1.7;font-style:italic;margin:0">"${safeMessage}"</p><p style="font-size:13px;color:#8A7D6E;margin:8px 0 0">&mdash; ${senderName}</p></div>`
              : ""
          }<div style="background:#1A1510;border:2px solid #D4A84B;border-radius:12px;padding:24px;text-align:center;margin:24px 0"><p style="font-size:13px;color:#8A7D6E;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px">Gift Card Code</p><p style="font-size:28px;font-weight:bold;color:#D4A84B;letter-spacing:3px;margin:0;font-family:monospace">${code}</p><p style="font-size:18px;color:#E8E0D5;margin:12px 0 0"><strong>$${amount}</strong></p></div><p style="font-size:16px;line-height:1.7">To redeem, enter this code at checkout. Browse the collections and find the stone that names what you are becoming.</p><p style="font-size:16px;line-height:1.7"><a href="${baseUrl}/collections/curated-singles" style="display:inline-block;padding:14px 32px;background:#D4A84B;color:#0A0808;text-decoration:none;border-radius:9999px;font-weight:bold;margin-top:8px">Shop The Archetypes</a></p><hr style="border-color:#2A241F;margin:30px 0"><p style="font-size:12px;color:#8A7D6E">MythRealms · Stones With Intention<br>This gift card never expires. Redeemable on any MythRealms piece.</p></body></html>`,
        }),
      });
    } else {
      console.log("Gift card email skipped (no RESEND_API_KEY):", code);
    }

    return NextResponse.json({ success: true, code });
  } catch {
    return NextResponse.json(
      { error: "Failed to process gift card. Please try again." },
      { status: 500 }
    );
  }
}
