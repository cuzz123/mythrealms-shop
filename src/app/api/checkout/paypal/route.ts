import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { createPendingOrder } from "@/lib/checkout/create-order";
import { prismaDiscountRepository } from "@/lib/checkout/discount";
import { CheckoutQuoteError, quoteCheckout } from "@/lib/checkout/quote";
import {
  CheckoutInputError,
  parseCheckoutRequest,
} from "@/lib/checkout/validation";
import { db } from "@/lib/db";
import { applyRateLimit } from "@/lib/server/rate-limit";

const PAYPAL_API = process.env.PAYPAL_API_BASE || "https://api-m.paypal.com";

function errorResponse(error: unknown) {
  if (error instanceof CheckoutInputError || error instanceof CheckoutQuoteError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof SyntaxError) {
    return NextResponse.json({ error: "Invalid checkout request" }, { status: 400 });
  }

  console.error("PayPal checkout error:", error);
  return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
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
    const input = parseCheckoutRequest(await request.json());
    const quote = await quoteCheckout(input, prismaDiscountRepository);

    const authResponse = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });
    if (!authResponse.ok) {
      return NextResponse.json(
        { error: "Please try PayPal again later." },
        { status: 502 },
      );
    }

    const authPayload = await authResponse.json();
    if (typeof authPayload?.access_token !== "string") {
      return NextResponse.json(
        { error: "PayPal returned an invalid response." },
        { status: 502 },
      );
    }

    const session = await auth();
    const order = await createPendingOrder(input, quote, session?.user?.id);
    const baseUrl = process.env.AUTH_URL || request.nextUrl.origin;
    const paypalResponse = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authPayload.access_token}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: (quote.totalCents / 100).toFixed(2),
            },
            custom_id: order.id,
            description: `MythRealms Order #${order.id.slice(-8)}`,
          },
        ],
        application_context: {
          return_url: `${baseUrl}/checkout/success?orderId=${order.id}`,
          cancel_url: `${baseUrl}/checkout/cancel?orderId=${order.id}`,
        },
      }),
    });
    if (!paypalResponse.ok) {
      console.error("PayPal order creation failed:", paypalResponse.status);
      return NextResponse.json(
        { error: "Please try PayPal again later." },
        { status: 502 },
      );
    }

    const paypalPayload = await paypalResponse.json();
    if (typeof paypalPayload?.id !== "string") {
      return NextResponse.json(
        { error: "PayPal returned an invalid response." },
        { status: 502 },
      );
    }

    await db.order.update({
      where: { id: order.id },
      data: {
        stripeSessionId: paypalPayload.id,
        stripePaymentStatus: "paypal:pending",
      },
    });

    return NextResponse.json({
      orderId: paypalPayload.id,
      dbOrderId: order.id,
      total: quote.totalCents / 100,
      currency: "USD",
      returnUrl: `${baseUrl}/checkout/success?orderId=${order.id}`,
      cancelUrl: `${baseUrl}/checkout/cancel?orderId=${order.id}`,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
