// GET /api/admin/assets — List all site images with their sources

import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/server/admin-auth";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  // Blog post images
  const blogPosts = await db.blogPost.findMany({
    select: { id: true, title: true, slug: true, image: true },
    where: { image: { not: null } },
  });

  // Category images
  const categories = await db.category.findMany({
    select: { id: true, name: true, slug: true, image: true },
    where: { image: { not: null } },
  });

  const assets = [
    ...blogPosts.map((p) => ({
      id: p.id,
      type: "blog",
      name: p.title,
      slug: p.slug,
      image: p.image || "",
      updateField: "image",
      updateApi: `/api/admin/blog`,
    })),
    ...categories.map((c) => ({
      id: c.id,
      type: "category",
      name: c.name,
      slug: c.slug,
      image: c.image || "",
      updateField: "image",
      updateApi: `/api/admin/categories`,
    })),
  ];

  return NextResponse.json({ assets });
}
