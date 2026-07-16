// GET /api/admin/orders — List all orders (admin only)

import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/server/admin-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const orders = await db.order.findMany({
    include: { items: { include: { product: { select: { name: true, slug: true } } } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(orders);
}
