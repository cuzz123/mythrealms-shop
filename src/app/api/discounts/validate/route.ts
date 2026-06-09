// POST /api/discounts/validate — Validate discount codes and calculate savings

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// Discount definitions
const DISCOUNTS: Record<
  string,
  {
    type: "percentage" | "fixed" | "bogo";
    value: number; // percentage (0-100) or fixed amount in dollars
    label: string;
    description: string;
    minSubtotal?: number;
    firstOrderOnly?: boolean;
    maxUses?: number;
  }
> = {
  MYTH15: {
    type: "percentage",
    value: 15,
    label: "MYTH15",
    description: "15% off your first order",
    firstOrderOnly: true,
    minSubtotal: 0,
  },
  WELCOME10: {
    type: "percentage",
    value: 10,
    label: "WELCOME10",
    description: "10% off for new customers",
    firstOrderOnly: true,
    minSubtotal: 0,
  },
  GUARDIAN20: {
    type: "percentage",
    value: 20,
    label: "GUARDIAN20",
    description: "20% off orders over $100",
    minSubtotal: 100,
  },
  FREESHIP: {
    type: "fixed",
    value: 4.99,
    label: "FREESHIP",
    description: "Free shipping on any order",
    minSubtotal: 0,
  },
};

// B2G1: Buy 2 Get 1 Free on Pendants (auto-detected, no code needed)
const B2G1_CATEGORY_SLUG = "beast-pendants";

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

    // --- 1. Check manual discount code ---
    if (code) {
      const normalizedCode = code.trim().toUpperCase();
      const discount = DISCOUNTS[normalizedCode];

      if (!discount) {
        return NextResponse.json(
          { error: "Invalid discount code" },
          { status: 400 }
        );
      }

      if (discount.minSubtotal && subtotal < discount.minSubtotal) {
        return NextResponse.json(
          {
            error: `Minimum order of $${discount.minSubtotal.toFixed(
              2
            )} required for ${discount.label}`,
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
        codeDiscount = Math.min(discount.value, subtotal); // don't discount more than subtotal
      }

      totalDiscount += codeDiscount;
      appliedDiscounts.push({
        type: "code",
        label: discount.label,
        amount: codeDiscount,
        description: discount.description,
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
