import { getStorefrontProductById } from "@/lib/storefront/catalog";
import type {
  CheckoutLineInput,
  CheckoutRequest,
  ShippingAddressInput,
} from "@/lib/checkout/types";

const MAX_LINES = 20;
const MAX_LINE_QUANTITY = 10;
const MAX_TOTAL_QUANTITY = 50;
const MAX_GIFT_NOTE_LENGTH = 240;

export class CheckoutInputError extends Error {
  readonly status = 400;

  constructor(message: string) {
    super(message);
    this.name = "CheckoutInputError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(
  value: unknown,
  label: string,
  minimumLength = 1,
): string {
  if (typeof value !== "string" || value.trim().length < minimumLength) {
    throw new CheckoutInputError(`${label} is required`);
  }
  return value.trim();
}

function parseGiftNote(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    throw new CheckoutInputError("Gift note must be text");
  }

  const note = value.trim();
  if (note.length > MAX_GIFT_NOTE_LENGTH) {
    throw new CheckoutInputError(
      `Gift note cannot exceed ${MAX_GIFT_NOTE_LENGTH} characters`,
    );
  }
  return note || undefined;
}

function parseItems(value: unknown): CheckoutLineInput[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new CheckoutInputError("Cart is empty");
  }
  if (value.length > MAX_LINES) {
    throw new CheckoutInputError(`Cart cannot contain more than ${MAX_LINES} lines`);
  }

  const items = value.map((candidate) => {
    if (!isRecord(candidate)) {
      throw new CheckoutInputError("Cart contains an invalid item");
    }

    const productId = requiredString(candidate.productId, "Product ID");
    if (!getStorefrontProductById(productId)) {
      throw new CheckoutInputError("Cart contains an unavailable product");
    }

    const quantity = candidate.quantity;
    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > MAX_LINE_QUANTITY
    ) {
      throw new CheckoutInputError(
        `Item quantity must be an integer from 1 to ${MAX_LINE_QUANTITY}`,
      );
    }

    if (typeof candidate.variantId === "string" && candidate.variantId.trim()) {
      throw new CheckoutInputError("Selected product variant is unavailable");
    }

    const giftNote = parseGiftNote(candidate.giftNote);
    return { productId, quantity, ...(giftNote ? { giftNote } : {}) };
  });

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  if (totalQuantity > MAX_TOTAL_QUANTITY) {
    throw new CheckoutInputError(
      `Cart cannot contain more than ${MAX_TOTAL_QUANTITY} total items`,
    );
  }

  return items;
}

export function validateCheckoutLines(value: unknown): CheckoutLineInput[] {
  return parseItems(value);
}

function parseShippingAddress(value: unknown): ShippingAddressInput {
  if (!isRecord(value)) {
    throw new CheckoutInputError("Shipping address is required");
  }

  const phone =
    typeof value.phone === "string" && value.phone.trim()
      ? value.phone.trim()
      : undefined;
  if (phone && !/^[\d\s+()-]{7,20}$/.test(phone)) {
    throw new CheckoutInputError("Please enter a valid phone number");
  }

  const country = requiredString(value.country, "Country").toUpperCase();
  if (!/^[A-Z]{2}$/.test(country)) {
    throw new CheckoutInputError("Please select a valid country");
  }

  const zip = requiredString(value.zip, "ZIP/Postal code");
  if (!/^[A-Za-z0-9\s-]{3,12}$/.test(zip)) {
    throw new CheckoutInputError("Please enter a valid ZIP/Postal code");
  }

  const state =
    typeof value.state === "string" && value.state.trim()
      ? value.state.trim()
      : undefined;

  return {
    name: requiredString(value.name, "Full name", 2),
    ...(phone ? { phone } : {}),
    address: requiredString(value.address, "Address", 5),
    city: requiredString(value.city, "City"),
    ...(state ? { state } : {}),
    country,
    zip,
  };
}

export function parseCheckoutRequest(value: unknown): CheckoutRequest {
  if (!isRecord(value)) {
    throw new CheckoutInputError("Invalid checkout request");
  }

  const email = requiredString(value.email, "Email").toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new CheckoutInputError("Please enter a valid email");
  }

  const discountCode =
    typeof value.discountCode === "string" && value.discountCode.trim()
      ? value.discountCode.trim().toUpperCase()
      : undefined;
  if (discountCode && discountCode.length > 64) {
    throw new CheckoutInputError("Discount code is too long");
  }

  return {
    items: validateCheckoutLines(value.items),
    email,
    shippingAddress: parseShippingAddress(value.shippingAddress),
    ...(discountCode ? { discountCode } : {}),
  };
}
