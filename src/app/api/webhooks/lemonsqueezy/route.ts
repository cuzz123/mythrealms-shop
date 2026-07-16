import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import {
  FulfillmentError,
  fulfillPaidOrder,
} from "@/lib/payments/fulfillment";
import {
  LemonSqueezyVerificationError,
  verifyLemonSqueezyOrder,
  verifyLemonSqueezyRefund,
} from "@/lib/payments/lemonsqueezy-verification";

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function hasValidSignature(body: string, signature: string, secret: string): boolean {
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");
  return (
    expectedBuffer.length === signatureBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
  );
}

export async function POST(request: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  if (!secret || !storeId) {
    console.error("Lemon Squeezy webhook credentials are not configured");
    return NextResponse.json({ error: "Webhook is not configured" }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get("x-signature") || "";
  if (!hasValidSignature(body, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const event = JSON.parse(body) as unknown;
    const root = asRecord(event);
    const meta = asRecord(root.meta);
    const customData = asRecord(meta.custom_data);
    const data = asRecord(root.data);
    const orderId =
      typeof customData.orderId === "string" ? customData.orderId : null;

    if (meta.event_name === "order_created") {
      if (!orderId) {
        throw new LemonSqueezyVerificationError(
          "Lemon Squeezy database order is missing",
        );
      }
      const order = await db.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          total: true,
          stripeSessionId: true,
          stripePaymentStatus: true,
        },
      });
      if (
        !order?.stripeSessionId ||
        !order.stripePaymentStatus?.startsWith("lemonsqueezy:")
      ) {
        return NextResponse.json({ error: "Order was not found" }, { status: 404 });
      }

      const payment = verifyLemonSqueezyOrder(event, {
        id: order.id,
        providerCheckoutId: order.stripeSessionId,
        totalCents: Math.round(order.total * 100),
        storeId,
        paymentBindingSecret: secret,
      });
      await fulfillPaidOrder(order.id, payment);
    }

    if (meta.event_name === "order_refunded" && orderId) {
      const order = await db.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          total: true,
          stripeSessionId: true,
          stripePaymentStatus: true,
        },
      });
      if (
        order?.stripeSessionId &&
        order.stripePaymentStatus?.startsWith("lemonsqueezy:")
      ) {
        const refund = verifyLemonSqueezyRefund(event, {
          id: order.id,
          providerCheckoutId: order.stripeSessionId,
          totalCents: Math.round(order.total * 100),
          storeId,
          paymentBindingSecret: secret,
        });
        if (!order.stripePaymentStatus.endsWith(`:${refund.transactionId}`)) {
          throw new LemonSqueezyVerificationError(
            "Lemon Squeezy refund transaction does not match",
          );
        }
        await db.order.updateMany({
          where: {
            id: order.id,
            status: { in: ["PAID", "SHIPPED", "DELIVERED"] },
          },
          data: {
            ...(refund.outcome === "full" ? { status: "REFUNDED" } : {}),
            stripePaymentStatus: `lemonsqueezy:${refund.outcome === "full" ? "refunded" : "partial-refund"}:${refund.transactionId}`,
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    if (
      error instanceof LemonSqueezyVerificationError ||
      error instanceof FulfillmentError
    ) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    console.error("Lemon Squeezy webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
