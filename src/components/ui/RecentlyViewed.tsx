"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getStorefrontProductBySlug, type StorefrontProduct } from "@/lib/storefront/catalog";
import { productDisplayName } from "@/lib/brand";
import { LazyImage } from "@/components/ui/LazyImage";
import { formatPrice } from "@/lib/utils";
import { Clock } from "lucide-react";

export function RecentlyViewed() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("mythrealms-recently-viewed");
      if (raw) {
        const parsed: string[] = JSON.parse(raw);
        setSlugs(parsed.slice(0, 4));
      }
    } catch { /* ignore */ }
  }, []);

  const products = slugs
    .map(getStorefrontProductBySlug)
    .filter((product): product is StorefrontProduct => Boolean(product));

  if (products.length === 0) return null;

  return (
    <section className="py-14 bg-[var(--surface)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-[var(--accent)]" />
          <h2 className="font-serif text-2xl font-bold text-[var(--text)]">Recently Viewed</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((rp) => (
            <Link key={rp.slug} href={`/products/${rp.slug}`} className="group" aria-label={`View ${productDisplayName(rp)}`}>
              <div className="aspect-square rounded-xl overflow-hidden border border-[var(--border)] group-hover:border-[var(--accent)]/40 transition-all relative">
                <LazyImage src={rp.image} alt={productDisplayName(rp)} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" containerClassName="absolute inset-0" />
              </div>
              <div className="mt-2.5 px-1">
                <h3 className="text-sm font-medium text-[var(--text)] line-clamp-1 group-hover:text-[var(--accent)] transition-colors">{productDisplayName(rp)}</h3>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xs font-semibold text-[var(--text)]">{formatPrice(rp.price)}</span>
                  {rp.compareAt && rp.compareAt > rp.price && (
                    <span className="text-[10px] text-[var(--text-muted)] line-through">{formatPrice(rp.compareAt)}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
