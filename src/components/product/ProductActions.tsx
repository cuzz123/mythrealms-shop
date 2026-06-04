"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import { useCartStore, useCartUIStore } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import type { Variant } from "@/components/product/VariantSelector";

interface ProductActionsProps {
  productId: string;
  productName: string;
  productSlug: string;
  images: string[];
  variants: Variant[];
  comparePrice?: number | null;
}

export function ProductActions({
  productId,
  productName,
  productSlug,
  images,
  variants,
  comparePrice,
}: ProductActionsProps) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartUIStore((s) => s.openCart);

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    variants[0] || null
  );
  const [quantity, setQuantity] = useState(1);

  const currentPrice = selectedVariant?.price ?? variants[0]?.price ?? 0;
  const hasSale = comparePrice && comparePrice > currentPrice;
  const savings = hasSale ? comparePrice - currentPrice : 0;

  function handleAddToCart() {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    addItem(
      {
        id: productId,
        name: productName,
        slug: productSlug,
        image: images[0] || "",
        price: currentPrice,
        variantId: selectedVariant.id,
        variantName: selectedVariant.name,
      },
      quantity
    );

    toast.success(`Added to cart!`);
    openCart();
  }

  function handleBuyNow() {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    addItem(
      {
        id: productId,
        name: productName,
        slug: productSlug,
        image: images[0] || "",
        price: currentPrice,
        variantId: selectedVariant.id,
        variantName: selectedVariant.name,
      },
      quantity
    );

    router.push("/checkout");
  }

  return (
    <div>
      {/* Price */}
      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-3xl font-bold text-[var(--sale)]">
          {formatPrice(currentPrice)}
        </span>
        {hasSale && (
          <>
            <span className="text-xl text-[var(--text-muted)] line-through">
              {formatPrice(comparePrice!)}
            </span>
            <span className="text-sm font-semibold text-[var(--sale)] bg-[var(--sale-bg)] px-3 py-1 rounded-full">
              Save {formatPrice(savings)}
            </span>
          </>
        )}
      </div>

      {/* Variant Selector */}
      <div className="mb-5">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-[var(--text)] mb-2">
          Material
        </p>
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => {
            const isSelected = selectedVariant?.id === v.id;
            const isSoldOut = v.stock <= 0;
            return (
              <button
                key={v.id}
                onClick={() => !isSoldOut && setSelectedVariant(v)}
                disabled={isSoldOut}
                className={`px-4 py-2.5 rounded-full text-sm font-medium transition border ${
                  isSoldOut
                    ? "opacity-40 line-through cursor-not-allowed border-[var(--border)] text-[var(--text-muted)]"
                    : isSelected
                    ? "border-[var(--accent)] bg-[var(--border-light)] text-[var(--accent)] font-semibold"
                    : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]"
                }`}
              >
                {v.name} — {formatPrice(v.price)}
              </button>
            );
          })}
        </div>
        {selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
          <p className="text-sm text-[var(--sale)] mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--sale)] animate-pulse" />
            Only {selectedVariant.stock} items in stock!
          </p>
        )}
      </div>

      {/* Quantity */}
      <div className="mb-5">
        <p className="text-[13px] font-semibold uppercase tracking-wider text-[var(--text)] mb-2">
          Quantity
        </p>
        <div className="flex items-center border border-[var(--border)] rounded-full w-fit">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-[var(--border-light)] rounded-l-full"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(99, quantity + 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-[var(--border-light)] rounded-r-full"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleAddToCart}
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          Add to Cart
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={handleBuyNow}
        >
          Buy It Now
        </Button>
      </div>
    </div>
  );
}
