"use client";
import Link from "next/link";
import Image from "next/image";
import { PRODUCTS, CATEGORIES } from "@/lib/1688-products";
import { formatPrice } from "@/lib/utils";

export function Collection1688({ slug }: { slug: string }) {
  const cat = CATEGORIES.find(c => c.slug === slug);
  const products = PRODUCTS.filter(p => p.category === slug);
  
  if (!cat || products.length === 0) return null;
  
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="font-serif text-3xl lg:text-4xl font-bold text-[var(--text)]">{cat.name}</h1>
        <p className="mt-2 text-[var(--text-muted)] max-w-2xl">{cat.description}</p>
        <p className="mt-1 text-sm text-[var(--accent)]">{products.length} styles</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p, i) => (
          <Link key={p.slug} href={`/products/${p.slug}`} className="group" aria-label={`View ${p.name}`}>
            <div className="img-container aspect-square rounded-xl overflow-hidden border border-[var(--border)] group-hover:border-[var(--accent)]/40 transition-all relative">
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="(max-width:640px) 50vw, 25vw"
                {...(i < 3 ? { priority: true } : { loading: "lazy" })}
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="mt-2.5 px-1">
              <h4 className="text-sm font-medium text-[var(--text)] line-clamp-1 group-hover:text-[var(--accent)] transition-colors">{p.name}</h4>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{formatPrice(p.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
