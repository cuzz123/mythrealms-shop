"use client";

import { useEffect } from "react";

export function SuccessTracker({ orderId }: { orderId: string }) {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "purchase", {
        transaction_id: orderId,
        currency: "USD",
        value: 0, // Will be updated when we fetch order details
      });
    }
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Purchase", { currency: "USD" });
    }
  }, [orderId]);

  return null;
}
