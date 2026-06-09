import Link from "next/link";
import { BookOpen, Gem, Users, Globe, Shield, Award, Clock } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-8">
        <Link href="/" className="hover:text-[var(--text)]">Home</Link><span>/</span>
        <span className="text-[var(--text)]">About MythRealms</span>
      </nav>

      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="font-serif text-5xl font-bold text-[var(--text)] mb-4">MythRealms</h1>
        <p className="text-xl text-[var(--accent)] font-serif italic mb-6">Ancient Beasts. Celestial Guardians. Handcrafted Luxury.</p>
        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
          2000 years before Tolkien mapped Middle-earth, the Chinese mapped the human soul onto 277 mythical creatures.
          The Classic of Mountains and Seas — the Shan Hai Jing — is the oldest bestiary in the world.
          Every beast in its pages guards a different part of who we are.
          MythRealms brings those guardians to life in precious metal and stone.
        </p>
      </div>

      {/* Three Pillars */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {[
          { icon: BookOpen, title: "Ancient Lore", desc: "Every design begins with the Shan Hai Jing. Our team researches each creature — its origin, its symbolism, its place in Chinese cosmology. We do not invent. We translate 2000-year-old wisdom into wearable form." },
          { icon: Gem, title: "Precious Materials", desc: "925 sterling silver. 14k and 18k gold. Authentic gemstones sourced along the ancient Silk Road. We believe jewelry should last generations — so we use materials that do." },
          { icon: Clock, title: "Handcrafted to Order", desc: "No warehouses. No mass production. Every piece is cast, polished, and finished by hand after you order. 2-3 weeks from your click to your doorstep. This is slow luxury." },
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
            The idea for MythRealms was born in a used bookstore. A faded English translation of the Shan Hai Jing —
            the Classic of Mountains and Seas — sat on a bottom shelf, its spine cracked, its pages yellow.
            Inside were creatures no Western bestiary had ever dreamed of: a fox with nine tails that appeared only when peace was coming.
            A tortoise that held up the sky. A fish that became a bird the size of a continent.
          </p>
          <p>
            These were not monsters. They were guardians — each mapped to a different part of the human experience.
            The one who carries too much alone. The one rebuilding from ashes. The one who sees what others miss.
            The one still standing after everything.
          </p>
          <p>
            The question was not "why create a jewelry brand around this?" The question was "why had no one done it before?"
          </p>
          <p>
            MythRealms exists at the intersection of ancient Chinese wisdom and modern European luxury craftsmanship.
            Every piece tells a story from the oldest book of legends. Every stone is chosen for its symbolic resonance as much as its beauty.
            Every design abstracts a mythical creature into a form you can wear every day — not a costume piece, but a personal talisman.
          </p>
        </div>
      </div>

      {/* Commitment */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {[
          { icon: Shield, title: "Our Promise", text: "If your piece arrives with any defect, we replace it free. If it does not feel like yours, return it within 30 days. If it breaks within a year, we repair it. Jewelry should outlast us." },
          { icon: Globe, title: "Ethical Sourcing", text: "Our gemstones travel the same routes as the ancient Silk Road — from Burmese jade mines to Afghan lapis quarries. We work exclusively with suppliers who guarantee fair wages, safe conditions, and environmental responsibility." },
          { icon: Users, title: "One Woman Atelier", text: "MythRealms is run by a single founder who researches every myth, selects every stone, and oversees every design. No corporate board. No investors. Just one person obsessed with bringing ancient guardians to life." },
          { icon: Award, title: "Limited Editions", text: "Our Artist Collaboration pieces are produced in numbered editions of 30-100. Once sold out, they are never reproduced. Each comes with a hand-signed certificate of authenticity." },
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
        <h2 className="font-serif text-3xl font-bold text-[var(--text)] mb-3">Find Your Guardian</h2>
        <p className="text-[var(--text-secondary)] mb-6">The beast that guards your soul has been waiting 2000 years to meet you.</p>
        <div className="flex justify-center gap-4">
          <Link href="/collections/beast-pendants" className="px-8 py-3 bg-[var(--accent)] text-white rounded-full font-semibold hover:bg-[var(--accent-hover)] transition">Explore the Bestiary</Link>
          <Link href="/guardian-quiz" className="px-8 py-3 border border-[var(--border)] text-[var(--text)] rounded-full font-semibold hover:border-[var(--accent)] transition">Take the Quiz</Link>
        </div>
      </div>
    </div>
  );
}
