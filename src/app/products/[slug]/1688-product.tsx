"use client";
import { useState } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/1688-products";
import { formatPrice } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ZoomIn, ShoppingBag } from "lucide-react";
import { LazyImage } from "@/components/ui/LazyImage";
import { useCartStore, useCartUIStore } from "@/lib/cart";
import toast from "react-hot-toast";

export function Product1688({ slug }: { slug: string }) {
  const product = PRODUCTS.find(p => p.slug === slug);
  const [activeIdx, setActiveIdx] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartUIStore((s) => s.openCart);
  
  if (!product) return null;
  const p = product; // TS narrowing for closure below
  const images = p.images;
  const mainImg = images[activeIdx] || p.image;

  function handleAddToCart() {
    addItem({
      id: p.id,
      name: p.name,
      slug: p.slug,
      image: p.image,
      price: p.price,
    });
    toast.success("Added to cart!");
    openCart();
  }
  
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
        <span className="mx-2">/</span>
        <Link href={`/collections/${p.category}`} className="hover:text-[var(--accent)]">{p.categoryName}</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--text)]">{p.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
            <LazyImage src={mainImg} alt={p.name} fill sizes="(max-width:1024px) 100vw, 50vw" priority className="object-cover" containerClassName="absolute inset-0" />
            {images.length > 1 && (
              <>
                <button onClick={() => setActiveIdx(i => i > 0 ? i-1 : images.length-1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => setActiveIdx(i => i < images.length-1 ? i+1 : 0)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-6 gap-2 mt-3">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveIdx(i)} className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${i === activeIdx ? 'border-[var(--accent)]' : 'border-transparent hover:border-[var(--border)]'}`}>
                  <LazyImage src={img} alt={`${p.name} ${i+1}`} fill sizes="80px" className="object-cover" containerClassName="absolute inset-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-xs text-[var(--accent)] uppercase tracking-wider font-medium">{p.categoryName}</p>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-[var(--text)] mt-1.5">{p.name}</h1>
          <p className="text-2xl font-semibold text-[var(--text)] mt-4">{formatPrice(p.price)}</p>
          
          <div className="mt-5 space-y-3 text-sm text-[var(--text-muted)] leading-relaxed">
            <p>{p.description}</p>
            <p>Material: Natural stone · Elastic fit · One size fits most</p>
            <p>Hand-selected. Each piece is unique — natural stone variations are part of its character.</p>
          </div>

          {p.images.length > 1 && (
            <div className="mt-5 p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
              <p className="text-xs text-[var(--accent)] font-medium">📸 {p.images.length} detail photos — use arrows to explore every angle</p>
            </div>
          )}

          <div className="mt-6">
            <button onClick={handleAddToCart} className="w-full py-3.5 rounded-lg bg-[var(--accent)] text-white font-semibold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              Add to Cart — {formatPrice(p.price)}
            </button>
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs text-[var(--text-muted)]">
            <span>Free shipping over $69.99</span>
            <span>·</span>
            <span>30-day returns</span>
            <span>·</span>
            <span>Hand-selected</span>
          </div>

          {/* Story link */}
          <a
            href="/about"
            className="flex items-center gap-3 p-4 bg-[#1A1812] border border-[#3A3220] rounded-lg mt-6 hover:border-[var(--accent)]/40 transition-colors cursor-pointer group"
          >
            <span className="text-sm font-medium text-[var(--text)]">
              Every stone has a story —{" "}
              <span className="text-[var(--accent)] group-hover:underline">
                Read the Story
              </span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
