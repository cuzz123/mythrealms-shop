// POST /api/checkout/paypal — Create order for PayPal checkout

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { applyRateLimit } from "@/lib/server/rate-limit";

export async function POST(request: NextRequest) {
  const rateLimitResponse = applyRateLimit(request, {
    windowMs: 60_000,
    maxRequests: 10,
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const { items, email, shippingAddress, discount } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Validate stock
    const variantIds = items.filter((i: any) => i.variantId).map((i: any) => i.variantId);
    if (variantIds.length > 0) {
      const variants = await db.variant.findMany({
        where: { id: { in: variantIds } },
        include: { product: { select: { name: true, isActive: true } } },
      });
      const variantMap = new Map(variants.map((v) => [v.id, v]));
      for (const item of items) {
        if (item.variantId) {
          const variant = variantMap.get(item.variantId);
          if (!variant || variant.stock < (item.quantity || 1)) {
            return NextResponse.json({ error: `Insufficient stock for "${item.name}"` }, { status: 400 });
          }
        }
      }
    }

    // Calculate totals
    let subtotal = 0;
    const productIds = [...new Set(items.map((i: any) => i.productId))] as string[];
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
      include: { variants: true },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));
    for (const item of items) {
      const product = productMap.get(item.productId);
      const variant = product?.variants.find((v: any) => v.id === item.variantId);
      subtotal += Number(variant?.price || 0) * (item.quantity || 1);
    }

    const discountAmount = discount?.amount || 0;
    const shippingCost = subtotal >= 69.99 ? 0 : 4.99;
    const total = Math.max(0, subtotal + shippingCost - discountAmount);

    // Create order in database
    const session = await auth();
    const order = await db.order.create({
      data: {
        email: email || session?.user?.email || "guest@example.com",
        userId: session?.user?.id || undefined,
        subtotal,
        shipping: shippingCost,
        discount: discountAmount,
        total,
        shippingAddress: JSON.stringify(shippingAddress || {}),
        status: "PENDING",
        items: {
          create: items.map((i: any) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
            price: i.price || 0,
            productSnapshot: JSON.stringify(i),
          })),
        },
      },
    });

    // Return order details for PayPal SDK
    const baseUrl = process.env.AUTH_URL || request.nextUrl.origin;
    // Create PayPal order via REST API
    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const paypalSecret = process.env.PAYPAL_CLIENT_SECRET;
    let paypalOrderId: string | null = null;

    if (paypalClientId && paypalSecret) {
      try {
        // Get PayPal access token (sandbox)
        const authRes = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${paypalClientId}:${paypalSecret}`).toString("base64")}`,
          },
          body: "grant_type=client_credentials",
        });
        const authData = await authRes.json();
        const accessToken = authData.access_token;

        // Create PayPal order (sandbox)
        const paypalRes = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [{
              amount: { currency_code: "USD", value: total.toFixed(2) },
              custom_id: order.id,
              description: `MythRealms Order #${order.id.slice(-8)}`,
            }],
            application_context: {
              return_url: `${baseUrl}/checkout/success?orderId=${order.id}`,
              cancel_url: `${baseUrl}/checkout/cancel?orderId=${order.id}`,
            },
          }),
        });
        const paypalData = await paypalRes.json();
        paypalOrderId = paypalData.id;

        // Save PayPal order ID to DB
        if (paypalOrderId) {
          await db.order.update({
            where: { id: order.id },
            data: { stripeSessionId: paypalOrderId },
          });
        }
      } catch (e: any) {
        console.error("PayPal API error:", e.message);
        // Fall through — return DB order without PayPal
      }
    }

    return NextResponse.json({
      orderId: paypalOrderId || order.id,
      dbOrderId: order.id,
      total: Math.round(total * 100) / 100,
      currency: "USD",
      returnUrl: `${baseUrl}/checkout/success?orderId=${order.id}`,
      cancelUrl: `${baseUrl}/checkout/cancel?orderId=${order.id}`,
    });
  } catch (e: any) {
    console.error("PayPal checkout error:", e);
    return NextResponse.json({ error: e?.message || "Checkout failed" }, { status: 500 });
  }
}
