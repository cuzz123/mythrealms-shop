import { db } from "@/lib/db";

export interface FulfillmentPayment {
  provider: "paypal" | "lemonsqueezy";
  providerOrderId: string;
  transactionId: string;
  orderId: string;
  currency: "USD";
  amountCents: number;
}

export interface FulfillmentOrderItem {
  quantity: number;
  price: number;
  variantId: string | null;
  productSnapshot: string | null;
}

export interface FulfillmentOrder {
  id: string;
  status: string;
  email: string;
  userId: string | null;
  total: number;
  discount: number;
  notes: string | null;
  items: FulfillmentOrderItem[];
}

export interface FulfillmentTransition {
  outcome: "fulfilled" | "already-fulfilled";
  order: FulfillmentOrder;
}

export interface FulfillmentRepository {
  applyPaidOrderAtomically(
    orderId: string,
    payment: FulfillmentPayment,
  ): Promise<FulfillmentTransition>;
  claimConfirmation(orderId: string): Promise<boolean>;
  markConfirmationSent(orderId: string): Promise<void>;
  releaseConfirmationClaim(orderId: string): Promise<void>;
  sendConfirmation(
    order: FulfillmentOrder,
    idempotencyKey: string,
  ): Promise<void>;
}

export class FulfillmentError extends Error {
  readonly status = 409;

  constructor(message: string) {
    super(message);
    this.name = "FulfillmentError";
  }
}

export class ConfirmationDeliveryError extends Error {
  constructor(
    readonly outcome: "fulfilled" | "already-fulfilled",
    cause: unknown,
  ) {
    super(
      `Order is paid but confirmation is pending: ${
        cause instanceof Error ? cause.message : "delivery failed"
      }`,
      { cause },
    );
    this.name = "ConfirmationDeliveryError";
  }
}

function getDiscountCodes(order: FulfillmentOrder): string[] {
  if (order.discount <= 0 || !order.notes) return [];

  try {
    const parsed = JSON.parse(order.notes) as { discountCodes?: unknown };
    if (!Array.isArray(parsed.discountCodes)) return [];
    return [
      ...new Set(
        parsed.discountCodes.filter(
          (code): code is string => typeof code === "string" && code.length > 0,
        ),
      ),
    ];
  } catch {
    return [];
  }
}

function getItemName(snapshot: string | null): string {
  if (!snapshot) return "Product";
  try {
    const parsed = JSON.parse(snapshot) as { name?: unknown };
    return typeof parsed.name === "string" && parsed.name.length > 0
      ? parsed.name
      : "Product";
  } catch {
    return "Product";
  }
}

const FULFILLED_STATUSES = ["PAID", "SHIPPED", "DELIVERED"];

export const prismaFulfillmentRepository: FulfillmentRepository = {
  applyPaidOrderAtomically(orderId, payment) {
    return db.$transaction(async (transaction): Promise<FulfillmentTransition> => {
      const claimed = await transaction.order.updateMany({
        where: {
          id: orderId,
          status: { in: ["PENDING", "PROCESSING_PAYMENT"] },
        },
        data: {
          status: "PAID",
          stripePaymentStatus: `${payment.provider}:paid:${payment.transactionId}`,
        },
      });

      if (claimed.count === 0) {
        const existing = await transaction.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });
        if (existing && FULFILLED_STATUSES.includes(existing.status)) {
          return { outcome: "already-fulfilled", order: existing };
        }
        throw new FulfillmentError(
          existing
            ? `Order cannot be fulfilled from ${existing.status}`
            : "Order was not found",
        );
      }

      const order = await transaction.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      if (!order) throw new FulfillmentError("Claimed order was not found");

      for (const item of order.items) {
        if (!item.variantId) continue;
        const inventory = await transaction.variant.updateMany({
          where: { id: item.variantId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (inventory.count !== 1) {
          throw new FulfillmentError("Insufficient inventory for paid order");
        }
      }

      const points = Math.floor(order.total);
      if (order.userId && points > 0) {
        await transaction.loyaltyPoint.create({
          data: {
            userId: order.userId,
            orderId: order.id,
            points,
            source: "purchase",
          },
        });
      }

      const discountCodes = getDiscountCodes(order);
      if (discountCodes.length > 0) {
        await transaction.discountCode.updateMany({
          where: { code: { in: discountCodes } },
          data: { usedCount: { increment: 1 } },
        });
      }

      return { outcome: "fulfilled", order };
    });
  },

  async claimConfirmation(orderId) {
    const staleClaim = new Date(Date.now() - 60 * 60 * 1000);
    const result = await db.order.updateMany({
      where: {
        id: orderId,
        confirmationSentAt: null,
        OR: [
          { confirmationClaimedAt: null },
          { confirmationClaimedAt: { lt: staleClaim } },
        ],
      },
      data: { confirmationClaimedAt: new Date() },
    });
    return result.count === 1;
  },

  async markConfirmationSent(orderId) {
    await db.order.update({
      where: { id: orderId },
      data: {
        confirmationSentAt: new Date(),
        confirmationClaimedAt: null,
      },
    });
  },

  async releaseConfirmationClaim(orderId) {
    await db.order.updateMany({
      where: { id: orderId, confirmationSentAt: null },
      data: { confirmationClaimedAt: null },
    });
  },

  async sendConfirmation(order, idempotencyKey) {
    const { sendOrderConfirmation } = await import("@/lib/email");
    await sendOrderConfirmation(
      order.email,
      order.id,
      order.total,
      order.items.map((item) => ({
        name: getItemName(item.productSnapshot),
        quantity: item.quantity,
        price: item.price,
      })),
      idempotencyKey,
    );
  },
};

export async function fulfillPaidOrder(
  orderId: string,
  payment: FulfillmentPayment,
  repository: FulfillmentRepository = prismaFulfillmentRepository,
): Promise<"fulfilled" | "already-fulfilled"> {
  if (payment.orderId !== orderId) {
    throw new FulfillmentError("Payment is bound to a different order");
  }

  const transition = await repository.applyPaidOrderAtomically(orderId, payment);
  const claimedConfirmation = await repository.claimConfirmation(orderId);
  if (claimedConfirmation) {
    let delivered = false;
    try {
      await repository.sendConfirmation(
        transition.order,
        `order-confirmation/${transition.order.id}`,
      );
      delivered = true;
      await repository.markConfirmationSent(orderId);
    } catch (error) {
      if (!delivered) {
        try {
          await repository.releaseConfirmationClaim(orderId);
        } catch (releaseError) {
          console.error("Failed to release confirmation claim:", releaseError);
        }
      }
      throw new ConfirmationDeliveryError(transition.outcome, error);
    }
  }
  return transition.outcome;
}

export async function fulfillPaidOrderForCheckout(
  orderId: string,
  payment: FulfillmentPayment,
  repository: FulfillmentRepository = prismaFulfillmentRepository,
): Promise<{
  outcome: "fulfilled" | "already-fulfilled";
  confirmationPending: boolean;
}> {
  try {
    const outcome = await fulfillPaidOrder(orderId, payment, repository);
    return { outcome, confirmationPending: false };
  } catch (error) {
    if (error instanceof ConfirmationDeliveryError) {
      console.error(error.message);
      return { outcome: error.outcome, confirmationPending: true };
    }
    throw error;
  }
}
