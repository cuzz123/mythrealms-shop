// POST /api/admin/products — Create product (admin only)

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

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
