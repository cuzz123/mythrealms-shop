// POST /api/checkout/paypal/capture — Capture an approved PayPal order and mark it paid

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { applyRateLimit } from "@/lib/server/rate-limit";

const PAYPAL_API = process.env.PAYPAL_API_BASE || "https://api-m.paypal.com";

export async function POST(request: NextRequest) {
  const rateLimitResponse = applyRateLimit(request, {
    windowMs: 60_000,
    maxRequests: 10,
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { paypalOrderId, dbOrderId } = await request.json();
    if (!paypalOrderId || !dbOrderId) {
      return NextResponse.json({ error: "Missing order reference" }, { status: 400 });
    }

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_CLIENT_SECRET;
    if (!clientId || !secret) {
      return NextResponse.json({ error: "PayPal is not configured" }, { status: 500 });
    }

    // Access token
    const authRes = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });
    if (!authRes.ok) {
      return NextResponse.json({ error: "PayPal authentication failed" }, { status: 502 });
    }
    const { access_token } = await authRes.json();

    // Capture the approved order
    const capRes = await fetch(`${PAYPAL_API}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
    const capData = await capRes.json();

    if (!capRes.ok || capData.status !== "COMPLETED") {
      console.error("PayPal capture failed:", capRes.status, JSON.stringify(capData));
      return NextResponse.json({ error: "Payment was not completed" }, { status: 402 });
    }

    // Mark order PAID (idempotent) + decrement stock + send confirmation.
    // The webhook does the same, guarded by status !== "PAID", so whichever
    // fires first wins and the other is a no-op.
    const order = await db.order.findUnique({
      where: { id: dbOrderId },
      include: { items: true },
    });
    if (order && order.status !== "PAID") {
      await db.order.update({
        where: { id: dbOrderId },
        data: {
          status: "PAID",
          stripeSessionId: paypalOrderId,
          stripePaymentStatus: "paid",
        },
      });

      for (const item of order.items) {
        if (item.variantId) {
          await db.$executeRawUnsafe(
            `UPDATE "Variant" SET stock = stock - $1 WHERE id = $2 AND stock >= $1`,
            item.quantity, item.variantId
          );
        }
      }

      try {
        const { sendOrderConfirmation } = await import("@/lib/email");
        const emailItems = order.items.map((item) => ({
          name: item.productSnapshot ? JSON.parse(item.productSnapshot).name || "Product" : "Product",
          quantity: item.quantity,
          price: item.price,
        }));
        await sendOrderConfirmation(order.email, order.id, order.total, emailItems);
      } catch (e) {
        console.error("Email failed:", e);
      }
    }

    return NextResponse.json({ success: true, orderId: dbOrderId });
  } catch (e: any) {
    console.error("PayPal capture error:", e);
    return NextResponse.json({ error: e?.message || "Capture failed" }, { status: 500 });
  }
}
