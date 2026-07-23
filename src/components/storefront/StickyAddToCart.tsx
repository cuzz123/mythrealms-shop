"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";

export function shouldShowStickyAddToCart(
  visible: boolean,
  primaryInViewport: boolean,
  isMobile: boolean,
): boolean {
  return visible && !primaryInViewport && isMobile;
}

interface StickyAddToCartProps {
  visible: boolean;
  disabled: boolean;
  onAdd: () => void;
  price: string;
  label: string;
}

export function StickyAddToCart({
  visible,
  disabled,
  onAdd,
  price,
  label,
}: StickyAddToCartProps) {
  const [primaryInViewport, setPrimaryInViewport] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    let observer: IntersectionObserver | undefined;

    const observePrimaryControl = () => {
      observer?.disconnect();

      if (!visible || !mobileQuery.matches) {
        setIsMobile(false);
        setPrimaryInViewport(true);
        return;
      }

      setIsMobile(true);
      const primaryControl = document.getElementById("primary-add-to-cart");
      if (!primaryControl) {
        setPrimaryInViewport(true);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => setPrimaryInViewport(entry.isIntersecting),
        { threshold: 0.15 },
      );
      observer.observe(primaryControl);
    };

    observePrimaryControl();
    mobileQuery.addEventListener("change", observePrimaryControl);

    return () => {
      observer?.disconnect();
      mobileQuery.removeEventListener("change", observePrimaryControl);
    };
  }, [visible]);

  if (!shouldShowStickyAddToCart(visible, primaryInViewport, isMobile)) {
    return null;
  }

  return (
    <div className="sticky-add-to-cart md:hidden" data-testid="sticky-add-to-cart">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-[var(--text)]">{label}</p>
          <p className="text-sm text-[var(--text-secondary)]">{price}</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          disabled={disabled}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--bg)] transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={`Add ${label} to cart`}
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          Add to cart
        </button>
      </div>
    </div>
  );
}
