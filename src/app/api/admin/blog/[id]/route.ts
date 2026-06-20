// GET/PUT /api/admin/blog/[id] — Fetch or update a single blog post (admin only)

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const post = await db.blogPost.findUnique({ where: { id } });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { title, slug, category, excerpt, content, image } = body;

  if (!title || !slug || !category || !excerpt || !content) {
    return NextResponse.json(
      { error: "Missing required fields: title, slug, category, excerpt, content" },
      { status: 400 }
    );
  }

  const existing = await db.blogPost.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Check slug uniqueness (exclude current post)
  const slugConflict = await db.blogPost.findFirst({
    where: { slug, id: { not: id } },
  });
  if (slugConflict) {
    return NextResponse.json(
      { error: "A post with this slug already exists" },
      { status: 409 }
    );
  }

  const post = await db.blogPost.update({
    where: { id },
    data: {
      title,
      slug,
      category,
      excerpt,
      content,
      image: image || null,
    },
  });

  return NextResponse.json(post);
}
