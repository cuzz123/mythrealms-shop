/**
 * Global loading skeleton.
 *
 * This is shown as a Suspense fallback for any page transition. It intentionally
 * uses a generic product-grid layout so it works across the homepage, collection
 * pages, and search results. Each section below can be refined per-route via
 * route-specific loading.tsx files if more accurate skeletons are needed later.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0F0D0E]">
      {/* Generic page header skeleton */}
      <div className="py-10 bg-[#1A1816] border-b border-[#2A2520] animate-pulse">
        <div className="max-w-7xl mx-auto px-6 space-y-3">
          <div className="h-8 w-48 bg-[#2A2520] rounded mx-auto" />
          <div className="h-4 w-64 bg-[#2A2520] rounded mx-auto" />
        </div>
      </div>

      {/* Product grid skeleton — generic enough for any listing page */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-xl bg-[#1A1816]" />
                <div className="mt-2.5 px-1 space-y-2">
                  <div className="h-4 w-2/3 bg-[#1A1816] rounded" />
                  <div className="h-3 w-full bg-[#1A1816] rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
