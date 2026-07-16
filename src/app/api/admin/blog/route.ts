// POST /api/admin/blog — Create blog post (admin only)

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { requireAdminApi } from "@/lib/server/admin-auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  const unauthorized = await requireAdminApi(session);
  if (unauthorized) return unauthorized;

  const body = await request.json();
  const { title, slug, category, excerpt, content, image } = body;

  if (!title || !slug || !category || !excerpt || !content) {
    return NextResponse.json(
      { error: "Missing required fields: title, slug, category, excerpt, content" },
      { status: 400 }
    );
  }

  const post = await db.blogPost.create({
    data: {
      title,
      slug,
      category,
      excerpt,
      content,
      image: image || null,
      authorId: session?.user?.id,
      publishedAt: new Date(),
    },
    include: {
      author: { select: { name: true } },
    },
  });

  return NextResponse.json(post, { status: 201 });
}
