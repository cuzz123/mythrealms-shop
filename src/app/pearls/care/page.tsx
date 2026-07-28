import type { Metadata } from "next";
import Link from "next/link";

import {
  BreadcrumbJsonLd,
  FAQPageJsonLd,
  JsonLd,
} from "@/components/ui/JsonLd";
import { absoluteUrl } from "@/lib/site";

const canonical = absoluteUrl("/pearls/care");
const title = "How to Care for Pearls | Pearl Care Guide";
const description =
  "Read general pearl care guidance on cleaning, heat, chemicals, and storage boundaries. Check the exact item record for item-specific instructions.";
const directAnswer =
  "General pearl-care guidance is to reduce contact with fragrance, cosmetics, heat, and harsh cleaners; wipe pearls with a very soft, clean cloth after wear; and avoid ultrasonic or steam cleaning. This is educational guidance for pearls, not a care instruction for any store item, setting, string, or finish.";

const faq = [
  {
    question: "Should I put pearl jewelry on before fragrance or cosmetics?",
    answer:
      "No. GIA’s general guidance is to put pearls on after fragrance and cosmetics. This does not confirm the composition or care requirements of a particular store item.",
  },
  {
    question: "Can I use an ultrasonic or steam cleaner on pearls?",
    answer:
      "No. GIA advises against ultrasonic and steam cleaning for pearls. For any specific item, use only care instructions that have been approved for that item.",
  },
  {
    question: "What should I do after wearing pearls?",
    answer:
      "GIA recommends wiping cultured pearls with a very soft, clean cloth after wear. Do not treat this general advice as a complete cleaning or storage instruction for every finished item.",
  },
  {
    question: "Does this guide tell me how to care for a product on this site?",
    answer:
      "No. It gives general pearl education. Check the exact item record or ask for verified item-specific information when a detail matters.",
  },
] as const;

const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Pearl Guide", href: "/pearls" },
  { label: "How to Care for Pearls", href: "/pearls/care" },
] as const;

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Care for Pearls",
  description: directAnswer,
  url: canonical,
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": canonical,
  },
} as const;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  openGraph: {
    title,
    description,
    url: canonical,
    type: "article",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function PearlCarePage() {
  return (
    <div>
      <BreadcrumbJsonLd
        items={breadcrumbs.map((item) => ({
          name: item.label,
          url: absoluteUrl(item.href),
        }))}
      />
      <JsonLd data={articleSchema} />
      <FAQPageJsonLd questions={faq} />

      <nav
        className="mx-auto flex max-w-3xl flex-wrap items-center gap-2 px-6 py-4 text-sm text-[var(--text-muted)]"
        aria-label="Breadcrumb"
      >
        {breadcrumbs.map((breadcrumb, index) => (
          <span key={breadcrumb.href} className="inline-flex items-center gap-2">
            {index > 0 && <span aria-hidden="true">/</span>}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-[var(--text)]" aria-current="page">
                {breadcrumb.label}
              </span>
            ) : (
              <Link href={breadcrumb.href} className="hover:text-[var(--accent)]">
                {breadcrumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      <article className="mx-auto max-w-3xl px-6 pb-16 pt-10 sm:pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Pearl Guide
        </p>
        <h1 className="mt-4 font-serif text-4xl font-medium text-[var(--text)] sm:text-5xl">
          How to Care for Pearls
        </h1>
        <p className="mt-6 text-lg leading-8 text-[var(--text)]">{directAnswer}</p>

        <div className="mt-14 space-y-14">
          <section aria-labelledby="everyday-exposure">
            <h2 id="everyday-exposure" className="font-serif text-3xl font-medium text-[var(--text)]">
              Keep everyday exposure in mind
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--text-secondary)]">
              GIA explains that pearls can be affected by heat and by chemicals, including hair spray, perfume, and cosmetics. A simple routine is to put pearl jewelry on after those products and to use a very soft, clean cloth after wear. This is a general approach to pearl care; it does not establish how any particular item in a store should be worn, cleaned, or stored.
            </p>
          </section>

          <section aria-labelledby="gentle-cleaning">
            <h2 id="gentle-cleaning" className="font-serif text-3xl font-medium text-[var(--text)]">
              Use gentle cleaning boundaries
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--text-secondary)]">
              GIA advises against ultrasonic and steam cleaning for pearls. Its care guidance permits occasional cleaning with warm, soapy water, while noting that a strung piece should dry completely before it is worn. Do not apply that general method to a specific item unless its own approved record confirms that the full construction can be cared for that way.
            </p>
          </section>

          <section aria-labelledby="missing-detail">
            <h2 id="missing-detail" className="font-serif text-3xl font-medium text-[var(--text)]">
              Pause when the item-specific detail is missing
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--text-secondary)]">
              An editorial guide cannot verify a particular item’s pearl identity, treatment, setting, string, adhesive, metal, coating, or cleaning tolerance. If an exact item record does not state the care detail you need, do not infer it from a photograph or a general guide. Ask for verified item-specific information before trying a cleaner or repair method.
            </p>
            <p className="mt-5 text-base leading-8 text-[var(--text-secondary)]">
              <Link className="font-semibold text-[var(--accent)]" href="/contact">
                Ask about a product detail
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="general-education">
            <h2 id="general-education" className="font-serif text-3xl font-medium text-[var(--text)]">
              Store general education beside exact instructions
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--text-secondary)]">
              Use this page to understand general pearl-care precautions, then keep any purchase, repair, or product-specific question with the exact item record and current support channel. General education does not promise durability, water resistance, tarnish resistance, skin compatibility, or an outcome from a care routine.
            </p>
          </section>
        </div>

        <section className="mt-16 border-t border-[var(--border)] pt-10" aria-labelledby="care-faq">
          <p className="text-xs font-semibold uppercase text-[var(--accent)]">Quick answers</p>
          <h2 id="care-faq" className="mt-3 font-serif text-3xl font-medium text-[var(--text)]">
            Frequently asked questions
          </h2>
          <dl className="mt-7 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {faq.map((item) => (
              <div key={item.question} className="py-6">
                <dt className="font-serif text-xl font-medium text-[var(--text)]">{item.question}</dt>
                <dd className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-16 border-t border-[var(--border)] pt-10" aria-labelledby="related-guides">
          <h2 id="related-guides" className="font-serif text-3xl font-medium text-[var(--text)]">
            Continue the pearl guide
          </h2>
          <ul className="mt-6 space-y-4 text-sm font-semibold text-[var(--accent)]">
            <li><Link href="/pearls">Explore the Pearl Guide</Link></li>
            <li><Link href="/pearls/how-to-wear">Read everyday pearl styling guidance</Link></li>
            <li><Link href="/pearls/freshwater-pearls">Read general pearl terminology</Link></li>
          </ul>
        </section>
      </article>
    </div>
  );
}
