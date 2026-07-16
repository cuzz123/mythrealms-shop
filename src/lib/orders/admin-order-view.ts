export interface AdminOrderItemInput {
  id: string;
  quantity: number;
  price: number;
  productSnapshot: string | null;
  product: { name: string; slug: string; images: string } | null;
  variant: { name: string } | null;
}

export interface AdminOrderItemView {
  id: string;
  name: string;
  slug: string | null;
  image: string | null;
  variantName: string | null;
  quantity: number;
  price: number;
}

function record(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function json(value: string | null): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function firstImage(value: string): string | null {
  const parsed = json(value);
  if (Array.isArray(parsed) && typeof parsed[0] === "string") return parsed[0];
  return value.startsWith("/") || value.startsWith("https://") ? value : null;
}

export function toAdminOrderItemView(
  item: AdminOrderItemInput,
): AdminOrderItemView {
  const snapshot = record(json(item.productSnapshot));
  const snapshotName =
    typeof snapshot?.name === "string" ? snapshot.name : "Unknown item";
  const snapshotSlug =
    typeof snapshot?.slug === "string" ? snapshot.slug : null;
  const snapshotImage =
    typeof snapshot?.image === "string" ? snapshot.image : null;
  return {
    id: item.id,
    name: item.product?.name ?? snapshotName,
    slug: item.product?.slug ?? snapshotSlug,
    image: item.product
      ? firstImage(item.product.images) ?? snapshotImage
      : snapshotImage,
    variantName: item.variant?.name ?? null,
    quantity: item.quantity,
    price: item.price,
  };
}

export interface AdminShippingAddressView {
  name: string | null;
  address: string | null;
  line2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
}

export function parseAdminShippingAddress(
  raw: string | null | undefined,
): AdminShippingAddressView | null {
  const value = record(json(raw ?? null));
  if (!value) return null;
  const string = (key: string) =>
    typeof value[key] === "string" && value[key].trim()
      ? value[key].trim()
      : null;
  return {
    name: string("name"),
    address: string("address") ?? string("line1"),
    line2: string("line2"),
    city: string("city"),
    state: string("state"),
    zip: string("zip"),
    country: string("country"),
  };
}
