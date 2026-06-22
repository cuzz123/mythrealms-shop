export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0F0D0E]">
      {/* Hero skeleton */}
      <div className="relative h-[70vh] max-h-[700px] overflow-hidden bg-[#0A0808] animate-pulse">
        <div className="absolute inset-0 bg-[#1A1816]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0D0E] to-transparent" />
      </div>

      {/* Trust bar skeleton */}
      <div className="bg-[#0A0808] border-b border-[#2A2520]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-center gap-8 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-3 w-32 bg-[#1A1816] rounded" />
          ))}
        </div>
      </div>

      {/* Guardian Teaser skeleton */}
      <div className="py-12 bg-[#1A1816] border-b border-[#2A2520] animate-pulse">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-4">
          <div className="h-8 w-64 bg-[#2A2520] rounded mx-auto" />
          <div className="h-4 w-96 bg-[#2A2520] rounded mx-auto" />
          <div className="h-12 w-48 bg-[#2A2520] rounded-lg mx-auto mt-4" />
        </div>
      </div>

      {/* New Arrivals grid skeleton */}
      <section className="py-14 bg-[#1A1816]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8 animate-pulse">
            <div className="h-10 w-48 bg-[#2A2520] rounded" />
            <div className="h-5 w-32 bg-[#2A2520] rounded hidden sm:block" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-xl bg-[#2A2520]" />
                <div className="mt-2.5 px-1 space-y-2">
                  <div className="h-4 w-2/3 bg-[#2A2520] rounded" />
                  <div className="h-3 w-full bg-[#2A2520] rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wear the Look skeleton */}
      <section className="py-12 bg-[#0F0D0E] border-t border-[#2A2520]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6 animate-pulse space-y-2">
            <div className="h-4 w-32 bg-[#1A1816] rounded mx-auto" />
            <div className="h-8 w-64 bg-[#1A1816] rounded mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] rounded-xl bg-[#1A1816]" />
                <div className="mt-3 space-y-1">
                  <div className="h-5 w-2/3 bg-[#1A1816] rounded" />
                  <div className="h-3 w-full bg-[#1A1816] rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter skeleton */}
      <section className="py-12 bg-[#1A1816]">
        <div className="max-w-[540px] mx-auto px-6 text-center animate-pulse space-y-4">
          <div className="h-8 w-64 bg-[#2A2520] rounded mx-auto" />
          <div className="h-4 w-80 bg-[#2A2520] rounded mx-auto" />
          <div className="h-12 w-full bg-[#2A2520] rounded-lg" />
        </div>
      </section>
    </div>
  );
}
