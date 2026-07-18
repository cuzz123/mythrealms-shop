import type { Metadata } from "next";
import Link from "next/link";

import { EditorialHero } from "@/components/editorial/EditorialHero";
import { RelatedProducts } from "@/components/editorial/RelatedProducts";
import { JsonLd } from "@/components/ui/JsonLd";
import { productDisplayName } from "@/lib/brand";
import { getNewArrivalProducts } from "@/lib/editorial/gifts";
import { HOMEPAGE_MEDIA } from "@/lib/homepage-editorial";
import { buildCollectionSchema } from "@/lib/seo/schema";
import { absoluteUrl } from "@/lib/site";

const title = "New Pearl Jewelry Arrivals | MythRealms";
const description =
  "Explore recently added pearl jewelry currently active and in stock in the MythRealms catalog.";
const heroImage = HOMEPAGE_MEDIA.necklaces;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/collections/new-arrivals") },
  openGraph: {
    title,
    description,
    url: absoluteUrl("/collections/new-arrivals"),
    type: "website",
    images: [{ url: absoluteUrl(heroImage.src), alt: heroImage.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [absoluteUrl(heroImage.src)],
  },
};

export default function NewArrivalsPage() {
  const products = getNewArrivalProducts();

  return (
    <main className="bg-[var(--bg)]">
      <JsonLd
        data={buildCollectionSchema({
          name: "New Pearl Arrivals",
          description,
          url: absoluteUrl("/collections/new-arrivals"),
          products: products.map((product) => ({
            name: productDisplayName(product),
            url: absoluteUrl(`/products/${product.slug}`),
          })),
        })}
      />
      <EditorialHero
        eyebrow="The Pearl Edit"
        title="New pearl arrivals."
        description="Recently added pieces in the active catalog, selected for anyone ready to see what is new in the Pearl Edit."
        image={heroImage}
        primaryAction={{ label: "Shop The Pearl Edit", href: "/collections/pearl-series" }}
      />

      {products.length > 0 ? (
        <RelatedProducts
          products={products}
          title="Recently added to the Pearl Edit"
          description="These are the active, in-stock pieces currently marked as new in the catalog."
        />
      ) : (
        <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div className="border-y border-[var(--border)] py-10">
            <p className="font-serif text-3xl text-[var(--text)]">There are no new arrivals right now.</p>
            <Link
              href="/collections/pearl-series"
              className="mt-5 inline-block text-sm font-semibold text-[var(--accent)]"
            >
              Browse The Pearl Edit
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
