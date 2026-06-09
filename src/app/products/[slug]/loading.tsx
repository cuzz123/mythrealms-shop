export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="flex gap-2 mb-8">
        <div className="h-4 w-12 bg-[var(--border)] rounded" />
        <div className="h-4 w-20 bg-[var(--border)] rounded" />
        <div className="h-4 w-40 bg-[var(--border)] rounded" />
      </div>

      {/* Product main skeleton */}
      <div className="grid lg:grid-cols-2 gap-12 pb-12">
        {/* Gallery skeleton */}
        <div className="aspect-[3/4] bg-[var(--border)] rounded-[var(--radius-lg)]" />

        {/* Info skeleton */}
        <div className="space-y-4">
          <div className="h-8 w-3/4 bg-[var(--border)] rounded" />
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 w-4 bg-[var(--border)] rounded" />
            ))}
          </div>
          <div className="h-10 w-1/3 bg-[var(--border)] rounded" />
          <div className="space-y-2 mt-6">
            <div className="h-12 w-full bg-[var(--border)] rounded-full" />
            <div className="h-12 w-full bg-[var(--border)] rounded-full" />
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-28 bg-[var(--border)] rounded" />
        ))}
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-[var(--border)] rounded" />
        <div className="h-4 w-5/6 bg-[var(--border)] rounded" />
        <div className="h-4 w-4/6 bg-[var(--border)] rounded" />
      </div>
    </div>
  );
}
