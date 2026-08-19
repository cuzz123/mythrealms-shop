import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PurchaseGuideLayout } from "@/components/editorial/PurchaseGuideLayout";
import { JsonLd } from "@/components/ui/JsonLd";
import {
  getPurchaseGuide,
  isActivePurchaseGuideSlug,
  type PurchaseGuide,
  type PurchaseGuideSlug,
} from "@/lib/editorial/purchase-guides";
import {
  buildBreadcrumbListSchema,
  buildFAQPageSchema,
} from "@/lib/seo/schema";
import { absoluteUrl } from "@/lib/site";

export function buildPurchaseGuideMetadata(guide: PurchaseGuide): Metadata {
  const canonical = absoluteUrl(`/pearls/${guide.slug}`);
  return {
    title: guide.seoTitle,
    description: guide.description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: guide.seoTitle,
      description: guide.description,
      url: canonical,
    },
    twitter: {
      card: "summary",
      title: guide.seoTitle,
      description: guide.description,
    },
  };
}

export function buildPurchaseGuideSchemas(guide: PurchaseGuide) {
  const canonical = absoluteUrl(`/pearls/${guide.slug}`);
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.h1,
    description: guide.directAnswer,
    url: canonical,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
  } as const;
  const faq = buildFAQPageSchema(guide.faq);
  const breadcrumbs = buildBreadcrumbListSchema([
    { name: "Home", url: absoluteUrl("/") },
    { name: "Pearl Guide", url: absoluteUrl("/pearls") },
    { name: guide.h1, url: canonical },
  ]);
  return [article, faq, breadcrumbs] as const;
}

export function PurchaseGuidePage({ slug }: { slug: PurchaseGuideSlug }) {
  if (!isActivePurchaseGuideSlug(slug)) notFound();
  const guide = getPurchaseGuide(slug);
  return (
    <>
      {buildPurchaseGuideSchemas(guide).map((data) => (
        <JsonLd key={String(data["@type"])} data={data} />
      ))}
      <PurchaseGuideLayout guide={guide} />
    </>
  );
}
