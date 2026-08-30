import type { StorefrontProductType } from "@/lib/storefront/catalog";

export type PurchaseGuide = Readonly<{
  href: string;
  label: string;
}>;

export const PURCHASE_GUIDE_BY_PRODUCT_TYPE = {
  earrings: {
    href: "/pearls/how-to-choose-pearl-earrings",
    label: "How to choose pearl earrings",
  },
  necklaces: {
    href: "/pearls/pearl-necklace-length-guide",
    label: "How to choose a pearl necklace length",
  },
  bracelets: {
    href: "/pearls/bracelet-size-and-fit-guide",
    label: "How to choose a pearl bracelet size",
  },
  rings: { href: "/pearls", label: "Read the Pearl Guide" },
  "hair-accessories": { href: "/pearls", label: "Read the Pearl Guide" },
  "eyewear-chains": { href: "/pearls", label: "Read the Pearl Guide" },
} as const satisfies Readonly<Record<StorefrontProductType, PurchaseGuide>>;

export function getPurchaseGuideForProductType(
  productType: StorefrontProductType,
): PurchaseGuide {
  return PURCHASE_GUIDE_BY_PRODUCT_TYPE[productType];
}
