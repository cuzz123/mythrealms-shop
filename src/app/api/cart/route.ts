// Cart API — CRUD operations for cart items stored in database
// Uses session-based cart identification

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Get session ID from cookie or generate one
function getSessionId(request: NextRequest): string {
  const cookieName = "cart_session";
  const existing = request.cookies.get(cookieName)?.value;
  if (existing) return existing;

  const newId = Math.random().toString(36).substring(2) + Date.now().toString(36);
  return newId;
}

// GET /api/cart — Get cart items
export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get("cart_session")?.value;
  if (!sessionId) return NextResponse.json({ items: [], subtotal: 0 });

  const items = await db.cartItem.findMany({
    where: { sessionId },
    include: {
      product: true,
      variant: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const parsedItems = items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    product: {
      ...item.product,
      images: JSON.parse(item.product.images as string),
    },
    variant: item.variant,
  }));

  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.variant?.price || 0) * item.quantity),
    0
  );

  return NextResponse.json({ items: parsedItems, subtotal });
}

// POST /api/cart — Add item to cart
export async function POST(request: NextRequest) {
  const sessionId = getSessionId(request);
  const body = await request.json();
  const { productId, variantId, quantity = 1 } = body;

  // Check if product exists
  const product = await db.product.findUnique({
    where: { id: productId },
    include: { variants: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Check if variant exists and has stock
  const variant = product.variants.find((v) => v.id === variantId);
  if (variant && variant.stock < quantity) {
    return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
  }

  // Check if already in cart
  const existing = await db.cartItem.findFirst({
    where: { sessionId, productId, variantId: variantId || null },
  });

  if (existing) {
    await db.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await db.cartItem.create({
      data: { sessionId, productId, variantId: variantId || null, quantity },
    });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("cart_session", sessionId, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return response;
}

// PUT /api/cart — Update item quantity
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { itemId, quantity } = body;

  if (quantity < 1) {
    await db.cartItem.delete({ where: { id: itemId } });
    return NextResponse.json({ success: true });
  }

  await db.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  return NextResponse.json({ success: true });
}

// DELETE /api/cart — Remove item
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get("itemId");

  if (!itemId) {
    return NextResponse.json({ error: "Item ID required" }, { status: 400 });
  }

  await db.cartItem.delete({ where: { id: itemId } });
  return NextResponse.json({ success: true });
}
