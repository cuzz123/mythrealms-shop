const VALID_TRANSITIONS: Record<string, readonly string[]> = {
  PENDING: ["CANCELLED"],
  PAID: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
};

export class AdminOrderTransitionError extends Error {
  constructor(
    message: string,
    readonly status: 400 | 409,
  ) {
    super(message);
    this.name = "AdminOrderTransitionError";
  }
}

export function getAdminOrderTransition(
  currentStatus: string,
  nextStatus: string,
): { restock: boolean } {
  const providerOwned =
    nextStatus === "PAID" ||
    nextStatus === "REFUNDED" ||
    (nextStatus === "CANCELLED" && currentStatus !== "PENDING");
  if (providerOwned) {
    throw new AdminOrderTransitionError(
      "Payment state must be changed by PayPal",
      409,
    );
  }
  if (!(VALID_TRANSITIONS[currentStatus] ?? []).includes(nextStatus)) {
    throw new AdminOrderTransitionError(
      `Cannot transition from ${currentStatus} to ${nextStatus}`,
      currentStatus === "PROCESSING_PAYMENT" ? 409 : 400,
    );
  }
  return { restock: false };
}
