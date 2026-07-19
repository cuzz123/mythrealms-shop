"use client";

import { useEffect } from "react";

import {
  createPurchaseTrackingController,
  trackPurchase,
  type TrackingEventTarget,
} from "@/lib/tracking";

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
    const target: TrackingEventTarget = {
      addEventListener: (type, listener) =>
        window.addEventListener(type, listener),
      removeEventListener: (type, listener) =>
        window.removeEventListener(type, listener),
    };
    const controller = createPurchaseTrackingController({
      target,
      storage: localStorage,
      orderId,
      track: (completed) =>
        trackPurchase(
          orderId,
          value,
          items ?? [],
          undefined,
          undefined,
          undefined,
          completed,
        ),
    });

    controller.start();
    return controller.cleanup;
  }, [items, orderId, value]);

  return null;
}
