import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/lib/1688-products";

export const metadata: Metadata = {
  title: "All Collections — MythRealms",
  description: "Explore our intention-based crystal and pearl jewelry — Serenity, Intention Stones, Balance & Light, and The Archetypes. Hand-selected. Artisan-finished.",
};

const categoryIntents: Record<string, { subtitle: string; cta: string }> = {
  "pearl-series": { subtitle: "Pearls for calm. For wisdom. For the quiet centre of the storm.", cta: "Explore Serenity" },
  "luxe-collection": { subtitle: "One stone. One purpose. Twelve ways to wear your intention.", cta: "Explore Intention Stones" },
  "pearl-crystal-series": { subtitle: "Where stillness meets energy. For those holding both at once.", cta: "Explore Balance & Light" },
  "curated-singles": { subtitle: "Six archetypes. Six intentions. Which one is calling you?", cta: "Explore The Archetypes" },
};

export default function CollectionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-10">
        <Link href="/" className="hover:text-[var(--text)]">Home</Link><span>/</span>
        <span className="text-[var(--text)]">Collections</span>
      </nav>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden mb-16">
        <Image
          src="/images/pages/collections-hero.webp"
          alt="MythRealms crystal and pearl bracelet collection — hand-selected gemstone jewelry"
          fill
          sizes="(max-width:768px) 100vw, 1280px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />
        <div className="relative z-10 text-center py-24 px-6">
          <span className="inline-block text-xs font-semibold tracking-[0.1em] text-[var(--accent)] uppercase mb-4">Four Collections. One Philosophy.</span>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-3">Find Your Intention</h1>
          <p className="text-white/70 max-w-xl mx-auto text-lg leading-relaxed">
            Every stone carries a purpose. Browse our collections and find the one
            that names what you are becoming.
          </p>
        </div>
      </div>

      {/* Collection Cards */}
      <div className="space-y-12">
        {CATEGORIES.map((cat, i) => {
          const intent = categoryIntents[cat.slug] || { subtitle: cat.description, cta: "Explore" };
          const isReversed = i % 2 === 1;

          return (
            <Link
              key={cat.slug}
              href={`/collections/${cat.slug}`}
              className={`group relative rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--accent)]/40 transition-all duration-500 flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"}`}
            >
              {/* Image */}
              <div className="relative lg:w-1/2 aspect-[4/3] lg:aspect-auto overflow-hidden">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={`${cat.name} — MythRealms`}
                    fill
                    sizes="(max-width:1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[var(--surface)]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="lg:w-1/2 flex flex-col justify-center p-8 lg:p-14 bg-[var(--surface)]">
                <span className="text-[10px] font-semibold tracking-[0.12em] text-[var(--accent)] uppercase mb-3">
                  0{i + 1}
                </span>
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-[var(--text)] mb-3 group-hover:text-[var(--accent)] transition-colors">
                  {cat.name}
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                  {intent.subtitle}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] group-hover:gap-3 transition-all">
                  {intent.cta} <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-20 pt-12 border-t border-[var(--border)]">
        <p className="text-[var(--text-muted)] mb-4 text-sm">Not sure where to start?</p>
        <Link
          href="/guardian-quiz"
          className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--accent)] text-white rounded-full font-semibold text-sm hover:bg-[var(--accent-hover)] transition"
        >
          Take the Crystal Intention Quiz
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
