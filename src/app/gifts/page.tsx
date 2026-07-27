import type { Metadata } from "next";
import Link from "next/link";

import { EditorialHero } from "@/components/editorial/EditorialHero";
import { FAQPageJsonLd } from "@/components/ui/JsonLd";
import { BRAND } from "@/lib/brand-identity";
import { HOMEPAGE_MEDIA } from "@/lib/homepage-editorial";
import { absoluteUrl } from "@/lib/site";

const title = `Pearl Jewelry Gift Guide | Everyday Giving | ${BRAND.name}`;
const description =
  "Choose jewelry as a gift without guessing size or material. Use an item detail only if it is explicitly stated on the exact item page; otherwise, do not infer it.";
const heroImage = HOMEPAGE_MEDIA.everyday;
const giftFaq = [
  {
    question: "How do I buy jewelry as a gift when I do not know the recipient's size?",
    answer: "Do not guess from photographs. Use dimensions, length, closure, or adjustment information only if it is explicitly stated on the exact item page. If it is not stated, contact support or choose another option.",
  },
  {
    question: "Can I tell what a jewelry gift is made of from its photo?",
    answer: "No. Images do not establish metal content, pearl type, plating, treatment, coating, or allergy suitability. Use a detail only if it is explicitly stated on the exact item page; otherwise, do not infer it.",
  },
  {
    question: "Will a jewelry gift arrive by a certain date?",
    answer: "This guide cannot make a delivery promise. Read the shipping page and checkout details that apply when you order, and contact support if timing is important.",
  },
] as const;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/gifts") },
  openGraph: {
    title,
    description,
    url: absoluteUrl("/gifts"),
    type: "website",
    images: [{ url: absoluteUrl(heroImage.src), alt: heroImage.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [absoluteUrl(heroImage.src)],
  },
};

export default function GiftsPage() {
  return (
    <div className="bg-[var(--bg)]">
      <FAQPageJsonLd questions={giftFaq} />
      <EditorialHero
        eyebrow="Pearl Gift Guide"
        title="A Pearl Jewelry Gift Guide for Everyday Giving"
        description="Start with the recipient's usual style and the occasion. Use a size, material, fastening, or care detail only if it is explicitly stated on the exact item page; if it is absent, do not infer it."
        image={heroImage}
        primaryAction={{ label: "Read the gift checklist", href: "#gift-method" }}
        secondaryAction={{ label: "Browse the catalog", href: "/collections/pearl-series" }}
      />

      <section id="gift-method" className="scroll-mt-24 border-b border-[var(--border)] bg-[var(--surface)]" aria-labelledby="gift-method-title">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:py-12">
          <p className="text-xs font-semibold uppercase text-[var(--accent)]">Gift checklist</p>
          <h2 id="gift-method-title" className="mt-3 font-serif text-3xl font-medium text-[var(--text)]">Begin with what you know about the recipient.</h2>
          <div className="mt-8 grid gap-x-8 gap-y-6 border-t border-[var(--border)] pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Usual style", "Notice whether they tend to choose subtle details, stronger shapes, or little jewelry at all."],
              ["Occasion", "Use the occasion as a personal prompt, not as a rule about value or meaning."],
              ["Budget", "Set a comfortable total before browsing; this guide does not state item prices."],
              ["Exact details", "If the exact item page does not explicitly state a needed fact, do not infer it from an image."],
            ].map(([label, copy]) => (
              <div key={label} className="border-t border-[var(--border)] pt-4">
                <h3 className="font-serif text-xl font-medium text-[var(--text)]">{label}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)] bg-[var(--surface)]" aria-labelledby="gift-faq-title">
        <div className="mx-auto max-w-3xl px-6 py-14 sm:py-16">
          <p className="text-xs font-semibold uppercase text-[var(--accent)]">Gift questions</p>
          <h2 id="gift-faq-title" className="mt-3 font-serif text-3xl font-medium text-[var(--text)]">Check the facts before you choose.</h2>
          <dl className="mt-8 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {giftFaq.map((item) => (
              <div key={item.question} className="py-6">
                <dt className="font-serif text-xl font-medium text-[var(--text)]">{item.question}</dt>
                <dd className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="gift-help" className="scroll-mt-24 mx-auto max-w-7xl px-6 py-14 sm:py-16">
        <div className="border-y border-[var(--border)] py-9 sm:flex sm:items-center sm:justify-between sm:gap-10">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--accent)]">Before you choose</p>
            <h2 className="mt-3 font-serif text-3xl font-medium text-[var(--text)]">
              Keep the practical details close.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--text-secondary)]">A general gift guide cannot establish availability, delivery timing, or return eligibility. Read the exact item page, the policy page that applies when you order, and checkout details. If a needed fact is absent, do not infer it.</p>
          </div>
          <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[var(--accent)] sm:mt-0" aria-label="Gift guide help">
            <Link href="/shipping">Shipping</Link>
            <Link href="/refund">Returns</Link>
            <Link href="/pearls/how-to-wear">Styling guide</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
