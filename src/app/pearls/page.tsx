import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FAQPageJsonLd } from "@/components/ui/JsonLd";
import { absoluteUrl } from "@/lib/site";

const questions = [
  {
    question: "What makes freshwater pearl jewelry a good everyday choice?",
    answer: "Freshwater pearls offer soft luster and natural variation, so they feel polished without looking overly formal. Their organic surface and irregularity make them especially easy to wear with linen, cotton, denim, and evening pieces.",
  },
  {
    question: "How should I choose pearl earrings, a necklace, or a bracelet?",
    answer: "Start with the place you want light near your face or hands. Earrings give the quickest visible lift, necklaces sit close to the collarbone, and bracelets add movement at the wrist. Product pages should be used for the exact product image, scale, material, and care details.",
  },
  {
    question: "Can pearl jewelry be worn every day?",
    answer: "Yes. Put pearl jewelry on after fragrance, lotion, and hair products, then wipe it with a soft dry cloth after wear. Avoid swimming, showering, harsh cleaners, and prolonged contact with perfume to help protect the surface.",
  },
  {
    question: "Are natural pearls identical to each other?",
    answer: "No. Natural variation in shape, luster, surface, and tone is expected. That variation is part of why each pearl piece has an individual character.",
  },
];

export const metadata: Metadata = {
  title: "Pearl Jewelry Guide | MythRealms",
  description: "A practical guide to choosing, wearing, and caring for pearl earrings, necklaces, bracelets, and rings.",
  alternates: { canonical: absoluteUrl("/pearls") },
  openGraph: {
    title: "Pearl Jewelry Guide | MythRealms",
    description: "How to choose, wear, and care for pearl jewelry.",
    url: absoluteUrl("/pearls"),
    images: [{ url: absoluteUrl("/images/brand/hero/pearl-necklace-editorial.png"), alt: "Model wearing pearl jewelry" }],
  },
};

export default function PearlGuidePage() {
  return (
    <main className="bg-[var(--bg)]">
      <FAQPageJsonLd questions={questions} />
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:py-20">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">Pearl jewelry guide</p>
          <h1 className="font-serif text-5xl font-medium leading-[.98] text-[var(--text)] md:text-6xl">A clear guide to wearing pearls your way.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[var(--text-secondary)]">Pearls can be dressed up, worn daily, layered, or kept deliberately simple. This guide helps you choose a piece with the right placement, scale, and care for real life.</p>
          <Link href="/collections/pearl-series" className="mt-8 inline-flex items-center gap-2 bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]">Shop the Pearl Edit <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--surface-alt)]">
          <Image src="/images/brand/hero/pearl-necklace-editorial.png" alt="Model wearing a pearl necklace" fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" priority />
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto grid max-w-7xl gap-px md:grid-cols-3">
          {[
            ["Earrings", "The easiest way to bring a soft, reflective point of light close to the face."],
            ["Necklaces", "Choose a neckline that feels natural with your daily wardrobe and layer only when it still feels effortless."],
            ["Bracelets & rings", "Keep the wrist or hand lightly styled with a piece that catches movement without taking over the outfit."],
          ].map(([title, copy]) => <div key={title} className="bg-[var(--surface)] px-6 py-8 md:px-9"><h2 className="font-serif text-2xl text-[var(--text)]">{title}</h2><p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{copy}</p></div>)}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 lg:py-20">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">Straight answers</p>
        <h2 className="font-serif text-4xl font-medium text-[var(--text)]">Pearl questions, answered plainly.</h2>
        <div className="mt-8 border-t border-[var(--border)]">
          {questions.map((item) => <details key={item.question} className="group border-b border-[var(--border)] py-5"><summary className="cursor-pointer list-none pr-8 font-serif text-xl text-[var(--text)] marker:content-none">{item.question}<span className="float-right font-sans text-[var(--accent)] group-open:hidden">+</span><span className="float-right hidden font-sans text-[var(--accent)] group-open:inline">-</span></summary><p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">{item.answer}</p></details>)}
        </div>
      </section>
    </main>
  );
}
