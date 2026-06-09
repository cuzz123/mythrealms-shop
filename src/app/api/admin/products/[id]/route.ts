// GET /api/admin/products/[id] — Get product by ID (admin only)
// PUT /api/admin/products/[id] — Update product (admin only)
// DELETE /api/admin/products/[id] — Delete product (admin only)

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const product = await db.product.findUnique({
    where: { id },
    include: {
      variants: true,
      category: { select: { name: true, slug: true } },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
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
    isActive,
    images,
    variants,
  } = body;

  if (!name || !slug || !description || !categoryId) {
    return NextResponse.json(
      { error: "Missing required fields: name, slug, description, categoryId" },
      { status: 400 }
    );
  }

  // Delete existing variants and recreate
  await db.variant.deleteMany({ where: { productId: id } });

  const product = await db.product.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      categoryId,
      stone: stone || null,
      material: material || null,
      intention: intention || null,
      comparePrice: comparePrice ? parseFloat(comparePrice) : null,
      isFeatured: isFeatured ?? false,
      isActive: isActive ?? true,
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

  return NextResponse.json(product);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Soft delete — check for existing orders first
  const existingOrders = await db.orderItem.count({ where: { productId: id } });
  if (existingOrders > 0) {
    // Product has order history — deactivate instead of delete
    await db.product.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true, softDeleted: true });
  }

  // No orders — safe to hard delete
  await db.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
