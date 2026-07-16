// POST /api/automation/daily-report — Pull key metrics for daily operations email

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireCron } from "@/lib/automation-auth";
import { getErrorMessage } from "@/lib/error-message";

export async function POST(request: NextRequest) {
  const unauthorized = requireCron(request);
  if (unauthorized) return unauthorized;

  try {
    const [ordersToday, ordersPending, totalOrders, lowStock, totalProducts] = await Promise.all([
      db.order.count({ where: { createdAt: { gte: new Date(Date.now() - 86400000) } } }),
      db.order.count({ where: { status: "PAID" } }),
      db.order.count(),
      db.variant.count({ where: { stock: { lte: 5 } } }),
      db.product.count({ where: { isActive: true } }),
    ]);

    const revenue = await db.order.aggregate({
      _sum: { total: true },
      where: { status: "PAID" },
    });

    return NextResponse.json({
      date: new Date().toISOString().slice(0, 10),
      metrics: {
        ordersToday,
        ordersPendingShipment: ordersPending,
        totalOrders,
        totalRevenue: Number(revenue._sum.total || 0).toFixed(2),
        lowStockProducts: lowStock,
        activeProducts: totalProducts,
      },
      alerts: lowStock > 0 ? [`${lowStock} products low on stock`] : [],
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error, "Failed to build daily report") }, { status: 500 });
  }
}
