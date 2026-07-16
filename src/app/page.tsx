import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, Gem, Moon, ShieldCheck, Sparkles } from "lucide-react";
import { HeroCarousel } from "@/components/layout/HeroCarousel";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { RecentlyViewed } from "@/components/ui/RecentlyViewed";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { LazyImage } from "@/components/ui/LazyImage";
import { formatPrice } from "@/lib/utils";
import { brandPositioning, categoryMessaging, intentionRealms, productBenefitTriplet, productDisplayName } from "@/lib/brand";
import { siteUrl } from "@/lib/site";
import { getStorefrontProducts } from "@/lib/storefront/catalog";

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: { canonical: siteUrl },
  openGraph: { url: siteUrl },
};

const featuredSlugs = [
  "pearl-series-12",
  "pearl-series-13",
  "pearl-series-14",
  "pearl-series-19",
  "pearl-series-20",
];

export default function HomePage() {
  const products = getStorefrontProducts();
  const featured = featuredSlugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product) => product?.isActive && product.inStock)
    .filter(Boolean)
    .slice(0, 6);

  return (
    <>
      <HeroCarousel />

      <ScrollReveal as="section" className="py-14 bg-[var(--surface-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[var(--accent)] uppercase mb-2">
              Shop by Style
            </span>
            <h2 className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-[var(--text)]">
              Choose Your Starting Point
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {intentionRealms.map((realm) => (
              <Link
                key={realm.slug}
                href={realm.href}
                className="group flex min-h-[210px] flex-col justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]/50"
              >
                <div>
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)]">
                    {realm.slug === "protection-boundaries" ? <ShieldCheck className="h-5 w-5" /> : realm.slug === "renewal" ? <Moon className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-[var(--text)]">{realm.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{realm.description}</p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)]">
                  Explore <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="py-14 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[var(--accent)] uppercase mb-2">
                The Pearl Edit
              </span>
              <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold text-[var(--text)]">
                Pearls with an easy, lived-in point of view.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                {categoryMessaging["pearl-series"].description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/collections/pearl-series" className="inline-flex items-center gap-2 bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]">
                  {brandPositioning.secondaryCta} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/guardian-quiz" className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--accent)]/50">
                  {brandPositioning.primaryCta}
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {featured.filter((product) => product?.category === "pearl-series").slice(0, 4).map((product) => product && (
                <Link key={product.slug} href={`/products/${product.slug}`} className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-[var(--border)]">
                  <LazyImage src={product.images[1] || product.image} alt={`${productDisplayName(product)} worn by a model`} fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" containerClassName="absolute inset-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="font-serif text-sm font-semibold text-white">{productDisplayName(product)}</p>
                    <p className="mt-0.5 text-[11px] text-white/70">{productBenefitTriplet(product)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="py-14 bg-[var(--surface-alt)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[var(--accent)] uppercase mb-2">
                The Shortlist
              </span>
              <h2 className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-[var(--text)]">
                Five Pieces to Begin With
              </h2>
            </div>
            <Link href="/collections/pearl-series" className="hidden sm:flex items-center gap-1 text-sm text-[var(--accent)] hover:underline whitespace-nowrap">
              View Pearls <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((product) => product && (
              <Link key={product.slug} href={`/products/${product.slug}`} className="group flex gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 transition hover:border-[var(--accent)]/40">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[var(--surface-alt)]">
                  <LazyImage src={product.images[1] || product.image} alt={`${productDisplayName(product)} worn by a model`} fill sizes="96px" className="object-cover transition duration-500 group-hover:scale-105" containerClassName="absolute inset-0" />
                </div>
                <div className="flex min-w-0 flex-col justify-center">
                  <h3 className="line-clamp-1 text-sm font-medium text-[var(--text)]">{productDisplayName(product)}</h3>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">{productBenefitTriplet(product)}</p>
                  <p className="mt-2 text-sm font-semibold text-[var(--accent)]">{formatPrice(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="bg-[var(--bg)] py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">
              <Gem className="h-4 w-4" /> Find Your Guardian
            </span>
            <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] font-bold text-[var(--text)]">
              A 60-second quiz to find your pearl point of view.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              Your guardian is an archetype, not a costume. Take the quiz to discover whether this season calls for calm, renewal, soft power, or stronger boundaries.
            </p>
            <Link href="/guardian-quiz" className="mt-6 inline-flex items-center gap-2 bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]">
              Take the Quiz <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
            {["Phoenix - Renewal", "Moon Rabbit - Softness", "White Tiger - Boundaries", "Nine-Tailed Fox - Magnetism"].map((item) => (
              <div key={item} className="flex items-center justify-between border-b border-[var(--border)] py-4 last:border-b-0">
                <span className="font-serif text-lg text-[var(--text)]">{item}</span>
                <span className="text-xs text-[var(--accent)]">Matched pieces</span>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="py-14 bg-[var(--surface)]">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-2">Stay Connected</h2>
          <p className="text-[var(--text-secondary)] text-sm mb-6">New pearl realms, guardian archetypes, and quiet offers. No spam, just the good stuff.</p>
          <NewsletterForm />
          <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-[var(--text-muted)]">
            <span>Secure checkout in USD</span>
            <span>Free shipping over $69.99</span>
            <span>30-day returns</span>
          </div>
        </div>
      </ScrollReveal>

      <div className="relative h-[300px] w-full overflow-hidden md:h-[400px]">
        <Image
          src="/images/under/footer-banner.webp"
          alt="MythRealms pearl jewelry in warm evening light"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="px-6 text-center font-serif text-2xl leading-relaxed text-white md:text-3xl">
            Find your guardian.<br />
            <span className="text-[var(--accent)]">Wear your intention.</span>
          </p>
        </div>
      </div>

      <RecentlyViewed />
    </>
  );
}
