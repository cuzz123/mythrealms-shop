import type { Metadata } from "next";

import { absoluteImageUrl } from "@/lib/images";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import {
  getProductType,
  type StorefrontProduct,
  type StorefrontProductType,
} from "@/lib/storefront/catalog";

const PRODUCT_TYPE_LABELS: Record<StorefrontProductType, string> = {
  rings: "Pearl Ring",
  bracelets: "Pearl Bracelet",
  earrings: "Pearl Earrings",
  necklaces: "Pearl Necklace",
  "hair-accessories": "Pearl Hair Accessory",
  "eyewear-chains": "Pearl Eyewear Chain",
};

export function buildProductMetadata(product: StorefrontProduct): Metadata {
  const typeLabel = PRODUCT_TYPE_LABELS[getProductType(product)];
  const title = `${product.name} | ${typeLabel} | ${SITE_NAME}`;
  const description = product.description.trim().replace(/\s+/g, " ").slice(0, 155).trim();
  const canonical = absoluteUrl(`/products/${product.slug}`);
  const image = absoluteImageUrl(product.image);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: product.name,
      description,
      url: canonical,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [image],
    },
  };
}
