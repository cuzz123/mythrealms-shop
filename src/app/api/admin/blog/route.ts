// POST /api/admin/blog — Create blog post (admin only)

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
      authorId: (session.user as any).id,
      publishedAt: new Date(),
    },
    include: {
      author: { select: { name: true } },
    },
  });

  return NextResponse.json(post, { status: 201 });
}
