"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { imageUrl } from "@/lib/images";
import { getProductType, getStorefrontProducts } from "@/lib/storefront/catalog";
import { productDisplayName } from "@/lib/brand";
import Link from "next/link";
import { useDialogFocus } from "@/lib/client/use-dialog-focus";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
}

export function SearchOverlay({ isScrolled }: { isScrolled?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useDialogFocus({
    isOpen,
    onClose: () => setIsOpen(false),
    containerRef: dialogRef,
    initialFocusRef: inputRef,
  });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery.length < 2) {
      setResults([]);
      return;
    }

    const matches: SearchResult[] = getStorefrontProducts()
      .filter((product) =>
        [
          productDisplayName(product),
          product.description,
          product.intention || "",
          `pearl ${getProductType(product)}`,
        ].some((value) => value.toLowerCase().includes(normalizedQuery)),
      )
      .slice(0, 8)
      .map((product) => ({
        id: product.id,
        name: productDisplayName(product),
        slug: product.slug,
        price: product.price,
        image: product.image,
        category: getProductType(product).replace("-", " "),
      }));

    setResults(matches);
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
        title="Search products"
        className={`flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)] focus-visible:ring-offset-2 ${isScrolled ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900" : "text-white/80 hover:bg-white/10 hover:text-white focus-visible:ring-offset-transparent"}`}
      >
        <Search className="w-5 h-5" />
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
            ref={dialogRef}
            className="bg-white rounded-xl shadow-2xl max-w-xl mx-auto mt-24 overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input */}
            <form onSubmit={handleSubmit} className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pearl jewelry..."
                className="flex-1 border-none outline-none text-base bg-transparent text-gray-900 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-400 px-2 py-1 hover:text-gray-700"
              >
                ESC
              </button>
            </form>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto">
              {query.length < 2 ? (
                <div className="p-8 text-center">
                  <p className="text-[28px] font-serif text-gray-300">
                    Search pearl rings, bracelets, earrings...
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-400">
                  No results found for &ldquo;{query}&rdquo;
                </div>
              ) : (
                results.map((result) => (
                  <Link
                    key={result.id}
                    href={`/products/${result.slug}`}
                    onClick={() => { setIsOpen(false); setQuery(""); }}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition border-b border-gray-100 last:border-b-0"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
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
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate text-gray-900">{result.name}</p>
                      <p className="text-xs text-gray-500">
                        {result.category} — {formatPrice(result.price)}
                      </p>
                    </div>
                    <Search className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  </Link>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-400 text-center">
                Press <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-700">Ctrl+K</kbd> to open search anytime
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
