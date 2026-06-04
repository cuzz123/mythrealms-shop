// POST /api/checkout — Create LemonSqueezy Checkout
// LemonSqueezy is MoR (Merchant of Record), handles global tax + payments

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createCheckout } from "@/lib/lemonsqueezy";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, email, shippingAddress } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Validate stock
    for (const item of items) {
      if (item.variantId) {
        const variant = await db.variant.findUnique({ where: { id: item.variantId } });
        if (!variant || variant.stock < item.quantity) {
          return NextResponse.json(
            { error: `Insufficient stock for "${item.name}". Available: ${variant?.stock ?? 0}` },
            { status: 400 }
          );
        }
      }
    }

    // Calculate totals from database prices
    let subtotal = 0;
    const lineItems = await Promise.all(
      items.map(async (item: any) => {
        const product = await db.product.findUnique({
          where: { id: item.productId },
          include: { variants: true },
        });
        const variant = product?.variants.find((v) => v.id === item.variantId);
        const price = variant?.price || 0;
        subtotal += Number(price) * item.quantity;
        return {
          name: variant ? `${product?.name} — ${variant.name}` : product?.name || "Product",
          price: Number(price),
          quantity: item.quantity,
        };
      })
    );

    // Create order in database
    const order = await db.order.create({
      data: {
        email: email || "guest@example.com",
        subtotal,
        shipping: subtotal >= 69.99 ? 0 : 4.99,
        total: subtotal >= 69.99 ? subtotal : subtotal + 4.99,
        shippingAddress: JSON.stringify(shippingAddress || {}),
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price || 0,
            productSnapshot: item,
          })),
        },
      },
    });

    // Create LemonSqueezy checkout
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;

    if (!storeId || !variantId) {
      // If LemonSqueezy not configured, return order confirmation directly (demo mode)
      console.warn("LemonSqueezy not configured — running in demo mode");
      return NextResponse.json({
        url: `${process.env.AUTH_URL || request.nextUrl.origin}/checkout/success?orderId=${order.id}`,
        demo: true,
      });
    }

    const baseUrl = process.env.AUTH_URL || request.nextUrl.origin;
    const checkout = await createCheckout({
      storeId,
      variantId,
      email,
      name: shippingAddress?.name || email,
      successUrl: `${baseUrl}/checkout/success?orderId=${order.id}`,
      cancelUrl: `${baseUrl}/checkout/cancel`,
      customData: { orderId: order.id },
    });

    // Update order with checkout ID
    await db.order.update({
      where: { id: order.id },
      data: { stripeSessionId: checkout.id }, // reuse this field for LemonSqueezy checkout ID
    });

    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}
