import Link from "next/link";

const pairings = [
  { beast: "White Tiger", slug: "white-tiger-guardian-cuff", label: "For the one who's always the strong one", line: "You carry everyone. Who carries you?" },
  { beast: "Phoenix", slug: "phoenix-rebirth-necklace", label: "For the one rebuilding from ashes", line: "This time, you rise on your own terms." },
  { beast: "Bai Ze", slug: "bai-ze-wisdom-talisman", label: "For the one who sees what others miss", line: "Knowledge is your armor. Wear it." },
  { beast: "Nine-Tailed Fox", slug: "nine-tailed-fox-pendant", label: "For the one who's been underestimated", line: "2000 years of wisdom. Now yours." },
  { beast: "Kun Peng", slug: "kun-peng-transformation-set", label: "For the one in a season of change", line: "From the depths to the sky. Your time is now." },
  { beast: "Black Tortoise", slug: "black-tortoise-endurance-bracelet", label: "For the one still standing", line: "Endurance is a quiet kind of power." },
];

export function GuardianMatch() {
  return (
    <section className="py-20 bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[#D4A84B] uppercase mb-4">
            Find Your Guardian
          </span>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold text-[#E8E0D5] mb-4">
            Which Beast Were You Born To Wear?
          </h2>
          <p className="text-[1.0625rem] text-[#A89880] max-w-[580px] mx-auto leading-relaxed">
            The Classic of Mountains and Seas says each creature guards a part of the human soul.
            Read the lines below. The one that stops you — that's yours.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pairings.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="group relative bg-[var(--bg)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all duration-300"
            >
              <div className="text-xs text-[var(--accent)] font-semibold tracking-[0.08em] uppercase mb-3">
                {p.beast}
              </div>
              <div className="text-lg font-serif font-semibold text-[var(--text)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                &ldquo;{p.label}&rdquo;
              </div>
              <div className="text-sm text-[var(--text-muted)] italic">
                {p.line}
              </div>
              <div className="mt-4 text-xs text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                Discover your {p.beast} →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
