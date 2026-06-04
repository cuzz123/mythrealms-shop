// GET /api/products/[slug] — Get single product with variants + reviews
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const product = await db.product.findUnique({
    where: { slug: slug },
    include: {
      variants: true,
      category: { select: { name: true, slug: true } },
      reviews: {
        include: {
          user: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      : 0;

  return NextResponse.json({
    ...product,
    images: JSON.parse(product.images as string),
    details: product.details,
    avgRating: Math.round(avgRating * 10) / 10,
    reviewCount: product.reviews.length,
  });
}
