// PATCH /api/admin/assets/[id] — Update a specific asset image

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/server/admin-auth";
import { getErrorMessage } from "@/lib/error-message";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await request.json();
    const { type, imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl required" }, { status: 400 });
    }

    // Route to the correct model based on type
    if (type === "blog") {
      await db.blogPost.update({ where: { id }, data: { image: imageUrl } });
    } else if (type === "category") {
      await db.category.update({ where: { id }, data: { image: imageUrl } });
    } else if (type === "hero") {
      // Hero carousel images are stored in code (HeroCarousel.tsx) — can't update via API
      return NextResponse.json({ error: "Hero images are code-managed" }, { status: 400 });
    } else {
      return NextResponse.json({ error: "Unknown asset type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error, "Failed to update asset") }, { status: 500 });
  }
}
