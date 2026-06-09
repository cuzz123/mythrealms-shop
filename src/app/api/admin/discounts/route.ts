// GET /api/admin/discounts — List all discount codes
// POST /api/admin/discounts — Create a discount code

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const codes = await db.discountCode.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(codes);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { code, type, value, label, description, minSubtotal, maxUses, firstOrderOnly, expiresAt } = body;
    if (!code || !type || value === undefined) {
      return NextResponse.json({ error: "code, type, and value are required" }, { status: 400 });
    }
    const created = await db.discountCode.create({
      data: {
        code: code.toUpperCase(),
        type,
        value: Number(value),
        label: label || code.toUpperCase(),
        description: description || "",
        minSubtotal: Number(minSubtotal) || 0,
        maxUses: Number(maxUses) || 0,
        firstOrderOnly: Boolean(firstOrderOnly),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });
    return NextResponse.json(created);
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json({ error: "Code already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
