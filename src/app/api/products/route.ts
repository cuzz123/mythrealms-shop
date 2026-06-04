// GET /api/products — List products with filtering, sorting, pagination
// POST /api/admin/products — Create product (admin only)

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "24");
  const category = searchParams.get("category");
  const stone = searchParams.get("stone");
  const intention = searchParams.get("intention");
  const material = searchParams.get("material");
  const sort = searchParams.get("sort") || "featured";
  const featured = searchParams.get("featured");
  const search = searchParams.get("search");

  const where: any = { isActive: true };

  if (category) where.category = { slug: category };
  if (stone) where.stone = stone;
  if (intention) where.intention = intention;
  if (material) where.material = material;
  if (featured === "true") where.isFeatured = true;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  // Price sorting is done in JS after fetch because SQLite can't sort by related field prices
  const needsJsPriceSort = sort === "price-low" || sort === "price-high";
  switch (sort) {
    case "price-low":
    case "price-high":
      orderBy = { createdAt: "desc" }; // fetch all, sort in JS
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "a-z":
      orderBy = { name: "asc" };
      break;
    case "z-a":
      orderBy = { name: "desc" };
      break;
  }

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        variants: true,
        category: { select: { name: true, slug: true } },
        reviews: { select: { rating: true } },
      },
      orderBy,
      // For price sorting, fetch all products and sort in JS; otherwise paginate via DB
      ...(needsJsPriceSort ? {} : { skip: (page - 1) * limit, take: limit }),
    }),
    db.product.count({ where }),
  ]);

  // Parse images JSON and calculate avg rating, handle price sorting
  let productsWithParsedData = products.map((product) => {
    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length
        : 0;

    return {
      ...product,
      images: JSON.parse(product.images as string),
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: product.reviews.length,
      _minPrice: Math.min(...product.variants.map(v => Number(v.price))),
    };
  });

  // Apply price sorting in JS for accurate results
  if (sort === "price-low") {
    productsWithParsedData.sort((a, b) => a._minPrice - b._minPrice);
  } else if (sort === "price-high") {
    productsWithParsedData.sort((a, b) => b._minPrice - a._minPrice);
  }

  // Remove internal _minPrice field and paginate if JS-sorted
  const finalProducts = (needsJsPriceSort
    ? productsWithParsedData.slice((page - 1) * limit, page * limit)
    : productsWithParsedData
  ).map(({ _minPrice, ...rest }) => rest) as typeof productsWithParsedData;

  return NextResponse.json({
    products: finalProducts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
