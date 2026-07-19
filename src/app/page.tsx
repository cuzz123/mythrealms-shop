import type { Metadata } from "next";
import { HomepageCategoryStories } from "@/components/home/HomepageCategoryStories";
import { HomepageEditorialStory } from "@/components/home/HomepageEditorialStory";
import { HomepageGuardian } from "@/components/home/HomepageGuardian";
import { HomepageHero } from "@/components/home/HomepageHero";
import { HomepagePearlEdit } from "@/components/home/HomepagePearlEdit";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { RecentlyViewed } from "@/components/ui/RecentlyViewed";
import type { Product } from "@/lib/1688-products";
import { getStorefrontProducts } from "@/lib/storefront/catalog";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  alternates: { canonical: siteUrl },
  openGraph: { url: siteUrl },
};

const featuredSlugs = ["pearl-series-12", "pearl-series-13", "pearl-series-14", "pearl-series-19", "pearl-series-20"];

export default function HomePage() {
  const products = getStorefrontProducts();
  const featuredProducts = featuredSlugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product?.isActive && product.inStock))
    .slice(0, 4);

  return (
    <>
      <HomepageHero />
      <HomepageCategoryStories />
      <HomepagePearlEdit products={featuredProducts} />
      <HomepageEditorialStory />
      <HomepageGuardian />
      <section className="bg-[var(--surface-alt)] py-16 md:py-20" aria-labelledby="newsletter-title">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 id="newsletter-title" className="font-serif text-3xl font-medium text-[var(--text)]">Notes from the coast.</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">New pearl arrivals, thoughtful stories, and the occasional quiet offer.</p>
          <div className="mt-7"><NewsletterForm /></div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-[var(--text-muted)]">
            <span>Secure checkout in USD</span>
            <span>Free shipping over $69.99</span>
            <span>30-day returns</span>
          </div>
        </div>
      </section>
      <RecentlyViewed />
    </>
  );
}
