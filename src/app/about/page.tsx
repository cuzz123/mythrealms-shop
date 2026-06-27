import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Gem, Sparkles, Clock, User, ArrowRight, Quote } from "lucide-react";
import { PRODUCTS } from "@/lib/1688-products";

export const metadata: Metadata = {
  title: "About MythRealms — Stones With Intention. Wear Your Becoming.",
  description: "We create intention pieces — wearable reminders of who you are becoming. Each stone carries a singular purpose. Protection, love, clarity, abundance — choose yours.",
};

const stoneIntents = [
  { stone: "Black Obsidian", intention: "Protection", desc: "Absorbs and protects. Your invisible perimeter.", slug: "curated-singles-01" },
  { stone: "Rose Quartz", intention: "Self-Love", desc: "Opens and softens. The heart that keeps choosing.", slug: "curated-singles-02" },
  { stone: "Amethyst", intention: "Intuition", desc: "Quiets and clarifies. The answers already within.", slug: "curated-singles-03" },
  { stone: "Moonstone", intention: "Renewal", desc: "Transforms and rebirths. The courage to begin again.", slug: "curated-singles-04" },
  { stone: "Tiger's Eye", intention: "Confidence", desc: "Steadies and focuses. The nerve to act.", slug: "curated-singles-05" },
  { stone: "Green Aventurine", intention: "Abundance", desc: "Attracts and receives. The audacity to say yes.", slug: "curated-singles-06" },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-10">
        <Link href="/" className="hover:text-[var(--text)]">Home</Link><span>/</span>
        <span className="text-[var(--text)]">About MythRealms</span>
      </nav>

      {/* ===== HERO ===== */}
      <div className="relative rounded-2xl overflow-hidden mb-20">
        <Image
          src="/images/pages/about-hero.webp"
          alt="Hand wearing a crystal bracelet, morning light — MythRealms intention jewelry"
          fill
          sizes="(max-width:768px) 100vw, 1120px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-black/20 to-transparent" />
        <div className="relative z-10 text-center py-24 px-6">
          <span className="inline-block text-xs font-semibold tracking-[0.1em] text-[var(--accent)] uppercase mb-4">Our Philosophy</span>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-4">Stones With Intention.<br />Wear Your Becoming.</h1>
          <p className="text-white/60 max-w-xl mx-auto text-lg leading-relaxed">
            You are not just wearing a bracelet. You are wearing a practice — a daily, tactile
            reminder of who you are choosing to become.
          </p>
        </div>
      </div>

      {/* ===== STONE INTENTIONS GRID ===== */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[var(--accent)] uppercase mb-3">Our Stones</span>
          <h2 className="font-serif text-3xl font-bold text-[var(--text)] mb-3">Six Stones. Six Intentions.</h2>
          <p className="text-[var(--text-muted)] max-w-lg mx-auto">Each MythRealms piece carries a singular purpose. Find the stone that speaks to where you are right now.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stoneIntents.map((s) => {
            const product = PRODUCTS.find(p => p.slug === s.slug);
            return (
              <Link
                key={s.slug}
                href={`/products/${s.slug}`}
                className="group bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--accent)]/40 transition-all duration-300 text-center"
              >
                {product && (
                  <div className="relative w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src={product.image}
                      alt={s.stone}
                      fill
                      sizes="64px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <h3 className="font-serif text-base font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">{s.stone}</h3>
                <p className="text-xs text-[var(--accent)] font-semibold uppercase tracking-wider mt-1">{s.intention}</p>
                <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">{s.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="max-w-5xl mx-auto"><div className="h-px bg-[var(--border)] mb-20" /></div>

      {/* ===== FOUR PILLARS ===== */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[var(--accent)] uppercase mb-3">How It Works</span>
          <h2 className="font-serif text-3xl font-bold text-[var(--text)]">The Practice</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: Gem, title: "Choose Your Intention", desc: "Protection. Love. Clarity. Confidence. Renewal. Abundance. One is calling to you right now. That is the one you start with — not because it matches your outfit, but because it names something true." },
            { icon: Sparkles, title: "Set It Each Morning", desc: "Hold your bracelet. Close your eyes. Name one thing you are releasing. One thing you are inviting. Put it on your left wrist — the receiving side. This is not jewelry. This is showing up for yourself." },
            { icon: Clock, title: "Wear It Through Your Day", desc: "Let the stone rest against your skin. When you notice it — a glint in the light, a brush against your desk — let it pull you back to the intention you set when the day was new. A tiny anchor. A quiet constant." },
            { icon: User, title: "Watch What Shifts", desc: "One day you notice you are softer. Less reactive. More grounded. The stone did not do the work — you did. But it held the reminder. It kept the intention visible when the world tried to make you forget." },
          ].map((p) => (
            <div key={p.title} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 group hover:border-[var(--accent)]/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center mb-4 group-hover:bg-[var(--accent)]/20 transition-colors">
                <p.icon className="w-5 h-5 text-[var(--accent)]" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-lg font-bold text-[var(--text)] mb-2">{p.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FOUNDER QUOTE ===== */}
      <div className="relative rounded-2xl overflow-hidden mb-20 bg-[var(--surface)] border border-[var(--border)]">
        <div className="absolute top-6 left-6 text-[var(--accent)]/20">
          <Quote className="w-16 h-16" />
        </div>
        <div className="relative z-10 p-12 lg:p-16 text-center">
          <p className="font-serif text-2xl lg:text-3xl text-[var(--text)] leading-relaxed italic mb-8 max-w-2xl mx-auto">
            &ldquo;I put on a bracelet to test the fit. A week later, I noticed I was softer with myself.
            Less reactive. More grounded. The stone did not do the work — but it kept the reminder
            against my skin when I needed it most. That is what MythRealms makes: tangible intentions
            for the moments you forget who you are becoming.&rdquo;
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            <span className="text-[var(--text)] font-semibold">The Founder</span> — MythRealms
          </p>
        </div>
      </div>

      {/* ===== COMMITMENT ===== */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[var(--accent)] uppercase mb-3">Our Commitments</span>
          <h2 className="font-serif text-3xl font-bold text-[var(--text)]">How We Work</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: Gem, title: "Sourced with Intention", text: "Every stone individually selected — not by the kilo, not by the lot. We know where each piece comes from and the hands that shaped it." },
            { icon: Sparkles, title: "Hand-Finished, Small Batches", text: "No warehouses. No mass production. Every bracelet is strung, knotted, and inspected by hand after you order. The stone waited millions of years. We can take a week to finish it right." },
            { icon: Clock, title: "Ethical & Transparent", text: "Fair wages. Safe conditions. Clean supply chains. A stone worn with intention should not arrive through suffering." },
            { icon: User, title: "One Founder, Every Piece", text: "No investors. No board. One person who selects every stone, oversees every design, and inspects every finished piece before it ships." },
          ].map((p) => (
            <div key={p.title} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
              <p.icon className="w-6 h-6 text-[var(--accent)] mb-3" strokeWidth={1.5} />
              <h3 className="font-serif text-lg font-bold text-[var(--text)] mb-2">{p.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <div className="text-center border-t border-[var(--border)] pt-16">
        <h2 className="font-serif text-3xl font-bold text-[var(--text)] mb-3">Which Intention Is Calling You?</h2>
        <p className="text-[var(--text-muted)] mb-8 max-w-md mx-auto">Six archetypes. One is yours. Take the quiz or browse the collection.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/guardian-quiz" className="px-8 py-3 bg-[var(--accent)] text-white rounded-full font-semibold hover:bg-[var(--accent-hover)] transition inline-flex items-center justify-center gap-2">
            Take the Quiz <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/collections/curated-singles" className="px-8 py-3 border border-[var(--border)] text-[var(--text)] rounded-full font-semibold hover:border-[var(--accent)] transition">
            Shop The Archetypes
          </Link>
        </div>
      </div>
    </div>
  );
}
