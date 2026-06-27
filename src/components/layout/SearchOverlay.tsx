"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { imageUrl } from "@/lib/images";
import { PRODUCTS } from "@/lib/1688-products";
import Link from "next/link";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
}

export function SearchOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchError, setSearchError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setSearchError(false);
      return;
    }

    // Search local 1688 products immediately (synchronous, no loading state)
    const q = query.toLowerCase();
    const localMatches: SearchResult[] = PRODUCTS
      .filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
      .slice(0, 8)
      .map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        image: p.image,
        category: p.categoryName,
      }));

    // Show local results right away
    setResults(localMatches);

    // Cancel any in-flight request from a previous keystroke
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/products?search=${encodeURIComponent(query)}&limit=8`,
          { signal: controller.signal }
        );
        const data = await res.json();
        const apiResults: SearchResult[] = data.products.map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.variants[0]?.price || 0,
          image: p.images[0],
          category: p.category?.name || "",
        }));
        // Merge: local first, then API results (deduplicate by slug)
        const localSlugs = new Set(localMatches.map(r => r.slug));
        const merged = [...localMatches, ...apiResults.filter((r: SearchResult) => !localSlugs.has(r.slug))];
        setResults(merged);
        setSearchError(false);
      } catch (err: any) {
        if (err.name === "AbortError") return; // silently ignore cancelled requests
        // Keep local results on API error
        if (localMatches.length === 0) {
          setResults([]);
        }
        setSearchError(true);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery("");
    }
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Search products"
        aria-expanded={isOpen}
        aria-controls="search-overlay"
        className="flex items-center gap-1 h-10 px-3 rounded-full hover:bg-[var(--border-light)] transition text-[var(--text-secondary)] hover:text-[var(--text)]"
      >
        <Search className="w-5 h-5" />
        <span className="text-xs ml-1 hidden lg:inline">Search</span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/40 animate-fade-in"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
          id="search-overlay"
        >
          <div
            className="bg-[var(--surface)] rounded-xl shadow-2xl max-w-xl mx-auto mt-24 overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input */}
            <form onSubmit={handleSubmit} className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
              <Search className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for jewelry, stones, apparel..."
                className="flex-1 border-none outline-none text-base bg-transparent text-[var(--text)] placeholder:text-[var(--text-muted)]"
              />
              {loading && <Loader2 className="w-4 h-4 animate-spin text-[var(--text-muted)]" />}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs text-[var(--text-muted)] px-2 py-1 hover:text-[var(--text)]"
              >
                ESC
              </button>
            </form>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto">
              {query.length < 2 ? (
                <div className="p-8 text-center">
                  <p className="text-[28px] font-serif text-[var(--text-muted)] animate-search-breathe">
                    Search gemstones, pearls, crystals...
                  </p>
                </div>
              ) : loading && results.length === 0 ? (
                /* Loading skeleton while fetching API results */
                <div className="p-4 space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 animate-pulse">
                      <div className="w-12 h-12 rounded-lg bg-[var(--border)] flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-[var(--border)] rounded w-3/4" />
                        <div className="h-3 bg-[var(--border)] rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.length === 0 && !loading ? (
                <div className="p-6 text-center text-sm text-[var(--text-muted)]">
                  {searchError
                    ? "Could not search right now. Please try again."
                    : <>No results found for &ldquo;{query}&rdquo;</>}
                </div>
              ) : (
                results.map((result) => (
                  <Link
                    key={result.id}
                    href={`/products/${result.slug}`}
                    onClick={() => { setIsOpen(false); setQuery(""); }}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-[var(--border-light)] transition border-b border-[var(--border)] last:border-b-0"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--border-light)]">
                      {result.image && (result.image.startsWith("http") || result.image.startsWith("/")) ? (
                        <Image
                          src={imageUrl(result.image)}
                          alt={result.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                          unoptimized={result.image.startsWith("http")}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] text-[10px]">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{result.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {result.category} — {formatPrice(result.price)}
                      </p>
                    </div>
                    <Search className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                  </Link>
                ))
              )}
              {/* Show results + subtle loading indicator when API is still fetching */}
              {loading && results.length > 0 && (
                <div className="px-5 py-2 border-t border-[var(--border)]">
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Searching...
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-[var(--border)] bg-[var(--border-light)]">
              <p className="text-xs text-[var(--text-muted)] text-center">
                Press <kbd className="px-1.5 py-0.5 bg-[var(--surface)] border border-[var(--border)] rounded text-[10px] text-[var(--text)]">Ctrl+K</kbd> to open search anytime
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
