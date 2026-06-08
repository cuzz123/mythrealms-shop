import { db } from "@/lib/db";
import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Search } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q} — MythRealms` : "Search — MythRealms",
    description: q
      ? `Search results for "${q}" — discover mythical jewelry and ancient guardians`
      : "Search our collection of mythical beast jewelry and ancient guardian talismans",
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  let products: any[] = [];
  let total = 0;

  if (query) {
    const results = await db.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { stone: { contains: query, mode: "insensitive" } },
          { material: { contains: query, mode: "insensitive" } },
          { intention: { contains: query, mode: "insensitive" } },
          { category: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      include: {
        variants: true,
        category: { select: { name: true, slug: true } },
        reviews: { select: { rating: true } },
      },
      take: 48,
      orderBy: { sortOrder: "asc" },
    });

    total = results.length;

    products = results.map((p) => ({
      ...p,
      images: JSON.parse(p.images as string),
      avgRating: p.reviews.length
        ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
        : 0,
      reviewCount: p.reviews.length,
    }));
  }

  const popularSearches = [
    "Nine-Tailed Fox",
    "Qilin",
    "Azure Dragon",
    "Phoenix",
    "White Tiger",
    "Four Symbols",
    "Bai Ze",
    "Kun Peng",
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-8">
        <Link href="/" className="hover:text-[var(--text)]">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Search</span>
      </nav>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl font-bold text-[var(--text)] mb-3">
          {query ? `Search: "${query}"` : "Search MythRealms"}
        </h1>
        <p className="text-[var(--text-muted)] max-w-lg mx-auto">
          {query
            ? `${total} result${total !== 1 ? "s" : ""} found`
            : "Find your guardian among the ancient beasts"}
        </p>
      </div>

      {/* Results */}
      {query ? (
        products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-2">
              No Results Found
            </h2>
            <p className="text-[var(--text-muted)] max-w-md mx-auto mb-8">
              We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try a different term or browse our collections.
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white rounded-full font-semibold text-sm hover:bg-[var(--accent-hover)] transition"
            >
              Browse All Collections
            </Link>

            {/* Popular searches fallback */}
            <div className="mt-12">
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                Popular Searches
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {popularSearches.map((term) => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="px-3 py-1.5 text-sm border border-[var(--border)] rounded-full text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text)] hover:bg-[var(--accent)]/5 transition"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )
      ) : (
        /* Empty state — no query yet */
        <div className="text-center py-20">
          <Search className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-6" />
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-3">
            What Are You Looking For?
          </h2>
          <p className="text-[var(--text-muted)] max-w-md mx-auto mb-8">
            Search for mythical beasts, constellations, gemstones, or intentions. Use the search bar above or try a suggestion below.
          </p>

          <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
            {popularSearches.map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="px-4 py-2 text-sm border border-[var(--border)] rounded-full text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text)] hover:bg-[var(--accent)]/5 transition"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
