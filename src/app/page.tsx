import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";
import { HeroCarousel } from "@/components/layout/HeroCarousel";
import { BrandStory } from "@/components/layout/BrandStory";
import { SymbolGrid } from "@/components/layout/SymbolGrid";
import { GuardianMatch } from "@/components/layout/GuardianMatch";
import { FeaturedProductsSection, FeaturedProductsFallback } from "@/components/layout/FeaturedProducts";
import { HomeBlogAsync, HomeBlogFallback } from "@/components/layout/HomeBlogAsync";
import { ArrowRight, ChevronDown } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {

  return (
    <>
      {/* Inline star field and animation styles */}

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-[#0F0D0E] pt-[72px]">
        {/* Star field — dual-layer parallax: slow layer drifts with scroll, fast layer twinkles */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(1.5px 1.5px at 50% 50%, rgba(255,255,255,0.5) 0%, transparent 100%)",
            backgroundSize: "100px 100px",
            animation: "twinkle1 4s ease-in-out infinite alternate",
          }}
        />
        {/* Bronze accent star layer — larger, slower twinkle for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(1px 1px at 35% 35%, rgba(212,168,75,0.4) 0%, transparent 100%)",
            backgroundSize: "140px 140px",
            animation: "twinkle2 8s ease-in-out infinite alternate",
          }}
        />

        {/* Star dust ambient glow — reduced to single gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(212,168,75,0.04) 0%, transparent 60%)",
          }}
        />

        {/* Hero content */}
        <div
          className="relative z-10 text-center max-w-[800px] px-6 py-10"
          style={{ animation: "fadeInUp 1s ease-out" }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1 mb-8 rounded-full border border-[rgba(212,168,75,0.3)] bg-[rgba(212,168,75,0.1)] text-sm text-[#D4A84B] font-medium tracking-[0.06em]">
            <span
              className="block w-[6px] h-[6px] rounded-full bg-[#D4A84B]"
              style={{ animation: "pulseDot 2s ease-in-out infinite" }}
            />
            10 Mythical Beasts. 277 Ancient Legends. One Guardian.
          </div>

          {/* Title */}
          <h1 className="font-serif text-[clamp(2.8rem,6vw,4.5rem)] font-bold text-[#E8E0D5] leading-[1.15] mb-6 tracking-[0.01em]">
            Which Beast<br />
            Guards Your Soul{" "}
            <span className="text-[#D4A84B]">{"·"}</span>{" "}
            <span className="text-[#D4A84B]">{"山海经"}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[clamp(1.05rem,2vw,1.2rem)] text-[#A89880] leading-relaxed max-w-[620px] mx-auto mb-10 font-normal">
            2000 years before Tolkien, China mapped the human soul onto 277 mythical creatures.<br />
            Each one guards a different part of who you are.<br />
            <em>Which one was born to protect you?</em>
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="#symbol-grid">
              <Button
                variant="accent"
                size="lg"
                className="shadow-[0_0_24px_rgba(212,168,75,0.18)] hover:shadow-[0_0_40px_rgba(212,168,75,0.28)] transition-[transform,box-shadow] hover:-translate-y-px"
              >
                Find Your Guardian <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/collections">
              <Button
                variant="outline"
                size="lg"
                className="border-[#D4A84B] text-[#D4A84B] hover:bg-[rgba(212,168,75,0.1)] hover:border-[#E0C06E] hover:text-[#E0C06E] hover:shadow-[0_0_24px_rgba(212,168,75,0.18)] transition-[transform,box-shadow] hover:-translate-y-px"
              >
                Shop the Collection
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-1/2 flex flex-col items-center gap-2 text-[#6B5F50] text-xs tracking-[0.08em] cursor-pointer z-10"
          style={{ animation: "bounceDown 2s ease-in-out infinite" }}
        >
          <span>SCROLL</span>
          <ChevronDown className="w-5 h-5 opacity-50" />
        </div>
      </section>

      {/* ===== HERO CAROUSEL ===== */}
      <HeroCarousel />

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="py-12 bg-[#0F0D0E]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section header */}
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[#D4A84B] uppercase mb-3">
              Begin Your Expedition
            </span>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold text-[#E8E0D5] mb-3">
              Realms of the Ancients
            </h2>
            <p className="text-[1.0625rem] text-[#A89880] max-w-[580px] mx-auto leading-relaxed">
              Four paths into the mythic — each rooted in the lore of mountains, seas, stars, and the sacred beasts that guard the cosmos.
            </p>
          </div>

          {/* Category cards — 4 cards with real images */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Mythical Beasts */}
            <Link
              href="/collections/beast-pendants"
              className="group relative rounded-xl overflow-hidden border border-[#2A2520] aspect-[4/5] flex flex-col justify-end cursor-pointer transition-[transform,border-color,box-shadow] duration-[400ms] hover:-translate-y-1 hover:border-[rgba(212,168,75,0.3)] hover:shadow-[0_0_24px_rgba(212,168,75,0.18)]"
            >
              <img src="/images/categories/beast-pendants.png" alt="Mythical Beasts" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[400ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,13,14,0.95)] via-[rgba(15,13,14,0.4)] to-[rgba(15,13,14,0.15)]" />
              <div className="relative z-10 p-5">
                <h3 className="font-serif text-xl font-semibold text-[#E8E0D5] mb-0.5">Mythical Beasts</h3>
                <p className="text-xs text-[#A89880]">12 designs · pendants, rings & cuffs</p>
              </div>
            </Link>

            {/* 28 Mansions */}
            <Link
              href="/collections/28-mansions"
              className="group relative rounded-xl overflow-hidden border border-[#2A2520] aspect-[4/5] flex flex-col justify-end cursor-pointer transition-[transform,border-color,box-shadow] duration-[400ms] hover:-translate-y-1 hover:border-[rgba(212,168,75,0.3)] hover:shadow-[0_0_24px_rgba(212,168,75,0.18)]"
            >
              <img src="/images/categories/28-mansions-bracelets.png" alt="28 Mansions" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[400ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,13,14,0.95)] via-[rgba(15,13,14,0.4)] to-[rgba(15,13,14,0.15)]" />
              <div className="relative z-10 p-5">
                <h3 className="font-serif text-xl font-semibold text-[#E8E0D5] mb-0.5">28 Mansions</h3>
                <p className="text-xs text-[#A89880]">28 star bracelets · find your celestial guardian</p>
              </div>
            </Link>

            {/* Zodiac */}
            <Link
              href="/collections/zodiac-amulets"
              className="group relative rounded-xl overflow-hidden border border-[#2A2520] aspect-[4/5] flex flex-col justify-end cursor-pointer transition-[transform,border-color,box-shadow] duration-[400ms] hover:-translate-y-1 hover:border-[rgba(212,168,75,0.3)] hover:shadow-[0_0_24px_rgba(212,168,75,0.18)]"
            >
              <img src="/images/categories/zodiac-amulets.png" alt="Zodiac" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[400ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,13,14,0.95)] via-[rgba(15,13,14,0.4)] to-[rgba(15,13,14,0.15)]" />
              <div className="relative z-10 p-5">
                <h3 className="font-serif text-xl font-semibold text-[#E8E0D5] mb-0.5">Zodiac Amulets</h3>
                <p className="text-xs text-[#A89880]">12 gold medallions · find your birth year guardian</p>
              </div>
            </Link>

            {/* Four Seasons */}
            <Link
              href="/collections/four-seasons"
              className="group relative rounded-xl overflow-hidden border border-[#2A2520] aspect-[4/5] flex flex-col justify-end cursor-pointer transition-[transform,border-color,box-shadow] duration-[400ms] hover:-translate-y-1 hover:border-[rgba(212,168,75,0.3)] hover:shadow-[0_0_24px_rgba(212,168,75,0.18)]"
            >
              <img src="/images/categories/four-seasons-collection.png" alt="Four Seasons" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[400ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,13,14,0.95)] via-[rgba(15,13,14,0.4)] to-[rgba(15,13,14,0.15)]" />
              <div className="relative z-10 p-5">
                <h3 className="font-serif text-xl font-semibold text-[#E8E0D5] mb-0.5">Four Seasons</h3>
                <p className="text-xs text-[#A89880]">12 seasonal pieces · spring to winter</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SYMBOL GRID ===== */}
      <SymbolGrid />

      {/* ===== FEATURED PRODUCTS (PRODUCT GRID) ===== */}
      <section className="py-16 bg-[#1A1816]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[#D4A84B] uppercase mb-3">
                The Bestiary Collection
              </span>
              <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold text-[#E8E0D5]">
                Featured Mythical Beasts
              </h2>
            </div>
            <Link href="/collections/beast-pendants" className="hidden sm:flex items-center gap-1 text-sm text-[var(--accent)] hover:underline whitespace-nowrap">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Bronze pattern divider */}
          <div
            className="h-[8px] rounded-full opacity-30 mb-16"
            style={{
              background:
                "repeating-linear-gradient(90deg, #D4A84B 0px, #D4A84B 2px, transparent 2px, transparent 6px, #D4A84B 6px, #D4A84B 8px, transparent 8px, transparent 12px)",
            }}
          />

          {/* Product Grid from existing component */}
          <Suspense fallback={<FeaturedProductsFallback />}>
            <FeaturedProductsSection />
          </Suspense>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link href="/collections/beast-pendants">
              <Button
                variant="accent"
                size="lg"
                className="shadow-[0_0_24px_rgba(212,168,75,0.18)] hover:shadow-[0_0_40px_rgba(212,168,75,0.28)] transition-[transform,box-shadow] hover:-translate-y-px"
              >
                Find Your Guardian <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== GUARDIAN MATCHING ===== */}
      <GuardianMatch />

      {/* ===== BRAND STORY ===== */}
      <BrandStory />

      {/* ===== 28 MANSIONS PRODUCTS ===== */}
      <section className="py-16 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[#D4A84B] uppercase mb-3">
                Celestial Cartography
              </span>
              <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold text-[#E8E0D5]">
                The Twenty-Eight Mansions
              </h2>
            </div>
            <Link href="/collections/28-mansions" className="hidden sm:flex items-center gap-1 text-sm text-[var(--accent)] hover:underline whitespace-nowrap">
              View All 28 <ArrowRight className="w-4 h-4" />
            </Link>
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
            <Link href="/collections/28-mansions" className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--accent)] text-[var(--accent)] rounded-full text-sm font-semibold hover:bg-[var(--accent)]/10 transition">
              View All 28 Mansions <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="max-w-[540px] mx-auto px-6 mt-16 text-center">
          <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[#D4A84B] uppercase mb-4">
            Stay Connected
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#E8E0D5] mb-3">
            Join the Expedition · {"探索上古"}
          </h2>
          <p className="text-[#A89880] mb-8 leading-relaxed">
            Receive tales from the bestiary, early access to new collections,
            and exclusive expedition-only discounts. No spam — only legends
            worthy of your inbox.
          </p>
          <NewsletterForm />
        </div>
      </section>

      {/* ===== HOME BLOG SECTION ===== */}
      <Suspense fallback={<HomeBlogFallback />}>
        <HomeBlogAsync />
      </Suspense>
    </>
  );
}
