"use client";

import { useRouter } from "next/navigation";

export function CollectionToolbar({
  total,
  sort,
  slug,
}: {
  total: number;
  sort: string;
  slug: string;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between py-4 border-t border-[var(--border)] mb-6 gap-4 flex-wrap">
      <div className="flex items-center gap-4">
        <span className="text-sm text-[var(--text-muted)]">
          {total.toLocaleString()} products
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-[var(--text-muted)]">Sort by:</span>
        <select
          className="text-sm border border-[var(--border)] rounded-full px-4 py-2 bg-[var(--bg)] text-[var(--text)] cursor-pointer"
          value={sort}
          onChange={(e) => {
            router.push(`/collections/${slug}?sort=${e.target.value}`);
          }}
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price, low to high</option>
          <option value="price-high">Price, high to low</option>
          <option value="newest">Newest</option>
          <option value="a-z">A-Z</option>
          <option value="z-a">Z-A</option>
        </select>
      </div>
    </div>
  );
}
