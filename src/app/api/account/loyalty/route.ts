// GET /api/account/loyalty — Returns user's total loyalty points
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(_request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ points: 0 });
  }

  const result = await db.loyaltyPoint.aggregate({
    where: { userId: session.user.id },
    _sum: { points: true },
  });

  return NextResponse.json({ points: result._sum.points || 0 });
}
