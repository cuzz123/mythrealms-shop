// GET /api/debug/discounts — Test if DiscountCode model is working

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const count = await db.discountCode.count();
    const codes = await db.discountCode.findMany({ select: { code: true, isActive: true, type: true } });
    return NextResponse.json({ ok: true, count, codes });
  } catch (e: any) {
    return NextResponse.json({
      ok: false,
      error: e?.message || "Unknown error",
      stack: process.env.NODE_ENV === "development" ? e?.stack : undefined,
    }, { status: 500 });
  }
}
