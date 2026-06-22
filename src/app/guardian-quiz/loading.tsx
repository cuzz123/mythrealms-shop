export default function GuardianQuizLoading() {
  return (
    <div className="min-h-screen bg-[#0F0D0E] py-12 animate-pulse">
      <div className="max-w-2xl mx-auto px-6">
        {/* Title */}
        <div className="text-center space-y-4 mb-10">
          <div className="h-10 w-64 bg-[#2A2520] rounded mx-auto" />
          <div className="h-5 w-80 bg-[#2A2520] rounded mx-auto" />
        </div>

        {/* Quiz card */}
        <div className="bg-[#1A1816] border border-[#2A2520] rounded-xl p-8 space-y-6">
          {/* Progress bar */}
          <div className="h-2 w-full bg-[#0F0D0E] rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-[#3A3220] rounded-full" />
          </div>

          {/* Question */}
          <div className="space-y-3">
            <div className="h-6 w-3/4 bg-[#2A2520] rounded" />
            <div className="h-4 w-full bg-[#2A2520] rounded" />
          </div>

          {/* Options */}
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-16 w-full bg-[#2A2520] rounded-lg"
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t border-[#2A2520]">
            <div className="h-10 w-24 bg-[#2A2520] rounded-lg" />
            <div className="h-10 w-24 bg-[#2A2520] rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
