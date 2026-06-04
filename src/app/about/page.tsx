import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BookOpen, Compass, Flame, Star, Shield, HelpCircle, Gem, Eye, Feather } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <Link href="/" className="hover:text-[var(--text)]">Home</Link><span>/</span>
        <span className="text-[var(--text)]">About MythRealms</span>
      </nav>

      <div className="text-center mb-16">
        <h1 className="font-serif text-5xl font-bold mb-4">Where Ancient Myths Come Alive</h1>
        <p className="text-[var(--text-muted)] max-w-xl mx-auto text-lg">上古神兽 — The oldest fantasy book on Earth, worn against your skin</p>
      </div>

      {/* Chapter 1: Origin */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20 pb-16 border-b border-[var(--border-light)]">
        <div className="rounded-xl overflow-hidden aspect-[0.75]">
          <img src="/images/about/ancient-bookstore.png" alt="Ancient Beijing Bookstore" className="w-full h-full object-cover" />
        </div>
        <div>
          <span className="text-xs uppercase tracking-[0.15em] text-[var(--accent)] font-semibold">Chapter One</span>
          <h2 className="font-serif text-3xl font-bold mt-2 mb-5">The Book That Started Everything</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            In the basement of a Beijing antiquarian bookstore, buried under a stack of Qing dynasty manuscripts, our founder found a worn copy of the <em>Classic of Mountains and Seas</em> — the Shan Hai Jing. Compiled over 2,000 years ago, it is the oldest surviving encyclopedia of mythical creatures on Earth. 2000 years before Tolkien imagined Middle-earth, Chinese scholars were cataloging the Nine-Tailed Fox, the Qilin, the Azure Dragon, and 400 other beings that walked the boundary between reality and legend.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            She spent the next decade traveling across China — to remote village temples where the Four Symbols are still painted on doors for protection, to bronze-age archaeological sites where Taotie patterns adorn 3,000-year-old ritual vessels, to the candlelit studios of master metalsmiths whose families have cast mythical beasts into jewelry for twelve generations.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            What began as academic curiosity became an obsession — and ultimately, a calling. The creatures of Shan Hai Jing are not just stories. They are <em>archetypes</em>: wisdom, protection, transformation, rebirth. They have been speaking to us for millennia. MythRealms gives them a voice you can wear.
          </p>
        </div>
      </div>

      {/* Chapter 2: Each Beast a Story */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20 pb-16 border-b border-[var(--border-light)]">
        <div className="order-2 md:order-1">
          <span className="text-xs uppercase tracking-[0.15em] text-[var(--accent)] font-semibold">Chapter Two</span>
          <h2 className="font-serif text-3xl font-bold mt-2 mb-5">Each Beast, A Story</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            Every MythRealms piece begins with a deep study of the original text. Our designers work from the earliest known illustrations — Han dynasty tomb murals, Tang dynasty silk paintings, Song dynasty woodblock prints — to capture the authentic spirit of each creature before reinterpreting it as wearable art.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            The <strong>Nine-Tailed Fox</strong> represents wisdom earned through centuries of life. The <strong>Qilin</strong> appears only in times of peace and just rule — a creature so gentle it refuses to step on living grass. Each beast carries a specific energy, a specific meaning, a specific gift for the wearer.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Our pieces are cast in small batches by artisans in Jingdezhen and Hangzhou — cities whose craft traditions stretch back a thousand years. Every pendant is hand-finished, every chain hand-linked, every stone hand-set. We use only ethically sourced materials: recycled bronze, conflict-free gemstones, and eco-friendly packaging.
          </p>
        </div>
        <div className="order-1 md:order-2 rounded-xl overflow-hidden aspect-[0.75]">
          <img src="/images/about/bronze-workshop.png" alt="Bronze Casting Workshop" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Chapter 3: Why Ancient Myths Matter Now */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20 pb-16 border-b border-[var(--border-light)]">
        <div className="rounded-xl overflow-hidden aspect-[0.75]">
          <img src="/images/about/mythology-books.png" alt="Ancient Mythology Books" className="w-full h-full object-cover" />
        </div>
        <div>
          <span className="text-xs uppercase tracking-[0.15em] text-[var(--accent)] font-semibold">Chapter Three</span>
          <h2 className="font-serif text-3xl font-bold mt-2 mb-5">Why Ancient Myths Matter Now</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            Mythology is not just old stories. Mythology is how cultures encode their deepest truths.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            When you wear a Nine-Tailed Fox pendant, you are wearing more than silver. You are wearing the idea that beauty and cunning can coexist — that transformation is possible, that you contain multitudes. When you wear a Bai Ze pendant, you are wearing the idea that knowledge protects — that wisdom defeats fear, that understanding your enemy is more powerful than fighting them.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            These are not "Chinese stories." They are human stories, preserved by Chinese culture for thousands of years. Our mission is to make the Shan Hai Jing as recognized as the Odyssey — one pendant at a time.
          </p>
        </div>
      </div>

      {/* Chapter 4: Meet the Six Beasts */}
      <div className="mb-20 pb-16 border-b border-[var(--border-light)]">
        <span className="text-xs uppercase tracking-[0.15em] text-[var(--accent)] font-semibold">Chapter Four</span>
        <h2 className="font-serif text-3xl font-bold mt-2 mb-8">The Six Beasts of MythRealms</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: Flame, name: "九尾狐 — The Nine-Tailed Fox", tagline: "The shape-shifter. The survivor. The one who walks between worlds.", wear: "Wear this if: You have been underestimated. You contain depths people cannot see." },
            { icon: Shield, name: "麒麟 — The Qilin", tagline: "The peace-bringer. Appears when a great leader is needed.", wear: "Wear this if: You lead with kindness. You protect without aggression." },
            { icon: Feather, name: "凤凰 — The Fenghuang", tagline: "The harmonizer. Descends when the world is at peace.", wear: "Wear this if: You bring balance wherever you go. You restore order from chaos." },
            { icon: Gem, name: "应龙 — The Yinglong", tagline: "The creator. The winged dragon who carved rivers and shaped the land.", wear: "Wear this if: You build things. You change landscapes. You leave a mark." },
            { icon: BookOpen, name: "白泽 — The Bai Ze", tagline: "The knower. Taught humanity how to ward off evil.", wear: "Wear this if: Knowledge is your weapon. Curiosity is your compass." },
            { icon: Eye, name: "穷奇 — The Qiong Qi", tagline: "The judge. The fierce one who punishes the wicked.", wear: "Wear this if: You protect your boundaries. You stand up for what is right." },
          ].map((beast) => (
            <div key={beast.name} className="bg-[var(--surface)] border border-[var(--border-light)] rounded-xl p-6 flex gap-4 items-start">
              <beast.icon className="w-8 h-8 text-[var(--accent)] shrink-0 mt-1" />
              <div>
                <h3 className="font-serif font-bold text-lg mb-1">{beast.name}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">{beast.tagline}</p>
                <p className="text-xs text-[var(--text-muted)] italic">{beast.wear}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chapter 5: Founder's Note */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20 pb-16 border-b border-[var(--border-light)]">
        <div className="order-2 md:order-1">
          <span className="text-xs uppercase tracking-[0.15em] text-[var(--accent)] font-semibold">Chapter Five</span>
          <h2 className="font-serif text-3xl font-bold mt-2 mb-5">A Note from the Founder</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            When I first read about the Nine-Tailed Fox, I thought: <em>how is this not a worldwide phenomenon?</em> A shapeshifting fox spirit that can be both hero and trickster — that is a better character than half of what Hollywood produces.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            I dug deeper. Qilin. Yinglong. Bai Ze. Fenghuang. Each one has a complete mythology — origin stories, powers, themes that resonate with modern life. And nobody in the West knows about them.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            I started MythRealms because these stories deserve an audience. Because Chinese mythology is too rich to stay locked in ancient texts. Because wearing a story is the best way to start a conversation.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Every pendant we ship is an ambassador. A tiny silver envoy from a 2,000-year-old imagination — yours to wear, share, and pass on.
          </p>
          <p className="text-[var(--text-muted)] text-sm mt-4">— Jasper, Founder</p>
        </div>
        <div className="order-1 md:order-2 rounded-xl overflow-hidden aspect-[0.75]">
          <img src="/images/about/founder-library.png" alt="Founder in Research Library" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Chapter 6: Our Approach to Mythology */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20 pb-16 border-b border-[var(--border-light)]">
        <div className="rounded-xl overflow-hidden aspect-[0.75]">
          <img src="/images/about/scholar-consultation.png" alt="Scholar Consultation" className="w-full h-full object-cover" />
        </div>
        <div>
          <span className="text-xs uppercase tracking-[0.15em] text-[var(--accent)] font-semibold">Chapter Six</span>
          <h2 className="font-serif text-3xl font-bold mt-2 mb-5">Our Approach to Mythology</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            We are myth enthusiasts, not religious practitioners. The Classic of Mountains and Seas is a work of imagination — ancient people describing a world they did not fully understand through the lens of wonder and storytelling. We treat these creatures as cultural treasures and artistic inspiration.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            That said, we take accuracy seriously. Every creature design is based on the original text descriptions from the Shan Hai Jing. We work with Chinese mythology scholars to ensure we are representing these beasts correctly — their appearance, their powers, their symbolic meanings.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            If you are a mythology enthusiast, you will find our story cards meticulously researched with cited sources. If you are just here for beautiful jewelry, that is fine too. The stories are there when you are ready for them.
          </p>
        </div>
      </div>

      {/* Chapter 7: FAQ */}
      <div className="mb-20 pb-16 border-b border-[var(--border-light)]">
        <div className="flex items-center gap-3 justify-center mb-8">
          <HelpCircle className="w-8 h-8 text-[var(--accent)]" />
          <h2 className="font-serif text-3xl font-bold">Frequently Asked Questions</h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-8">
          {[
            { q: "Is this cultural appropriation?", a: "We believe sharing mythology across cultures is appreciation, not appropriation. We cite our sources, compensate our Chinese scholars, and present the stories accurately and respectfully. We are ambassadors for Chinese mythology, not appropriators of it." },
            { q: "What is the difference between silver and bronze pendants?", a: "Sterling silver (925) is brighter, more durable, and develops a subtle patina over time. Bronze has a warmer tone and an antique feel straight out of the box. Both are beautiful — it comes down to personal preference." },
            { q: "How do I choose which beast is right for me?", a: "Read the descriptions and see which story resonates. Are you a survivor? The Nine-Tailed Fox. A leader? The Qilin. A builder? The Yinglong. There is no wrong choice — every beast has its own power. Many customers start with one and eventually collect several." },
            { q: "Do you ship internationally?", a: "Yes. Free standard shipping on orders over $50. Express shipping is available at checkout. We ship worldwide from China." },
            { q: "Is each pendant really based on the original Shan Hai Jing text?", a: "Yes. Every design references the original Classical Chinese descriptions — sometimes down to specific passages. The story card included with each pendant cites the original passage that inspired it." },
          ].map((faq) => (
            <details key={faq.q} className="group">
              <summary className="font-serif text-lg font-semibold cursor-pointer hover:text-[var(--accent)] transition-colors list-none flex items-center gap-2">
                <span className="text-[var(--text-muted)] group-open:rotate-90 transition-transform">▸</span>
                {faq.q}
              </summary>
              <p className="mt-3 ml-6 text-[var(--text-secondary)] leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Three Pillars */}
      <div className="mb-20">
        <h2 className="font-serif text-3xl font-bold text-center mb-12">The Three Pillars</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: BookOpen, title: "Authenticity · 真", desc: "Every design is rooted in scholarship. We consult the original Shan Hai Jing text, archaeological findings, and cultural advisors to ensure every creature is rendered with fidelity to its 2,000-year-old source." },
            { icon: Star, title: "Craftsmanship · 精", desc: "Our pieces are made in small batches by master artisans. No mass production. No shortcuts. Each pendant passes through twelve hands before reaching yours — casting, filing, polishing, setting, patina, quality." },
            { icon: Compass, title: "Exploration · 探", desc: "We are always discovering. The Shan Hai Jing contains over 400 creatures, and we have only begun to explore them. New beasts are released with each season, inviting you deeper into the mythology." },
          ].map((v) => (
            <div key={v.title} className="bg-[var(--surface)] border border-[var(--border-light)] rounded-xl p-8 text-center hover:shadow-lg transition">
              <v.icon className="w-10 h-10 text-[var(--accent)] mx-auto mb-4" />
              <h3 className="font-serif text-lg font-bold mb-2">{v.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-gradient-to-br from-[#0F0D0E] to-[#1A1816] text-[var(--text)] rounded-2xl py-16 px-6 border border-[var(--border)]">
        <h2 className="font-serif text-3xl font-bold mb-4">Enter the Bestiary</h2>
        <p className="text-[var(--text-muted)] mb-8 max-w-md mx-auto">Discover the creature that speaks to your spirit. 400 beasts. Infinite stories.</p>
        <Link href="/collections/beast-pendants"><Button variant="accent" size="lg">Explore the Collection</Button></Link>
      </div>
    </div>
  );
}
