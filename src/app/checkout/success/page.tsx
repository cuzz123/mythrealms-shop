import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";
import { SuccessTracker } from "./tracker";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center">
      <CheckCircle className="w-16 h-16 text-[var(--success)] mx-auto mb-6" />
      <h1 className="font-serif text-3xl font-bold text-[var(--text)] mb-3">Order Confirmed!</h1>
      <p className="text-[var(--text-secondary)] mb-2">Thank you for your purchase. Your order has been received and is being processed.</p>
      {orderId && (
        <p className="text-sm text-[var(--text-muted)] mb-8">Order ID: <code className="bg-[var(--border-light)] px-2 py-1 rounded text-[var(--text)]">{orderId}</code></p>
      )}
      <p className="text-sm text-[var(--text-muted)] mb-8">A confirmation email will be sent shortly. Ancient legends are already on their way to you.</p>
      <div className="flex gap-3 justify-center">
        <Link href="/collections/beast-pendants"><Button variant="primary">Continue Shopping</Button></Link>
        <Link href="/"><Button variant="outline">Back to Home</Button></Link>
      </div>
      {orderId && <SuccessTracker orderId={orderId} />}
    </div>
  );
}
