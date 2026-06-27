import Link from "next/link";
import type { Metadata } from "next";
import { PRODUCTS } from "@/lib/1688-products";

export const metadata: Metadata = {
  title: "Page Not Found — MythRealms",
};

export default function NotFoundPage() {
  // First product image per category for link thumbnails
  const categoryLinks = [
    { slug: "pearl-series", label: "Pearl Collection" },
    { slug: "luxe-collection", label: "Luxe Collection" },
    { slug: "pearl-crystal-series", label: "Pearl & Crystal" },
    { slug: "curated-singles", label: "Curated Singles" },
  ].map((c) => {
    const first = PRODUCTS.find((p) => p.category === c.slug);
    return { ...c, thumb: first?.image };
  });
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-lg mx-auto text-center">
        {/* Icon */}
        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-[var(--surface)] border border-[var(--border)]">
          <span className="font-serif text-5xl text-[var(--text-muted)]">?</span>
        </div>

        <h1 className="font-serif text-4xl font-bold text-[var(--text)] mb-4">
          Page Not Found
        </h1>

        <p className="text-[var(--text-secondary)] leading-relaxed mb-8 max-w-sm mx-auto">
          The page you are looking for does not exist in this realm. Perhaps it has vanished into myth, or maybe the path was never here at all.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-[var(--primary-hover)] transition"
        >
          Return to Home
        </Link>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-[var(--border-light)]">
          <p className="text-sm text-[var(--text-muted)] mb-4">You might be looking for:</p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {categoryLinks.map((c) => (
              <Link
                key={c.slug}
                href={`/collections/${c.slug}`}
                className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text)] transition group"
              >
                {c.thumb && (
                  <span className="w-10 h-10 rounded-lg overflow-hidden bg-[var(--surface)] border border-[var(--border)] flex-shrink-0">
                    <img src={c.thumb} alt="" className="w-full h-full object-cover" />
                  </span>
                )}
                <span className="underline underline-offset-2 group-hover:no-underline">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
