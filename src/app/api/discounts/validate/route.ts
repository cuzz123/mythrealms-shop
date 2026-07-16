import { NextRequest, NextResponse } from "next/server";

import { prismaDiscountRepository } from "@/lib/checkout/discount";
import { CheckoutQuoteError, quoteCheckout } from "@/lib/checkout/quote";
import {
  CheckoutInputError,
  validateCheckoutLines,
} from "@/lib/checkout/validation";
import { applyRateLimit } from "@/lib/server/rate-limit";

export async function POST(request: NextRequest) {
  const rateLimitResponse = await applyRateLimit(request, {
    windowMs: 60_000,
    maxRequests: 30,
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const items = validateCheckoutLines(body?.items);
    const email =
      typeof body?.email === "string" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())
        ? body.email.trim().toLowerCase()
        : "guest@mythrealms.invalid";
    const discountCode =
      typeof body?.discountCode === "string" && body.discountCode.trim()
        ? body.discountCode.trim().toUpperCase()
        : undefined;
    if (discountCode && discountCode.length > 64) {
      throw new CheckoutInputError("Discount code is too long");
    }

    const quote = await quoteCheckout(
      { items, email, ...(discountCode ? { discountCode } : {}) },
      prismaDiscountRepository,
    );

    return NextResponse.json({
      valid: true,
      subtotal: quote.subtotalCents / 100,
      shipping: quote.shippingCents / 100,
      discount: quote.discountCents / 100,
      discountedSubtotal: (quote.subtotalCents - quote.discountCents) / 100,
      total: quote.totalCents / 100,
      appliedDiscounts: quote.appliedDiscounts.map((discount) => ({
        type: "code",
        label: discount.label,
        code: discount.code,
        amount: discount.amountCents / 100,
        description: "",
      })),
    });
  } catch (error) {
    if (error instanceof CheckoutInputError || error instanceof CheckoutQuoteError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid discount request" }, { status: 400 });
    }

    console.error("Discount validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate discount. Please try again." },
      { status: 500 },
    );
  }
}
