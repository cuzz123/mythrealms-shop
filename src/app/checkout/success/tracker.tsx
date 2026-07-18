"use client";

import { useEffect } from "react";

import { CONSENT_CHANGED_EVENT } from "@/lib/analytics/consent";
import { purchaseStorageKey, trackPurchase } from "@/lib/tracking";

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
    const key = purchaseStorageKey(orderId);
    let listening = false;

    const stopListening = () => {
      if (!listening) return;
      window.removeEventListener(CONSENT_CHANGED_EVENT, attemptPurchaseTracking);
      listening = false;
    };

    const attemptPurchaseTracking = () => {
      try {
        if (localStorage.getItem(key) !== null) {
          stopListening();
          return;
        }
      } catch {
        return;
      }

      if (!trackPurchase(orderId, value, items ?? [])) return;

      try {
        localStorage.setItem(key, "true");
        stopListening();
      } catch {
        // The event was accepted, but storage is unavailable for cross-refresh deduplication.
      }
    };

    attemptPurchaseTracking();

    try {
      if (localStorage.getItem(key) === null) {
        window.addEventListener(CONSENT_CHANGED_EVENT, attemptPurchaseTracking);
        listening = true;
      }
    } catch {
      // Storage access failed closed above, so there is nothing to retry.
    }

    return stopListening;
  }, [items, orderId, value]);

  return null;
}
