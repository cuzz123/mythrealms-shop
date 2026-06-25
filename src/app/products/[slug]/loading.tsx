export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-3.5 w-10 bg-[#2A2520] rounded" />
        <div className="h-3.5 w-20 bg-[#2A2520] rounded" />
        <div className="h-3.5 w-32 bg-[#2A2520] rounded" />
      </div>

      {/* Product main: 2-column match to 1688 layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Image skeleton — aspect-square */}
        <div>
          <div className="aspect-square rounded-xl bg-[#2A2520]" />
          {/* Thumbnail row */}
          <div className="grid grid-cols-6 gap-2 mt-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-[#2A2520]" />
            ))}
          </div>
        </div>

        {/* Right: Product info skeleton */}
        <div className="space-y-4">
          {/* Category label */}
          <div className="h-3 w-24 bg-[#2A2520] rounded" />

          {/* Product name + share button row */}
          <div className="flex items-start gap-2">
            <div className="h-9 w-3/4 bg-[#2A2520] rounded flex-1" />
            <div className="h-9 w-9 rounded-full bg-[#2A2520] shrink-0" />
          </div>

          {/* Price */}
          <div className="h-8 w-32 bg-[#2A2520] rounded" />

          {/* Social proof line */}
          <div className="h-3.5 w-48 bg-[#2A2520] rounded" />

          {/* Delivery estimate line */}
          <div className="h-3.5 w-64 bg-[#2A2520] rounded" />

          {/* Description lines */}
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full bg-[#2A2520] rounded" />
            <div className="h-4 w-5/6 bg-[#2A2520] rounded" />
            <div className="h-4 w-2/3 bg-[#2A2520] rounded" />
            <div className="h-4 w-3/4 bg-[#2A2520] rounded" />
          </div>

          {/* Care note box */}
          <div className="h-16 w-full bg-[#1A1812] rounded-lg border border-[#3A3220]" />

          {/* Details badge */}
          <div className="h-12 w-full bg-[#2A2520] rounded-lg" />

          {/* Qty + Add to Cart */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="h-4 w-8 bg-[#2A2520] rounded" />
              <div className="h-10 w-28 bg-[#2A2520] rounded-lg" />
            </div>
            <div className="h-[52px] w-full bg-[#2A2520] rounded-lg" />
          </div>

          {/* Trust signals row */}
          <div className="flex items-center gap-4 pt-2">
            <div className="h-3 w-32 bg-[#2A2520] rounded" />
            <div className="h-3 w-36 bg-[#2A2520] rounded" />
            <div className="h-3 w-28 bg-[#2A2520] rounded" />
          </div>

          {/* Story link */}
          <div className="h-[72px] w-full bg-[#1A1812] rounded-lg border border-[#3A3220]" />

          {/* Details accordion */}
          <div className="h-14 w-full bg-[#2A2520] rounded-lg" />
        </div>
      </div>

      {/* Related products skeleton */}
      <section className="mt-16 pt-12 border-t border-[#2A2520]">
        <div className="h-8 w-48 bg-[#2A2520] rounded mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2.5">
              <div className="aspect-square bg-[#2A2520] rounded-xl" />
              <div className="h-4 w-full bg-[#2A2520] rounded" />
              <div className="h-3.5 w-1/3 bg-[#2A2520] rounded" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
