// GET /api/admin/discounts — List all discount codes
// POST /api/admin/discounts — Create a discount code

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/server/admin-auth";
import { getErrorMessage, hasErrorCode } from "@/lib/error-message";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const codes = await db.discountCode.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(codes);
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
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
  } catch (error: unknown) {
    if (hasErrorCode(error, "P2002")) {
      return NextResponse.json({ error: "Code already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: getErrorMessage(error, "Failed to create discount code") }, { status: 500 });
  }
}
