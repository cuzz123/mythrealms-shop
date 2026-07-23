import type { Metadata } from "next";

import { GuideLayout } from "@/components/editorial/GuideLayout";
import { ArticleJsonLd, BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/ui/JsonLd";
import { getRelatedGuideProducts, PEARL_GUIDES } from "@/lib/editorial/guides";
import { absoluteUrl } from "@/lib/site";

const guide = PEARL_GUIDES.care;
const canonical = absoluteUrl("/pearls/care");
const image = absoluteUrl(guide.image.src);
const title = `${guide.seoTitle} | MythRealms`;
const careQuickAnswers = [
  {
    question: "Should I put pearl jewelry on before getting dressed?",
    answer: "Put pearl jewelry on after cosmetics, fragrance, and hair products, then remove it before changing clothes or using household cleaners.",
  },
  {
    question: "What should I do after pearl jewelry gets wet?",
    answer: "Use a soft, clean cloth to remove surface moisture, then let the piece air-dry fully before storing it flat in a soft pouch or cloth.",
  },
  {
    question: "When should I ask a jeweler for help?",
    answer: "Ask a qualified jeweler when a pearl piece needs repair, restringing, or care beyond a gentle wipe with a soft cloth.",
  },
] as const;

export const metadata: Metadata = {
  title,
  description: guide.description,
  alternates: { canonical },
  openGraph: {
    title,
    description: guide.description,
    url: canonical,
    type: "article",
    publishedTime: guide.published,
    modifiedTime: guide.updated,
    images: [{ url: image, alt: guide.image.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: guide.description,
    images: [{ url: image, alt: guide.image.alt }],
  },
};

export default function PearlCarePage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Pearl Knowledge", href: "/pearls" },
    { label: guide.title, href: "/pearls/care" },
  ] as const;
  const relatedGuides = Object.values(PEARL_GUIDES)
    .filter((item) => item.slug !== guide.slug)
    .map((item) => ({ title: item.title, description: item.description, href: `/pearls/${item.slug}` }));

  return (
    <div>
      <BreadcrumbJsonLd items={breadcrumbs.map((item) => ({ name: item.label, url: absoluteUrl(item.href) }))} />
      <ArticleJsonLd title={guide.title} description={guide.directAnswer} url={canonical} image={image} datePublished={guide.published} dateModified={guide.updated} />
      <FAQPageJsonLd questions={guide.faq} />
      <GuideLayout breadcrumbs={breadcrumbs} guide={guide} relatedGuides={relatedGuides} relatedProducts={getRelatedGuideProducts(guide)} />
      <section className="border-t border-[var(--border)] bg-[var(--surface)]" aria-labelledby="care-quick-answers-title">
        <div className="mx-auto max-w-3xl px-6 py-14 sm:py-16">
          <p className="text-xs font-semibold uppercase text-[var(--accent)]">Care reminders</p>
          <h2 id="care-quick-answers-title" className="mt-3 font-serif text-3xl font-medium text-[var(--text)]">A few more practical answers</h2>
          <dl className="mt-8 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {careQuickAnswers.map((item) => (
              <div key={item.question} className="py-6">
                <dt className="font-serif text-xl font-medium text-[var(--text)]">{item.question}</dt>
                <dd className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
