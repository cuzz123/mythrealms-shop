import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { PRODUCTS } from "@/lib/1688-products";
import { productBenefitTriplet, productDisplayName } from "@/lib/brand";
import { LazyImage } from "@/components/ui/LazyImage";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Find Your Guardian | MythRealms",
  description: "TikTok visitors: take the MythRealms guardian quiz and discover pearl or gemstone jewelry for calm, renewal, boundaries, and soft power.",
};

const starterSlugs = ["pearl-series-01", "pearl-series-05", "pearl-series-13", "pearl-crystal-series-01"];

export default function TikTokLandingPage() {
  const products = starterSlugs
    .map((slug) => PRODUCTS.find((product) => product.slug === slug))
    .filter(Boolean);

  return (
    <main className="bg-[var(--bg)]">
      <section className="mx-auto grid min-h-[calc(100vh-120px)] max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">
            <Sparkles className="h-4 w-4" /> From TikTok
          </span>
          <h1 className="mt-4 font-serif text-[clamp(2.6rem,7vw,5rem)] font-bold leading-tight text-[var(--text)]">
            Find your guardian. Wear your intention.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--text-secondary)]">
            Take the 60-second quiz to match this season of you with pearl and gemstone pieces chosen for calm, renewal, boundaries, or soft power.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/guardian-quiz" className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3 text-sm font-semibold text-[var(--bg)] transition hover:bg-[var(--accent-hover)]">
              Take the Quiz <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/collections/pearl-series" className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] px-7 py-3 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--accent)]/50">
              Shop Pearls
            </Link>
          </div>
          <div className="mt-8 grid gap-3 text-sm text-[var(--text-secondary)] sm:grid-cols-3">
            {["Made to order", "Free shipping over $69.99", "30-day returns"].map((signal) => (
              <span key={signal} className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--accent)]" /> {signal}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => product && (
            <Link key={product.slug} href={`/products/${product.slug}`} className="group rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 transition hover:border-[var(--accent)]/50">
              <div className="relative aspect-square overflow-hidden rounded-md">
                <LazyImage src={product.image} alt={productDisplayName(product)} fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" containerClassName="absolute inset-0" />
              </div>
              <div className="p-2">
                <h2 className="line-clamp-1 font-serif text-sm font-semibold text-[var(--text)]">{productDisplayName(product)}</h2>
                <p className="mt-1 line-clamp-1 text-[11px] text-[var(--text-muted)]">{productBenefitTriplet(product)}</p>
                <p className="mt-2 text-xs font-semibold text-[var(--accent)]">{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
