// POST /api/stock-alerts — subscribe to back-in-stock notification

import { NextRequest, NextResponse } from "next/server";
import { applyRateLimit } from "@/lib/server/rate-limit";

// In-memory store for stock alerts (DB model not yet created)
// Keyed by productId
const stockAlerts: Array<{
  productId: string;
  productName: string;
  email: string;
  createdAt: string;
}> = [];

export async function POST(request: NextRequest) {
  // Rate limit: 3 subscriptions per 5 minutes per IP
  const rateLimitResponse = await applyRateLimit(request, {
    windowMs: 5 * 60_000,
    maxRequests: 3,
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const { productId, productName, email } = body;

    // Validate required fields
    if (!productId || !productName || !email) {
      return NextResponse.json(
        { error: "productId, productName, and email are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Check for duplicate subscription
    const duplicate = stockAlerts.find(
      (a) => a.productId === productId && a.email === email
    );
    if (duplicate) {
      return NextResponse.json(
        { success: true, message: "You are already subscribed to notifications for this product." },
        { status: 200 }
      );
    }

    // Store the alert in memory
    stockAlerts.push({
      productId,
      productName,
      email,
      createdAt: new Date().toISOString(),
    });

    console.log(`[StockAlert] ${email} subscribed to "${productName}" (${productId})`);

    // TODO: When StockAlert DB model is created, persist to database instead
    // Example:
    // await db.stockAlert.create({
    //   data: { productId, productName, email },
    // });

    return NextResponse.json({
      success: true,
      message: "You will be notified when this item is back in stock.",
    });
  } catch (error) {
    console.error("POST /api/stock-alerts error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
