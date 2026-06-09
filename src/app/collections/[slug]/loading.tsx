export default function CollectionLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex gap-2 mb-4">
        <div className="h-4 w-12 bg-[var(--border)] rounded" />
        <div className="h-4 w-32 bg-[var(--border)] rounded" />
      </div>

      {/* Title */}
      <div className="h-10 w-64 bg-[var(--border)] rounded mb-2" />
      <div className="h-5 w-96 bg-[var(--border)] rounded mb-8" />

      {/* Toolbar */}
      <div className="flex justify-between mb-6">
        <div className="h-10 w-24 bg-[var(--border)] rounded-full" />
        <div className="h-10 w-40 bg-[var(--border)] rounded-full" />
      </div>

      {/* Product grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-[3/4] bg-[var(--border)] rounded-[var(--radius-lg)]" />
            <div className="h-4 w-3/4 bg-[var(--border)] rounded" />
            <div className="h-4 w-1/3 bg-[var(--border)] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
