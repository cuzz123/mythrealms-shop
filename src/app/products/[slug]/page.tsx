import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { absoluteImageUrl } from "@/lib/images";
import { absoluteUrl } from "@/lib/site";
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
      title: "Product Not Found | MythRealms",
      robots: { index: false, follow: false },
    };
  }

  const description = product.description.slice(0, 155);
  const url = absoluteUrl(`/products/${product.slug}`);
  return {
    title: `${product.name} | MythRealms Pearl Jewelry`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: product.name,
      description,
      url,
      images: [{ url: absoluteImageUrl(product.image) }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [absoluteImageUrl(product.image)],
    },
  };
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
