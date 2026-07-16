import { getStorefrontProductById } from "@/lib/storefront/catalog";
import { validateCheckoutLines } from "@/lib/checkout/validation";
import type {
  BaseQuote,
  CheckoutLineInput,
  CheckoutQuote,
  CheckoutQuoteInput,
} from "@/lib/checkout/types";

const FREE_SHIPPING_THRESHOLD_CENTS = 6999;
const STANDARD_SHIPPING_CENTS = 499;

export interface DiscountRecord {
  code: string;
  label: string;
  type: string;
  value: number;
  minSubtotal: number;
  maxUses: number;
  usedCount: number;
  firstOrderOnly: boolean;
  isActive: boolean;
  startsAt: Date;
  expiresAt: Date | null;
}

export interface DiscountRepository {
  findDiscountByCode(code: string): Promise<DiscountRecord | null>;
  countPaidOrdersByEmail(email: string): Promise<number>;
}

export class CheckoutQuoteError extends Error {
  readonly status = 400;

  constructor(message: string) {
    super(message);
    this.name = "CheckoutQuoteError";
  }
}

export function quoteStorefrontCart(lines: CheckoutLineInput[]): BaseQuote {
  const quotedLines = validateCheckoutLines(lines).map((line) => {
    const product = getStorefrontProductById(line.productId);
    if (!product) {
      throw new CheckoutQuoteError("Cart contains an unavailable product");
    }

    const unitPriceCents = Math.round(product.price * 100);
    return {
      productId: product.id,
      ...(line.variantId ? { variantId: line.variantId } : {}),
      slug: product.slug,
      name: product.name,
      image: product.image,
      quantity: line.quantity,
      unitPriceCents,
      lineTotalCents: unitPriceCents * line.quantity,
    };
  });

  const subtotalCents = quotedLines.reduce(
    (sum, line) => sum + line.lineTotalCents,
    0,
  );
  const shippingCents =
    subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : STANDARD_SHIPPING_CENTS;

  return {
    lines: quotedLines,
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
  };
}

function validateDiscount(
  discount: DiscountRecord | null,
  subtotalCents: number,
  now: Date,
): DiscountRecord {
  if (!discount || !discount.isActive) {
    throw new CheckoutQuoteError("Invalid discount code");
  }
  if (discount.startsAt > now) {
    throw new CheckoutQuoteError("This discount code is not active yet");
  }
  if (discount.expiresAt && discount.expiresAt <= now) {
    throw new CheckoutQuoteError("This discount code has expired");
  }
  if (discount.maxUses > 0 && discount.usedCount >= discount.maxUses) {
    throw new CheckoutQuoteError("This discount code has reached its usage limit");
  }
  if (subtotalCents < Math.round(discount.minSubtotal * 100)) {
    throw new CheckoutQuoteError(
      `Minimum order of $${discount.minSubtotal.toFixed(2)} required`,
    );
  }
  if (discount.type !== "percentage" && discount.type !== "fixed") {
    throw new CheckoutQuoteError("This discount type is not supported");
  }

  return discount;
}

function calculateDiscountCents(
  discount: DiscountRecord,
  subtotalCents: number,
): number {
  const rawAmount =
    discount.type === "percentage"
      ? Math.round((subtotalCents * discount.value) / 100)
      : Math.round(discount.value * 100);

  return Math.max(0, Math.min(subtotalCents, rawAmount));
}

export async function quoteCheckout(
  input: CheckoutQuoteInput,
  repository: DiscountRepository,
  now = new Date(),
): Promise<CheckoutQuote> {
  const baseQuote = quoteStorefrontCart(input.items);
  if (!input.discountCode) {
    return { ...baseQuote, discountCents: 0, appliedDiscounts: [] };
  }

  const discount = validateDiscount(
    await repository.findDiscountByCode(input.discountCode),
    baseQuote.subtotalCents,
    now,
  );
  if (
    discount.firstOrderOnly &&
    (await repository.countPaidOrdersByEmail(input.email)) > 0
  ) {
    throw new CheckoutQuoteError(
      `${discount.label} is only valid for first-time orders`,
    );
  }

  const discountCents = calculateDiscountCents(discount, baseQuote.subtotalCents);
  return {
    ...baseQuote,
    discountCents,
    totalCents: baseQuote.subtotalCents + baseQuote.shippingCents - discountCents,
    appliedDiscounts: [
      {
        code: discount.code,
        label: discount.label,
        amountCents: discountCents,
      },
    ],
  };
}
