// POST /api/webhooks/paypal — Handle PayPal payment events

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventType = body.event_type;

    // Verify webhook (production: validate signature with PayPal SDK)
    // For now, accept the event and process it

    console.log(`PayPal webhook: ${eventType}`);

    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const resource = body.resource;
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
                await db.variant.update({
                  where: { id: item.variantId },
                  data: { stock: { decrement: item.quantity } },
                });
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
      const customId = body.resource?.custom_id;
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
