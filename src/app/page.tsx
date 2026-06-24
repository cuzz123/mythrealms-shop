import Link from "next/link";
import Image from "next/image";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { HeroCarousel } from "@/components/layout/HeroCarousel";
import { GuardianTeaser } from "@/components/layout/GuardianTeaser";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { PRODUCTS, CATEGORIES, getBestSellers } from "@/lib/1688-products";

export const dynamic = "force-static";

export default function HomePage() {
  const featured = PRODUCTS.filter(p => p.isBestSeller).slice(0, 4);
  const categories = CATEGORIES;

  return (
    <>
      {/* ===== HERO ===== */}
      <HeroCarousel />

      {/* ===== TRUST BAR ===== */}
      <div className="bg-[#0A0808] border-b border-[#2A2520]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-center gap-6 sm:gap-10 text-xs text-[#8A7D6E] font-medium overflow-x-auto whitespace-nowrap">
          <span>Free Shipping Over $69.99</span>
          <span className="text-[#3A3220]">|</span>
          <span>Hand-Selected Stones</span>
          <span className="text-[#3A3220]">|</span>
          <span>30-Day Easy Returns</span>
          <span className="text-[#3A3220]">|</span>
          <span>Ethically Sourced</span>
        </div>
      </div>

      {/* ===== SHOP BY COLLECTION ===== */}
      <section className="py-14 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[#D4A84B] uppercase mb-2">New Collection</span>
            <h2 className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-[#E8E0D5]">Shop by Series</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((cat) => {
              const first = PRODUCTS.filter(p => p.category === cat.slug)[0];
              return (
                <Link key={cat.slug} href={`/collections/${cat.slug}`} className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-[var(--border)] hover:border-[var(--accent)]/40 transition-all">
                  {first && <Image src={first.image} alt={cat.name} fill sizes="(max-width:640px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />}
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
      </section>

      {/* ===== FEATURED SINGLES ===== */}
      <section className="py-14 bg-[#1A1816]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-[#E8E0D5]">Curated Singles</h2>
            <Link href="/collections/curated-singles" className="hidden sm:flex items-center gap-1 text-sm text-[var(--accent)] hover:underline whitespace-nowrap">View All <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`} className="group flex gap-4 bg-[var(--surface)] rounded-xl p-3 border border-[var(--border)] hover:border-[var(--accent)]/40 transition-all">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                  <Image src={p.image} alt={p.name} fill sizes="96px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h4 className="text-sm font-medium text-[var(--text)] line-clamp-1">{p.name}</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{p.categoryName} · {formatPrice(p.price)}</p>
                  {p.images.length > 1 && <p className="text-[10px] text-[var(--accent)] mt-1">{p.images.length} detail photos</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="py-12 bg-[#1A1816]">
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
      </section>
    </>
  );
}
