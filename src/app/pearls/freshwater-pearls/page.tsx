import type { Metadata } from "next";

import { GuideLayout } from "@/components/editorial/GuideLayout";
import { ArticleJsonLd, BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/ui/JsonLd";
import { getRelatedGuideProducts, PEARL_GUIDES } from "@/lib/editorial/guides";
import { absoluteUrl } from "@/lib/site";

const guide = PEARL_GUIDES["freshwater-pearls"];
const canonical = absoluteUrl("/pearls/freshwater-pearls");
const image = absoluteUrl(guide.image.src);
const title = `${guide.seoTitle} | MythRealms`;

export const metadata: Metadata = {
  title,
  description: guide.description,
  alternates: { canonical },
  openGraph: {
    title,
    description: guide.description,
    url: canonical,
    type: "article",
    publishedTime: guide.updated,
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

export default function FreshwaterPearlsPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Pearl Knowledge", href: "/pearls" },
    { label: guide.title, href: "/pearls/freshwater-pearls" },
  ] as const;
  const relatedGuides = Object.values(PEARL_GUIDES)
    .filter((item) => item.slug !== guide.slug)
    .map((item) => ({ title: item.title, description: item.description, href: `/pearls/${item.slug}` }));

  return (
    <div>
      <BreadcrumbJsonLd items={breadcrumbs.map((item) => ({ name: item.label, url: absoluteUrl(item.href) }))} />
      <ArticleJsonLd title={guide.title} description={guide.directAnswer} url={canonical} image={image} datePublished={guide.updated} dateModified={guide.updated} />
      <FAQPageJsonLd questions={guide.faq} />
      <GuideLayout breadcrumbs={breadcrumbs} guide={guide} relatedGuides={relatedGuides} relatedProducts={getRelatedGuideProducts(guide)} />
    </div>
  );
}
