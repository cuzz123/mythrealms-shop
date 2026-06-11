// GET /api/admin/orders — List all orders (admin only)

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await db.order.findMany({
    include: { items: { include: { product: { select: { name: true, slug: true } } } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(orders);
}
