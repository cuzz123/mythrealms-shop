"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { categoryMessaging, productDisplayName } from "@/lib/brand";
import {
  getProductType,
  getStorefrontProducts,
  type StorefrontProductType,
} from "@/lib/storefront/catalog";

type SortMode = "featured" | "price-asc" | "price-desc" | "name-asc";
type PriceRange = "all" | "under40" | "40to50" | "over50";

const TYPE_FILTERS: Array<{ value?: StorefrontProductType; label: string }> = [
  { label: "All" },
  { value: "rings", label: "Rings" },
  { value: "bracelets", label: "Bracelets" },
  { value: "earrings", label: "Earrings" },
  { value: "necklaces", label: "Necklaces" },
  { value: "eyewear-chains", label: "Eyewear Chains" },
];

export function Collection1688({
  slug,
  initialType,
}: {
  slug: string;
  initialType?: StorefrontProductType;
}) {
  const [sort, setSort] = useState<SortMode>("featured");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const messaging = categoryMessaging[slug];

  const products = useMemo(() => {
    let list = getStorefrontProducts();
    if (initialType) {
      list = list.filter((product) => getProductType(product) === initialType);
    }
    if (priceRange === "under40") list = list.filter((product) => product.price < 40);
    if (priceRange === "40to50") {
      list = list.filter((product) => product.price >= 40 && product.price <= 50);
    }
    if (priceRange === "over50") list = list.filter((product) => product.price > 50);

    switch (sort) {
      case "price-asc":
        return [...list].sort((left, right) => left.price - right.price);
      case "price-desc":
        return [...list].sort((left, right) => right.price - left.price);
      case "name-asc":
        return [...list].sort((left, right) =>
          productDisplayName(left).localeCompare(productDisplayName(right)),
        );
      default:
        return list;
    }
  }, [initialType, priceRange, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
      <header className="mb-10 border-b border-[var(--border)] pb-8">
        <p className="mb-2 text-xs font-semibold uppercase text-[var(--accent)]">
          Everyday Pearl
        </p>
        <h1 className="font-serif text-3xl font-bold text-[var(--text)] lg:text-4xl">
          {messaging.name}
        </h1>
        <p className="mt-3 max-w-3xl text-[var(--text-muted)]">
          {messaging.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--text-secondary)]">
          <span>{getStorefrontProducts().length} pearl-led styles</span>
          <span>Free shipping over $69.99</span>
          <span>30-day returns</span>
        </div>
      </header>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-2" aria-label="Filter by jewelry type">
        {TYPE_FILTERS.map((filter) => {
          const selected = filter.value === initialType || (!filter.value && !initialType);
          const href = filter.value
            ? `/collections/${slug}?type=${filter.value}`
            : `/collections/${slug}`;
          return (
            <Link
              key={filter.value || "all"}
              href={href}
              aria-current={selected ? "page" : undefined}
              className={`shrink-0 border px-4 py-2 text-sm transition ${
                selected
                  ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <label className="sr-only" htmlFor="collection-sort">Sort products</label>
        <select
          id="collection-sort"
          value={sort}
          onChange={(event) => setSort(event.target.value as SortMode)}
          className="border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)]"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
        </select>
        <div className="flex flex-wrap gap-2" aria-label="Filter by price">
          {([
            ["all", "All prices"],
            ["under40", "Under $40"],
            ["40to50", "$40 - $50"],
            ["over50", "Over $50"],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setPriceRange(value)}
              aria-pressed={priceRange === value}
              className={`border px-3 py-2 text-xs transition ${
                priceRange === value
                  ? "border-[var(--text)] text-[var(--text)]"
                  : "border-[var(--border)] text-[var(--text-muted)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="ml-auto text-sm text-[var(--text-muted)]">
          {products.length} styles
        </span>
      </div>

      {products.length === 0 ? (
        <div className="border-y border-[var(--border)] py-16 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            No styles match these filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSort("featured");
              setPriceRange("all");
            }}
            className="mt-4 text-sm text-[var(--accent)] underline"
          >
            Reset price and sort
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.slug} data-product-type={getProductType(product)}>
              <ProductCard
                product={{
                  id: product.id,
                  name: productDisplayName(product),
                  slug: product.slug,
                  images: product.images,
                  variants: [{ price: product.price }],
                  comparePrice: product.compareAt ?? null,
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
