"use client";

import { useEffect } from "react";

interface TrackItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export function SuccessTracker({
  orderId,
  value,
  items,
}: {
  orderId: string;
  value: number;
  items?: TrackItem[];
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as any;

    if (w.gtag) {
      w.gtag("event", "purchase", {
        transaction_id: orderId,
        currency: "USD",
        value,
        items: items?.map((i) => ({
          item_id: i.id,
          item_name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
      });
    }
    if (w.fbq) {
      w.fbq("track", "Purchase", { currency: "USD", value });
    }
    if (w.pintrk) {
      w.pintrk("track", "checkout", { value, currency: "USD", order_id: orderId });
    }
  }, [orderId, value]);

  return null;
}
