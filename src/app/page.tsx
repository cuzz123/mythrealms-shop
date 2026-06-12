import Link from "next/link";
import { Suspense } from "react";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { ProductGrid } from "@/components/product/ProductGrid";
import { HeroCarousel } from "@/components/layout/HeroCarousel";
import { GuardianMatch } from "@/components/layout/GuardianMatch";
import { FeaturedProductsSection, FeaturedProductsFallback } from "@/components/layout/FeaturedProducts";
import { HomeBlogAsync, HomeBlogFallback } from "@/components/layout/HomeBlogAsync";
import { ArrowRight, ChevronDown } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-[#0F0D0E] pt-[72px]">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(1.5px 1.5px at 50% 50%, rgba(255,255,255,0.5) 0%, transparent 100%)", backgroundSize: "100px 100px", animation: "twinkle1 4s ease-in-out infinite alternate" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(1px 1px at 35% 35%, rgba(212,168,75,0.4) 0%, transparent 100%)", backgroundSize: "140px 140px", animation: "twinkle2 8s ease-in-out infinite alternate" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(212,168,75,0.04) 0%, transparent 60%)" }} />
        <div className="relative z-10 text-center max-w-[800px] px-6 py-10" style={{ animation: "fadeInUp 1s ease-out" }}>
          <div className="inline-flex items-center gap-2 px-4 py-1 mb-8 rounded-full border border-[rgba(212,168,75,0.3)] bg-[rgba(212,168,75,0.1)] text-sm text-[#D4A84B] font-medium tracking-[0.06em]">
            <span className="block w-[6px] h-[6px] rounded-full bg-[#D4A84B]" style={{ animation: "pulseDot 2s ease-in-out infinite" }} />
            10 Mythical Beasts. 277 Ancient Legends. One Guardian.
          </div>
          <h1 className="font-serif text-[clamp(2.8rem,6vw,4.5rem)] font-bold text-[#E8E0D5] leading-[1.15] mb-6 tracking-[0.01em]">
            Which Beast<br />Guards Your Soul{" "}
            <span className="text-[#D4A84B]">{"·"}</span>{" "}
            <span className="text-[#D4A84B]">{"山海经"}</span>
          </h1>
          <p className="text-[clamp(1.05rem,2vw,1.2rem)] text-[#A89880] leading-relaxed max-w-[620px] mx-auto mb-10">
            2000 years before Tolkien, China mapped the human soul onto 277 mythical creatures.<br />
            Each one guards a different part of who you are.<br /><em>Which one was born to protect you?</em>
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/collections/beast-pendants" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D4A84B] text-white rounded-full font-semibold text-sm shadow-[0_0_24px_rgba(212,168,75,0.18)] hover:bg-[#C49A3C] hover:shadow-[0_0_40px_rgba(212,168,75,0.28)] transition-all hover:-translate-y-px">
              Shop the Bestiary <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/guardian-quiz" className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#D4A84B] text-[#D4A84B] rounded-full font-semibold text-sm hover:bg-[rgba(212,168,75,0.1)] transition-all hover:-translate-y-px">
              Take the Quiz
            </Link>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 flex flex-col items-center gap-2 text-[#6B5F50] text-xs tracking-[0.08em] cursor-pointer z-10" style={{ animation: "bounceDown 2s ease-in-out infinite" }}>
          <span>SCROLL</span><ChevronDown className="w-5 h-5 opacity-50" />
        </div>
      </section>

      {/* ===== HERO CAROUSEL ===== */}
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

      {/* ===== CATEGORIES — horizontal scroll on mobile ===== */}
      <section className="py-10 bg-[#0F0D0E]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
            <div className="flex gap-3 lg:grid lg:grid-cols-4 min-w-max lg:min-w-0">
              {[
                { name: "Find Your Guardian", count: "12 Beasts", img: "/images/categories/beast-pendants.png", href: "/collections/beast-pendants", tag: "Which beast guards your soul?" },
                { name: "Find Your Star", count: "28 Mansions", img: "/images/categories/28-mansions-bracelets.png", href: "/collections/28-mansions", tag: "Discover your celestial mansion" },
                { name: "Find Your Destiny", count: "12 Zodiac", img: "/images/categories/zodiac-amulets.png", href: "/collections/zodiac-amulets", tag: "The amulet of your birth year" },
                { name: "Find Your Season", count: "12 Seasons", img: "/images/categories/four-seasons-collection.png", href: "/collections/four-seasons", tag: "Jewelry for every season of life" },
              ].map((c) => (
                <Link key={c.name} href={c.href} className="group relative w-[180px] lg:w-auto aspect-[4/5] rounded-xl overflow-hidden border border-[#2A2520] flex-shrink-0 hover:border-[rgba(212,168,75,0.3)] transition-all">
                  <img src={c.img} alt={c.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,13,14,0.95)] via-[rgba(15,13,14,0.3)] to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-serif text-base font-semibold text-[#E8E0D5]">{c.name}</h3>
                    <p className="text-xs text-[var(--accent)]">{c.tag}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-14 bg-[#1A1816]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-[#E8E0D5]">Featured Mythical Beasts</h2>
            <Link href="/collections/beast-pendants" className="hidden sm:flex items-center gap-1 text-sm text-[var(--accent)] hover:underline whitespace-nowrap">View All <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <Suspense fallback={<FeaturedProductsFallback />}>
            <FeaturedProductsSection />
          </Suspense>
          <div className="text-center mt-6 sm:hidden">
            <Link href="/collections/beast-pendants" className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--accent)] text-[var(--accent)] rounded-full text-sm font-semibold">View All <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* ===== 28 MANSIONS ===== */}
      <section className="py-14 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-[#E8E0D5]">28 Mansions · 二十八宿</h2>
            <Link href="/collections/28-mansions" className="hidden sm:flex items-center gap-1 text-sm text-[var(--accent)] hover:underline whitespace-nowrap">View All 28 <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Jiao · 角 — Horn", slug: "jiao-mansion-bracelet", stone: "Lapis Lazuli", quadrant: "Azure Dragon" },
              { name: "Kang · 亢 — Neck", slug: "kang-mansion-bracelet", stone: "Tiger Eye", quadrant: "Azure Dragon" },
              { name: "Jing · 井 — Well", slug: "jing-mansion-bracelet", stone: "Aquamarine", quadrant: "Vermillion Bird" },
              { name: "Xing · 星 — Star", slug: "xing-mansion-bracelet", stone: "Clear Quartz", quadrant: "Vermillion Bird" },
              { name: "Kui · 奎 — Legs", slug: "kui-mansion-bracelet", stone: "White Moonstone", quadrant: "White Tiger" },
              { name: "Shen · 参 — Three Stars", slug: "shen-mansion-bracelet", stone: "Labradorite", quadrant: "White Tiger" },
              { name: "Dou · 斗 — Dipper", slug: "dou-mansion-bracelet", stone: "Dark Sodalite", quadrant: "Black Tortoise" },
              { name: "Nv · 女 — Girl", slug: "nv-mansion-bracelet", stone: "Rose Quartz", quadrant: "Black Tortoise" },
            ].map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`} className="group">
                <div className="aspect-square rounded-xl overflow-hidden bg-[var(--bg)] border border-[var(--border)] group-hover:border-[var(--accent)]/40 transition-all">
                  <img src={`/images/products/${p.slug}.png`} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="mt-2.5 px-1">
                  <h4 className="text-sm font-medium text-[var(--text)] line-clamp-1 group-hover:text-[var(--accent)] transition-colors">{p.name}</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{p.stone} · {p.quadrant}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6 sm:hidden">
            <Link href="/collections/28-mansions" className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--accent)] text-[var(--accent)] rounded-full text-sm font-semibold">View All 28 <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* ===== GUARDIAN MATCHING ===== */}
      <GuardianMatch />

      {/* ===== NEWSLETTER ===== */}
      <section className="py-14 bg-[#1A1816]">
        <div className="max-w-[540px] mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl font-bold text-[#E8E0D5] mb-3">Join the Expedition · {"探索上古"}</h2>
          <p className="text-[#A89880] mb-8 leading-relaxed">Receive tales from the bestiary, early access to new collections, and exclusive discounts. No spam — only legends worthy of your inbox.</p>
          <NewsletterForm />
        </div>
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <section className="py-12 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-2xl font-bold text-[#E8E0D5] mb-2">Join 1,000+ Guardians</h2>
          <p className="text-[var(--text-muted)] text-sm mb-6">Each piece handcrafted for those who carry ancient wisdom</p>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {[
              { icon: "✧", text: "Handcrafted in small batches" },
              { icon: "✦", text: "Ethically sourced gemstones" },
              { icon: "♛", text: "30-day love it or return it" },
            ].map((s) => (
              <div key={s.text} className="bg-[var(--bg)] border border-[var(--border)] rounded-lg p-4 text-center">
                <span className="text-[var(--accent)] text-xl">{s.icon}</span>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BLOG ===== */}
      <Suspense fallback={<HomeBlogFallback />}>
        <HomeBlogAsync />
      </Suspense>
    </>
  );
}
