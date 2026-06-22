export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 py-4">
        <div className="h-4 w-12 bg-[#2A2520] rounded" />
        <div className="h-4 w-20 bg-[#2A2520] rounded" />
        <div className="h-4 w-40 bg-[#2A2520] rounded" />
      </div>

      {/* Product main: 2-column layout */}
      <div className="grid lg:grid-cols-2 gap-12 pb-12">
        {/* Left: Gallery skeleton */}
        <div className="space-y-3">
          <div className="aspect-square rounded-xl bg-[#2A2520]" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-20 h-20 rounded-lg bg-[#2A2520] flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Right: Product info skeleton */}
        <div className="space-y-5">
          {/* Product name */}
          <div className="h-9 w-3/4 bg-[#2A2520] rounded" />

          {/* Stars */}
          <div className="flex gap-1 items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-5 h-5 bg-[#2A2520] rounded" />
            ))}
            <div className="h-5 w-20 bg-[#2A2520] rounded ml-2" />
          </div>

          {/* Guardian tag badge */}
          <div className="h-8 w-64 bg-[#2A2520] rounded-lg" />

          {/* Options label + variants */}
          <div className="space-y-3">
            <div className="h-4 w-20 bg-[#2A2520] rounded" />
            <div className="h-12 w-full bg-[#2A2520] rounded-lg" />
          </div>

          {/* Crafted to order notice */}
          <div className="h-10 w-full bg-[#2A2520] rounded-lg" />

          {/* Add to cart button */}
          <div className="h-14 w-full bg-[#2A2520] rounded-lg" />

          {/* Trust signals */}
          <div className="flex items-center gap-4">
            <div className="h-4 w-36 bg-[#2A2520] rounded" />
            <div className="h-4 w-40 bg-[#2A2520] rounded" />
            <div className="h-4 w-28 bg-[#2A2520] rounded" />
          </div>

          {/* Mythical Legend badge */}
          <div className="h-16 w-full bg-[#1A1812] rounded-lg border border-[#3A3220]" />
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="border-t border-[#2A2520] pt-8" id="tabs">
        <div className="flex gap-4 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 w-28 bg-[#2A2520] rounded" />
          ))}
        </div>
        <div className="space-y-3 max-w-3xl">
          <div className="h-4 w-full bg-[#2A2520] rounded" />
          <div className="h-4 w-5/6 bg-[#2A2520] rounded" />
          <div className="h-4 w-2/3 bg-[#2A2520] rounded" />
          <div className="h-4 w-3/4 bg-[#2A2520] rounded mt-6" />
          <div className="h-4 w-full bg-[#2A2520] rounded" />
        </div>
      </div>

      {/* Reviews skeleton */}
      <section className="py-12 border-t border-[#2A2520] mt-8">
        <div className="h-8 w-56 bg-[#2A2520] rounded mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-[#1A1816] border border-[#2A2520] rounded-lg p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2A2520]" />
                <div className="space-y-1.5">
                  <div className="h-4 w-24 bg-[#2A2520] rounded" />
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div key={j} className="w-4 h-4 bg-[#2A2520] rounded" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="h-4 w-full bg-[#2A2520] rounded" />
              <div className="h-4 w-3/4 bg-[#2A2520] rounded" />
            </div>
          ))}
        </div>
      </section>

      {/* Related products skeleton */}
      <section className="py-12 border-t border-[#2A2520]">
        <div className="h-8 w-48 bg-[#2A2520] rounded mb-6" />
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-60 space-y-2">
              <div className="aspect-square bg-[#2A2520] rounded-lg" />
              <div className="h-4 w-full bg-[#2A2520] rounded" />
              <div className="h-4 w-1/3 bg-[#2A2520] rounded" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
