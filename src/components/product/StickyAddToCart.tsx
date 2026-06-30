"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { imageUrl } from "@/lib/images";
import { ShoppingBag } from "lucide-react";
import { useCartStore, useCartUIStore } from "@/lib/cart";
import toast from "react-hot-toast";

interface StickyAddToCartProps {
  productId: string;
  productName: string;
  productSlug: string;
  image: string;
  price: number;
  variantId?: string;
  variantName?: string;
}

export function StickyAddToCart({ productId, productName, productSlug, image, price, variantId, variantName }: StickyAddToCartProps) {
  const [visible, setVisible] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartUIStore((s) => s.openCart);

  useEffect(() => {
    const handle = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const handleAdd = () => {
    addItem({ id: productId, name: productName, slug: productSlug, image, price, variantId, variantName });
    toast.success("Added to cart!");
    openCart();
  };

  return (
    <div className={`lg:hidden fixed bottom-14 left-0 right-0 z-30 bg-[var(--surface)] border-t border-[var(--border)] px-4 py-3 transition-transform duration-200 ease-out ${visible ? "translate-y-0" : "translate-y-full"}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden border border-[var(--border)]">
            <Image src={imageUrl(image)} alt={productName} fill sizes="40px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--text)] truncate">{productName}</p>
            <p className="text-sm font-bold text-[var(--accent)]">{formatPrice(price)}</p>
          </div>
        </div>
        <button onClick={handleAdd} className="flex-shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 bg-[var(--accent)] text-[var(--bg)] rounded-full font-semibold text-sm hover:bg-[var(--accent-hover)] transition">
          <ShoppingBag className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
