// POST /api/discounts/validate — Validate discount codes from database and calculate savings

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// B2G1: Buy 2 Get 1 Free on Pendants (auto-detected, no code needed)
const B2G1_CATEGORY_SLUG = "curated-singles";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, items, email } = body;

    if (!items?.length) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Track all applicable discounts
    const appliedDiscounts: Array<{
      type: string;
      label: string;
      amount: number;
      description: string;
    }> = [];

    let totalDiscount = 0;
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );

    // --- 1. Check manual discount code from database ---
    if (code) {
      const normalizedCode = code.trim().toUpperCase();
      const discount = await db.discountCode.findUnique({
        where: { code: normalizedCode },
      });

      if (!discount || !discount.isActive) {
        return NextResponse.json(
          { error: "Invalid discount code" },
          { status: 400 }
        );
      }

      // Check expiration
      if (discount.expiresAt && new Date() > discount.expiresAt) {
        return NextResponse.json(
          { error: "This discount code has expired" },
          { status: 400 }
        );
      }

      // Check max uses
      if (discount.maxUses > 0 && discount.usedCount >= discount.maxUses) {
        return NextResponse.json(
          { error: "This discount code has reached its usage limit" },
          { status: 400 }
        );
      }

      // Check min subtotal
      if (discount.minSubtotal > 0 && subtotal < discount.minSubtotal) {
        return NextResponse.json(
          {
            error: `Minimum order of $${discount.minSubtotal.toFixed(2)} required`,
          },
          { status: 400 }
        );
      }

      // Check first order restriction
      if (discount.firstOrderOnly && email) {
        const existingOrders = await db.order.count({
          where: {
            email,
            status: { in: ["PAID", "SHIPPED", "DELIVERED"] },
          },
        });
        if (existingOrders > 0) {
          return NextResponse.json(
            { error: `${discount.label} is only valid for first-time orders` },
            { status: 400 }
          );
        }
      }

      let codeDiscount = 0;
      if (discount.type === "percentage") {
        codeDiscount = subtotal * (discount.value / 100);
      } else if (discount.type === "fixed") {
        codeDiscount = Math.min(discount.value, subtotal);
      }

      totalDiscount += codeDiscount;
      appliedDiscounts.push({
        type: "code",
        label: discount.label,
        amount: codeDiscount,
        description: discount.description || "",
      });
    }

    // --- 2. Auto-detect B2G1 (Buy 2 Get 1 Free on pendants) ---
    const pendantCategory = await db.category.findUnique({
      where: { slug: B2G1_CATEGORY_SLUG },
    });

    if (pendantCategory) {
      // Batch-fetch all product categories in one query
      const productIds = [...new Set(items.map((i: any) => i.productId))] as string[];
      const products = await db.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, categoryId: true },
      });
      const productCatMap = new Map(products.map((p) => [p.id, p.categoryId]));

      // Get all pendant items in cart with their category info
      const pendantItems = [];
      for (const item of items) {
        if (productCatMap.get(item.productId) === pendantCategory.id) {
          pendantItems.push(item);
        }
      }

      // B2G1: For every 3 pendants, the cheapest one is free
      const totalPendants = pendantItems.reduce(
        (sum: number, item: any) => sum + (item.quantity || 1),
        0
      );
      const freeCount = Math.floor(totalPendants / 3);

      if (freeCount > 0) {
        // Find the cheapest pendant items and apply discount
        const sortedByPrice = [...pendantItems].sort(
          (a, b) => (a.price || 0) - (b.price || 0)
        );

        let remainingFree = freeCount;
        let b2g1Discount = 0;

        for (const item of sortedByPrice) {
          if (remainingFree <= 0) break;
          const qty = item.quantity || 1;
          const freeFromThisItem = Math.min(qty, remainingFree);
          b2g1Discount += (item.price || 0) * freeFromThisItem;
          remainingFree -= freeFromThisItem;
        }

        if (b2g1Discount > 0) {
          totalDiscount += b2g1Discount;
          appliedDiscounts.push({
            type: "b2g1",
            label: "Buy 2 Get 1 Free",
            amount: b2g1Discount,
            description: `Automatic: ${freeCount} free pendant${freeCount > 1 ? "s" : ""}`,
          });
        }
      }
    }

    // --- Response ---
    const finalSubtotal = Math.max(0, subtotal - totalDiscount);

    return NextResponse.json({
      valid: true,
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(totalDiscount * 100) / 100,
      discountedSubtotal: Math.round(finalSubtotal * 100) / 100,
      appliedDiscounts,
    });
  } catch (e: any) {
    console.error("Discount validation error:", e);
    return NextResponse.json(
      { error: e?.message || "Failed to validate discount" },
      { status: 500 }
    );
  }
}
