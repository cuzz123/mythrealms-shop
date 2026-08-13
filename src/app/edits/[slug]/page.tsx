import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { ProductCard } from "@/components/product/ProductCard";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/ui/JsonLd";
import { productDisplayName } from "@/lib/brand";
import { absoluteUrl } from "@/lib/site";
import {
  PEARL_EDITS,
  getPearlEditBySlug,
  getPearlEditProducts,
} from "@/lib/storefront/pearl-edits";
import { getStorefrontProducts } from "@/lib/storefront/catalog";

type EditPageProps = Readonly<{ params: Promise<{ slug: string }> }>;

const EDIT_RATIONALES: Readonly<Record<string, string>> = {
  "everyday-light": "Small-scale pieces and easy layers that sit comfortably with a plain shirt, knit, or open collar.",
  "dinner-by-the-water": "A more defined mix of drops, lariats, and darker accents for an evening neckline or an unhurried table.",
  "a-gift-to-keep": "Personal pearl details with a clear focal point, selected to make choosing for someone else feel more considered.",
  "soft-gold-and-pearl": "Warm metal tones and pearl details that can bring a quiet finish to linen, silk, or a simple evening layer.",
};

function getEditOrNotFound(slug: string) {
  const edit = getPearlEditBySlug(slug);
  if (!edit) notFound();
  return edit;
}

export function generateStaticParams() {
  return PEARL_EDITS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: EditPageProps): Promise<Metadata> {
  const edit = getEditOrNotFound((await params).slug);
  const title = `${edit.title} | Pearl Jewelry Edit | MythRealms`;
  const image = absoluteUrl(edit.heroImage);
  const canonical = absoluteUrl(edit.route);

  return {
    title,
    description: edit.description,
    alternates: { canonical },
    openGraph: {
      title,
      description: edit.description,
      url: canonical,
      type: "website",
      images: [{ url: image, alt: `${edit.title} pearl jewelry edit` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: edit.description,
      images: [image],
    },
  };
}

export default async function PearlEditPage({ params }: EditPageProps) {
  const edit = getEditOrNotFound((await params).slug);
  const products = getPearlEditProducts(edit, getStorefrontProducts());
  const canonical = absoluteUrl(edit.route);

  return (
    <div className="bg-[var(--bg)]">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: absoluteUrl("/") },
          { name: "Pearl Edits", url: absoluteUrl("/gifts") },
          { name: edit.title, url: canonical },
        ]}
      />
      <ItemListJsonLd
        name={edit.title}
        url={canonical}
        products={products.map((product) => ({
          name: productDisplayName(product),
          url: absoluteUrl(`/products/${product.slug}`),
        }))}
      />

      <section className="grid min-h-[34rem] border-b border-[var(--border)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="relative min-h-[22rem] bg-[var(--surface-alt)] lg:min-h-full">
          <Image
            src={edit.heroImage}
            alt={`${edit.title} pearl jewelry editorial`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="flex items-end bg-[var(--surface)] px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase text-[var(--accent)]">Pearl edit</p>
            <h1 className="mt-4 font-serif text-4xl font-medium text-[var(--text)] sm:text-5xl">
              {edit.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-[var(--text-secondary)]">{edit.description}</p>
            <Link
              href="#selected-pieces"
              className="mt-8 inline-flex border-b border-[var(--accent)] pb-1 text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)]"
            >
              View selected pieces
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16" aria-labelledby="edit-rationale-title">
        <div className="max-w-2xl border-l-2 border-[var(--accent)] pl-5">
          <p className="text-xs font-semibold uppercase text-[var(--accent)]">Why these pieces</p>
          <h2 id="edit-rationale-title" className="mt-3 font-serif text-3xl font-medium text-[var(--text)]">
            A focused place to begin.
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">{EDIT_RATIONALES[edit.slug]}</p>
        </div>
      </section>

      <section id="selected-pieces" className="scroll-mt-24 border-y border-[var(--border)] bg-[var(--surface-alt)] py-14 sm:py-16" aria-labelledby="selected-pieces-title">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase text-[var(--accent)]">The Pearl Edit</p>
          <h2 id="selected-pieces-title" className="mt-3 font-serif text-3xl font-medium text-[var(--text)]">
            Selected pieces
          </h2>
          <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
            {products.map((product) => (
              <ProductCard
                key={product.slug}
                product={{
                  id: product.id,
                  name: productDisplayName(product),
                  slug: product.slug,
                  images: [...product.images],
                  imageRoles: product.imageRoles,
                  variants: [{ price: product.price }],
                  comparePrice: product.compareAt ?? null,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16" aria-labelledby="edit-guides-title">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase text-[var(--accent)]">Keep reading</p>
          <h2 id="edit-guides-title" className="mt-3 font-serif text-3xl font-medium text-[var(--text)]">
            Style, care, and gift guidance
          </h2>
        </div>
        <nav className="mt-8 grid gap-x-8 gap-y-5 border-t border-[var(--border)] pt-6 sm:grid-cols-3" aria-label="Pearl edit guides">
          {[
            ["How to wear pearls", "Start with placement, scale, and the neckline you will wear most.", "/pearls/how-to-wear"],
            ["Pearl care", "A practical routine for wearing, cleaning, and storing pearl jewelry.", "/pearls/care"],
            ["Gift guide", "Browse pearl pieces by price, occasion, and how they might be worn.", "/gifts"],
          ].map(([title, copy, href]) => (
            <Link key={href} href={href} className="border-t border-[var(--border)] pt-4 hover:border-[var(--accent)]">
              <h3 className="font-serif text-xl font-medium text-[var(--text)]">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{copy}</p>
            </Link>
          ))}
        </nav>
      </section>
    </div>
  );
}
