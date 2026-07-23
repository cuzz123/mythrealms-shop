"use client";

import { cn, formatPrice } from "@/lib/utils";
import { STORE_POLICY_FACTS } from "@/lib/storefront/policies";

export type FreeShippingProgress = {
  threshold: number;
  subtotal: number;
  remaining: number;
  progress: number;
  isUnlocked: boolean;
};

export function getFreeShippingProgress(subtotal: number): FreeShippingProgress {
  const threshold = STORE_POLICY_FACTS.freeShippingThresholdUsd;
  const normalizedSubtotal = Math.max(0, Number.isFinite(subtotal) ? subtotal : 0);
  const remaining = Math.max(0, Math.round((threshold - normalizedSubtotal) * 100) / 100);

  return {
    threshold,
    subtotal: normalizedSubtotal,
    remaining,
    progress: Math.min(100, Math.max(0, (normalizedSubtotal / threshold) * 100)),
    isUnlocked: remaining === 0,
  };
}

export function FreeShippingProgress({ subtotal, className }: { subtotal: number; className?: string }) {
  const progress = getFreeShippingProgress(subtotal);
  const message = progress.isUnlocked
    ? "Free standard shipping unlocked."
    : `Free shipping on orders of ${formatPrice(progress.threshold)} or more. ${formatPrice(progress.remaining)} away from free standard shipping.`;

  return (
    <div className={cn("border border-[var(--border)] bg-[var(--surface)] px-3 py-3", className)} role="status">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-medium text-[var(--text)]">{message}</span>
        <span className="shrink-0 text-[var(--text-muted)]">{formatPrice(progress.threshold)}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden bg-[var(--border-light)]" aria-hidden="true">
        <div className="h-full bg-[var(--accent)] transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${progress.progress}%` }} />
      </div>
    </div>
  );
}
