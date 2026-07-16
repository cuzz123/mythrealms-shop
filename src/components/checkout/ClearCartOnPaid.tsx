"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useCartStore } from "@/lib/cart";
import {
  isPaidOrderStatus,
  shouldPollOrderStatus,
} from "@/lib/checkout/order-status";

export function ClearCartOnPaid({
  orderId,
  status,
}: {
  orderId?: string;
  status?: string | null;
}) {
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();

  useEffect(() => {
    if (isPaidOrderStatus(status)) {
      clearCart();
      return;
    }
    if (!orderId || !shouldPollOrderStatus(status)) return;

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      router.refresh();
      if (attempts >= 30) window.clearInterval(timer);
    }, 2_000);

    return () => window.clearInterval(timer);
  }, [clearCart, orderId, router, status]);

  return null;
}
