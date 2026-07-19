import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { EditorialHero } from "@/components/editorial/EditorialHero";
import { RelatedProducts } from "@/components/editorial/RelatedProducts";
import { FAQPageJsonLd } from "@/components/ui/JsonLd";
import {
  getRelatedGuideProducts,
  PEARL_GUIDES,
  PEARL_HUB_FAQ,
  type GuideSlug,
} from "@/lib/editorial/guides";
import { HOMEPAGE_MEDIA } from "@/lib/homepage-editorial";
import { absoluteUrl } from "@/lib/site";

const title = "Pearl Jewelry Guide: Care, Styling & Freshwater Pearls | MythRealms";
const description =
  "Straight answers about pearl jewelry care, everyday styling, and freshwater cultured pearls, with links to current MythRealms pieces.";
const heroImage = HOMEPAGE_MEDIA.everyday;

const GUIDE_QUESTIONS: readonly { slug: GuideSlug; question: string }[] = [
  { slug: "care", question: "How should I care for pearl jewelry?" },
  { slug: "how-to-wear", question: "How can I wear pearls day to day?" },
  { slug: "freshwater-pearls", question: "What are freshwater cultured pearls?" },
];

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl("/pearls") },
  openGraph: {
    title,
    description,
    url: absoluteUrl("/pearls"),
    type: "website",
    images: [{ url: absoluteUrl(heroImage.src), alt: heroImage.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [{ url: absoluteUrl(heroImage.src), alt: heroImage.alt }],
  },
};

function formatUpdatedDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export default function PearlHubPage() {
  const guides = Object.values(PEARL_GUIDES);
  const products = getRelatedGuideProducts(PEARL_GUIDES["how-to-wear"]);

  return (
    <div className="bg-[var(--bg)]">
      <FAQPageJsonLd questions={PEARL_HUB_FAQ} />
      <EditorialHero
        eyebrow="Pearl Knowledge"
        title="Pearl knowledge for choosing, wearing, and caring."
        description="Find direct, practical guidance on pearl care, everyday styling, and the visible characteristics of freshwater cultured pearls."
        image={heroImage}
        primaryAction={{ label: "Choose a guide", href: "#pearl-guides" }}
        secondaryAction={{ label: "Shop The Pearl Edit", href: "/collections/pearl-series" }}
      />

      <section id="pearl-guides" className="scroll-mt-24 border-b border-[var(--border)]" aria-labelledby="pearl-guides-title">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
          <p className="text-xs font-semibold uppercase text-[var(--accent)]">Three practical guides</p>
          <h2 id="pearl-guides-title" className="mt-3 max-w-2xl font-serif text-3xl font-medium text-[var(--text)] sm:text-4xl">
            Read by the question in front of you.
          </h2>
          <div className="mt-10 grid gap-x-7 gap-y-12 lg:grid-cols-3">
            {guides.map((guide) => (
              <article key={guide.slug}>
                <Link href={`/pearls/${guide.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[var(--surface-alt)]">
                    <Image
                      src={guide.image.src}
                      alt={guide.image.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      style={{ objectPosition: guide.image.objectPosition ?? "center" }}
                    />
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase text-[var(--accent)]">
                    Updated {formatUpdatedDate(guide.updated)}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-medium text-[var(--text)] group-hover:text-[var(--accent)]">
                    {guide.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{guide.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                    Read {guide.title}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)] bg-[var(--surface)]" aria-labelledby="question-links-title">
        <div className="mx-auto max-w-4xl px-6 py-14 sm:py-16">
          <h2 id="question-links-title" className="font-serif text-3xl font-medium text-[var(--text)]">
            Start with the question you have
          </h2>
          <ul className="mt-7 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {GUIDE_QUESTIONS.map(({ slug, question }) => (
              <li key={slug}>
                <Link href={`/pearls/${slug}`} className="flex items-center justify-between gap-5 py-5 font-serif text-xl text-[var(--text)] hover:text-[var(--accent)]">
                  {question}
                  <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-[var(--border)]" aria-labelledby="pearl-faq-title">
        <div className="mx-auto max-w-4xl px-6 py-14 sm:py-16">
          <p className="text-xs font-semibold uppercase text-[var(--accent)]">Straight answers</p>
          <h2 id="pearl-faq-title" className="mt-3 font-serif text-3xl font-medium text-[var(--text)] sm:text-4xl">
            General pearl questions
          </h2>
          <dl className="mt-8 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {PEARL_HUB_FAQ.map((item) => (
              <div key={item.question} className="py-6">
                <dt className="font-serif text-xl font-medium text-[var(--text)]">{item.question}</dt>
                <dd className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.answer}</dd>
              </div>
            ))}
          </dl>
          <Link href="/faq" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] underline decoration-[var(--border)] underline-offset-4">
            Read all customer FAQs
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <RelatedProducts
        products={products}
        title="Explore current pearl pieces"
        description="Six active, in-stock pieces from the current MythRealms catalog."
      />

      <section className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 px-6 py-10 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--accent)]">The Pearl Edit</p>
            <h2 className="mt-2 font-serif text-2xl font-medium text-[var(--text)]">See the complete current collection.</h2>
          </div>
          <Link href="/collections/pearl-series" className="inline-flex items-center gap-2 bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--accent-hover)]">
            Shop The Pearl Edit
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
