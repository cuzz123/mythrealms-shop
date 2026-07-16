import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import {
  FulfillmentError,
  fulfillPaidOrderForCheckout,
  type FulfillmentPayment,
} from "@/lib/payments/fulfillment";
import {
  PaymentVerificationError,
  shouldReleasePayPalCaptureReservation,
  verifyPayPalCapture,
} from "@/lib/payments/paypal-verification";
import { applyRateLimit } from "@/lib/server/rate-limit";

const PAYPAL_API = process.env.PAYPAL_API_BASE || "https://api-m.paypal.com";

interface PayPalOrderRecord {
  id: string;
  status: string;
  total: number;
  stripeSessionId: string | null;
  stripePaymentStatus: string | null;
}

function storedPayPalPayment(order: PayPalOrderRecord): FulfillmentPayment | null {
  const prefix = "paypal:paid:";
  if (!order.stripeSessionId || !order.stripePaymentStatus?.startsWith(prefix)) {
    return null;
  }
  const transactionId = order.stripePaymentStatus.slice(prefix.length);
  if (!transactionId) return null;
  return {
    provider: "paypal",
    providerOrderId: order.stripeSessionId,
    transactionId,
    orderId: order.id,
    currency: "USD",
    amountCents: Math.round(order.total * 100),
  };
}

async function paidResponse(order: PayPalOrderRecord, payment: FulfillmentPayment) {
  const result = await fulfillPaidOrderForCheckout(order.id, payment);
  return NextResponse.json({
    success: true,
    orderId: order.id,
    confirmationPending: result.confirmationPending,
  });
}

function errorResponse(error: unknown) {
  if (error instanceof PaymentVerificationError || error instanceof FulfillmentError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof SyntaxError) {
    return NextResponse.json({ error: "Invalid capture request" }, { status: 400 });
  }

  console.error("PayPal capture error:", error);
  return NextResponse.json({ error: "Capture failed" }, { status: 500 });
}

export async function POST(request: NextRequest) {
  const rateLimitResponse = await applyRateLimit(request, {
    windowMs: 60_000,
    maxRequests: 10,
  });
  if (rateLimitResponse) return rateLimitResponse;

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) {
    return NextResponse.json(
      { error: "Please try PayPal again later." },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as {
      paypalOrderId?: unknown;
      dbOrderId?: unknown;
    };
    if (typeof body.paypalOrderId !== "string" || body.paypalOrderId.length === 0) {
      return NextResponse.json({ error: "Missing PayPal order reference" }, { status: 400 });
    }

    const order = await db.order.findUnique({
      where: { stripeSessionId: body.paypalOrderId },
      select: {
        id: true,
        status: true,
        total: true,
        stripeSessionId: true,
        stripePaymentStatus: true,
      },
    });
    if (!order || !order.stripeSessionId) {
      return NextResponse.json({ error: "Order was not found" }, { status: 404 });
    }
    if (typeof body.dbOrderId === "string" && body.dbOrderId !== order.id) {
      return NextResponse.json({ error: "Order reference does not match" }, { status: 409 });
    }
    if (["PAID", "SHIPPED", "DELIVERED"].includes(order.status)) {
      const storedPayment = storedPayPalPayment(order);
      return storedPayment
        ? paidResponse(order, storedPayment)
        : NextResponse.json({ success: true, orderId: order.id });
    }
    if (!["PENDING", "PROCESSING_PAYMENT"].includes(order.status)) {
      return NextResponse.json(
        { error: `Order cannot be captured from ${order.status}` },
        { status: 409 },
      );
    }

    const authResponse = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });
    if (!authResponse.ok) {
      return NextResponse.json({ error: "PayPal authentication failed" }, { status: 502 });
    }
    const authPayload = await authResponse.json();
    if (typeof authPayload?.access_token !== "string") {
      return NextResponse.json({ error: "PayPal returned an invalid response" }, { status: 502 });
    }

    if (order.status === "PENDING") {
      const reservation = await db.order.updateMany({
        where: {
          id: order.id,
          stripeSessionId: body.paypalOrderId,
          status: "PENDING",
        },
        data: { status: "PROCESSING_PAYMENT" },
      });
      if (reservation.count !== 1) {
        const current = await db.order.findUnique({
          where: { id: order.id },
          select: { status: true, stripePaymentStatus: true },
        });
        if (current && ["PAID", "SHIPPED", "DELIVERED"].includes(current.status)) {
          const completedOrder = {
            ...order,
            status: current.status,
            stripePaymentStatus: current.stripePaymentStatus,
          };
          const storedPayment = storedPayPalPayment(completedOrder);
          return storedPayment
            ? paidResponse(completedOrder, storedPayment)
            : NextResponse.json({ success: true, orderId: order.id });
        }
        if (current?.status !== "PROCESSING_PAYMENT") {
          return NextResponse.json(
            { error: `Order cannot be captured from ${current?.status || "missing"}` },
            { status: 409 },
          );
        }
      }
    }

    const captureResponse = await fetch(
      `${PAYPAL_API}/v2/checkout/orders/${encodeURIComponent(body.paypalOrderId)}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authPayload.access_token}`,
          Prefer: "return=representation",
          "PayPal-Request-Id": `capture-${order.id}`,
        },
      },
    );
    const capturePayload = await captureResponse.json().catch(() => ({}));
    if (!captureResponse.ok) {
      console.error("PayPal capture failed:", captureResponse.status);
      const canRetry = shouldReleasePayPalCaptureReservation(
        captureResponse.status,
        capturePayload,
      );
      if (canRetry) {
        await db.order.updateMany({
          where: {
            id: order.id,
            stripeSessionId: body.paypalOrderId,
            status: "PROCESSING_PAYMENT",
          },
          data: { status: "PENDING" },
        });
      }
      return NextResponse.json(
        {
          error: canRetry
            ? "Please try PayPal again later."
            : "PayPal confirmation is pending. Please check your order status.",
        },
        { status: canRetry ? 402 : 502 },
      );
    }

    const payment = verifyPayPalCapture(capturePayload, {
      id: order.id,
      providerOrderId: order.stripeSessionId,
      totalCents: Math.round(order.total * 100),
    });
    return paidResponse(order, payment);
  } catch (error) {
    return errorResponse(error);
  }
}
