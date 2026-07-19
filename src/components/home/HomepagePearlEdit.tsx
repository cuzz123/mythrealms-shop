import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { productDisplayName } from "@/lib/brand";
import type { Product } from "@/lib/1688-products";

type HomepagePearlEditProps = {
  products: Product[];
};

export function HomepagePearlEdit({ products }: HomepagePearlEditProps) {
  return (
    <section className="bg-[var(--bg)] py-16 md:py-24" aria-labelledby="pearl-edit-title">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--accent)]">The Pearl Edit</p>
            <h2 id="pearl-edit-title" className="mt-3 font-serif text-3xl font-medium text-[var(--text)] md:text-4xl">
              Pieces for everyday light.
            </h2>
          </div>
          <Link href="/collections/pearl-series" className="inline-flex items-center gap-2 border-b border-[var(--text)] pb-1 text-sm font-semibold text-[var(--text)]">
            Shop the edit <ArrowRight className="h-4 w-4" />
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
