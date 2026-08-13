"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { imageUrl } from "@/lib/images";
import { searchStorefrontProducts } from "@/lib/storefront/search";
import Link from "next/link";
import { useDialogFocus } from "@/lib/client/use-dialog-focus";

export function SearchOverlay({ isScrolled }: { isScrolled?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const results = useMemo(() => searchStorefrontProducts(query), [query]);

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
        className={`flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)] focus-visible:ring-offset-2 ${isScrolled ? "text-[var(--text-secondary)] hover:bg-[var(--surface-alt)] hover:text-[var(--text)]" : "text-white/80 hover:bg-white/10 hover:text-white focus-visible:ring-offset-transparent"}`}
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[200] overflow-y-auto bg-[var(--overlay)] px-4 py-5 animate-fade-in sm:px-6 sm:py-12"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
          id="search-overlay"
        >
          <div
            ref={dialogRef}
            className="mx-auto w-full max-w-2xl overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text)] shadow-[var(--shadow-xl)] animate-slide-up sm:mt-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input */}
            <form onSubmit={handleSubmit} className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3 sm:px-5">
              <Search className="h-5 w-5 shrink-0 text-[var(--text-muted)]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pearl jewelry..."
                className="min-w-0 flex-1 border-none bg-transparent text-base text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-alt)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)]"
                aria-label="Close search"
                title="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </form>

            {/* Results */}
            <div className="max-h-[min(28rem,calc(100vh-10rem))] overflow-y-auto">
              {query.length < 2 ? (
                <div className="p-8 text-center sm:p-10">
                  <p className="font-serif text-2xl text-[var(--text-muted)] sm:text-[28px]">
                    Search pearl rings, bracelets, earrings...
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="p-6 text-center text-sm text-[var(--text-muted)]">
                  No results found for &ldquo;{query}&rdquo;
                </div>
              ) : (
                results.map((result) => (
                  <Link
                    key={result.id}
                    href={`/products/${result.slug}`}
                    onClick={() => { setIsOpen(false); setQuery(""); }}
                    className="flex min-h-[72px] items-center gap-4 border-b border-[var(--border)] px-4 py-3 transition-colors last:border-b-0 hover:bg-[var(--surface-alt)] sm:px-5"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--surface-alt)]">
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
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-[var(--text-muted)]">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[var(--text)]">{result.name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {result.category} — {formatPrice(result.price)}
                      </p>
                    </div>
                    <Search className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                  </Link>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 sm:px-5">
              <p className="text-center text-xs text-[var(--text-muted)]">
                Press <kbd className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-raised)] px-1.5 py-0.5 text-[10px] text-[var(--text-secondary)]">Ctrl+K</kbd> to open search anytime
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
