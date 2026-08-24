// JSON-LD structured data for search engines and answer engines.

import {
  buildArticleSchema,
  buildBreadcrumbListSchema,
  buildFAQPageSchema,
  buildItemListSchema,
  buildOrganizationSchema,
  buildProductSchema,
  type ArticleSchemaInput,
  type ItemListSchemaInput,
  type ProductSchemaInput,
} from "@/lib/seo/schema";
import { BRAND } from "@/lib/brand-identity";
import { absoluteUrl, siteUrl } from "@/lib/site";
import { STORE_POLICY_FACTS } from "@/lib/storefront/policies";

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

interface BlogPostingDataProps {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished: Date;
  dateModified: Date;
  authorName: string;
}

export function buildBlogPostingData({
  headline,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName: _authorName,
}: BlogPostingDataProps): Record<string, unknown> {
  return {
    "@context": "https://schema.org/",
    "@type": "BlogPosting",
    headline,
    description,
    ...(image ? { image } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: datePublished.toISOString(),
    dateModified: dateModified.toISOString(),
    author: { "@type": "Organization", name: `${BRAND.name} Editorial` },
    publisher: { "@type": "Organization", name: BRAND.name },
  };
}

export function BlogPostingJsonLd(props: BlogPostingDataProps) {
  return <JsonLd data={buildBlogPostingData(props)} />;
}

interface ProductSchemaProps extends Omit<ProductSchemaInput, "availability"> {
  comparePrice?: number | null;
  availability?: ProductSchemaInput["availability"];
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
  brand = BRAND.name,
  category,
  policyFacts,
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
        policyFacts,
      })}
    />
  );
}

export function ArticleJsonLd(input: ArticleSchemaInput) {
  return <JsonLd data={buildArticleSchema(input)} />;
}

export function ItemListJsonLd(input: ItemListSchemaInput) {
  return <JsonLd data={buildItemListSchema(input)} />;
}

interface BreadcrumbSchemaProps {
  items: readonly { name: string; url: string }[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbSchemaProps) {
  return <JsonLd data={buildBreadcrumbListSchema(items)} />;
}

export function OrganizationJsonLd() {
  const { contactPoint: _unverifiedContactPoint, ...organization } =
    buildOrganizationSchema({
      url: siteUrl,
      logo: absoluteUrl("/apple-icon.png"),
      contactEmail: "",
      description: BRAND.promise,
      policyFacts: STORE_POLICY_FACTS,
      knowsAbout: [
        "Pearl jewelry",
        "Jewelry styling",
        "Pearl care",
      ],
    });

  return (
    <JsonLd
      data={organization}
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
    name: BRAND.name,
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
