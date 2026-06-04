// POST /api/checkout — Create order, redirect to LemonSqueezy
// Uses direct checkout URL to avoid API call issues from Vercel

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

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
            { error: `Insufficient stock for "${item.name}"` },
            { status: 400 }
          );
        }
      }
    }

    // Calculate totals from DB prices
    let subtotal = 0;
    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });
      const variant = product?.variants.find((v) => v.id === item.variantId);
      subtotal += Number(variant?.price || 0) * item.quantity;
    }

    // Create order
    const order = await db.order.create({
      data: {
        email: email || "guest@example.com",
        subtotal,
        shipping: subtotal >= 69.99 ? 0 : 4.99,
        total: subtotal >= 69.99 ? subtotal : subtotal + 4.99,
        shippingAddress: JSON.stringify(shippingAddress || {}),
        status: "PENDING",
        items: { create: items.map((item: any) => ({
          productId: item.productId, variantId: item.variantId,
          quantity: item.quantity, price: item.price || 0,
          productSnapshot: JSON.stringify(item),
        }))},
      },
    });

    // Use LemonSqueezy direct checkout URL (bypasses API, no IP restrictions)
    const productUUID = process.env.LEMONSQUEEZY_PRODUCT_UUID;
    const baseUrl = process.env.AUTH_URL || request.nextUrl.origin;

    if (productUUID) {
      const checkoutUrl = `https://jasperkit.lemonsqueezy.com/checkout/buy/${productUUID}?checkout[custom][orderId]=${order.id}&checkout[email]=${encodeURIComponent(email || "")}`;
      return NextResponse.json({ url: checkoutUrl });
    }

    // Demo mode fallback
    return NextResponse.json({
      url: `${baseUrl}/checkout/success?orderId=${order.id}`,
      demo: true,
    });
  } catch (e: any) {
    console.error("Checkout error:", e);
    return NextResponse.json(
      { error: e?.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
