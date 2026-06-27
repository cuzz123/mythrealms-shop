import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Gem, Sparkles, Clock, User } from "lucide-react";

export const metadata: Metadata = {
  title: "About MythRealms — Stones With Intention. Wear Your Becoming.",
  description: "We create intention pieces — wearable reminders of who you are becoming. Each stone carries a singular purpose. Protection, love, clarity, abundance — choose yours.",
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
            alt="MythRealms intention bracelet — hand-selected stone with purpose"
            fill
            sizes="(max-width:768px) 100vw, 896px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />
        </div>
        <div className="relative z-10 text-center py-20 px-6">
          <h1 className="font-serif text-5xl font-bold text-white mb-4">Stones With Intention. Wear Your Becoming.</h1>
          <p className="text-xl text-[var(--accent)] font-serif italic mb-6">You are not just wearing a bracelet. You are wearing a practice.</p>
          <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
            One stone. One intention. One daily reminder of who you are becoming.
            Protection. Clarity. Love. Confidence. Abundance. Renewal. Choose the
            intention that names what you need most right now. Wear it every day. Let
            it anchor the person you are growing into — not who you used to be, but
            who you are choosing to become.
          </p>
        </div>
      </div>

      {/* Four Pillars */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {[
          { icon: Gem, title: "The Intentions — Six Paths to Yourself", descNode: <>Every MythRealms piece begins with a single intention. <Link href="/collections/curated-singles" className="text-[var(--accent)] hover:underline">Protection</Link>. Love. Clarity. Confidence. Renewal. Abundance. You do not buy a bracelet because you like how it looks. You choose it because it names something true about where you are right now — and where you are trying to go.</> },
          { icon: Sparkles, title: "The Stones — Nature's Vocabulary", descNode: <>Each stone carries a meaning refined over centuries. Black obsidian absorbs and protects. Rose quartz opens and softens. Amethyst quiets and clarifies. Tiger's eye steadies and focuses. Moonstone renews and transforms. Green aventurine attracts and receives. We select each stone for its quality and its energy — hand-picked, never mass-sourced.</> },
          { icon: Clock, title: "The Practice — A Daily Ritual", descNode: <>The bracelet is not the practice. The practice is what you do with it. Hold it each morning. Name one thing you are releasing. One thing you are inviting. Put it on. Move through your day with the stone against your skin — a constant, quiet reminder of the intention you set when the day was new. This is not jewelry. This is showing up for yourself.</> },
          { icon: User, title: "The Archetypes — Six Versions of You", descNode: <>The <Link href="/products/curated-singles-01" className="text-[var(--accent)] hover:underline">Watchman</Link>. The <Link href="/products/curated-singles-02" className="text-[var(--accent)] hover:underline">Heart Opener</Link>. The <Link href="/products/curated-singles-03" className="text-[var(--accent)] hover:underline">Seer</Link>. The <Link href="/products/curated-singles-04" className="text-[var(--accent)] hover:underline">Phoenix</Link>. The <Link href="/products/curated-singles-05" className="text-[var(--accent)] hover:underline">Strategist</Link>. The <Link href="/products/curated-singles-06" className="text-[var(--accent)] hover:underline">Lion's Share</Link>. Six archetypes. Six intentions. You may be more than one — but one is calling to you right now. That is the one you start with.</> },
        ].map((p) => (
          <div key={p.title} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 text-center">
            <p.icon className="w-10 h-10 text-[var(--accent)] mx-auto mb-4" strokeWidth={1.5} />
            <h3 className="font-serif text-lg font-bold text-[var(--text)] mb-2">{p.title}</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{p.descNode}</p>
          </div>
        ))}
      </div>

      {/* Story Section */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8 mb-16">
        <h2 className="font-serif text-3xl font-bold text-[var(--text)] mb-6 text-center">A Designer Put On a Bracelet and Everything Shifted</h2>
        <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
          <p>
            She was not looking for a spiritual practice. She was a jewelry designer —
            practical, visual, someone who thought in shapes and materials and how light
            falls across a finished piece. The bracelet was just a prototype. Rose quartz.
            Simple. She put it on to test the fit and forgot she was wearing it.
          </p>
          <p>
            A week later, she noticed something. She was softer with herself. Less reactive
            in conversations that would have normally hooked her. Something about the weight
            of the stone against her wrist — a tiny, constant presence — was anchoring her
            in a way she could not explain.
          </p>
          <p>
            She started experimenting. Black obsidian on hard days. Amethyst before sleep.
            Tiger's eye into meetings that scared her. Each stone felt different. Each one
            seemed to hold a frequency — not magic, but focus. A tangible reminder of an
            intention she was choosing to hold.
          </p>
          <p>
            MythRealms was born from that experiment. Not from an ancient text. Not from
            a marketing strategy. From the simple, private discovery that wearing a stone
            with intention changes how you move through the world. Every piece we make
            carries that same belief: that what you put on your body shapes what happens
            inside it. Choose your intention. Wear it daily. Watch what shifts.
          </p>
        </div>
      </div>

      {/* Commitment */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {[
          { icon: Gem, title: "Sourced with Intention", text: "We select every stone individually — not by the kilo, not by the lot. Each piece is chosen for its quality, its energy, and its ability to hold meaning. We know where every stone comes from and who shaped it." },
          { icon: Sparkles, title: "Hand-Finished in Small Batches", text: "No warehouses. No mass production. Every bracelet is strung, knotted, and inspected by hand after you order. The stone has waited millions of years to find you. We can take a week to finish it properly." },
          { icon: Clock, title: "Ethical Stones, Transparent Chain", text: "Our stones travel trusted supply chains with verified origins. We work exclusively with suppliers who guarantee fair wages, safe conditions, and environmental responsibility. A stone worn with intention should not arrive through suffering." },
          { icon: User, title: "One Founder, Every Piece", text: "MythRealms is run by the designer who started the experiment. She selects every stone, oversees every design, and personally inspects every finished piece. No investors. No board. One person who believes that a bracelet can change your day — and enough days change a life." },
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
        <h2 className="font-serif text-3xl font-bold text-[var(--text)] mb-3">Find Your Intention. Wear Your Becoming.</h2>
        <p className="text-[var(--text-secondary)] mb-6">Six archetypes. Six intentions. One is calling to you right now. Its stone is here — hand-selected, artisan-finished, ready to ship.</p>
        <div className="flex justify-center gap-4">
          <Link href="/collections/curated-singles" className="px-8 py-3 bg-[var(--accent)] text-white rounded-full font-semibold hover:bg-[var(--accent-hover)] transition">Discover The Archetypes</Link>
          <Link href="/collections" className="px-8 py-3 border border-[var(--border)] text-[var(--text)] rounded-full font-semibold hover:border-[var(--accent)] transition">Explore All Collections</Link>
        </div>
      </div>
    </div>
  );
}
