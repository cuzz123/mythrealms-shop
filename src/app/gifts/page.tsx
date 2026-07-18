import type { Metadata } from "next";
import Link from "next/link";

import { EditorialHero } from "@/components/editorial/EditorialHero";
import { RelatedProducts } from "@/components/editorial/RelatedProducts";
import { JsonLd } from "@/components/ui/JsonLd";
import { productDisplayName } from "@/lib/brand";
import {
  type GiftSection,
  getGiftSections,
  getUniqueGiftProducts,
} from "@/lib/editorial/gifts";
import { HOMEPAGE_MEDIA } from "@/lib/homepage-editorial";
import { buildCollectionSchema } from "@/lib/seo/schema";
import { absoluteUrl } from "@/lib/site";

const title = "Pearl Jewelry Gifts | MythRealms Gift Guide";
const description =
  "Shop pearl jewelry gifts under $50 and $70, plus everyday and statement pearl edits selected from the current MythRealms catalog.";
const heroImage = HOMEPAGE_MEDIA.everyday;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/gifts") },
  openGraph: {
    title,
    description,
    url: absoluteUrl("/gifts"),
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

export function GiftProductSections({ sections }: { sections: readonly GiftSection[] }) {
  return sections.map((section) => {
    const headingId = `${section.id}-products-title`;

    return (
      <section
        key={section.id}
        id={section.id}
        className="scroll-mt-28"
        aria-labelledby={headingId}
      >
        {section.products.length > 0 ? (
          <RelatedProducts
            products={section.products}
            title={section.title}
            description={section.description}
            headingId={headingId}
          />
        ) : (
          <div className="bg-[var(--surface-alt)] py-14 sm:py-16">
            <div className="mx-auto max-w-7xl px-6">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase text-[var(--accent)]">
                  The Pearl Edit
                </p>
                <h2
                  id={headingId}
                  className="mt-3 font-serif text-3xl font-medium text-[var(--text)]"
                >
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  {section.description}
                </p>
                <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                  There are no pieces available in this edit right now.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  });
}

export default function GiftsPage() {
  const sections = getGiftSections();
  const products = getUniqueGiftProducts(sections);

  return (
    <main className="bg-[var(--bg)]">
      <JsonLd
        data={buildCollectionSchema({
          name: "MythRealms Pearl Gift Guide",
          description,
          url: absoluteUrl("/gifts"),
          products: products.map((product) => ({
            name: productDisplayName(product),
            url: absoluteUrl(`/products/${product.slug}`),
          })),
        })}
      />
      <EditorialHero
        eyebrow="Pearl Gift Guide"
        title="Pearl gifts, chosen by how they will be worn."
        description="Choose from four current-catalog edits: two price points, pieces for everyday wear, and pearls with a more pronounced presence."
        image={heroImage}
        primaryAction={{ label: "Browse gifts", href: "#under-50" }}
        secondaryAction={{ label: "Shop The Pearl Edit", href: "/collections/pearl-series" }}
      />

      <section className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:py-12">
          <p className="max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
            Start with the budget or the way the piece will fit into their wardrobe. Each edit
            draws from the active, in-stock Pearl Edit and keeps the choice focused.
          </p>
        </div>
      </section>

      <GiftProductSections sections={sections} />

      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
        <div className="border-y border-[var(--border)] py-9 sm:flex sm:items-center sm:justify-between sm:gap-10">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--accent)]">Before you choose</p>
            <h2 className="mt-3 font-serif text-3xl font-medium text-[var(--text)]">
              Keep the practical details close.
            </h2>
          </div>
          <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[var(--accent)] sm:mt-0" aria-label="Gift guide help">
            <Link href="/shipping">Shipping</Link>
            <Link href="/returns">Returns</Link>
            <Link href="/pearls/care">Pearl care</Link>
          </nav>
        </div>
      </section>
    </main>
  );
}
