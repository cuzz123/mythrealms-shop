import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Gem, Moon, ShieldCheck, Sparkles } from "lucide-react";
import { categoryMessaging } from "@/lib/brand";

export const metadata: Metadata = {
  title: "About MythRealms | Pearl & Gemstone Jewelry for Modern Guardians",
  description:
    "MythRealms creates pearl and gemstone jewelry around intention, modern ritual, and Chinese celestial-inspired guardian archetypes.",
};

const realms = [
  {
    ...categoryMessaging["pearl-series"],
    href: "/collections/pearl-series",
    image: "/images/collections/collections封面1.webp",
  },
  {
    ...categoryMessaging["pearl-crystal-series"],
    href: "/collections/pearl-crystal-series",
    image: "/images/collections/collections封面3.webp",
  },
  {
    ...categoryMessaging["curated-singles"],
    href: "/collections/curated-singles",
    image: "/images/collections/collections封面4.webp",
  },
  {
    ...categoryMessaging["luxe-collection"],
    href: "/collections/luxe-collection",
    image: "/images/collections/collections封面2.webp",
  },
];

const principles = [
  {
    icon: Gem,
    title: "Pearls First",
    text: "Pearls are the center of the world here: luminous, quiet, and emotionally readable on camera. Gemstones add color, contrast, and intention.",
  },
  {
    icon: ShieldCheck,
    title: "Guardians, Not Costumes",
    text: "The guardian is an archetype you choose, not a literal creature attached to the product. The jewelry stays wearable; the story gives it gravity.",
  },
  {
    icon: Moon,
    title: "Small Runs",
    text: "We keep the collection edited and test demand before expanding. Fewer pieces, clearer meanings, less inventory pressure.",
  },
  {
    icon: Sparkles,
    title: "Ritual Language",
    text: "Our intention notes are emotional anchors and styling cues. They are not medical, spiritual, or guaranteed outcome claims.",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <nav className="mb-8 flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--text)]">
          Home
        </Link>
        <span>/</span>
        <span className="text-[var(--text)]">About MythRealms</span>
      </nav>

      <section className="relative mb-16 min-h-[520px] overflow-hidden rounded-lg">
        <Image
          src="/images/about/hero.webp"
          alt="MythRealms pearl and gemstone jewelry in warm light"
          fill
          sizes="(max-width: 768px) 100vw, 1152px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
        <div className="relative z-10 flex min-h-[520px] items-end px-6 pb-10 md:px-12 md:pb-14">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              Modern Talismans
            </p>
            <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-6xl">
              Pearls for calm. Gemstones for becoming.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/72 md:text-lg">
              MythRealms makes jewelry for people who want the feeling of a talisman without
              losing the polish of an everyday piece. The shapes are wearable. The story is
              celestial. The choice is personal.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16 grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            The Story
          </p>
          <h2 className="font-serif text-3xl font-bold text-[var(--text)] md:text-4xl">
            The guardian is the meaning you wear into the day.
          </h2>
        </div>
        <div className="space-y-5 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
          <p>
            We started from a simple tension: jewelry can be beautiful, but it can also feel
            generic. MythRealms gives each piece a role. A pearl ring can be a quiet center.
            A bracelet can be a boundary. A gemstone can mark a fresh start.
          </p>
          <p>
            The inspiration comes from Chinese celestial imagery, moonlight, protection myths,
            and the language of personal intention. The products do not need animal shapes to
            carry that world. A clean pearl necklace can still feel like a guardian when the
            name, color, ritual, and styling all point in the same direction.
          </p>
          <p>
            That is why the collection is organized by intention instead of only by product
            type. Customers can shop by what they need to feel: calm, renewal, protection,
            soft power, clarity, or balance.
          </p>
        </div>
      </section>

      <section className="mb-16">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              The Realms
            </p>
            <h2 className="font-serif text-3xl font-bold text-[var(--text)]">
              Four ways into the collection
            </h2>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            Shop all collections <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {realms.map((realm) => (
            <Link
              key={realm.href}
              href={realm.href}
              className="group overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--border-light)]">
                <Image
                  src={realm.image}
                  alt={`${realm.name} collection`}
                  fill
                  sizes="(max-width: 768px) 50vw, 280px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                  {realm.realm}
                </p>
                <h3 className="mt-2 font-serif text-lg font-bold text-[var(--text)]">
                  {realm.name}
                </h3>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[var(--text-muted)]">
                  {realm.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-16 border-y border-[var(--border)] py-14">
        <div className="mb-8 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            How We Build
          </p>
          <h2 className="font-serif text-3xl font-bold text-[var(--text)]">
            Luxury feeling, lean operating logic.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
            MythRealms is intentionally early and intentionally edited. We focus on a few
            pieces that can carry a strong story, then expand only when the audience tells us
            what deserves to stay.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {principles.map((principle) => (
            <div key={principle.title} className="rounded-lg bg-[var(--surface)] p-5">
              <principle.icon className="mb-4 h-6 w-6 text-[var(--accent)]" strokeWidth={1.5} />
              <h3 className="font-serif text-lg font-bold text-[var(--text)]">
                {principle.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                {principle.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16 grid gap-8 rounded-lg bg-[var(--surface)] p-8 md:grid-cols-[1fr_1.2fr] md:p-10">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            Our Promise
          </p>
          <h2 className="font-serif text-3xl font-bold text-[var(--text)]">
            Clear story. Clear expectations.
          </h2>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-[var(--text-secondary)]">
          <p>
            Natural pearls and gemstones vary in tone, size, and surface character. That
            variation is part of the piece, not a defect.
          </p>
          <p>
            Many pieces are prepared after ordering through trusted jewelry suppliers and
            partner workshops. This keeps inventory lean and lets us test what people actually
            love before holding deeper stock.
          </p>
          <p>
            The brand world is cinematic, but the product promise stays practical: clear
            product pages, visible shipping expectations, free shipping over $69.99, and a
            30-day return window.
          </p>
        </div>
      </section>

      <section className="text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
          Start Here
        </p>
        <h2 className="font-serif text-3xl font-bold text-[var(--text)]">
          Find the intention that fits this season.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">
          Take the quiz for a guardian archetype, or begin with pearls if you want the cleanest
          first purchase path.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/guardian-quiz"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3 text-sm font-semibold text-[var(--bg)] transition hover:bg-[var(--accent-hover)]"
          >
            Take the Quiz <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/collections/pearl-series"
            className="inline-flex items-center justify-center rounded-full border border-[var(--border)] px-7 py-3 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--accent)]"
          >
            Shop Pearl Realms
          </Link>
        </div>
      </section>
    </main>
  );
}
