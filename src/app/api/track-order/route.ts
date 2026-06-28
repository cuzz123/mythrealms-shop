// GET /api/track-order — Public order lookup by order ID + email
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get("orderId");
  const email = request.nextUrl.searchParams.get("email");

  if (!orderId || !email) {
    return NextResponse.json({ error: "Order ID and email required" }, { status: 400 });
  }

  const order = await db.order.findFirst({
    where: {
      id: orderId,
      email: email.toLowerCase().trim(),
    },
    select: {
      id: true,
      status: true,
      total: true,
      createdAt: true,
      shippingAddress: true,
      items: {
        select: {
          quantity: true,
          productSnapshot: true,
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Parse shipping address
  let city = "N/A";
  try {
    if (order.shippingAddress) {
      city = JSON.parse(order.shippingAddress)?.city || "N/A";
    }
  } catch {}

  // Status mapping
  const statusLabels: Record<string, string> = {
    PENDING: "Processing",
    PAID: "In Transit",
    SHIPPED: "In Transit",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };

  const status = statusLabels[order.status] || order.status;
  const createdAt = new Date(order.createdAt);
  const estimatedDelivery = new Date(createdAt);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 14);

  return NextResponse.json({
    id: order.id,
    status,
    total: order.total,
    createdAt: createdAt.toISOString(),
    estimatedDelivery: estimatedDelivery.toISOString(),
    destination: city,
    items: order.items.map((i: any) => {
      try {
        const snap = JSON.parse(i.productSnapshot || "{}");
        return { name: snap.name || "Product", quantity: i.quantity };
      } catch {
        return { name: "Product", quantity: i.quantity };
      }
    }),
  });
}
