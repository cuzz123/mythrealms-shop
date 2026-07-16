import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle, Clock3, Home, Package, Truck } from "lucide-react";

import { ClearCartOnPaid } from "@/components/checkout/ClearCartOnPaid";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/db";
import {
  getCheckoutSuccessPresentation,
  isPaidOrderStatus,
} from "@/lib/checkout/order-status";
import { safeJsonParse } from "@/lib/utils";

import { SuccessTracker } from "./tracker";

export const metadata: Metadata = {
  title: "Checkout Status | MythRealms",
  description: "Check the latest payment and fulfillment status for your MythRealms order.",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  if (!orderId) notFound();
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) notFound();
  const isPaid = isPaidOrderStatus(order?.status);
  const presentation = getCheckoutSuccessPresentation(
    order?.status,
    order?.confirmationSentAt,
  );
  const trackItems = (order?.items ?? []).map((item) => ({
    id: item.productId || "",
    name:
      safeJsonParse<{ name?: string }>(item.productSnapshot, { name: "Product" }).name ||
      "Product",
    quantity: item.quantity,
    price: item.price,
  }));

  return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center">
      <ClearCartOnPaid orderId={order?.id} status={order?.status} />
      {isPaid ? (
        <CheckCircle className="w-16 h-16 text-[var(--success)] mx-auto mb-6" />
      ) : (
        <Clock3 className="w-16 h-16 text-[var(--accent)] mx-auto mb-6" />
      )}
      <h1 className="font-serif text-3xl font-bold text-[var(--text)] mb-3">
        {presentation.heading}
      </h1>
      <p className="text-[var(--text-secondary)] mb-2">{presentation.message}</p>
      {orderId && (
        <p className="text-sm text-[var(--text-muted)] mb-8">
          Order ID:{" "}
          <code className="bg-[var(--border-light)] px-2 py-1 rounded text-[var(--text)]">
            {orderId}
          </code>
        </p>
      )}
      <p className="text-sm text-[var(--text-muted)] mb-8">{presentation.note}</p>
      <div className="flex gap-3 justify-center">
        <Link href="/collections/pearl-series">
          <Button variant="primary">Continue Shopping</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      {presentation.showFulfillmentSteps && (
        <div className="mt-12 text-left">
          <h2 className="font-serif text-xl font-semibold text-[var(--text)] mb-6 text-center">
            What Happens Next
          </h2>
          <div className="space-y-5">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div>
                <p className="font-medium text-[var(--text)] text-sm">We prepare your order</p>
                <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                  Your order is prepared for dispatch. Current processing expectations are
                  listed on our Shipping page.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div>
                <p className="font-medium text-[var(--text)] text-sm">We ship with tracking</p>
                <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                  Once shipped, you will receive an email with a tracking number to follow your
                  package.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                <Home className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div>
                <p className="font-medium text-[var(--text)] text-sm">It arrives at your door</p>
                <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                  Delivery typically takes 7-14 business days within the United States.
                  International orders may vary.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {orderId && presentation.trackPurchase && (
        <SuccessTracker orderId={orderId} value={order?.total ?? 0} items={trackItems} />
      )}
    </div>
  );
}
