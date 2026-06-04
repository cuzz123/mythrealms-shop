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

    // Step 1: Validate stock
    try {
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
    } catch (e: any) {
      return NextResponse.json({ error: "DB stock check: " + e.message }, { status: 500 });
    }

    // Step 2: Calculate totals
    let subtotal = 0;
    await Promise.all(
      items.map(async (item: any) => {
        const product = await db.product.findUnique({
          where: { id: item.productId },
          include: { variants: true },
        });
        const variant = product?.variants.find((v) => v.id === item.variantId);
        const price = variant?.price || 0;
        subtotal += Number(price) * item.quantity;
      })
    );

    // Step 3: Create order
    let order;
    try {
      order = await db.order.create({
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
              productSnapshot: JSON.stringify(item),
            })),
          },
        },
      });
    } catch (e: any) {
      return NextResponse.json({ error: "DB order create: " + e.message }, { status: 500 });
    }

    // Step 4: LemonSqueezy
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;

    if (!storeId || !variantId) {
      return NextResponse.json({
        url: `${process.env.AUTH_URL || request.nextUrl.origin}/checkout/success?orderId=${order.id}`,
        demo: true,
      });
    }

    const baseUrl = process.env.AUTH_URL || request.nextUrl.origin;
    try {
      const checkout = await createCheckout({
        storeId,
        variantId,
        email,
        name: shippingAddress?.name || email,
        successUrl: `${baseUrl}/checkout/success?orderId=${order.id}`,
        cancelUrl: `${baseUrl}/checkout/cancel`,
        customData: { orderId: order.id },
      });

      await db.order.update({
        where: { id: order.id },
        data: { stripeSessionId: checkout.id },
      });

      return NextResponse.json({ url: checkout.url });
    } catch (e: any) {
      return NextResponse.json({ error: "LemonSqueezy: " + e.message }, { status: 500 });
    }
  } catch (e: any) {
    return NextResponse.json({ error: "Parse: " + e.message }, { status: 500 });
  }
}
