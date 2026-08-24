"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";

export function shouldShowStickyAddToCart(
  visible: boolean,
  primaryInViewport: boolean,
  isMobile: boolean,
  primaryHasBeenInViewport: boolean,
): boolean {
  return visible && !primaryInViewport && isMobile && primaryHasBeenInViewport;
}

export function shouldMarkPrimaryAsEncountered(
  alreadyEncountered: boolean,
  isIntersecting: boolean,
  boundingClientRectBottom: number,
): boolean {
  return alreadyEncountered || isIntersecting || boundingClientRectBottom <= 0;
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
  const [primaryHasBeenInViewport, setPrimaryHasBeenInViewport] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    let observer: IntersectionObserver | undefined;

    const observePrimaryControl = () => {
      observer?.disconnect();

      if (!visible || !mobileQuery.matches) {
        setIsMobile(false);
        setPrimaryInViewport(true);
        setPrimaryHasBeenInViewport(false);
        return;
      }

      setIsMobile(true);
      const primaryControl = document.getElementById("primary-add-to-cart");
      if (!primaryControl) {
        setPrimaryInViewport(true);
        setPrimaryHasBeenInViewport(false);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          setPrimaryInViewport(entry.isIntersecting);
          setPrimaryHasBeenInViewport((alreadyEncountered) =>
            shouldMarkPrimaryAsEncountered(
              alreadyEncountered,
              entry.isIntersecting,
              entry.boundingClientRect.bottom,
            ),
          );
        },
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

  if (!shouldShowStickyAddToCart(visible, primaryInViewport, isMobile, primaryHasBeenInViewport)) {
    return null;
  }

  return (
    <div
      className="sticky-add-to-cart md:hidden"
      data-testid="sticky-add-to-cart"
      style={{ bottom: "calc(4.5rem + env(safe-area-inset-bottom, 0px))" }}
    >
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
