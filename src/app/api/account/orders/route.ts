// GET /api/account/orders — Returns the authenticated user's order history

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(_request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const userId = session.user.id as string;

  const orders = await db.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              slug: true,
              images: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}
