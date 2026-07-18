// JSON-LD structured data for search engines and answer engines.

import { absoluteUrl, siteUrl } from "@/lib/site";
import {
  buildArticleSchema,
  buildBreadcrumbListSchema,
  buildFAQPageSchema,
  buildOrganizationSchema,
  buildProductSchema,
  type ArticleSchemaInput,
  type OrganizationSchemaInput,
  type ProductSchemaInput,
} from "@/lib/seo/schema";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

interface ProductSchemaProps extends ProductSchemaInput {
  comparePrice?: number | null;
}

export function ProductJsonLd({
  name,
  description,
  images,
  price,
  currency = "USD",
  sku,
  availability = "InStock",
  url,
  brand = "MythRealms",
  category,
}: ProductSchemaProps) {
  return (
    <JsonLd
      data={buildProductSchema({
        name,
        description,
        images,
        price,
        currency,
        sku,
        availability,
        url,
        brand,
        category,
      })}
    />
  );
}

export function ArticleJsonLd(input: ArticleSchemaInput) {
  return <JsonLd data={buildArticleSchema(input)} />;
}

interface BreadcrumbSchemaProps {
  items: readonly { name: string; url: string }[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbSchemaProps) {
  return <JsonLd data={buildBreadcrumbListSchema(items)} />;
}

type OrganizationJsonLdProps = Pick<
  OrganizationSchemaInput,
  "shippingService" | "returnPolicy"
>;

export function OrganizationJsonLd({
  shippingService,
  returnPolicy,
}: OrganizationJsonLdProps = {}) {
  return (
    <JsonLd
      data={buildOrganizationSchema({
        url: siteUrl,
        logo: absoluteUrl("/apple-icon.png"),
        contactEmail: "mythrealms@outlook.com",
        description:
          "An online pearl jewelry shop offering pearl earrings, necklaces, bracelets, and rings with an easy, editorial point of view.",
        knowsAbout: [
          "Pearl jewelry",
          "Jewelry styling",
          "Pearl care",
          "Freshwater pearls",
        ],
        sameAs: ["https://instagram.com/mythrealms.shop"],
        shippingService,
        returnPolicy,
      })}
    />
  );
}

export function FAQPageJsonLd({
  questions,
}: {
  questions: readonly { question: string; answer: string }[];
}) {
  return <JsonLd data={buildFAQPageSchema(questions)} />;
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org/",
    "@type": "WebSite",
    name: "MythRealms",
    url: siteUrl,
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/search?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
  return <JsonLd data={data} />;
}
