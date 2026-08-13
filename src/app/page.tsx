import type { Metadata } from "next";
import { HomepageCategoryStories } from "@/components/home/HomepageCategoryStories";
import { EditorialDiptych } from "@/components/home/EditorialDiptych";
import { HomepageEditorialStory } from "@/components/home/HomepageEditorialStory";
import { HomepageGiftSets } from "@/components/home/HomepageGiftSets";
import { HomepageHero } from "@/components/home/HomepageHero";
import { HomepagePearlEdit } from "@/components/home/HomepagePearlEdit";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { RecentlyViewed } from "@/components/ui/RecentlyViewed";
import { EditorialLinkBand } from "@/components/editorial/EditorialLinkBand";
import type { Product } from "@/lib/1688-products";
import { BRAND } from "@/lib/brand-identity";
import { getStorefrontProducts } from "@/lib/storefront/catalog";
import { getPearlEditProducts, PEARL_EDITS } from "@/lib/storefront/pearl-edits";
import { siteUrl } from "@/lib/site";
import { HOMEPAGE_EDITORIAL_DIPTYCH, HOMEPAGE_EDITORIAL_LINKS } from "@/lib/homepage-editorial";

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
      <EditorialDiptych {...HOMEPAGE_EDITORIAL_DIPTYCH} />
      <HomepagePearlEdit products={featuredProducts} />
      <HomepageEditorialStory />
      <div data-homepage-section="homepage-editorial-links">
        <EditorialLinkBand items={HOMEPAGE_EDITORIAL_LINKS} />
      </div>
      <HomepageGiftSets products={giftProducts} />
      <section data-homepage-section="homepage-newsletter-letter" className="bg-[var(--surface-alt)] py-16 md:py-20" aria-labelledby="newsletter-title">
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
