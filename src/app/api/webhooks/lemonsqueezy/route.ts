// LemonSqueezy Webhook — Handle order events
// POST /api/webhooks/lemonsqueezy

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-signature") || "";

  // Verify webhook signature
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (secret) {
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(body);
    const digest = hmac.digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  }

  let event: any;
  try { event = JSON.parse(body); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = event.meta?.event_name;
  console.log(`LemonSqueezy webhook: ${eventName}`);

  switch (eventName) {
    case "order_created": {
      const orderData = event.data;
      const customData = orderData.attributes.custom_data || {};
      const orderId = customData.orderId || orderData.attributes.first_order_item?.order_id;

      if (orderId) {
        // Idempotency check
        const existing = await db.order.findUnique({ where: { id: orderId } });
        if (existing?.status === "PAID") break;

        await db.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            stripePaymentStatus: "paid",
            shippingAddress: JSON.stringify(orderData.attributes.shipping || {}),
          },
        });

        // Decrease stock
        const order = await db.order.findUnique({
          where: { id: orderId },
          include: { items: { include: { product: true } } },
        });

        if (order) {
          for (const item of order.items) {
            if (item.variantId) {
              await db.variant.update({
                where: { id: item.variantId },
                data: { stock: { decrement: item.quantity } },
              });
            }
          }

          // Send confirmation email
          try {
            const { sendOrderConfirmation } = await import("@/lib/email");
            const emailItems = order.items.map((item) => ({
              name: item.product.name,
              quantity: item.quantity,
              price: item.price,
            }));
            await sendOrderConfirmation(order.email, order.id, order.total, emailItems);
          } catch (e) { console.error("Email failed:", e); }
        }
      }
      break;
    }

    case "order_refunded": {
      const orderId = event.data.attributes.custom_data?.orderId;
      if (orderId) {
        await db.order.update({
          where: { id: orderId },
          data: { status: "REFUNDED" },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
