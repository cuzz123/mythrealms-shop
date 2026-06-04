import Link from "next/link";
import { db } from "@/lib/db";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/Button";
import { HeroCarousel } from "@/components/layout/HeroCarousel";
import { BrandStory } from "@/components/layout/BrandStory";
import { SymbolGrid } from "@/components/layout/SymbolGrid";
import { HomeBlogSection } from "@/components/layout/HomeBlogSection";
import { ArrowRight, ChevronDown, Gem, Star, Shield, Compass } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredProducts = await db.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: { variants: true, reviews: { select: { rating: true } } },
    take: 8,
    orderBy: { sortOrder: "asc" },
  });

  const categories = await db.category.findMany({
    take: 5,
    orderBy: { sortOrder: "asc" },
  });

  const products = featuredProducts.map((p) => ({
    ...p,
    images: JSON.parse(p.images as string),
    avgRating: p.reviews.length
      ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
      : 0,
    reviewCount: p.reviews.length,
  }));

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
            Ancient Myths Reimagined in Bronze and Jade
          </div>

          {/* Title */}
          <h1 className="font-serif text-[clamp(2.8rem,6vw,4.5rem)] font-bold text-[#E8E0D5] leading-[1.15] mb-6 tracking-[0.01em]">
            Where Ancient Myths<br />
            Come Alive{" "}
            <span className="text-[#D4A84B]">{"·"}</span>{" "}
            <span className="text-[#D4A84B]">{"上古神兽"}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[clamp(1.05rem,2vw,1.2rem)] text-[#A89880] leading-relaxed max-w-[620px] mx-auto mb-10 font-normal">
            Discover jewelry inspired by China&apos;s oldest book of legends.<br />
            2000 years before Tolkien, there was the{" "}
            <em>Classic of Mountains and Seas</em>.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/collections/beast-pendants">
              <Button
                variant="accent"
                size="lg"
                className="shadow-[0_0_24px_rgba(212,168,75,0.18)] hover:shadow-[0_0_40px_rgba(212,168,75,0.28)] transition-[transform,box-shadow] hover:-translate-y-px"
              >
                Explore the Bestiary <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/collections">
              <Button
                variant="outline"
                size="lg"
                className="border-[#D4A84B] text-[#D4A84B] hover:bg-[rgba(212,168,75,0.1)] hover:border-[#E0C06E] hover:text-[#E0C06E] hover:shadow-[0_0_24px_rgba(212,168,75,0.18)] transition-[transform,box-shadow] hover:-translate-y-px"
              >
                View Collections
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
      <section className="py-20 bg-[#0F0D0E]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[#D4A84B] uppercase mb-4">
              Begin Your Expedition
            </span>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold text-[#E8E0D5] mb-4">
              Realms of the Ancients
            </h2>
            <p className="text-[1.0625rem] text-[#A89880] max-w-[580px] mx-auto leading-relaxed">
              Four paths into the mythic — each rooted in the lore of mountains,
              seas, stars, and the sacred beasts that guard the cosmos.
            </p>
          </div>

          {/* Category cards — 4 fixed concept cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Beast Pendants */}
            <Link
              href="/collections/beast-pendants"
              className="group relative rounded-xl overflow-hidden border border-[#2A2520] bg-[#1A1816] aspect-[3/4] flex flex-col justify-end cursor-pointer transition-[transform,border-color,box-shadow] duration-[400ms] hover:-translate-y-1 hover:border-[rgba(212,168,75,0.3)] hover:shadow-[0_0_24px_rgba(212,168,75,0.18)]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[400ms] group-hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,13,14,0.95)] via-[rgba(15,13,14,0.4)] to-[rgba(15,13,14,0.15)]" />
              <div className="relative z-10 p-8">
                <Gem className="mb-4 w-12 h-12 text-[#D4A84B] opacity-80" strokeWidth={1.5} />
                <h3 className="font-serif text-2xl font-semibold text-[#E8E0D5] mb-1">
                  {"神兽吊坠"}
                </h3>
                <p className="text-xs text-[#6B5F50] font-normal mb-1">
                  Beast Pendants
                </p>
                <p className="text-sm text-[#A89880] leading-relaxed">
                  Mythical creatures rendered in bronze, silver, and jade.
                </p>
              </div>
            </Link>

            {/* Star Bracelets */}
            <Link
              href="/collections/star-bracelets"
              className="group relative rounded-xl overflow-hidden border border-[#2A2520] bg-[#1A1816] aspect-[3/4] flex flex-col justify-end cursor-pointer transition-[transform,border-color,box-shadow] duration-[400ms] hover:-translate-y-1 hover:border-[rgba(212,168,75,0.3)] hover:shadow-[0_0_24px_rgba(212,168,75,0.18)]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[400ms] group-hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #1a1a1a 0%, #2d1b2e 50%, #4a1942 100%)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,13,14,0.95)] via-[rgba(15,13,14,0.4)] to-[rgba(15,13,14,0.15)]" />
              <div className="relative z-10 p-8">
                <Star className="mb-4 w-12 h-12 text-[#D4A84B] opacity-80" strokeWidth={1.5} />
                <h3 className="font-serif text-2xl font-semibold text-[#E8E0D5] mb-1">
                  {"星宿手串"}
                </h3>
                <p className="text-xs text-[#6B5F50] font-normal mb-1">
                  Star Bracelets
                </p>
                <p className="text-sm text-[#A89880] leading-relaxed">
                  Beaded bracelets mapped to the 28 Chinese mansions.
                </p>
              </div>
            </Link>

            {/* Ancient Talismans */}
            <Link
              href="/collections/ancient-talismans"
              className="group relative rounded-xl overflow-hidden border border-[#2A2520] bg-[#1A1816] aspect-[3/4] flex flex-col justify-end cursor-pointer transition-[transform,border-color,box-shadow] duration-[400ms] hover:-translate-y-1 hover:border-[rgba(212,168,75,0.3)] hover:shadow-[0_0_24px_rgba(212,168,75,0.18)]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[400ms] group-hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #1a120b 0%, #2d1f0f 50%, #5c3d2e 100%)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,13,14,0.95)] via-[rgba(15,13,14,0.4)] to-[rgba(15,13,14,0.15)]" />
              <div className="relative z-10 p-8">
                <Shield className="mb-4 w-12 h-12 text-[#D4A84B] opacity-80" strokeWidth={1.5} />
                <h3 className="font-serif text-2xl font-semibold text-[#E8E0D5] mb-1">
                  {"上古护符"}
                </h3>
                <p className="text-xs text-[#6B5F50] font-normal mb-1">
                  Ancient Talismans
                </p>
                <p className="text-sm text-[#A89880] leading-relaxed">
                  Protection charms inscribed with seals from the Shan Hai Jing.
                </p>
              </div>
            </Link>

            {/* Four Symbols */}
            <Link
              href="/collections/four-symbols"
              className="group relative rounded-xl overflow-hidden border border-[#2A2520] bg-[#1A1816] aspect-[3/4] flex flex-col justify-end cursor-pointer transition-[transform,border-color,box-shadow] duration-[400ms] hover:-translate-y-1 hover:border-[rgba(212,168,75,0.3)] hover:shadow-[0_0_24px_rgba(212,168,75,0.18)]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[400ms] group-hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #0b1a1a 0%, #0f2d2d 50%, #1a4a4a 100%)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,13,14,0.95)] via-[rgba(15,13,14,0.4)] to-[rgba(15,13,14,0.15)]" />
              <div className="relative z-10 p-8">
                <Compass className="mb-4 w-12 h-12 text-[#D4A84B] opacity-80" strokeWidth={1.5} />
                <h3 className="font-serif text-2xl font-semibold text-[#E8E0D5] mb-1">
                  {"四象系列"}
                </h3>
                <p className="text-xs text-[#6B5F50] font-normal mb-1">
                  Four Symbols
                </p>
                <p className="text-sm text-[#A89880] leading-relaxed">
                  The Azure Dragon, White Tiger, Vermillion Bird, and Black
                  Tortoise.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SYMBOL GRID ===== */}
      <SymbolGrid />

      {/* ===== FEATURED PRODUCTS (PRODUCT GRID) ===== */}
      <section className="py-24 bg-[#1A1816]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[#D4A84B] uppercase mb-4">
              The Bestiary Collection
            </span>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold text-[#E8E0D5] mb-4">
              Featured Mythical Beasts
            </h2>
            <p className="text-[1.0625rem] text-[#A89880] max-w-[580px] mx-auto leading-relaxed">
              Each piece tells a story from the Classic of Mountains and Seas —
              handcrafted with reverence for the ancient lore.
            </p>
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
          <ProductGrid products={products} />

          {/* CTA */}
          <div className="text-center mt-12">
            <Link href="/collections/beast-pendants">
              <Button
                variant="accent"
                size="lg"
                className="shadow-[0_0_24px_rgba(212,168,75,0.18)] hover:shadow-[0_0_40px_rgba(212,168,75,0.28)] transition-[transform,box-shadow] hover:-translate-y-px"
              >
                Explore the Bestiary <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== BRAND STORY ===== */}
      <BrandStory />

      {/* ===== CONSTELLATION MAP SECTION ===== */}
      <section className="py-24 bg-[#1A1816] relative overflow-hidden [content-visibility:auto] [contain-intrinsic-size:auto_1200px]">
        {/* Star field — single gradient layer instead of 15, way less CPU */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "radial-gradient(1px 1px at 50% 50%, rgba(255,255,255,0.5) 0%, transparent 100%)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section header */}
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[#D4A84B] uppercase mb-4">
              Celestial Cartography
            </span>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold text-[#E8E0D5] mb-4">
              The Twenty-Eight Mansions
            </h2>
            <p className="text-[1.0625rem] text-[#A89880] max-w-[580px] mx-auto leading-relaxed">
              {"二十八宿"} — An ancient star map dividing the sky into four quadrants, each guarded by a sacred beast.
            </p>
          </div>

          {/* Four Celestial Guardians — Image Strips */}
          <div className="flex flex-col gap-8">
            {[
              { name: "Azure Dragon · 青龙", subtitle: "Eastern Spring — Guardian of the Blue-Green Heavens", img: "/images/constellations/azure-dragon.png", color: "rgba(74,158,207,0.15)", accent: "#6db3d4" },
              { name: "Vermillion Bird · 朱雀", subtitle: "Southern Summer — Guardian of the Vermillion Skies", img: "/images/constellations/vermillion-bird.png", color: "rgba(224,122,61,0.15)", accent: "#e07a3d" },
              { name: "White Tiger · 白虎", subtitle: "Western Autumn — Guardian of the White Heavens", img: "/images/constellations/white-tiger.png", color: "rgba(192,192,192,0.12)", accent: "#c0c0c0" },
              { name: "Black Tortoise · 玄武", subtitle: "Northern Winter — Guardian of the Dark Heavens", img: "/images/constellations/black-tortoise.png", color: "rgba(139,92,246,0.15)", accent: "#8b5cf6" },
            ].map((guardian) => (
              <div key={guardian.name} className="group">
                {/* Group Header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#2A2520]">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: guardian.accent }} />
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-[#E8E0D5]">{guardian.name}</h3>
                    <p className="text-xs text-[#A89880]">{guardian.subtitle}</p>
                  </div>
                </div>
                {/* Image Strip — 7:1 aspect, scrollable on mobile */}
                <div className="relative rounded-xl overflow-hidden border border-[#2A2520] group-hover:border-[rgba(212,168,75,0.3)] transition-[border-color] duration-500">
                  <div className="absolute inset-0 pointer-events-none z-10" style={{ background: `linear-gradient(to bottom, ${guardian.color}, transparent 30%, transparent 70%, ${guardian.color})` }} />
                  <img
                    src={guardian.img}
                    alt={guardian.name}
                    loading="lazy"
                    className="w-full h-auto block"
                  />
                  {/* Hover glow — opacity-only transition on pseudo layer, GPU only */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
                    style={{ background: `radial-gradient(ellipse at 50% 50%, ${guardian.accent}22 0%, transparent 70%)` }} />
                </div>
                {/* Mansion labels row */}
                <div className="flex justify-between px-1 mt-2 text-[10px] text-[#6B6055] font-medium tracking-wider uppercase">
                  {guardian.name.includes("Azure Dragon") && ["Jiao","Kang","Di","Fang","Xin","Wei","Ji"].map(m => <span key={m}>{m}</span>)}
                  {guardian.name.includes("Vermillion") && ["Jing","Gui","Liu","Xing","Zhang","Yi","Zhen"].map(m => <span key={m}>{m}</span>)}
                  {guardian.name.includes("White Tiger") && ["Kui","Lou","Wei","Mao","Bi","Zi","Shen"].map(m => <span key={m}>{m}</span>)}
                  {guardian.name.includes("Black Tortoise") && ["Dou","Niu","Nv","Xu","Wei","Shi","Bi"].map(m => <span key={m}>{m}</span>)}
                </div>
              </div>
            ))}
          </div>

          {/* Bronze pattern divider */}
          <div className="h-[8px] rounded-full opacity-30 mt-16" style={{ background: "repeating-linear-gradient(90deg, #D4A84B 0px, #D4A84B 2px, transparent 2px, transparent 6px, #D4A84B 6px, #D4A84B 8px, transparent 8px, transparent 12px)" }} />
        </div>

        <div className="max-w-[540px] mx-auto px-6 relative z-10 text-center">
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
      <HomeBlogSection />
    </>
  );
}
