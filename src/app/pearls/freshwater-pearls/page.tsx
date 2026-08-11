import type { Metadata } from "next";

import { JsonLd } from "@/components/ui/JsonLd";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

const canonical = absoluteUrl("/pearls/freshwater-pearls");
const heading = "Freshwater Cultured Pearl Basics";
const title = `${heading} | ${SITE_NAME}`;
const description =
  "Learn what “freshwater cultured pearls” means in general education, which details to compare, and why a category term cannot verify a specific jewelry item.";
const directAnswer =
  "Freshwater cultured pearls are a general pearl category usually cultivated in freshwater lakes and ponds. They can occur in varied sizes, shapes, and colors. This guide explains the terminology and the questions to ask; it does not identify, classify, or describe the materials, origin, treatment, or quality of any specific jewelry item.";
const articleLinkClass =
  "text-stone-950 underline decoration-stone-500 underline-offset-4 transition-colors hover:text-stone-700 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-950";

const faq = [
  {
    question: "What does “freshwater cultured pearl” mean?",
    answer:
      "In general education, it describes a cultured-pearl category usually cultivated in freshwater lakes and ponds. It does not identify the material, origin, treatment, or quality of a specific jewelry item.",
  },
  {
    question: "Does “freshwater” tell me what a specific item contains?",
    answer:
      "No. A category term or photograph cannot establish whether a specific item is freshwater, cultured, natural, imitation, treated, or of a particular quality. Use only the exact item’s verified information for those facts.",
  },
  {
    question: "What details are useful to compare when they are disclosed?",
    answer:
      "GIA’s general vocabulary includes size, shape, color, luster, surface, nacre, and matching. These are comparison questions, not a grade assigned by this guide or evidence about an item without a verified description.",
  },
  {
    question: "Why does precise pearl terminology matter?",
    answer:
      "The FTC distinguishes natural, cultured, and imitation pearls and advises clear identification in advertising. This guide therefore uses category terms only for general education; it does not make a compliance conclusion about any seller or listing.",
  },
] as const;

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

export default function FreshwaterPearlsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            {
              "@type": "ListItem",
              position: 2,
              name: "Pearl Knowledge",
              item: absoluteUrl("/pearls"),
            },
            { "@type": "ListItem", position: 3, name: heading, item: canonical },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: heading,
          description,
          url: canonical,
          mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map(({ question, answer }) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          })),
        }}
      />

      <article>
        <p className="text-sm uppercase tracking-[0.2em] text-stone-600">Pearl Guide</p>
        <h1 className="mt-4 text-4xl font-medium tracking-tight text-stone-950 sm:text-5xl">
          {heading}
        </h1>
        <p className="mt-6 text-lg leading-8 text-stone-700">{directAnswer}</p>

        <section className="mt-12 space-y-5">
          <h2 className="text-2xl font-medium text-stone-950">
            What does “freshwater cultured pearl” mean?
          </h2>
          <p>
            In general pearl education, <strong>freshwater cultured pearls</strong> are a
            cultured-pearl category usually cultivated in freshwater lakes and ponds. GIA describes
            this category as occurring in varied sizes, shapes, and colors. The phrase is useful
            for learning vocabulary, but it is not a complete description of a jewelry item.
          </p>
          <p>
            Natural, cultured, and imitation are different general terms. The FTC explains that
            natural pearls form without human help, cultured pearls involve human intervention in
            the process, and imitation pearls are manufactured from other materials. Those
            definitions do not classify an item shown on this site or in any photograph.
          </p>
        </section>

        <section className="mt-12 space-y-5">
          <h2 className="text-2xl font-medium text-stone-950">
            Which details are useful to compare?
          </h2>
          <p>
            When an item is accurately described, GIA’s general comparison vocabulary can help a
            shopper read the details that are actually disclosed: size, shape, color, luster,
            surface, nacre, and matching. These are questions for comparing verified information,
            not a quality grade assigned by this guide.
          </p>
          <p>
            Photographs and a category label cannot establish scale, color origin, treatment,
            surface condition, matching, or value. If a detail matters to a decision, look for a
            precise written description for that exact item rather than inferring it from styling
            or an image.
          </p>
        </section>

        <section className="mt-12 space-y-5">
          <h2 className="text-2xl font-medium text-stone-950">
            What can this guide not tell you?
          </h2>
          <p>
            This guide does not identify the pearl type or any other material in a particular item.
            It does not confirm whether an item is freshwater, cultured, natural, imitation,
            treated, dyed, or of a particular origin or quality. It also cannot establish
            dimensions, weight, fastening, comfort, allergy suitability, care instructions,
            availability, price, delivery, or return terms.
          </p>
          <p>
            Use general education to frame a question, then rely on the smallest claim supported
            by the exact item’s verified information. If an important fact is not disclosed, do
            not assume it from a category label or photograph.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-medium text-stone-950">Sources</h2>
          <ul className="mt-6 list-disc space-y-3 pl-5">
            <li>
              <a className={articleLinkClass} href="https://www.gia.edu/pearl-description">
                GIA: Different Pearl Types &amp; Colors
              </a>
            </li>
            <li>
              <a className={articleLinkClass} href="https://www.gia.edu/pearl/buyers-guide">
                GIA: Pearl Buyer’s Guide
              </a>
            </li>
            <li>
              <a
                className={articleLinkClass}
                href="https://consumer.ftc.gov/articles/buying-gemstones-diamonds-and-pearls"
              >
                FTC: Buying Gemstones, Diamonds, and Pearls
              </a>
            </li>
            <li>
              <a
                className={articleLinkClass}
                href="https://www.ftc.gov/business-guidance/resources/loupe-advertising-diamond-gemstones-pearls"
              >
                FTC: In the Loupe: Advertising Diamonds, Gemstones and Pearls
              </a>
            </li>
          </ul>
        </section>

        <nav className="mt-12 space-y-3" aria-label="Related reading">
          <a className={`block ${articleLinkClass}`} href="/pearls/care">
            Read the general pearl care guide
          </a>
          <a className={`block ${articleLinkClass}`} href="/pearls/how-to-wear">
            Read everyday styling ideas
          </a>
        </nav>

        <section className="mt-12">
          <h2 className="text-2xl font-medium text-stone-950">
            Frequently asked questions
          </h2>
          <dl className="mt-6 space-y-6">
            {faq.map((item) => (
              <div key={item.question}>
                <dt className="font-medium text-stone-950">{item.question}</dt>
                <dd className="mt-2 text-stone-700">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </article>
    </div>
  );
}
