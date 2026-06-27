"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { PRODUCTS, CATEGORIES } from "@/lib/1688-products";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";

type SortMode = "featured" | "price-asc" | "price-desc" | "name-asc";
type PriceRange = "all" | "under40" | "40to50" | "over50";

export function Collection1688({ slug }: { slug: string }) {
  const [sort, setSort] = useState<SortMode>("featured");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");

  const cat = CATEGORIES.find(c => c.slug === slug);
  const products = useMemo(() => {
    let list = PRODUCTS.filter(p => p.category === slug);

    // Price filter
    if (priceRange === "under40") list = list.filter(p => p.price < 40);
    else if (priceRange === "40to50") list = list.filter(p => p.price >= 40 && p.price <= 50);
    else if (priceRange === "over50") list = list.filter(p => p.price > 50);

    // Sort
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
      default:
        // Keep original order
        break;
    }
    return list;
  }, [slug, sort, priceRange]);

  if (!cat) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-3">Collection Not Found</h2>
        <p className="text-[var(--text-muted)] mb-6">We couldn&apos;t find that collection.</p>
        <Link href="/collections">
          <Button variant="primary">Browse Collections</Button>
        </Link>
      </div>
    );
  }

  if (products.length === 0 && priceRange === "all") {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-3xl lg:text-4xl font-bold text-[var(--text)] mb-3">{cat.name}</h1>
        <p className="text-[var(--text-muted)] mb-2">{cat.description}</p>
        <div className="mt-8 py-10 border border-dashed border-[var(--border)] rounded-xl">
          <p className="text-[var(--text-muted)] text-sm mb-2">This collection is being curated. Check back soon.</p>
          <Link href="/collections" className="text-sm text-[var(--accent)] hover:underline">
            Browse other collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="font-serif text-3xl lg:text-4xl font-bold text-[var(--text)]">{cat.name}</h1>
        <p className="mt-2 text-[var(--text-muted)] max-w-2xl">{cat.description}</p>
        <p className="mt-1 text-sm text-[var(--accent)]">{products.length} styles</p>
      </div>

      {/* Controls: Sort + Price Filter */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {/* Sort */}
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortMode)}
          className="px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg)] text-[var(--text)] cursor-pointer"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
        </select>

        {/* Price range pills */}
        <div className="flex flex-wrap gap-2">
          {([
            ["all", "All"],
            ["under40", "Under $40"],
            ["40to50", "$40 – $50"],
            ["over50", "Over $50"],
          ] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setPriceRange(val)}
              className={`px-3 py-1.5 text-xs rounded-full border transition ${
                priceRange === val
                  ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-muted)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-[var(--border)] rounded-xl">
          <p className="text-[var(--text-muted)] text-sm">No styles match your current filters. Try a different price range.</p>
          <button
            onClick={() => { setSort("featured"); setPriceRange("all"); }}
            className="mt-3 text-xs text-[var(--accent)] hover:underline"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p, i) => (
            <div key={p.slug} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms`, animationFillMode: "backwards" }}>
              <ProductCard product={{
                id: p.id,
                name: p.name,
                slug: p.slug,
                images: p.images,
                variants: [{ price: p.price }],
                comparePrice: p.compareAt ?? null,
              }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}