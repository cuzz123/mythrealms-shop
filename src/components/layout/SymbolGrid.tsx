import Link from "next/link";

const symbols = [
  { name: "Azure Dragon", href: "/products/azure-dragon-ring", img: "/images/hero/azure-dragon.webp" },
  { name: "Phoenix", href: "/products/phoenix-rebirth-necklace", img: "/images/hero/phoenix.webp" },
  { name: "White Tiger", href: "/products/white-tiger-guardian-cuff", img: "/images/hero/white-tiger.webp" },
  { name: "Black Tortoise", href: "/products/black-tortoise-endurance-bracelet", img: "/images/hero/black-tortoise.webp" },
  { name: "Nine-Tailed Fox", href: "/products/nine-tailed-fox-pendant", img: "/images/hero/nine-tailed-fox.webp" },
  { name: "Qilin", href: "/products/qilin-protection-bracelet", img: "/images/hero/qilin.webp" },
  { name: "Bai Ze", href: "/products/bai-ze-wisdom-talisman", img: "/images/hero/bai-ze.webp" },
  { name: "Kun Peng", href: "/products/kun-peng-transformation-set", img: "/images/hero/kun-peng.webp" },
  { name: "Taotie", href: "/products/taotie-bronze-amulet", img: "/images/hero/taotie.webp" },
  { name: "Yinglong", href: "/products/yinglong-winged-dragon-cufflinks", img: "/images/hero/yinglong.webp" },
];

export function SymbolGrid() {
  return (
    <section id="symbol-grid" className="py-16 bg-[var(--surface)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl font-bold text-[var(--text)] mb-2">
            Explore by Mythical Beast
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Discover jewelry and decor inspired by the creatures of Shan Hai Jing
          </p>
        </div>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
          {symbols.map((s) => (
            <Link
              key={s.name}
              href={s.href}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center overflow-hidden group-hover:border-[var(--accent)] group-hover:shadow-md transition">
                {s.img ? (
                  <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl text-[var(--text-muted)]">{s.name[0]}</span>
                )}
              </div>
              <span className="text-[11px] text-[var(--text-secondary)] text-center leading-tight group-hover:text-[var(--text)] transition">
                {s.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
