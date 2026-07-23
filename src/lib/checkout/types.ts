export interface CheckoutLineInput {
  productId: string;
  variantId?: string;
  quantity: number;
  giftNote?: string;
}

export interface ShippingAddressInput {
  name: string;
  phone?: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  zip: string;
}

export interface CheckoutRequest {
  items: CheckoutLineInput[];
  email: string;
  shippingAddress: ShippingAddressInput;
  discountCode?: string;
}

export type CheckoutQuoteInput = Pick<
  CheckoutRequest,
  "items" | "email" | "discountCode"
>;

export interface QuotedLine {
  productId: string;
  variantId?: string;
  slug: string;
  name: string;
  image: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
  giftNote?: string;
}

export interface BaseQuote {
  lines: QuotedLine[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
}

export interface AppliedDiscount {
  code: string;
  label: string;
  amountCents: number;
}

export interface CheckoutQuote extends BaseQuote {
  discountCents: number;
  appliedDiscounts: AppliedDiscount[];
}
