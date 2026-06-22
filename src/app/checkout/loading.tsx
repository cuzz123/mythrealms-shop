export default function CheckoutLoading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-10 bg-[#2A2520] rounded" />
        <div className="h-4 w-4">/</div>
        <div className="h-4 w-10 bg-[#2A2520] rounded" />
        <div className="h-4 w-4">/</div>
        <div className="h-4 w-20 bg-[#2A2520] rounded" />
      </div>

      {/* Title */}
      <div className="h-10 w-48 bg-[#2A2520] rounded mb-8" />

      {/* Crafted to order notice */}
      <div className="h-16 w-full bg-[#2A2520] rounded-lg mb-6" />

      {/* Main 2-column layout */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
        {/* Left Column - Contact + Shipping */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-[#1A1816] border border-[#2A2520] rounded-xl p-6 space-y-4">
            <div className="h-7 w-48 bg-[#2A2520] rounded" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 w-24 bg-[#2A2520] rounded" />
                <div className="h-11 w-full bg-[#2A2520] rounded-lg" />
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div className="bg-[#1A1816] border border-[#2A2520] rounded-xl p-6 space-y-4">
            <div className="h-7 w-40 bg-[#2A2520] rounded" />
            {Array.from({ length: 1 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <div className="h-3 w-24 bg-[#2A2520] rounded" />
                <div className="h-11 w-full bg-[#2A2520] rounded-lg" />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 w-16 bg-[#2A2520] rounded" />
                  <div className="h-11 w-full bg-[#2A2520] rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="sticky top-24 bg-[#1A1816] border border-[#2A2520] rounded-xl p-6 space-y-4">
          <div className="h-7 w-36 bg-[#2A2520] rounded pb-3 border-b border-[#2A2520]" />

          {/* Cart items */}
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-12 h-12 rounded bg-[#2A2520] flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-full bg-[#2A2520] rounded" />
                  <div className="h-3 w-24 bg-[#2A2520] rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Discount code */}
          <div className="border-t border-[#2A2520] pt-4 space-y-2">
            <div className="h-3 w-28 bg-[#2A2520] rounded" />
            <div className="flex gap-2">
              <div className="flex-1 h-10 bg-[#2A2520] rounded-lg" />
              <div className="w-20 h-10 bg-[#2A2520] rounded-lg" />
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-[#2A2520] pt-4 space-y-2">
            <div className="flex justify-between">
              <div className="h-4 w-16 bg-[#2A2520] rounded" />
              <div className="h-4 w-16 bg-[#2A2520] rounded" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 w-16 bg-[#2A2520] rounded" />
              <div className="h-4 w-12 bg-[#2A2520] rounded" />
            </div>
            <div className="flex justify-between pt-2 border-t border-[#2A2520]">
              <div className="h-6 w-12 bg-[#2A2520] rounded" />
              <div className="h-6 w-16 bg-[#2A2520] rounded" />
            </div>
          </div>

          {/* Payment method */}
          <div className="space-y-2">
            <div className="h-3 w-32 bg-[#2A2520] rounded" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-12 bg-[#2A2520] rounded-lg" />
              <div className="h-12 bg-[#2A2520] rounded-lg" />
            </div>
          </div>

          {/* Pay button */}
          <div className="h-14 w-full bg-[#2A2520] rounded-lg" />
        </div>
      </div>
    </div>
  );
}
