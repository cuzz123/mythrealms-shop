import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { buildProductMetadata } from "@/lib/seo/product-metadata";
import {
  getStorefrontProductBySlug,
  getStorefrontProducts,
} from "@/lib/storefront/catalog";

import { Product1688 } from "./1688-product";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return getStorefrontProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getStorefrontProductBySlug(slug);
  if (!product) {
    return {
      title: "Product Not Found | Maverenne",
      robots: { index: false, follow: false },
    };
  }

  return buildProductMetadata(product);
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getStorefrontProductBySlug(slug);
  if (!product) notFound();
  return <Product1688 product={product} />;
}
