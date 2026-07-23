import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EditorialHero } from "@/components/editorial/EditorialHero";
import { BreadcrumbJsonLd, JsonLd } from "@/components/ui/JsonLd";
import { STORY_CONTENT, type StorySection } from "@/lib/editorial/story";
import { buildAboutPageSchema } from "@/lib/seo/schema";
import { absoluteUrl } from "@/lib/site";

const { seo, hero } = STORY_CONTENT;
const canonicalUrl = absoluteUrl("/about");
const socialImage = absoluteUrl(hero.image.src);

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: seo.title,
    description: seo.description,
    url: canonicalUrl,
    type: "website",
    siteName: "MythRealms",
    images: [{ url: socialImage, alt: hero.image.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: [{ url: socialImage, alt: hero.image.alt }],
  },
};

function StorySectionBlock({ section }: { section: StorySection }) {
  if (section.kind === "text") {
    return (
      <section id={section.id} className="bg-[var(--surface)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase text-[var(--accent)]">
              {section.eyebrow}
            </p>
            <h2 className="mt-3 font-serif text-3xl font-medium text-[var(--text)] sm:text-4xl">
              {section.title}
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-[var(--text-secondary)]">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.kind === "reference") {
    return (
      <section id={section.id} className="bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--accent)]">
                {section.eyebrow}
              </p>
              <h2 className="mt-3 font-serif text-3xl font-medium text-[var(--text)] sm:text-4xl">
                {section.title}
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-[var(--text-secondary)]">
              {section.introduction}
            </p>
          </div>

          <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-6 lg:mt-14 lg:gap-10">
            {[section.reference, section.editorial].map((item) => (
              <figure key={item.title} className="min-w-0">
                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--surface-alt)]">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(max-width: 767px) 100vw, 50vw"
                    className="object-cover"
                    style={{ objectPosition: item.image.objectPosition ?? "center" }}
                  />
                </div>
                <figcaption className="border-t border-[var(--border)] pt-5">
                  <h3 className="font-serif text-2xl font-medium text-[var(--text)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                    {item.text}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="mt-12 border-y border-[var(--border)] py-6 text-sm font-medium leading-7 text-[var(--text)] sm:text-base">
            {section.disclosure}
          </p>
        </div>
      </section>
    );
  }

  const isPromise = section.id === "what-we-promise";

  return (
    <section
      id={section.id}
      className={isPromise ? "bg-[var(--surface)]" : "bg-[var(--surface-alt)]"}
    >
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--accent)]">
              {section.eyebrow}
            </p>
            <h2 className="mt-3 font-serif text-3xl font-medium text-[var(--text)] sm:text-4xl">
              {section.title}
            </h2>
          </div>
          <div>
            <p className="max-w-2xl text-base leading-8 text-[var(--text-secondary)]">
              {section.introduction}
            </p>
            <div className="mt-8 grid gap-x-8 sm:grid-cols-2">
              {section.details.map((detail) => (
                <div key={detail.title} className="border-t border-[var(--border)] py-6">
                  <h3 className="font-serif text-xl font-medium text-[var(--text)]">
                    {detail.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                    {detail.text}
                  </p>
                </div>
              ))}
            </div>
            {section.closing && (
              <p className="mt-2 border-t border-[var(--border)] pt-6 text-sm leading-7 text-[var(--text-secondary)]">
                {section.closing}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="bg-[var(--bg)]">
      <JsonLd
        data={buildAboutPageSchema({
          name: "Our Story | MythRealms",
          description: seo.description,
          url: canonicalUrl,
        })}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: absoluteUrl("/") },
          { name: "Our Story", url: canonicalUrl },
        ]}
      />

      <EditorialHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        image={hero.image}
      />

      {STORY_CONTENT.sections.map((section) => (
        <StorySectionBlock key={section.id} section={section} />
      ))}

      <section className="bg-[#202a28] text-white" aria-labelledby="story-editorial-title">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
          <p className="text-xs font-semibold uppercase text-white/70">
            {STORY_CONTENT.editorialStrip.eyebrow}
          </p>
          <div className="mt-3 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <h2 id="story-editorial-title" className="font-serif text-3xl font-medium sm:text-4xl">
              {STORY_CONTENT.editorialStrip.title}
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
              {STORY_CONTENT.editorialStrip.description}
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-3">
          {STORY_CONTENT.editorialImages.map((image) => (
            <figure key={image.src} className="relative aspect-[4/3] min-w-0 overflow-hidden">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 639px) 100vw, 33vw"
                className="object-cover"
                style={{
                  objectPosition:
                    "objectPosition" in image && typeof image.objectPosition === "string"
                      ? image.objectPosition
                      : "center",
                }}
              />
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <div className="border-y border-[var(--border)] py-10 sm:flex sm:items-center sm:justify-between sm:gap-10">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase text-[var(--accent)]">Continue</p>
              <h2 className="mt-3 font-serif text-3xl font-medium text-[var(--text)]">
                Find your way into the edit.
              </h2>
            </div>
            <div className="mt-7 flex flex-col items-start gap-5 sm:mt-0 sm:items-end">
              {STORY_CONTENT.actions.map((action, index) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={
                    index === 0
                      ? "inline-flex items-center gap-2 bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]"
                      : "inline-flex items-center gap-2 border-b border-[var(--border)] pb-1 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  }
                >
                  {action.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
