import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { productDisplayName } from "@/lib/brand";
import type { StorefrontProduct } from "@/lib/storefront/catalog";

type HomepageGiftSetsProps = {
  products: readonly StorefrontProduct[];
};

export function HomepageGiftSets({ products }: HomepageGiftSetsProps) {
  return (
    <section className="bg-[var(--bg)] py-16 md:py-24" aria-labelledby="gift-sets-title">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase text-[var(--accent)]">Gift-ready Sets</p>
            <h2 id="gift-sets-title" className="mt-3 font-serif text-3xl font-medium text-[var(--text)] md:text-4xl">
              A little something to keep close.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)] md:text-base">
              Pearl pieces selected for a personal gesture, from a quiet thank-you to a date worth remembering.
            </p>
          </div>
          <Link href="/gifts" className="inline-flex items-center gap-2 border-b border-[var(--text)] pb-1 text-sm font-semibold text-[var(--text)]">
            Explore pearl gifts <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-5">
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              product={{
                id: product.id,
                name: productDisplayName(product),
                slug: product.slug,
                images: [product.imageRoles?.primary || product.image],
                imageRoles: product.imageRoles,
                variants: [{ price: product.price }],
                comparePrice: product.compareAt ?? null,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
