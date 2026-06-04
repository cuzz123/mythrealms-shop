import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { XCircle } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center">
      <XCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
      <h1 className="font-serif text-3xl font-bold text-[var(--text)] mb-3">Checkout Cancelled</h1>
      <p className="text-[var(--text-secondary)] mb-8">Your payment was not processed. Your cart items are still saved — you can try again whenever you are ready.</p>
      <div className="flex gap-3 justify-center">
        <Link href="/cart"><Button variant="primary">Return to Cart</Button></Link>
        <Link href="/"><Button variant="outline">Back to Home</Button></Link>
      </div>
    </div>
  );
}
