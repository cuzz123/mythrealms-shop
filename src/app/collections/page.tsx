import Link from "next/link"
import { db } from "@/lib/db"
import { CATEGORIES } from "@/lib/1688-products"

export const dynamic = "force-dynamic"

export default async function CollectionsPage() {
  const dbCategories = await db.category.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
  })

  // Merge 1688 static categories
  const allCategories = [
    ...CATEGORIES.map(c => ({ id: c.slug, name: c.name, slug: c.slug, description: c.description, is1688: true })),
    ...dbCategories.map(c => ({ id: c.id, name: c.name, slug: c.slug, description: c.description, is1688: false })),
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl font-bold text-[var(--text)] mb-2">All Collections</h1>
      <p className="text-[var(--text-muted)] mb-10">Explore our complete range of hand-selected gemstone jewelry</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allCategories.map(cat => (
          <Link key={cat.id} href={`/collections/${cat.slug}`}
            className="group bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8 hover:border-[var(--accent)] transition">
            <h2 className="font-serif text-xl font-semibold text-[var(--text)] mb-2">{cat.name}</h2>
            {cat.description && <p className="text-sm text-[var(--text-muted)]">{cat.description}</p>}
            {cat.is1688 && <span className="inline-block mt-2 text-[10px] bg-[var(--accent)]/20 text-[var(--accent)] px-2 py-0.5 rounded-full">New</span>}
          </Link>
        ))}
      </div>
    </div>
  )
}
