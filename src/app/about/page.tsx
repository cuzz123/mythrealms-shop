import Link from "next/link";
import Image from "next/image";
import { Gem, Sparkles, Users, Globe, Shield, Award, Clock } from "lucide-react";

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
            src="/images/1688-hero/单品1.png"
            alt=""
            fill
            sizes="(max-width:768px) 100vw, 896px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />
        </div>
        <div className="relative z-10 text-center py-20 px-6">
          <h1 className="font-serif text-5xl font-bold text-white mb-4">MythRealms</h1>
          <p className="text-xl text-[var(--accent)] font-serif italic mb-6">Curated Gemstones. Artisan Craftsmanship. Timeless Beauty.</p>
          <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
            Every stone carries a story millions of years in the making. From the depths of the earth
            to your wrist, natural gemstones have been treasured across cultures for their beauty,
            their energy, and their quiet power. MythRealms brings you hand-selected crystal bracelets
            — each bead chosen, each piece finished by hand, each design a personal talisman for the
            modern mystic.
          </p>
        </div>
      </div>

      {/* Three Pillars */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {[
          { icon: Gem, title: "Natural Stones", desc: "Every bracelet begins with the stone. We source amethyst, rose quartz, black obsidian, moonstone, tiger's eye, and more from ethical mines around the world. Each bead is individually inspected for quality, color, and character before it earns a place in our collection." },
          { icon: Sparkles, title: "Artisan Finishes", desc: "925 sterling silver accents. Gold-plated spacers. Hand-knotted silk cord. We believe jewelry should feel substantial — so we use materials that hold their beauty through years of daily wear." },
          { icon: Clock, title: "Handcrafted to Order", desc: "No warehouses. No mass production. Every bracelet is strung, finished, and inspected by hand after you order. 1-2 weeks from your click to your doorstep. This is slow luxury." },
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
        <h2 className="font-serif text-3xl font-bold text-[var(--text)] mb-6 text-center">The Story</h2>
        <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
          <p>
            The idea for MythRealms was born in a small gem market on a winding back street.
            A vendor with calloused hands and knowing eyes held out a strand of raw amethyst —
            deep purple catching the afternoon light — and said simply, "This one is for clarity."
            Not for decoration. For clarity. It was the first time jewelry had been presented
            as something more than an accessory.
          </p>
          <p>
            That moment sparked a question: what if every piece of jewelry could be more than
            beautiful? What if each bracelet could carry intention — a small reminder on your
            wrist of what you are cultivating in yourself? Clarity. Protection. Love. Confidence.
            Transformation. These are not just words. They are anchors.
          </p>
          <p>
            The question was not "why create a jewelry brand around this?" The question was "why had no one done it with this level of care before?"
          </p>
          <p>
            MythRealms exists at the intersection of natural beauty and intentional design.
            Every stone is chosen for its character as much as its appearance. Every bracelet
            is finished by hand because machines cannot feel when a knot is too tight or a bead
            sits off-angle. Every piece that leaves our hands carries the energy of the person
            who made it — and the hope that it finds the person it was meant for.
          </p>
        </div>
      </div>

      {/* Commitment */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {[
          { icon: Shield, title: "Our Promise", text: "If your bracelet arrives with any defect, we replace it free. If it does not feel like yours, return it within 30 days. If it breaks within a year, we repair it. Jewelry should outlast us." },
          { icon: Globe, title: "Ethical Sourcing", text: "Our stones travel trusted supply chains — from Brazilian amethyst mines to Madagascan rose quartz quarries. We work exclusively with suppliers who guarantee fair wages, safe conditions, and environmental responsibility." },
          { icon: Users, title: "One Woman Atelier", text: "MythRealms is run by a single founder who selects every stone, oversees every design, and personally inspects every finished piece. No corporate board. No investors. Just one person obsessed with bringing exceptional natural stones to the people who need them." },
          { icon: Award, title: "Limited Editions", text: "Our seasonal collections are produced in small batches. Once a stone batch sells out, the exact combination of color and character may never be replicated. Each bracelet is one of a kind in its own way." },
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
        <h2 className="font-serif text-3xl font-bold text-[var(--text)] mb-3">Find Your Stone</h2>
        <p className="text-[var(--text-secondary)] mb-6">The bracelet that speaks to you is out there — hand-selected, artisan-finished, and ready to ship.</p>
        <div className="flex justify-center gap-4">
          <Link href="/collections/curated-singles" className="px-8 py-3 bg-[var(--accent)] text-white rounded-full font-semibold hover:bg-[var(--accent-hover)] transition">Explore the Collection</Link>
          <Link href="/products" className="px-8 py-3 border border-[var(--border)] text-[var(--text)] rounded-full font-semibold hover:border-[var(--accent)] transition">Shop All</Link>
        </div>
      </div>
    </div>
  );
}
