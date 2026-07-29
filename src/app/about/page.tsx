import type { Metadata } from "next";

import { BreadcrumbJsonLd, JsonLd } from "@/components/ui/JsonLd";
import { STORY_CONTENT } from "@/lib/editorial/story";
import { buildAboutPageSchema } from "@/lib/seo/schema";
import { absoluteUrl } from "@/lib/site";

const { seo, heading, statement } = STORY_CONTENT;
const canonicalUrl = absoluteUrl("/about");

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: seo.title,
    description: seo.description,
    url: canonicalUrl,
    type: "website",
    siteName: "Maverenne",
  },
  twitter: {
    card: "summary",
    title: seo.title,
    description: seo.description,
  },
};

export default function AboutPage() {
  return (
    <div className="bg-[var(--bg)]">
      <JsonLd
        data={buildAboutPageSchema({
          name: heading,
          description: seo.description,
          url: canonicalUrl,
        })}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: absoluteUrl("/") },
          { name: "About", url: canonicalUrl },
        ]}
      />

      <section aria-labelledby="about-title" className="bg-[var(--surface)]">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
          <p className="text-xs font-semibold uppercase text-[var(--accent)]">About</p>
          <h1
            id="about-title"
            className="mt-3 font-serif text-4xl font-medium text-[var(--text)] sm:text-5xl"
          >
            {heading}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            {statement}
          </p>
        </div>
      </section>
    </div>
  );
}
