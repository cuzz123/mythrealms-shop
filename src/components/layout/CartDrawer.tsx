"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Trash2, Mail } from "lucide-react";
import { useCartStore, useCartUIStore } from "@/lib/cart";
import { cn, formatPrice } from "@/lib/utils";
import { imageUrl } from "@/lib/images";

const FREE_SHIPPING_THRESHOLD = 69.99;

export function CartDrawer() {
  const isOpen = useCartUIStore((s) => s.isOpen);
  const closeCart = useCartUIStore((s) => s.closeCart);

  const items = useCartStore((s) => s.items);
  const itemCount = useCartStore((s) => s.itemCount());
  const subtotal = useCartStore((s) => s.subtotal());
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  // Abandoned cart save
  const [showSave, setShowSave] = useState(false);
  const [saveEmail, setSaveEmail] = useState("");
  const [saved, setSaved] = useState(false);

  // Close on Escape key — prompt save when cart has items
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (items.length > 0 && !saved) {
          setShowSave(true);
        } else {
          closeCart();
          setShowSave(false);
        }
      }
    },
    [closeCart, items.length, saved],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll while drawer is open
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  // Free shipping calculation
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const progressPercent = Math.min(
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
    100,
  );
  const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  // Recommended products
  const [recommended, setRecommended] = useState<any[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/products?featured=true&limit=3")
      .then((r) => r.json())
      .then((data) => {
        if (data.products) {
          setRecommended(data.products.slice(0, 3));
        }
      })
      .catch(() => {});
  }, [isOpen]);

  // ── Abandoned cart handlers ──
  function handleClose() {
    if (items.length > 0 && !saved) {
      setShowSave(true);
    } else {
      closeCart();
      setShowSave(false);
    }
  }

  async function handleSave() {
    if (!saveEmail) return;
    try {
      await fetch("/api/email/abandoned-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: saveEmail,
          cartItems: items.map((i) => ({
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
          })),
          stage: "1h",
        }),
      });
    } catch {
      /* silent — best effort save */
    }
    setSaved(true);
    setShowSave(false);
    setTimeout(() => {
      closeCart();
      setSaved(false);
    }, 1200);
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-[var(--overlay)] transition-opacity duration-300",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={cn(
          "fixed top-0 right-0 z-50 flex h-full w-full flex-col bg-[var(--surface)] shadow-[var(--shadow-xl)] transition-transform duration-400 ease-out sm:w-[420px]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label={`Shopping cart with ${itemCount} items`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h2 className="font-serif text-lg font-semibold text-[var(--text)]">
            Your Cart ({itemCount})
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-muted)] transition-colors hover:bg-[var(--border-light)] hover:text-[var(--text)]"
            aria-label="Close cart"
          >
            <X size={20} strokeWidth={1.8} />
          </button>
        </div>

        {/* Body — cart items or empty state */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--border-light)]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-muted)"
                strokeWidth="1.5"
                className="h-7 w-7"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </div>
            <p className="text-[var(--text-muted)]">Your cart is empty</p>
            <button
              type="button"
              onClick={closeCart}
              className="mt-2 rounded-[var(--radius-md)] bg-[var(--primary)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-hover)]"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Item list */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="divide-y divide-[var(--border)]">
                {items.map((item) => (
                  <li key={`${item.product.id}-${item.product.variantId ?? "default"}`} className="flex gap-3 py-4">
                    {/* Product image */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-[var(--border-light)]">
                      <Image
                        src={imageUrl(item.product.image)}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    {/* Product details */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <Link
                          href={`/products/${item.product.slug}`}
                          onClick={closeCart}
                          className="block truncate text-sm font-medium text-[var(--text)] transition-colors hover:text-[var(--primary)]"
                        >
                          {item.product.name}
                        </Link>
                        {item.product.variantName && (
                          <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                            {item.product.variantName}
                          </p>
                        )}
                        <p className="mt-0.5 text-sm font-medium text-[var(--text)]">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      {/* Quantity controls + remove */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-[var(--radius-sm)] border border-[var(--border)]">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.product.variantId,
                                item.quantity - 1,
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                            aria-label={`Decrease quantity of ${item.product.name}`}
                          >
                            <Minus size={13} strokeWidth={2} />
                          </button>
                          <span className="flex h-7 w-8 items-center justify-center text-xs font-medium text-[var(--text)] tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.product.variantId,
                                item.quantity + 1,
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                            aria-label={`Increase quantity of ${item.product.name}`}
                          >
                            <Plus size={13} strokeWidth={2} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(
                              item.product.id,
                              item.product.variantId,
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-muted)] transition-colors hover:bg-red-900/20 hover:text-red-400"
                          aria-label={`Remove ${item.product.name} from cart`}
                        >
                          <Trash2 size={15} strokeWidth={1.8} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Abandoned Cart Save Prompt */}
            {showSave && !saved && (
              <div className="mx-5 mb-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border-light)] px-4 py-3">
                <p className="text-sm font-semibold text-[var(--text)] mb-1">
                  Save your cart?
                </p>
                <p className="text-xs text-[var(--text-muted)] mb-3">
                  We'll email you a link to pick up where you left off.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={saveEmail}
                    onChange={(e) => setSaveEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]"
                  />
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]"
                  >
                    <Mail size={14} />
                    Save
                  </button>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    setShowSave(false);
                  }}
                  className="mt-2 text-xs text-[var(--text-muted)] hover:underline"
                >
                  No thanks
                </button>
              </div>
            )}
            {saved && (
              <div className="mx-5 mb-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border-light)] px-4 py-3 text-center text-sm font-semibold text-[var(--text)]">
                Check your inbox!
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-[var(--border)] px-5 py-4">
              {/* Free shipping progress */}
              {hasFreeShipping ? (
                <div className="mb-4 flex items-center gap-2 rounded-[var(--radius-md)] bg-[#1A2E1A] px-3 py-2.5 text-sm text-[var(--success)]">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4 shrink-0"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">
                    Congratulations! You have earned free shipping.
                  </span>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="mb-1.5 flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span>
                      You are {formatPrice(remaining)} away from free shipping
                    </span>
                    <span className="font-medium">{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--border-light)]">
                    <div
                      className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Subtotal */}
              <div className="mb-4 flex items-center justify-between border-t border-[var(--border)] pt-3">
                <span className="text-sm font-medium text-[var(--text)]">
                  Subtotal
                </span>
                <span className="font-serif text-lg font-semibold text-[var(--text)]">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {/* You May Also Like */}
              {recommended.length > 0 && (
                <div className="mb-4 border-t border-[var(--border)] pt-3">
                  <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                    You May Also Like
                  </p>
                  <div className="flex gap-3 overflow-x-auto">
                    {recommended.map((p: any) => (
                      <Link
                        key={p.id}
                        href={`/products/${p.slug}`}
                        onClick={closeCart}
                        className="flex-shrink-0 w-[90px] group"
                      >
                        <div className="w-[90px] h-[90px] rounded-[var(--radius-md)] overflow-hidden bg-[var(--border-light)] mb-1.5">
                          <Image
                            src={imageUrl(Array.isArray(p.images) ? p.images[0] : (typeof p.images === "string" ? JSON.parse(p.images)[0] : ""))}
                            alt={p.name}
                            width={90}
                            height={90}
                            className="object-cover w-full h-full transition-transform group-hover:scale-105"
                          />
                        </div>
                        <p className="text-[11px] text-[var(--text)] line-clamp-2 leading-tight mb-0.5">
                          {p.name}
                        </p>
                        <p className="text-[11px] font-medium text-[var(--text-secondary)]">
                          {formatPrice(p.variants?.[0]?.price || 0)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <Link
                href="/cart"
                onClick={closeCart}
                className="flex h-11 w-full items-center justify-center rounded-[var(--radius-md)] bg-[var(--primary)] text-sm font-medium text-white shadow-sm transition-colors hover:bg-[var(--primary-hover)]"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-2 flex h-11 w-full items-center justify-center rounded-[var(--radius-md)] border border-[var(--accent)] text-sm font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/10"
              >
                Checkout
              </Link>
              <button
                type="button"
                onClick={closeCart}
                className="mt-3 w-full text-center text-sm text-[var(--text-secondary)] underline-offset-2 transition-colors hover:text-[var(--text)] hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
