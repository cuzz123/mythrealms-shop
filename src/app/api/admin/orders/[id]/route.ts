// GET  /api/admin/orders/[id] — Read single order detail
// PATCH /api/admin/orders/[id] — Update order status, tracking, etc.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  parseAdminShippingAddress,
  toAdminOrderItemView,
} from "@/lib/orders/admin-order-view";
import {
  AdminOrderTransitionError,
  getAdminOrderTransition,
} from "@/lib/orders/admin-order-transition";
import {
  requireAdminApi,
  requireAdminMutation,
} from "@/lib/server/admin-auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: {
        select: {
          id: true,
          quantity: true,
          price: true,
          productSnapshot: true,
          product: { select: { name: true, slug: true, images: true } },
          variant: { select: { name: true } },
        },
      },
    },
  });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  const { items, shippingAddress, ...rest } = order;
  return NextResponse.json({
    ...rest,
    shippingAddress: parseAdminShippingAddress(shippingAddress),
    items: items.map(toAdminOrderItemView),
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdminMutation(request);
  if (unauthorized) return unauthorized;
  try {
    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const { status, trackingNumber, notes } = body;

    if (status !== undefined && typeof status !== "string") {
      return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
    }

    const order = await db.order.findUnique({ where: { id } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const patch = {
      ...(trackingNumber !== undefined && { trackingNumber: trackingNumber as string | null }),
      ...(notes !== undefined && { notes: notes as string | null }),
    };

    const updated = status
      ? await db.$transaction(async (transaction) => {
          const transition = getAdminOrderTransition(order.status, status);
          const claimed = await transaction.order.updateMany({
            where: { id, status: order.status },
            data: { ...patch, status },
          });
          if (claimed.count !== 1) {
            throw new AdminOrderTransitionError(
              "Order changed while the update was in progress",
              409,
            );
          }

          if (transition.restock) {
            const items = await transaction.orderItem.findMany({
              where: { orderId: id },
            });
            for (const item of items) {
              if (!item.variantId) continue;
              await transaction.variant.update({
                where: { id: item.variantId },
                data: { stock: { increment: item.quantity } },
              });
            }
          }

          const current = await transaction.order.findUnique({ where: { id } });
          if (!current) {
            throw new AdminOrderTransitionError("Order was not found", 409);
          }
          return current;
        })
      : await db.order.update({ where: { id }, data: patch });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    if (error instanceof AdminOrderTransitionError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 },
    );
  }
}
