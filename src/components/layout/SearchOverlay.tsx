"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
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
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
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
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/products?search=${encodeURIComponent(query)}&limit=8`
        );
        const data = await res.json();
        setResults(
          data.products.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.variants[0]?.price || 0,
            image: p.images[0],
            category: p.category?.name || "",
          }))
        );
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/collections/beast-pendants?search=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery("");
    }
  }

  const popularSearches = [
    "Nine-Tailed Fox",
    "Qilin",
    "Azure Dragon",
    "Phoenix",
    "Four Symbols",
  ];

  function handleSuggestionClick(suggestion: string) {
    setQuery(suggestion);
    router.push(`/collections/beast-pendants?search=${encodeURIComponent(suggestion)}`);
    setIsOpen(false);
    setQuery("");
  }

  return (
    <>
      {/* Trigger button - exposed as global function */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--border-light)] transition text-[var(--text-secondary)] hover:text-[var(--text)]"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[200] bg-black/40 animate-fade-in"
          onClick={() => setIsOpen(false)}
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
                <div className="p-5">
                  <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                    Popular Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1.5 text-sm border border-[var(--border)] rounded-full text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text)] hover:bg-[var(--accent)]/5 transition cursor-pointer"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length === 0 && !loading ? (
                <div className="p-6 text-center text-sm text-[var(--text-muted)]">
                  No results found for &ldquo;{query}&rdquo;
                </div>
              ) : (
                results.map((result) => (
                  <Link
                    key={result.id}
                    href={`/products/${result.slug}`}
                    onClick={() => { setIsOpen(false); setQuery(""); }}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-[var(--border-light)] transition border-b border-[var(--border)] last:border-b-0"
                  >
                    <img
                      src={result.image}
                      alt={result.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
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
