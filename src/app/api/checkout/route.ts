// POST /api/checkout — API checkout with redirect_url, fallback to buy URL

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
          return NextResponse.json({ error: `Insufficient stock for "${item.name}"` }, { status: 400 });
        }
      }
    }

    // Calculate totals from DB
    let subtotal = 0;
    for (const item of items) {
      const product = await db.product.findUnique({ where: { id: item.productId }, include: { variants: true } });
      const variant = product?.variants.find((v) => v.id === item.variantId);
      subtotal += Number(variant?.price || 0) * item.quantity;
    }

    // Create order
    const order = await db.order.create({
      data: {
        email: email || "guest@example.com",
        subtotal, shipping: subtotal >= 69.99 ? 0 : 4.99,
        total: subtotal >= 69.99 ? subtotal : subtotal + 4.99,
        shippingAddress: JSON.stringify(shippingAddress || {}),
        status: "PENDING",
        items: { create: items.map((i: any) => ({
          productId: i.productId, variantId: i.variantId,
          quantity: i.quantity, price: i.price || 0,
          productSnapshot: JSON.stringify(i),
        }))},
      },
    });

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;
    const baseUrl = process.env.AUTH_URL || request.nextUrl.origin;
    const productUUID = process.env.LEMONSQUEEZY_PRODUCT_UUID;

    // Try API checkout with redirect_url
    if (apiKey && storeId && variantId) {
      try {
        const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
          body: JSON.stringify({
            data: {
              type: "checkouts",
              attributes: {
                store_id: Number(storeId),
                variant_id: Number(variantId),
                checkout_data: { email: email || "", custom: { orderId: order.id } },
                product_options: { redirect_url: `${baseUrl}/checkout/success?orderId=${order.id}` },
                checkout_options: { embed: false },
              },
              relationships: {
                store: { data: { type: "stores", id: String(storeId) } },
                variant: { data: { type: "variants", id: String(variantId) } },
              },
            },
          }),
        });
        if (res.ok) {
          const json = await res.json();
          await db.order.update({ where: { id: order.id }, data: { stripeSessionId: json.data.id } });
          return NextResponse.json({ url: json.data.attributes.url });
        }
        console.error("LS API failed:", res.status, await res.text());
      } catch (e: any) { console.error("LS API error:", e.message); }
    }

    // Fallback: direct buy URL (no redirect_url, but always works)
    if (productUUID) {
      return NextResponse.json({
        url: `https://jasperkit.lemonsqueezy.com/checkout/buy/${productUUID}?checkout[custom][orderId]=${order.id}&checkout[email]=${encodeURIComponent(email || "")}`,
      });
    }

    return NextResponse.json({ url: `${baseUrl}/checkout/success?orderId=${order.id}`, demo: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Checkout failed" }, { status: 500 });
  }
}
