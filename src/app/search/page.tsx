import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Search } from "lucide-react";
import type { Metadata } from "next";
import { getProductType, getStorefrontProducts } from "@/lib/storefront/catalog";
import { productDisplayName, productShortDescription } from "@/lib/brand";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q} | MythRealms` : "Search | MythRealms",
    description: q
      ? `Search MythRealms pearl jewelry for "${q}".`
      : "Search the MythRealms Pearl Edit for rings, bracelets, earrings, and necklaces.",
  };
}

const popularSearches = [
  "Pearl Earrings",
  "Pearl Necklace",
  "Pearl Bracelet",
  "Pearl Ring",
  "Everyday Pearl",
  "Gift",
];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";
  const normalizedQuery = query.toLowerCase();

  const matches = normalizedQuery
    ? getStorefrontProducts().filter((product) =>
        [
          productDisplayName(product),
          productShortDescription(product),
          product.categoryName,
          product.intention || "",
          `pearl ${getProductType(product)}`,
        ].some((value) => value.toLowerCase().includes(normalizedQuery)),
      )
    : [];

  const products = matches.map((product) => ({
    id: product.id,
    name: productDisplayName(product),
    slug: product.slug,
    images: product.images,
    variants: [{ price: product.price }],
    comparePrice: product.compareAt ?? null,
  }));

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <nav className="mb-8 flex items-center gap-2 text-sm text-[var(--text-muted)]" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[var(--text)]">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Search</span>
      </nav>

      <div className="mb-12 text-center">
        <h1 className="mb-3 font-serif text-4xl font-bold text-[var(--text)]">
          {query ? `Search: "${query}"` : "Search MythRealms"}
        </h1>
        <p className="mx-auto max-w-lg text-[var(--text-muted)]">
          {query
            ? `${products.length} result${products.length === 1 ? "" : "s"} found`
            : "Find pearl rings, bracelets, earrings, and necklaces."}
        </p>
      </div>

      {query && products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="py-20 text-center">
          <Search className="mx-auto mb-4 h-12 w-12 text-[var(--text-muted)]" />
          <h2 className="mb-2 font-serif text-2xl font-bold text-[var(--text)]">
            {query ? "No Results Found" : "What Are You Looking For?"}
          </h2>
          <p className="mx-auto mb-8 max-w-md text-[var(--text-muted)]">
            {query
              ? `We could not find a pearl piece matching "${query}". Try another term or browse the full edit.`
              : "Use the search field in the header or start with one of these suggestions."}
          </p>
          <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-2">
            {popularSearches.map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-secondary)] transition hover:border-[var(--accent)] hover:text-[var(--text)]"
              >
                {term}
              </Link>
            ))}
          </div>
          {query && (
            <Link
              href="/collections/pearl-series"
              className="mt-8 inline-flex bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--bg)] transition hover:bg-[var(--accent-hover)]"
            >
              Browse the Pearl Edit
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
