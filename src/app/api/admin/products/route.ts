// POST /api/admin/products — Create product (admin only)
// GET /api/admin/products — List all products including 1688 catalog (admin only)

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { PRODUCTS as SRC_PRODUCTS, CATEGORIES as SRC_CATEGORIES } from "@/lib/1688-products";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbProducts = await db.product.findMany({
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
  });

  // Map 1688 products to a shape the admin panel can display
  const catalogProducts = SRC_PRODUCTS.filter(p => p.isActive).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: { name: p.categoryName, slug: p.category },
    variants: [{ name: "Default", price: p.price }],
    comparePrice: p.compareAt || null,
    isActive: true,
    isCatalog: true, // flag to distinguish from DB products
    images: [p.image],
  }));

  return NextResponse.json({
    dbProducts,
    catalogProducts,
    total: dbProducts.length + catalogProducts.length,
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    name,
    slug,
    description,
    categoryId,
    stone,
    material,
    intention,
    comparePrice,
    isFeatured,
    images,
    variants,
  } = body;

  if (!name || !slug || !description || !categoryId) {
    return NextResponse.json(
      { error: "Missing required fields: name, slug, description, categoryId" },
      { status: 400 }
    );
  }

  const product = await db.product.create({
    data: {
      name,
      slug,
      description,
      categoryId,
      stone: stone || null,
      material: material || null,
      intention: intention || null,
      comparePrice: comparePrice ? parseFloat(comparePrice) : null,
      isFeatured: isFeatured || false,
      images: JSON.stringify(images || []),
      variants: {
        create:
          variants?.map((v: { name: string; price: number | string; stock: number | string }) => ({
            name: v.name,
            price: parseFloat(String(v.price)),
            stock: parseInt(String(v.stock)) || 0,
          })) || [],
      },
    },
    include: {
      variants: true,
      category: true,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
