import type { Metadata } from "next";
import Link from "next/link"
import { CATEGORIES } from "@/lib/1688-products"

export const metadata: Metadata = {
  title: "All Collections — MythRealms",
  description: "Explore our complete range of hand-selected gemstone jewelry — Pearl Collection, Luxe Collection, Pearl & Crystal Series, and Curated Singles.",
};

export default function CollectionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl font-bold text-[var(--text)] mb-2">All Collections</h1>
      <p className="text-[var(--text-muted)] mb-10">Explore our complete range of hand-selected gemstone jewelry</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map(cat => (
          <Link key={cat.slug} href={`/collections/${cat.slug}`}
            className="group bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8 hover:border-[var(--accent)] transition">
            <h2 className="font-serif text-xl font-semibold text-[var(--text)] mb-2">{cat.name}</h2>
            {cat.description && <p className="text-sm text-[var(--text-muted)]">{cat.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  )
}
