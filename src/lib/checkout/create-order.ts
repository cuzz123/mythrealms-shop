import { db } from "@/lib/db";
import type { CheckoutQuote, CheckoutRequest } from "@/lib/checkout/types";

export interface PendingOrderItemData {
  productId?: string;
  variantId?: string;
  quantity: number;
  price: number;
  productSnapshot: string;
}

export interface PendingOrderData {
  email: string;
  userId?: string;
  status: "PENDING";
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: string;
  notes?: string;
  items: { create: PendingOrderItemData[] };
}

export interface PendingOrderRepository {
  createOrder(data: PendingOrderData): Promise<{ id: string }>;
}

export const prismaPendingOrderRepository: PendingOrderRepository = {
  createOrder(data) {
    return db.order.create({ data, select: { id: true } });
  },
};

function dollars(cents: number): number {
  return cents / 100;
}

export async function createPendingOrder(
  input: CheckoutRequest,
  quote: CheckoutQuote,
  sessionUserId: string | undefined,
  repository: PendingOrderRepository = prismaPendingOrderRepository,
): Promise<{ id: string }> {
  const discountCodes = quote.appliedDiscounts.map((discount) => discount.code);
  const giftNotes = quote.lines.flatMap((line) =>
    line.giftNote
      ? [
          {
            productId: line.productId,
            ...(line.variantId ? { variantId: line.variantId } : {}),
            note: line.giftNote,
          },
        ]
      : [],
  );
  const data: PendingOrderData = {
    email: input.email,
    ...(sessionUserId ? { userId: sessionUserId } : {}),
    status: "PENDING",
    subtotal: dollars(quote.subtotalCents),
    shipping: dollars(quote.shippingCents),
    discount: dollars(quote.discountCents),
    total: dollars(quote.totalCents),
    shippingAddress: JSON.stringify(input.shippingAddress),
    ...(discountCodes.length > 0 || giftNotes.length > 0
      ? {
          notes: JSON.stringify({
            ...(discountCodes.length > 0 ? { discountCodes } : {}),
            ...(giftNotes.length > 0 ? { giftNotes } : {}),
          }),
        }
      : {}),
    items: {
      create: quote.lines.map((line) => ({
        quantity: line.quantity,
        price: dollars(line.unitPriceCents),
        productSnapshot: JSON.stringify({
          id: line.productId,
          slug: line.slug,
          name: line.name,
          image: line.image,
          unitPriceCents: line.unitPriceCents,
        }),
      })),
    },
  };

  return repository.createOrder(data);
}
