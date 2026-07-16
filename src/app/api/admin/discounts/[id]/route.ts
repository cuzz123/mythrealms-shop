// PATCH /api/admin/discounts/[id] — Update discount code
// DELETE /api/admin/discounts/[id] — Delete discount code

import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/server/admin-auth";
import { getErrorMessage } from "@/lib/error-message";

const allowedDiscountUpdateFields = [
  "label",
  "description",
  "isActive",
  "minSubtotal",
  "maxUses",
  "firstOrderOnly",
  "expiresAt",
  "type",
  "value",
] as const;

type AllowedDiscountUpdate = Pick<
  Prisma.DiscountCodeUpdateInput,
  (typeof allowedDiscountUpdateFields)[number]
>;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    const body = await request.json();
    // Whitelist allowed fields
    const data: Partial<AllowedDiscountUpdate> = {};
    for (const key of allowedDiscountUpdateFields) {
      if (body[key] !== undefined) data[key] = body[key];
    }
    const updated = await db.discountCode.update({
      where: { id },
      data,
    });
    return NextResponse.json(updated);
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error, "Failed to update discount code") }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    await db.discountCode.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error, "Failed to delete discount code") }, { status: 500 });
  }
}
