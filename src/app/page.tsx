import Link from "next/link";
import Image from "next/image";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { HeroCarousel } from "@/components/layout/HeroCarousel";
import { GuardianTeaser } from "@/components/layout/GuardianTeaser";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { imageUrl } from "@/lib/images";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <>
      {/* ===== HERO CAROUSEL (first thing visitor sees) ===== */}
      <HeroCarousel />

      {/* ===== TRUST BAR ===== */}
      <div className="bg-[#0A0808] border-b border-[#2A2520]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-center gap-6 sm:gap-10 text-xs text-[#8A7D6E] font-medium overflow-x-auto whitespace-nowrap">
          <span>Free Shipping Over $69.99</span>
          <span className="text-[#3A3220]">|</span>
          <span>30-Day Returns</span>
          <span className="text-[#3A3220]">|</span>
          <span>Handcrafted to Order</span>
          <span className="text-[#3A3220]">|</span>
          <span>Secure Checkout</span>
        </div>
      </div>

      {/* ===== GUARDIAN TEASER — personalization before browsing ===== */}
      <GuardianTeaser />

      {/* ===== NEW COLLECTIONS (Featured Products) ===== */}
      <section className="py-14 bg-[#1A1816]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-[#E8E0D5]">New Arrivals</h2>
            <Link href="/collections" className="hidden sm:flex items-center gap-1 text-sm text-[var(--accent)] hover:underline whitespace-nowrap">View All Collections <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Moon Phases · 月相", slug: "ml-full", stone: "Moonstone & Diamond", price: 158.99, href: "/collections/moon-phases" },
              { name: "Celestial Stars · 星辰", slug: "cs-constellation", stone: "Diamond & White Gold", price: 128.99, href: "/collections/celestial-stars" },
              { name: "Ocean Pearls · 海珠", slug: "op-aquamarine", stone: "Akoya Pearl & Aquamarine", price: 128.99, href: "/collections/ocean-pearls" },
              { name: "Butterfly Dream · 蝶梦", slug: "bf-bracelet", stone: "Rose Gold & Amethyst", price: 128.99, href: "/collections/butterfly-dream" },
            ].map((p) => (
              <Link key={p.slug} href={p.href} className="group">
                <div className="img-container aspect-square rounded-xl overflow-hidden border border-[var(--border)] group-hover:border-[var(--accent)]/40 transition-all relative">
                  <Image src={imageUrl(`/images/products/${p.slug}.png`)} alt={p.name} fill sizes="(max-width:640px) 50vw, 25vw" loading="lazy" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="mt-2.5 px-1">
                  <h4 className="text-sm font-medium text-[var(--text)] line-clamp-1 group-hover:text-[var(--accent)] transition-colors">{p.name}</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{p.stone} · {formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WEAR THE LOOK ===== */}
      <section className="py-12 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[#D4A84B] uppercase mb-2">Wrist Stories</span>
            <h2 className="font-serif text-2xl font-bold text-[#E8E0D5]">Wear the Look · 叠戴灵感</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name:"Celestial Stack", desc:"28 Mansions + Moon Phases — the sky on your wrist", img:imageUrl("/images/products/mansion-collection-flatlay.png"), link:"/collections/28-mansions" },
              { name:"Elemental Layers", desc:"Wood + Fire + Earth — three elements, one story", img:imageUrl("/images/products/m5-wood.png"), link:"/collections/five-elements" },
              { name:"Ocean Dreams", desc:"Pearls + Aquamarine — inspired by the Silk Road seas", img:imageUrl("/images/products/op-aquamarine.png"), link:"/collections/ocean-pearls" },
            ].map(s => (
              <Link key={s.name} href={s.link} className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-[var(--border)] hover:border-[var(--accent)]/40 transition-all">
                <Image src={s.img} alt={s.name} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-serif text-lg font-semibold text-white">{s.name}</h3>
                  <p className="text-xs text-white/70">{s.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER + TRUST ===== */}
      <section className="py-12 bg-[#1A1816]">
        <div className="max-w-[540px] mx-auto px-6 text-center">
          <h2 className="font-serif text-2xl font-bold text-[#E8E0D5] mb-2">Join the Expedition · {"探索上古"}</h2>
          <p className="text-[#A89880] text-sm mb-6">Tales from the bestiary, early access to new collections, and exclusive discounts.</p>
          <NewsletterForm />
          <div className="flex justify-center gap-6 mt-6 text-xs text-[#8A7D6E]">
            <span>Handcrafted</span><span className="text-[#3A3220]">|</span>
            <span>Ethically Sourced</span><span className="text-[#3A3220]">|</span>
            <span>30-Day Returns</span>
          </div>
        </div>
      </section>
    </>
  );
}
