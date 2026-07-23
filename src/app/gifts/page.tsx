import type { Metadata } from "next";
import Link from "next/link";

import { EditorialHero } from "@/components/editorial/EditorialHero";
import { GiftProductSections } from "@/components/editorial/GiftProductSections";
import { RelatedProducts } from "@/components/editorial/RelatedProducts";
import { JsonLd } from "@/components/ui/JsonLd";
import { productDisplayName } from "@/lib/brand";
import {
  getGiftSections,
  getUniqueGiftProducts,
} from "@/lib/editorial/gifts";
import { HOMEPAGE_MEDIA } from "@/lib/homepage-editorial";
import { buildCollectionSchema } from "@/lib/seo/schema";
import { absoluteUrl } from "@/lib/site";
import { PEARL_EDITS, getPearlEditProducts } from "@/lib/storefront/pearl-edits";
import { getStorefrontProducts } from "@/lib/storefront/catalog";

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

export default function GiftsPage() {
  const sections = getGiftSections();
  const products = getUniqueGiftProducts(sections);
  const giftEdit = PEARL_EDITS.find((edit) => edit.slug === "a-gift-to-keep");
  const everydayEdit = PEARL_EDITS.find((edit) => edit.slug === "everyday-light");
  const dinnerEdit = PEARL_EDITS.find((edit) => edit.slug === "dinner-by-the-water");
  const catalog = getStorefrontProducts();

  return (
    <div className="bg-[var(--bg)]">
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
        description="Start with who you are choosing for, the occasion you want to mark, or a price point that keeps the choice focused. Every piece below is from the current Pearl Edit."
        image={heroImage}
        primaryAction={{ label: "Browse gift paths", href: "#gift-paths" }}
        secondaryAction={{ label: "Shop The Pearl Edit", href: "/collections/pearl-series" }}
      />

      <section id="gift-paths" className="scroll-mt-24 border-b border-[var(--border)] bg-[var(--surface)]" aria-labelledby="gift-paths-title">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:py-12">
          <p className="text-xs font-semibold uppercase text-[var(--accent)]">Gift paths</p>
          <h2 id="gift-paths-title" className="mt-3 font-serif text-3xl font-medium text-[var(--text)]">Begin with the part that feels certain.</h2>
          <nav className="mt-8 grid gap-x-8 gap-y-6 border-t border-[var(--border)] pt-6 sm:grid-cols-2 lg:grid-cols-4" aria-label="Gift guide paths">
            {[
              ["For someone close", "A personal place to begin for a friend, partner, or family member.", "#for-someone-close"],
              ["For an occasion", "Choose an everyday, dinner, or milestone-ready direction.", "#for-an-occasion"],
              ["By price", "Compare current pieces below $50 or below $70.", "#under-50"],
              ["Before you order", "Review practical shipping, returns, and care details.", "#gift-help"],
            ].map(([label, copy, href]) => (
              <a key={href} href={href} className="border-t border-[var(--border)] pt-4 hover:border-[var(--accent)]">
                <h3 className="font-serif text-xl font-medium text-[var(--text)]">{label}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{copy}</p>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {giftEdit && (
        <section id="for-someone-close" className="scroll-mt-24">
          <RelatedProducts
            products={getPearlEditProducts(giftEdit, catalog)}
            title="For someone close"
            description="A small selection with a personal focal point, chosen from the active Pearl Edit for gifts that can be worn often."
            headingId="for-someone-close-title"
          />
        </section>
      )}

      <section id="for-an-occasion" className="scroll-mt-24 border-b border-[var(--border)] bg-[var(--surface)]" aria-labelledby="occasion-title">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
          <p className="text-xs font-semibold uppercase text-[var(--accent)]">For an occasion</p>
          <h2 id="occasion-title" className="mt-3 font-serif text-3xl font-medium text-[var(--text)]">Choose the rhythm of the day.</h2>
          <div className="mt-8 grid gap-x-8 gap-y-6 border-t border-[var(--border)] pt-6 sm:grid-cols-2">
            {[everydayEdit, dinnerEdit].filter(Boolean).map((edit) => (
              <Link key={edit!.slug} href={edit!.route} className="border-t border-[var(--border)] pt-5 hover:border-[var(--accent)]">
                <h3 className="font-serif text-2xl font-medium text-[var(--text)]">{edit!.title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--text-secondary)]">{edit!.description}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-[var(--accent)]">Explore the edit</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <GiftProductSections sections={sections} />

      <section id="gift-help" className="scroll-mt-24 mx-auto max-w-7xl px-6 py-14 sm:py-16">
        <div className="border-y border-[var(--border)] py-9 sm:flex sm:items-center sm:justify-between sm:gap-10">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--accent)]">Before you choose</p>
            <h2 className="mt-3 font-serif text-3xl font-medium text-[var(--text)]">
              Keep the practical details close.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--text-secondary)]">Review the shipping and returns pages for the current store policy before placing an order. A personal message can still begin with the piece and occasion you choose.</p>
          </div>
          <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[var(--accent)] sm:mt-0" aria-label="Gift guide help">
            <Link href="/shipping">Shipping</Link>
            <Link href="/returns">Returns</Link>
            <Link href="/pearls/care">Pearl care</Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
