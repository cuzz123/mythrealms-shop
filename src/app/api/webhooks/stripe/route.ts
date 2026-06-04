// Stripe Webhook — Handle payment success/failure
// POST /api/webhooks/stripe

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the event — with idempotency check
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        // Idempotency: skip if already processed
        const existingOrder = await db.order.findUnique({ where: { id: orderId } });
        if (existingOrder?.status === "PAID") {
          console.log(`Order ${orderId} already marked PAID — skipping duplicate webhook`);
          break;
        }

        await db.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            stripePaymentStatus: session.payment_status,
            shippingAddress: JSON.stringify((session as any).shipping_details || (session as any).shipping || {}),
          },
        });

        // Decrease stock for purchased variants
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

          // Send order confirmation email
          const emailItems = order.items.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.price,
          }));
          const { sendOrderConfirmation } = await import("@/lib/email");
        await sendOrderConfirmation(order.email, order.id, order.total, emailItems);
        }
      }
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        await db.order.update({
          where: { id: orderId },
          data: { status: "CANCELLED" },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
