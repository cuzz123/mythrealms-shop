import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/Button";
import { CheckCircle, Package, Truck, Home } from "lucide-react";
import { SuccessTracker } from "./tracker";
import { safeJsonParse } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order Confirmed — MythRealms",
  description: "Your order has been confirmed. Your intentions are on their way to you.",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  const order = orderId
    ? await db.order.findUnique({ where: { id: orderId }, include: { items: true } })
    : null;
  const trackValue = order?.total ?? 0;
  const trackItems = (order?.items ?? []).map((i) => ({
    id: i.productId || "",
    name: safeJsonParse<{ name?: string }>(i.productSnapshot, { name: "Product" }).name || "Product",
    quantity: i.quantity,
    price: i.price,
  }));
  return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center">
      <CheckCircle className="w-16 h-16 text-[var(--success)] mx-auto mb-6" />
      <h1 className="font-serif text-3xl font-bold text-[var(--text)] mb-3">Order Confirmed!</h1>
      <p className="text-[var(--text-secondary)] mb-2">Thank you for your purchase. Your order has been received and is being processed.</p>
      {orderId && (
        <p className="text-sm text-[var(--text-muted)] mb-8">Order ID: <code className="bg-[var(--border-light)] px-2 py-1 rounded text-[var(--text)]">{orderId}</code></p>
      )}
      <p className="text-sm text-[var(--text-muted)] mb-8">A confirmation email will be sent shortly. Your intention pieces are already on their way to you.</p>
      <div className="flex gap-3 justify-center">
        <Link href="/collections/curated-singles"><Button variant="primary">Continue Shopping</Button></Link>
        <Link href="/"><Button variant="outline">Back to Home</Button></Link>
      </div>

      {/* What happens next */}
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
                Our artisans carefully inspect and package each piece. This takes 2-3 business days.
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
                Once shipped, you will receive an email with a tracking number to follow your package.
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
                Delivery typically takes 7-14 business days within the United States. International orders may vary.
              </p>
            </div>
          </div>
        </div>
      </div>

      {orderId && <SuccessTracker orderId={orderId} value={trackValue} items={trackItems} />}
    </div>
  );
}
