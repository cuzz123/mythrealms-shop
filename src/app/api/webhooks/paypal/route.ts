// POST /api/webhooks/paypal — Handle PayPal payment events

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

async function verifyPayPalWebhook(request: NextRequest, body: string): Promise<boolean> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) {
    console.error("PayPal webhook: missing credentials for verification");
    return false;
  }
  try {
    // Get access token
    const authRes = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });
    if (!authRes.ok) return false;
    const authData = await authRes.json();

    // Verify webhook signature
    const verifyRes = await fetch("https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData.access_token}`,
      },
      body: JSON.stringify({
        auth_algo: request.headers.get("paypal-auth-algo") || "",
        cert_url: request.headers.get("paypal-cert-url") || "",
        transmission_id: request.headers.get("paypal-transmission-id") || "",
        transmission_sig: request.headers.get("paypal-transmission-sig") || "",
        transmission_time: request.headers.get("paypal-transmission-time") || "",
        webhook_id: clientId,
        webhook_event: JSON.parse(body),
      }),
    });
    if (!verifyRes.ok) return false;
    const verifyData = await verifyRes.json();
    return verifyData.verification_status === "SUCCESS";
  } catch (e) {
    console.error("PayPal webhook verification error:", e);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const event = JSON.parse(body);

    // Verify webhook signature
    const verified = await verifyPayPalWebhook(request, body);
    if (!verified) {
      console.warn("PayPal webhook: signature verification failed");
      return NextResponse.json({ error: "Verification failed" }, { status: 400 });
    }

    const eventType = event.event_type;
    console.log(`PayPal webhook: ${eventType}`);

    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const resource = event.resource;
      const customId = resource?.custom_id; // order ID we passed
      const paypalOrderId = resource?.id;

      if (customId) {
        const order = await db.order.findUnique({ where: { id: customId } });
        if (order && order.status !== "PAID") {
          await db.order.update({
            where: { id: customId },
            data: {
              status: "PAID",
              stripeSessionId: paypalOrderId,
              stripePaymentStatus: "paid",
            },
          });

          // Decrease stock
          const orderWithItems = await db.order.findUnique({
            where: { id: customId },
            include: { items: true },
          });
          if (orderWithItems) {
            for (const item of orderWithItems.items) {
              if (item.variantId) {
                await db.$executeRawUnsafe(
                  `UPDATE "Variant" SET stock = stock - $1 WHERE id = $2 AND stock >= $1`,
                  item.quantity, item.variantId
                );
              }
            }
          }

          // Send confirmation email
          try {
            const { sendOrderConfirmation } = await import("@/lib/email");
            const emailItems = orderWithItems!.items.map((item) => ({
              name: item.productSnapshot ? JSON.parse(item.productSnapshot).name || "Product" : "Product",
              quantity: item.quantity,
              price: item.price,
            }));
            await sendOrderConfirmation(order.email, order.id, order.total, emailItems);
          } catch (e) { console.error("Email failed:", e); }
        }
      }
    }

    if (eventType === "PAYMENT.CAPTURE.REFUNDED") {
      const customId = event.resource?.custom_id;
      if (customId) {
        await db.order.update({
          where: { id: customId },
          data: { status: "REFUNDED" },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    console.error("PayPal webhook error:", e);
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
