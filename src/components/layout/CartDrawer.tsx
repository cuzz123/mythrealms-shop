"use client";

import { useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCartStore, useCartUIStore } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { getStorefrontProducts } from "@/lib/storefront/catalog";
import { productDisplayName } from "@/lib/brand";
import { imageUrl } from "@/lib/images";
import { useDialogFocus } from "@/lib/client/use-dialog-focus";
import { FreeShippingProgress } from "@/components/storefront/FreeShippingProgress";

export function CartDrawer() {
  const isOpen = useCartUIStore((state) => state.isOpen);
  const closeCart = useCartUIStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const itemCount = useCartStore((state) => state.itemCount());
  const subtotal = useCartStore((state) => state.subtotal());
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useDialogFocus({
    isOpen,
    onClose: closeCart,
    containerRef: panelRef,
    initialFocusRef: closeRef,
  });

  const recommended = useMemo(() => {
    const cartIds = new Set(items.map((item) => item.product.id));
    return getStorefrontProducts()
      .filter((product) => !cartIds.has(product.id))
      .slice(0, 3);
  }, [items]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-[var(--overlay)]"
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        ref={panelRef}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col border-l border-[var(--border)] bg-[var(--surface-raised)] shadow-[var(--shadow-xl)]"
        role="dialog"
        aria-modal="true"
        aria-label={`Shopping cart with ${itemCount} items`}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-5 sm:px-6">
          <h2 className="font-serif text-xl font-semibold tracking-[0.01em] text-[var(--text)]">
            Your Cart ({itemCount})
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-alt)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)]"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <ShoppingBag className="mb-4 h-9 w-9 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-muted)]">Your cart is empty.</p>
            <button
              type="button"
              onClick={closeCart}
              className="mt-6 bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--bg)]"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 sm:px-6">
              <div id="free-shipping-progress" className="border-b border-[var(--border)] py-4">
                <FreeShippingProgress subtotal={subtotal} className="border-0 bg-[var(--surface-alt)]" />
              </div>
              <ul className="divide-y divide-[var(--border)]">
                {items.map((item) => (
                  <li
                    key={`${item.product.id}-${item.product.variantId ?? "default"}`}
                    className="flex gap-4 py-5"
                  >
                    <Link
                      href={`/products/${item.product.slug}`}
                      onClick={closeCart}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--border-light)]"
                    >
                      <Image
                        src={imageUrl(item.product.image)}
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${item.product.slug}`}
                        onClick={closeCart}
                        className="line-clamp-2 text-sm font-medium text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)]"
                      >
                        {item.product.name}
                      </Link>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        {formatPrice(item.product.price)}
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)]">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.product.variantId,
                                item.quantity - 1,
                              )
                            }
                            className="flex h-11 w-11 items-center justify-center rounded-l-[var(--radius-sm)] transition-colors hover:bg-[var(--surface-alt)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)]"
                            aria-label={`Decrease quantity of ${item.product.name}`}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs tabular-nums">
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
                            className="flex h-11 w-11 items-center justify-center rounded-r-[var(--radius-sm)] transition-colors hover:bg-[var(--surface-alt)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)]"
                            aria-label={`Increase quantity of ${item.product.name}`}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            removeItem(item.product.id, item.product.variantId)
                          }
                          className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-alt)] hover:text-[var(--sale)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)]"
                          aria-label={`Remove ${item.product.name} from cart`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {recommended.length > 0 && (
                <section className="border-t border-[var(--border)] py-5" aria-labelledby="cart-recommendations">
                  <h3 id="cart-recommendations" className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                    You May Also Like
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {recommended.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={closeCart}
                        className="min-w-0 rounded-[var(--radius-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)]"
                      >
                        <div className="relative aspect-square overflow-hidden rounded-[var(--radius-sm)] bg-[var(--border-light)]">
                          <Image
                            src={imageUrl(product.image)}
                            alt={productDisplayName(product)}
                            fill
                            sizes="120px"
                            className="object-cover"
                          />
                        </div>
                        <p className="mt-2 line-clamp-2 text-[11px] leading-tight text-[var(--text)]">
                          {productDisplayName(product)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="border-t border-[var(--border)] bg-[var(--surface)] px-5 py-5 sm:px-6">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <Link
                href="/cart"
                onClick={closeCart}
                className="flex h-11 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--primary)] text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)] focus-visible:ring-offset-2"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-2 flex h-11 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--accent)] text-sm font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--surface-alt)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)] focus-visible:ring-offset-2"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
