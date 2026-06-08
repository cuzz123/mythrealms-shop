// POST /api/cart/validate — Validate cart items against current stock

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items?.length) {
      return NextResponse.json({ valid: true, issues: [] });
    }

    const issues: Array<{
      productId: string;
      variantId?: string;
      name: string;
      requested: number;
      available: number;
      message: string;
    }> = [];

    for (const item of items) {
      if (item.variantId) {
        const variant = await db.variant.findUnique({
          where: { id: item.variantId },
          include: { product: { select: { name: true, isActive: true } } },
        });

        if (!variant) {
          issues.push({
            productId: item.productId,
            variantId: item.variantId,
            name: item.name || "Unknown product",
            requested: item.quantity || 1,
            available: 0,
            message: "This variant is no longer available",
          });
          continue;
        }

        if (!variant.product.isActive) {
          issues.push({
            productId: item.productId,
            variantId: item.variantId,
            name: variant.product.name,
            requested: item.quantity || 1,
            available: 0,
            message: "This product has been discontinued",
          });
          continue;
        }

        if (variant.stock < (item.quantity || 1)) {
          issues.push({
            productId: item.productId,
            variantId: item.variantId,
            name: variant.product.name,
            requested: item.quantity || 1,
            available: variant.stock,
            message:
              variant.stock === 0
                ? "Out of stock"
                : `Only ${variant.stock} left in stock`,
          });
        }
      }
    }

    return NextResponse.json({
      valid: issues.length === 0,
      issues,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Validation failed" },
      { status: 500 }
    );
  }
}
