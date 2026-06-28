// POST /api/reviews — create a product review

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { applyRateLimit } from "@/lib/server/rate-limit";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // Rate limit: 5 reviews per 10 minutes per IP
  const rateLimitResponse = await applyRateLimit(request, {
    windowMs: 10 * 60_000,
    maxRequests: 5,
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const session = await auth();
    const body = await request.json();
    const { productId, rating, content, images, userName } = body;

    // Validate required fields
    if (!productId || !rating || !content) {
      return NextResponse.json(
        { error: "productId, rating, and content are required" },
        { status: 400 }
      );
    }

    // Validate rating is 1-5
    if (typeof rating !== "number" || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json(
        { error: "Rating must be an integer between 1 and 5" },
        { status: 400 }
      );
    }

    // Validate content length
    if (typeof content !== "string" || content.trim().length < 5) {
      return NextResponse.json(
        { error: "Review content must be at least 5 characters" },
        { status: 400 }
      );
    }

    // Process images: accept string URL or array
    const imageArray = Array.isArray(images)
      ? images.filter((i: unknown) => typeof i === "string" && i.trim())
      : typeof images === "string" && images.trim()
        ? [images.trim()]
        : [];

    const review = await db.review.create({
      data: {
        productId,
        rating,
        content: content.trim(),
        images: JSON.stringify(imageArray),
        userId: session?.user?.id || null,
      },
    });

    return NextResponse.json({
      success: true,
      review: {
        id: review.id,
        productId: review.productId,
        rating: review.rating,
        content: review.content,
        images: JSON.parse(review.images),
        userName: session?.user?.name || userName || "Anonymous",
        createdAt: review.createdAt,
      },
    });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json(
      { error: "Failed to create review. Please try again." },
      { status: 500 }
    );
  }
}
