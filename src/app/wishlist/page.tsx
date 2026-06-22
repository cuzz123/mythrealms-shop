"use client";

import { useWishlistStore } from "@/lib/wishlist";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { imageUrl } from "@/lib/images";
import Link from "next/link";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/lib/cart";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <Heart className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-6" />
        <h1 className="font-serif text-3xl font-bold text-[var(--text)] mb-3">Your Wishlist is Empty</h1>
        <p className="text-[var(--text-muted)] mb-8">Save your favorite mythical pieces here and come back to them anytime.</p>
        <Link href="/collections/beast-pendants">
          <Button variant="primary" size="lg">Explore the Bestiary</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--text)]">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Wishlist</span>
      </nav>

      <h1 className="font-serif text-4xl font-bold text-[var(--text)] mb-8">My Wishlist ({items.length})</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
            <Link href={`/products/${item.slug}`} className="w-20 h-20 rounded-lg overflow-hidden bg-[var(--border-light)] flex-shrink-0">
              <img src={imageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/products/${item.slug}`} className="font-medium text-[var(--text)] hover:text-[var(--accent)] line-clamp-1">
                {item.name}
              </Link>
              <p className="text-sm text-[var(--accent)] font-semibold mt-1">{formatPrice(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  addItem({ id: item.id, name: item.name, slug: item.slug, image: item.image, price: item.price });
                  toast.success("Added to cart!");
                }}
                className="p-2 rounded-full hover:bg-[var(--accent)]/10 text-[var(--text-secondary)] hover:text-[var(--accent)] transition"
                aria-label="Add to cart"
              >
                <ShoppingBag className="w-5 h-5" />
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 rounded-full hover:bg-red-900/20 text-[var(--text-muted)] hover:text-red-400 transition"
                aria-label="Remove from wishlist"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Link href="/collections/beast-pendants" className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mt-8 justify-center">
        <ArrowLeft className="w-4 h-4" /> Continue Browsing
      </Link>
    </div>
  );
}
