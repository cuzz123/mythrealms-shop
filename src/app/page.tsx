import type { Metadata } from "next";
import { HomepageCategoryStories } from "@/components/home/HomepageCategoryStories";
import { HomepageEditorialStory } from "@/components/home/HomepageEditorialStory";
import { HomepageGiftSets } from "@/components/home/HomepageGiftSets";
import { HomepageOccasionEdit } from "@/components/home/HomepageOccasionEdit";
import { HomepageHero } from "@/components/home/HomepageHero";
import { HomepagePearlEdit } from "@/components/home/HomepagePearlEdit";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { RecentlyViewed } from "@/components/ui/RecentlyViewed";
import type { Product } from "@/lib/1688-products";
import { BRAND } from "@/lib/brand-identity";
import { getStorefrontProducts } from "@/lib/storefront/catalog";
import { getPearlEditProducts, PEARL_EDITS } from "@/lib/storefront/pearl-edits";
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
  const giftEdit = PEARL_EDITS.find((edit) => edit.slug === "a-gift-to-keep");
  const giftProducts = giftEdit ? getPearlEditProducts(giftEdit, products).slice(0, 4) : [];

  return (
    <>
      <HomepageHero />
      <HomepageCategoryStories />
      <HomepageOccasionEdit />
      <HomepagePearlEdit products={featuredProducts} />
      <HomepageEditorialStory />
      <HomepageGiftSets products={giftProducts} />
      <section className="bg-[var(--surface-alt)] py-16 md:py-20" aria-labelledby="newsletter-title">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 id="newsletter-title" className="font-serif text-3xl font-medium text-[var(--text)]">{BRAND.newsletterTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Thoughtful notes on jewelry, styling, and everyday moments.</p>
          <div className="mt-7"><NewsletterForm /></div>
        </div>
      </section>
      <RecentlyViewed />
    </>
  );
}
