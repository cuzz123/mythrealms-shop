interface DiscountLineSource {
  product: { id: string };
  quantity: number;
}

export function buildDiscountPreviewRequest(
  items: readonly DiscountLineSource[],
  discountCode: string,
  email?: string,
) {
  const normalizedCode = discountCode.trim().toUpperCase();
  const normalizedEmail = email?.trim().toLowerCase();
  return {
    items: items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    })),
    ...(normalizedCode ? { discountCode: normalizedCode } : {}),
    ...(normalizedEmail ? { email: normalizedEmail } : {}),
  };
}

export function parseDiscountPreviewResponse(value: unknown): {
  discount: number;
  label: string;
  total: number;
} {
  if (typeof value !== "object" || value === null) {
    throw new Error("Invalid discount preview response");
  }
  const record = value as Record<string, unknown>;
  if (
    typeof record.discount !== "number" ||
    !Number.isFinite(record.discount) ||
    record.discount < 0 ||
    typeof record.total !== "number" ||
    !Number.isFinite(record.total) ||
    record.total < 0
  ) {
    throw new Error("Invalid discount preview response");
  }
  const first = Array.isArray(record.appliedDiscounts)
    ? record.appliedDiscounts[0]
    : null;
  const label =
    typeof first === "object" &&
    first !== null &&
    typeof (first as Record<string, unknown>).label === "string"
      ? String((first as Record<string, unknown>).label)
      : "Applied";
  return { discount: record.discount, label, total: record.total };
}
