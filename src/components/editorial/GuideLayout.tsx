import Link from "next/link";

import { EditorialHero } from "@/components/editorial/EditorialHero";
import { RelatedProducts } from "@/components/editorial/RelatedProducts";
import type { PearlGuide } from "@/lib/editorial/guides";
import type { StorefrontProduct } from "@/lib/storefront/catalog";

export type GuideBreadcrumb = Readonly<{
  label: string;
  href: string;
}>;

export type RelatedGuide = Readonly<{
  title: string;
  description: string;
  href: string;
}>;

export type GuideLayoutProps = Readonly<{
  breadcrumbs: readonly GuideBreadcrumb[];
  guide: PearlGuide;
  relatedGuides: readonly RelatedGuide[];
  relatedProducts: readonly StorefrontProduct[];
}>;

function formatUpdatedDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function GuideLayout({
  breadcrumbs,
  guide,
  relatedGuides,
  relatedProducts,
}: GuideLayoutProps) {
  return (
    <div>
      <nav
        className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-6 py-4 text-sm text-[var(--text-muted)]"
        aria-label="Breadcrumb"
      >
        {breadcrumbs.map((breadcrumb, index) => {
          const isCurrent = index === breadcrumbs.length - 1;

          return (
            <span key={breadcrumb.href} className="inline-flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">/</span>}
              {isCurrent ? (
                <span className="text-[var(--text)]" aria-current="page">
                  {breadcrumb.label}
                </span>
              ) : (
                <Link href={breadcrumb.href} className="hover:text-[var(--accent)]">
                  {breadcrumb.label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>

      <EditorialHero
        eyebrow={guide.eyebrow}
        title={guide.title}
        description={guide.directAnswer}
        image={guide.image}
      />

      <nav
        className="mx-auto max-w-3xl px-6 py-12 sm:py-14"
        aria-labelledby="guide-contents-title"
      >
        <h2
          id="guide-contents-title"
          className="font-serif text-2xl font-medium text-[var(--text)]"
        >
          Table of contents
        </h2>
        <ol className="mt-5 grid gap-3 border-t border-[var(--border)] pt-5 sm:grid-cols-2">
          {guide.sections.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="inline-flex gap-3 text-sm font-semibold text-[var(--text)] hover:text-[var(--accent)]"
              >
                <span className="text-[var(--text-muted)]">{index + 1}.</span>
                {section.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <article className="mx-auto max-w-3xl px-6 pb-16">
        <div className="space-y-14">
          {guide.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="font-serif text-3xl font-medium text-[var(--text)]">
                <a href={`#${section.id}`} className="hover:text-[var(--accent)]">
                  {section.heading}
                </a>
              </h2>
              <p className="mt-4 text-lg leading-8 text-[var(--text)]">{section.answer}</p>
              <div className="mt-5 space-y-4 text-base leading-8 text-[var(--text-secondary)]">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.bullets && (
                <ul className="mt-6 space-y-3 border-l-2 border-[var(--accent)] pl-5 text-sm leading-7 text-[var(--text-secondary)]">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {section.table && (
                <div className="mt-7 overflow-x-auto border-y border-[var(--border)]">
                  <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                    <thead>
                      <tr>
                        {section.table.headers.map((header) => (
                          <th
                            key={header}
                            scope="col"
                            className="border-b border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-semibold text-[var(--text)]"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, rowIndex) => (
                        <tr key={`${section.id}-${rowIndex}`}>
                          {row.map((cell, cellIndex) => (
                            <td
                              key={`${section.id}-${rowIndex}-${cellIndex}`}
                              className="border-b border-[var(--border-light)] px-4 py-3 align-top leading-6 text-[var(--text-secondary)] last:border-b-0"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
        </div>

        <section className="mt-16 border-t border-[var(--border)] pt-10" aria-labelledby="guide-faq-title">
          <p className="text-xs font-semibold uppercase text-[var(--accent)]">Quick answers</p>
          <h2 id="guide-faq-title" className="mt-3 font-serif text-3xl font-medium text-[var(--text)]">
            Frequently asked questions
          </h2>
          <dl className="mt-7 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {guide.faq.map((item) => (
              <div key={item.question} className="py-6">
                <dt className="font-serif text-xl font-medium text-[var(--text)]">{item.question}</dt>
                <dd className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <footer className="mt-12 border-t border-[var(--border)] pt-7 text-sm leading-7 text-[var(--text-secondary)]">
          <p>
            By <span className="font-semibold text-[var(--text)]">{guide.author}</span>
            <span aria-hidden="true"> · </span>
            Updated {formatUpdatedDate(guide.updated)}
          </p>
          <div className="mt-4">
            <p className="font-semibold text-[var(--text)]">Sources</p>
            <ul className="mt-2 space-y-1">
              {guide.sources.map((source) => (
                <li key={source.href}>
                  <a
                    href={source.href}
                    className="text-[var(--accent)] underline decoration-[var(--border)] underline-offset-4 hover:text-[var(--accent-hover)]"
                    {...(isExternalHref(source.href)
                      ? { rel: "noopener noreferrer", target: "_blank" }
                      : {})}
                  >
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </article>

      {relatedGuides.length > 0 && (
        <section className="border-y border-[var(--border)] bg-[var(--surface)] py-14" aria-labelledby="related-guides-title">
          <div className="mx-auto max-w-7xl px-6">
            <h2 id="related-guides-title" className="font-serif text-3xl font-medium text-[var(--text)]">
              Related guides
            </h2>
            <div className="mt-7 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {relatedGuides.map((relatedGuide) => (
                <Link
                  key={relatedGuide.href}
                  href={relatedGuide.href}
                  className="border-t border-[var(--border)] pt-5 hover:border-[var(--accent)]"
                >
                  <h3 className="font-serif text-xl font-medium text-[var(--text)]">
                    {relatedGuide.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                    {relatedGuide.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
