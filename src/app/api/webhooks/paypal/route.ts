import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import {
  FulfillmentError,
  fulfillPaidOrder,
} from "@/lib/payments/fulfillment";
import {
  getPayPalRefundOrderPatch,
  PaymentVerificationError,
  verifyPayPalCapture,
  verifyPayPalRefund,
} from "@/lib/payments/paypal-verification";

const PAYPAL_API = process.env.PAYPAL_API_BASE || "https://api-m.paypal.com";

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function relatedOrderId(resource: Record<string, unknown>): string | null {
  const supplementaryData = asRecord(resource.supplementary_data);
  const relatedIds = asRecord(supplementaryData.related_ids);
  return typeof relatedIds.order_id === "string" ? relatedIds.order_id : null;
}

function relatedCaptureId(resource: Record<string, unknown>): string | null {
  const supplementaryData = asRecord(resource.supplementary_data);
  const relatedIds = asRecord(supplementaryData.related_ids);
  return typeof relatedIds.capture_id === "string" ? relatedIds.capture_id : null;
}

async function verifyPayPalWebhook(request: NextRequest, rawEvent: string): Promise<boolean> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!clientId || !secret || !webhookId) return false;

  try {
    const authResponse = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });
    if (!authResponse.ok) return false;
    const authPayload = await authResponse.json();
    if (typeof authPayload?.access_token !== "string") return false;

    const verificationFields = JSON.stringify({
      auth_algo: request.headers.get("paypal-auth-algo") || "",
      cert_url: request.headers.get("paypal-cert-url") || "",
      transmission_id: request.headers.get("paypal-transmission-id") || "",
      transmission_sig: request.headers.get("paypal-transmission-sig") || "",
      transmission_time: request.headers.get("paypal-transmission-time") || "",
      webhook_id: webhookId,
    });
    const verificationBody = `${verificationFields.slice(0, -1)},"webhook_event":${rawEvent}}`;

    const verifyResponse = await fetch(
      `${PAYPAL_API}/v1/notifications/verify-webhook-signature`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authPayload.access_token}`,
        },
        body: verificationBody,
      },
    );
    if (!verifyResponse.ok) return false;
    const verifyPayload = await verifyResponse.json();
    return verifyPayload?.verification_status === "SUCCESS";
  } catch (error) {
    console.error("PayPal webhook verification error:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const event = JSON.parse(rawBody) as unknown;
    if (!(await verifyPayPalWebhook(request, rawBody))) {
      return NextResponse.json({ error: "Verification failed" }, { status: 400 });
    }

    const eventRecord = asRecord(event);
    const eventType = eventRecord.event_type;
    const resource = asRecord(eventRecord.resource);
    const providerOrderId = relatedOrderId(resource);

    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      if (!providerOrderId) {
        throw new PaymentVerificationError("PayPal provider order is missing");
      }
      const order = await db.order.findUnique({
        where: { stripeSessionId: providerOrderId },
        select: { id: true, total: true, stripeSessionId: true },
      });
      if (!order?.stripeSessionId) {
        return NextResponse.json({ error: "Order was not found" }, { status: 404 });
      }

      const payment = verifyPayPalCapture(
        {
          id: providerOrderId,
          status: "COMPLETED",
          purchase_units: [
            {
              custom_id: resource.custom_id,
              payments: { captures: [resource] },
            },
          ],
        },
        {
          id: order.id,
          providerOrderId: order.stripeSessionId,
          totalCents: Math.round(order.total * 100),
        },
      );
      await fulfillPaidOrder(order.id, payment);
    }

    if (eventType === "PAYMENT.CAPTURE.REFUNDED" && providerOrderId) {
      const captureId = relatedCaptureId(resource);
      const order = await db.order.findUnique({
        where: { stripeSessionId: providerOrderId },
        select: { id: true, total: true, stripePaymentStatus: true },
      });
      if (
        order &&
        captureId &&
        order.stripePaymentStatus?.endsWith(`:${captureId}`)
      ) {
        const refund = verifyPayPalRefund(resource, {
          totalCents: Math.round(order.total * 100),
        });
        const patch = getPayPalRefundOrderPatch(refund, captureId);
        await db.order.updateMany({
          where: {
            id: order.id,
            status: { in: ["PAID", "SHIPPED", "DELIVERED"] },
          },
          data: patch,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    if (error instanceof PaymentVerificationError || error instanceof FulfillmentError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("PayPal webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
