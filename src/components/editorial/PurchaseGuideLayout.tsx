import Link from "next/link";
import {
  isVisiblePurchaseGuideRelatedHref,
  type PurchaseGuide,
} from "@/lib/editorial/purchase-guides";

export function PurchaseGuideLayout({ guide }: { guide: PurchaseGuide }) {
  return (
    <article className="mx-auto max-w-3xl px-6 pb-16 pt-10 sm:pt-16">
      <nav aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/pearls">Pearl Guide</Link> /{" "}
        <span aria-current="page">{guide.h1}</span>
      </nav>
      <p>{guide.eyebrow}</p>
      <h1>{guide.h1}</h1>
      <p>{guide.directAnswer}</p>
      {guide.sections.map((section) => (
        <section key={section.id} aria-labelledby={section.id}>
          <h2 id={section.id}>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
      <aside aria-labelledby="purchase-guide-boundary">
        <h2 id="purchase-guide-boundary">Before you choose</h2>
        <p>{guide.boundary}</p>
      </aside>
      <section aria-labelledby="purchase-guide-faq">
        <h2 id="purchase-guide-faq">Frequently asked questions</h2>
        <dl>
          {guide.faq.map((item) => (
            <div key={item.question}>
              <dt>{item.question}</dt>
              <dd>{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section aria-labelledby="purchase-guide-sources">
        <h2 id="purchase-guide-sources">Sources</h2>
        <p>Reviewed August 12, 2026</p>
        <ul>
          {guide.sources.map((source) => (
            <li key={source.href}>
              <a
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <nav aria-label="Related reading">
        <ul className="space-y-3">
          {guide.relatedLinks
            .filter((link) => isVisiblePurchaseGuideRelatedHref(link.href))
            .map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
            ))}
        </ul>
      </nav>
    </article>
  );
}
