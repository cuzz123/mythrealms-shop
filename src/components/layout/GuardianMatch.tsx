import Link from "next/link";

const pairings = [
  { beast: "Phoenix", slug: "phoenix-rebirth-necklace", label: "For the one rebuilding from ashes", line: "This time, you rise on your own terms.", img: "/images/products/phoenix.png" },
  { beast: "Nine-Tailed Fox", slug: "nine-tailed-fox-pendant", label: "For the one who's been underestimated", line: "2000 years of wisdom. Now yours.", img: "/images/products/nine-tailed-fox.png" },
  { beast: "Black Tortoise", slug: "black-tortoise-endurance-bracelet", label: "For the one still standing", line: "Endurance is a quiet kind of power.", img: "/images/products/black-tortoise.png" },
  { beast: "Kun Peng", slug: "kun-peng-transformation-set", label: "For the one in a season of change", line: "From the depths to the sky. Your time is now.", img: "/images/products/m5-water.png" },
];

export function GuardianMatch() {
  return (
    <section className="py-12 bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[#D4A84B] uppercase mb-3">
            Find Your Guardian
          </span>
          <h2 className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-[#E8E0D5]">
            Which Beast Were You Born To Wear?
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {pairings.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="group bg-[var(--bg)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--accent)]/40 transition-all"
            >
              <div className="aspect-square bg-[var(--border-light)] overflow-hidden">
                <img src={p.img} alt={p.beast} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4">
                <div className="text-xs text-[var(--accent)] font-semibold tracking-[0.08em] uppercase mb-1.5">
                  {p.beast}
                </div>
                <p className="text-sm font-serif text-[var(--text)] mb-1 group-hover:text-[var(--accent)] transition-colors">
                  &ldquo;{p.label}&rdquo;
                </p>
                <p className="text-xs text-[var(--text-muted)] italic">{p.line}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
