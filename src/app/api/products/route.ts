import { NextRequest, NextResponse } from "next/server";
import {
  getProductType,
  getStorefrontProducts,
} from "@/lib/storefront/catalog";
import { productDisplayName, productShortDescription } from "@/lib/brand";

function positiveInteger(value: string | null, fallback: number, maximum: number) {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, maximum) : fallback;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = positiveInteger(searchParams.get("page"), 1, 10_000);
  const limit = positiveInteger(searchParams.get("limit"), 24, 48);
  const category = searchParams.get("category")?.trim().toLowerCase();
  const search = searchParams.get("search")?.trim().toLowerCase();
  const sort = searchParams.get("sort") || "featured";

  let products = getStorefrontProducts().filter((product) => {
    if (category && category !== product.category && category !== getProductType(product)) {
      return false;
    }

    if (!search) return true;

    return [
      productDisplayName(product),
      productShortDescription(product),
      product.categoryName,
      product.intention || "",
      getProductType(product),
    ].some((value) => value.toLowerCase().includes(search));
  });

  products = [...products].sort((left, right) => {
    switch (sort) {
      case "price-low":
        return left.price - right.price;
      case "price-high":
        return right.price - left.price;
      case "a-z":
        return productDisplayName(left).localeCompare(productDisplayName(right));
      case "z-a":
        return productDisplayName(right).localeCompare(productDisplayName(left));
      default:
        return Number(right.isBestSeller) - Number(left.isBestSeller);
    }
  });

  const total = products.length;
  const offset = (page - 1) * limit;
  const pageProducts = products.slice(offset, offset + limit).map((product) => ({
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
  }));

  return NextResponse.json({
    products: pageProducts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
