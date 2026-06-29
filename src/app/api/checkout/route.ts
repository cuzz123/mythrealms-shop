// POST /api/checkout — Create order and redirect to LemonSqueezy checkout

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { applyRateLimit } from "@/lib/server/rate-limit";

export async function POST(request: NextRequest) {
  // Rate limit: 5 requests per minute per IP
  const rateLimitResponse = await applyRateLimit(request, {
    windowMs: 60_000,
    maxRequests: 5,
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const { items, email, shippingAddress, discount } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // --- Validate stock (batch query) ---
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
            return NextResponse.json(
              { error: `Insufficient stock for "${item.name}"` },
              { status: 400 }
            );
          }
          if (!variant.product.isActive) {
            return NextResponse.json(
              { error: `"${variant.product.name}" is no longer available` },
              { status: 400 }
            );
          }
        }
      }
    }

    // --- Calculate totals (batch query) ---
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

    // --- Create order in database ---
    const session = await auth();
    const order = await db.order.create({
      data: {
        email: email || session?.user?.email || "guest@example.com",
        ...(session?.user?.id ? { userId: session.user.id } : {}),
        subtotal,
        shipping: shippingCost,
        discount: discountAmount,
        total,
        shippingAddress: JSON.stringify(shippingAddress || {}),
        status: "PENDING",
        items: {
          create: items.map((i: any) => ({
            ...(i.productId && !String(i.productId).startsWith("1688-") ? { productId: i.productId } : {}),
            ...(i.variantId ? { variantId: i.variantId } : {}),
            quantity: i.quantity,
            price: i.price || 0,
            productSnapshot: JSON.stringify(i),
          })),
        },
      },
    });

    // --- Increment discount code usedCount ---
    if (discountAmount > 0 && discount?.codes?.length) {
      const codeLabels = discount.codes.map((c: string) => c.trim().toUpperCase());
      await db.discountCode.updateMany({
        where: { code: { in: codeLabels } },
        data: { usedCount: { increment: 1 } },
      });
    }

    // --- LemonSqueezy Checkout ---
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;
    const baseUrl = process.env.AUTH_URL || request.nextUrl.origin;

    // Require LemonSqueezy configuration
    if (!apiKey || !storeId) {
      console.error(
        "LemonSqueezy not configured. Set LEMONSQUEEZY_API_KEY and LEMONSQUEEZY_STORE_ID in .env"
      );
      return NextResponse.json(
        {
          error:
            "Payment provider is not configured. Please contact support.",
        },
        { status: 500 }
      );
    }

    // Method 1: API-based checkout (uses a single LS variant as payment gateway)
    if (variantId) {
      const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          data: {
            type: "checkouts",
            attributes: {
              store_id: Number(storeId),
              variant_id: Number(variantId),
              // Charge the actual cart total (in cents), not the variant's fixed price
              custom_price: Math.round(total * 100),
              checkout_data: {
                email: email || "",
                custom: {
                  orderId: order.id,
                  itemCount: String(items.length),
                  subtotal: String(subtotal),
                },
              },
              product_options: {
                redirect_url: `${baseUrl}/checkout/success?orderId=${order.id}`,
              },
              checkout_options: {
                embed: false,
                locale: "en",
                // Pass button text customization for multi-item orders
                button_color: "#D4A84B",
              },
            },
            relationships: {
              store: {
                data: { type: "stores", id: String(storeId) },
              },
              variant: {
                data: { type: "variants", id: String(variantId) },
              },
            },
          },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        // Store the LS checkout ID for webhook reconciliation
        await db.order.update({
          where: { id: order.id },
          data: { stripeSessionId: json.data.id },
        });
        return NextResponse.json({ url: json.data.attributes.url });
      }

      const errText = await res.text();
      console.error("LemonSqueezy API error:", res.status, errText);
      return NextResponse.json(
        { error: "Payment service temporarily unavailable. Please try again." },
        { status: 502 }
      );
    }

    // Method 2: Direct product buy link (fallback, no API overhead)
    const productUUID = process.env.LEMONSQUEEZY_PRODUCT_UUID;
    const storeDomain = process.env.LEMONSQUEEZY_STORE_DOMAIN;

    if (productUUID && storeDomain) {
      const checkoutUrl = new URL(
        `https://${storeDomain}/checkout/buy/${productUUID}`
      );
      checkoutUrl.searchParams.set("checkout[custom][orderId]", order.id);
      checkoutUrl.searchParams.set(
        "checkout[email]",
        encodeURIComponent(email || "")
      );
      checkoutUrl.searchParams.set("locale", "en");

      return NextResponse.json({ url: checkoutUrl.toString() });
    }

    // Neither method available
    return NextResponse.json(
      {
        error:
          "Payment provider is not fully configured. Set LEMONSQUEEZY_VARIANT_ID or LEMONSQUEEZY_PRODUCT_UUID.",
      },
      { status: 500 }
    );
  } catch (e: any) {
    console.error("Checkout error:", e);
    return NextResponse.json(
      { error: e?.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
