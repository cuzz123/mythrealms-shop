import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Mountain, Waves, Droplets, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "About MythRealms — From an Ancient Book to Your Wrist",
  description: "The Classic of Mountains and Seas held 550 mountains, countless stones. MythRealms brings those stones from the page to the present — each piece a fragment of an ancient geological treasure map.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-8">
        <Link href="/" className="hover:text-[var(--text)]">Home</Link><span>/</span>
        <span className="text-[var(--text)]">About MythRealms</span>
      </nav>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden mb-16">
        <div className="absolute inset-0">
          <Image
            src="/images/1688-hero/单品1.webp"
            alt="MythRealms curated singles bracelet — one-of-a-kind hand-selected stone jewelry"
            fill
            sizes="(max-width:768px) 100vw, 896px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />
        </div>
        <div className="relative z-10 text-center py-20 px-6">
          <h1 className="font-serif text-5xl font-bold text-white mb-4">From an Ancient Book to Your Wrist</h1>
          <p className="text-xl text-[var(--accent)] font-serif italic mb-6">Every stone carries a story. Ours begin in the Classic of Mountains and Seas.</p>
          <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
            The <span className="italic">Classic of Mountains and Seas</span> (Shan Hai Jing), written
            2,500 years ago, was not merely a bestiary. It was a map of stones. Every mountain held a
            gem. Every river carried a crystal. Every sea guarded a pearl. One book. 277 mythical
            creatures. 550 mountains. Countless stones waiting to be found. MythRealms brings those
            stones from the page to the present — each piece a fragment of an ancient geological
            treasure map, worn not as costume but as connection.
          </p>
        </div>
      </div>

      {/* Four Pillars */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {[
          { icon: Mountain, title: "The Mountains — Stones of Power", desc: "Every mountain in the Classic holds a gem. Jade from Kunlun. Agate from the peaks of the east. Crystal from the summits that touch heaven. We trace the ancient names and bring their stones to the surface — each mountain a source, each stone a piece of living geography." },
          { icon: Waves, title: "The Seas — Pearls of the Dragon Kings", desc: "The four Dragon Kings guard the oceans in Chinese myth. Ao Guang rules the East Sea. Ao Qin commands the South. Ao Run oversees the West. Ao Shun guards the North. Their tears, shed over millennia, became the pearls we string today. Each one carries the depth of an undersea palace." },
          { icon: Droplets, title: "The Rivers — Crystals of the Sky", desc: "Rivers in the Classic carry minerals from the heavens. Crystal, quartz, and moonstone wash down from sacred peaks, polished by the current over thousands of years. Our river-sourced stones carry the clarity of mountain streams and the patience of moving water." },
          { icon: Sparkles, title: "The Beasts — Guardians of Each Stone", desc: "277 creatures populate the Shan Hai Jing. The nine-tailed fox. The qilin. The phoenix. The white tiger. Each one protects a mineral deposit. Each one guards a geological secret. When you wear a MythRealms piece, you wear the stone a mythical beast was said to protect — a quiet inheritance from a world that believed every rock had a keeper." },
        ].map((p) => (
          <div key={p.title} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 text-center">
            <p.icon className="w-10 h-10 text-[var(--accent)] mx-auto mb-4" strokeWidth={1.5} />
            <h3 className="font-serif text-lg font-bold text-[var(--text)] mb-2">{p.title}</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Story Section */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8 mb-16">
        <h2 className="font-serif text-3xl font-bold text-[var(--text)] mb-6 text-center">A Designer Walked Into a Used Bookstore</h2>
        <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
          <p>
            She was not looking for anything in particular. A cramped shop in a back alley.
            Shelves stacked to the ceiling. The smell of old paper. She pulled a tattered
            volume from a pile — the cover half-detached, the pages yellowed at the edges.
            It was a translation of the <span className="italic">Shan Hai Jing</span>, the
            Classic of Mountains and Seas.
          </p>
          <p>
            She was not a historian. She was a jewelry designer. And flipping through the
            brittle pages, she noticed something that generations of scholars had overlooked.
            The book did not just list creatures and legends. It catalogued geology. It told
            you <span className="italic">exactly</span> which mountain produced jade, which
            river held pearls, which peak yielded crystal. It was a mineral survey wrapped in
            mythology — a geological treasure map disguised as a bestiary.
          </p>
          <p>
            She read past midnight. She read through the weekend. The names of mountains
            she had never heard of — Kunlun, Buzhou, the peaks of the Eastern Sea — became
            coordinates on a map only she could see. She started sketching. A bracelet named
            for a dragon king's tear. A necklace inspired by a shattered pillar of the sky.
            A ring that carried the name of a mountain that existed only in myth.
          </p>
          <p>
            MythRealms was born that afternoon in a used bookstore, and every piece we make
            carries that same impulse: the belief that the stones described in a 2,500-year-old
            text are not just archaeology. They are alive. They can be worn. They belong in the
            present.
          </p>
        </div>
      </div>

      {/* Commitment */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {[
          { icon: Mountain, title: "Traced from Ancient Sources", text: "Every stone in our collection corresponds to a named deposit in the Shan Hai Jing. We cross-reference translations, geological surveys, and historical mining records to verify each origin. This is not costume jewelry. This is material heritage." },
          { icon: Waves, title: "Hand-Finished in Small Batches", text: "No warehouses. No mass production. Every bracelet is strung, knotted, and inspected by hand after you order. 1-2 weeks from your click to your doorstep. The stones waited 2,500 years to be found. We can take a week to finish them properly." },
          { icon: Droplets, title: "Ethical Stones, Transparent Supply", text: "Our stones travel trusted supply chains with verified origins. We work exclusively with suppliers who guarantee fair wages, safe conditions, and environmental responsibility. A stone that came from a sacred mountain should not arrive through suffering." },
          { icon: Sparkles, title: "One Founder, Every Piece", text: "MythRealms is run by the designer who found that book. She selects every stone, oversees every design, and personally inspects every finished piece before it ships. No investors. No board. One person who believes that ancient stones still have something to say." },
        ].map((p) => (
          <div key={p.title} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <p.icon className="w-6 h-6 text-[var(--accent)] mb-3" strokeWidth={1.5} />
            <h3 className="font-serif text-lg font-bold text-[var(--text)] mb-2">{p.title}</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{p.text}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center border-t border-[var(--border)] pt-12">
        <h2 className="font-serif text-3xl font-bold text-[var(--text)] mb-3">Find Your Mountain. Wear Its Stone.</h2>
        <p className="text-[var(--text-secondary)] mb-6">The mountain that calls to you is in the Classic. Its stone is here — hand-selected, artisan-finished, ready to ship.</p>
        <div className="flex justify-center gap-4">
          <Link href="/collections/curated-singles" className="px-8 py-3 bg-[var(--accent)] text-white rounded-full font-semibold hover:bg-[var(--accent-hover)] transition">Discover Curated Singles</Link>
          <Link href="/collections" className="px-8 py-3 border border-[var(--border)] text-[var(--text)] rounded-full font-semibold hover:border-[var(--accent)] transition">Explore All Collections</Link>
        </div>
      </div>
    </div>
  );
}
