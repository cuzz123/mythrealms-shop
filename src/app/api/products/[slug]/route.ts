import { NextResponse } from "next/server";
import {
  getProductType,
  getStorefrontProductBySlug,
} from "@/lib/storefront/catalog";
import { productDisplayName, productShortDescription } from "@/lib/brand";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const product = getStorefrontProductBySlug(slug);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: product.id,
    name: productDisplayName(product),
    slug: product.slug,
    description: productShortDescription(product),
    images: product.images,
    image: product.image,
    variants: [{ price: product.price }],
    comparePrice: product.compareAt ?? null,
    category: { name: "The Pearl Edit", slug: product.category },
    productType: getProductType(product),
    inStock: product.inStock,
  });
}
