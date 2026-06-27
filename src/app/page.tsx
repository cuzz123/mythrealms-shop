import Link from "next/link";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { HeroCarousel } from "@/components/layout/HeroCarousel";
import { ArrowRight, Gem, Leaf, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { PRODUCTS, CATEGORIES } from "@/lib/1688-products";
import { LazyImage } from "@/components/ui/LazyImage";
import { RecentlyViewed } from "@/components/ui/RecentlyViewed";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const dynamic = "force-static";

export default function HomePage() {
  const featured = PRODUCTS.filter(p => p.category === 'curated-singles' && p.isBestSeller).slice(0, 6);
  const categories = CATEGORIES;

  return (
    <>
      {/* ===== HERO ===== */}
      <HeroCarousel />

      {/* Urgency signal */}
      <div className="bg-[#1A1816] border-b border-[var(--border)]">
        <p className="max-w-7xl mx-auto px-6 py-2.5 text-center text-xs text-[#D4A84B]/80 tracking-wide">
          Limited quantities — each piece hand-selected and unique.
        </p>
      </div>

      {/* ===== SHOP BY COLLECTION ===== */}
      <ScrollReveal as="section" className="py-14 bg-[var(--surface-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[#D4A84B] uppercase mb-2">New Collection</span>
            <h2 className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-[#E8E0D5]">Shop by Series</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((cat, i) => {
              const first = PRODUCTS.filter(p => p.category === cat.slug)[0];
              const coverImage = cat.image || first?.image;
              return (
                <Link key={cat.slug} href={`/collections/${cat.slug}`} className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-[var(--border)] hover:border-[var(--accent)]/40 transition-all">
                  {coverImage && <LazyImage src={coverImage} alt={cat.name} fill sizes="(max-width:640px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" containerClassName="absolute inset-0" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-serif text-lg font-semibold text-white">{cat.name}</h3>
                    <p className="text-xs text-white/60 mt-0.5">{PRODUCTS.filter(p => p.category === cat.slug).length} styles</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      <div className="max-w-7xl mx-auto px-6"><div className="h-px bg-[var(--border)]" /></div>

      {/* ===== FEATURED SINGLES ===== */}
      <ScrollReveal as="section" className="py-14 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-[#E8E0D5]">Best Sellers</h2>
            <Link href="/collections/curated-singles" className="hidden sm:flex items-center gap-1 text-sm text-[var(--accent)] hover:underline whitespace-nowrap">View All <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((p, i) => (
              <Link key={p.slug} href={`/products/${p.slug}`} className="group flex gap-4 bg-[var(--surface)] rounded-xl p-3 border border-[var(--border)] hover:border-[var(--accent)]/40 transition-all">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                  <LazyImage src={p.image} alt={p.name} fill sizes="96px" className="object-cover group-hover:scale-105 transition-transform duration-500" containerClassName="absolute inset-0" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h4 className="text-sm font-medium text-[var(--text)] line-clamp-1">{p.name}</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{p.categoryName} · {formatPrice(p.price)}{p.compareAt && p.compareAt > p.price ? <span className="line-through ml-1.5">{formatPrice(p.compareAt)}</span> : null}</p>
                  {p.images.length > 1 && <p className="text-[10px] text-[var(--accent)] mt-1">{p.images.length} detail photos</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <div className="max-w-7xl mx-auto px-6"><div className="h-px bg-[var(--border)]" /></div>

      {/* ===== WHY MYTHREALMS ===== */}
      <ScrollReveal as="section" className="py-14 bg-[var(--surface-alt)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[#D4A84B] uppercase mb-2">Why MythRealms</span>
          <h2 className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-[#E8E0D5] mb-10">Crafted with Intention</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#1A1816] border border-[#2A2520] flex items-center justify-center mb-4">
                <Gem className="w-6 h-6 text-[#D4A84B]" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#E8E0D5] mb-2">Hand-Selected</h3>
              <p className="text-sm text-[#8A7D6E] leading-relaxed">Each stone is individually chosen for its unique character and energy. No mass production — every piece is one of a kind.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#1A1816] border border-[#2A2520] flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-[#D4A84B]" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#E8E0D5] mb-2">Ethically Sourced</h3>
              <p className="text-sm text-[#8A7D6E] leading-relaxed">Direct from artisan mines with fair labor practices. We know every stone's origin and the hands that shaped it.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#1A1816] border border-[#2A2520] flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-[#D4A84B]" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#E8E0D5] mb-2">30-Day Trial</h3>
              <p className="text-sm text-[#8A7D6E] leading-relaxed">Wear it, love it, or return it. If it doesn't feel like yours within 30 days, send it back — no questions asked.</p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <div className="max-w-7xl mx-auto px-6"><div className="h-px bg-[var(--border)]" /></div>

      {/* ===== STYLED BY YOU ===== */}
      <ScrollReveal as="section" className="py-14 bg-[var(--surface-alt)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[#D4A84B] uppercase mb-2">Coming Soon — Share Your Look</span>
          <h2 className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-[#E8E0D5] mb-2">Share Your Look</h2>
          <p className="text-[#8A7D6E] text-sm mb-8">Tag @mythrealms.shop to be featured here</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['/images/share/Share1.webp', '/images/share/Share2.webp', '/images/share/Share3.webp', '/images/share/Share4.webp'].map((src, i) => (
              <a key={i} href="https://instagram.com/mythrealms.shop" target="_blank" rel="noopener noreferrer" className="group relative aspect-[4/5] rounded-xl overflow-hidden border border-[var(--border)] hover:border-[var(--accent)]/40 transition-all">
                <LazyImage src={src} alt={`MythRealms — share your look`} fill sizes="(max-width:640px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" containerClassName="absolute inset-0" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-end justify-center pb-3">
                  <span className="text-white/80 text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">Tag @mythrealms.shop</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <div className="max-w-7xl mx-auto px-6"><div className="h-px bg-[var(--border)]" /></div>

      {/* ===== NEWSLETTER ===== */}
      <ScrollReveal as="section" className="py-12 bg-[#1A1816]">
        <div className="max-w-[540px] mx-auto px-6 text-center">
          <h2 className="font-serif text-2xl font-bold text-[#E8E0D5] mb-2">Join the Circle</h2>
          <p className="text-[#A89880] text-sm mb-6">Early access to new stone collections, styling guides, and exclusive subscriber-only discounts.</p>
          <NewsletterForm />
          <div className="flex justify-center gap-6 mt-6 text-xs text-[#8A7D6E]">
            <span>Hand-Selected</span><span className="text-[#3A3220]">|</span>
            <span>Ethically Sourced</span><span className="text-[#3A3220]">|</span>
            <span>30-Day Returns</span>
          </div>
        </div>
      </ScrollReveal>
      <RecentlyViewed />
    </>
  );
}
