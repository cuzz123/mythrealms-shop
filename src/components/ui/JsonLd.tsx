// JSON-LD structured data for search engines and answer engines.

import { absoluteUrl, siteUrl } from "@/lib/site";

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

interface ProductSchemaProps {
  name: string;
  description: string;
  images: string[];
  price: number;
  comparePrice?: number | null;
  currency?: string;
  sku?: string;
  availability?: "InStock" | "OutOfStock";
  url: string;
  brand?: string;
  category?: string;
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
  const data: Record<string, unknown> = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name,
    description: description.slice(0, 500),
    image: images.filter(Boolean),
    sku,
    brand: { "@type": "Brand", name: brand },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: currency,
      price: price.toFixed(2),
      availability: `https://schema.org/${availability}`,
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  if (category) {
    data.category = category;
  }

  return <JsonLd data={data} />;
}

interface BreadcrumbSchemaProps {
  items: { name: string; url: string }[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbSchemaProps) {
  const data = {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return <JsonLd data={data} />;
}

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org/",
    "@type": ["Organization", "OnlineStore"],
    name: "MythRealms",
    url: siteUrl,
    logo: absoluteUrl("/apple-icon.png"),
    description:
      "An online pearl jewelry shop offering pearl earrings, necklaces, bracelets, and rings with an easy, editorial point of view.",
    knowsAbout: [
      "Pearl jewelry",
      "Jewelry styling",
      "Pearl care",
      "Freshwater pearls",
    ],
    sameAs: ["https://instagram.com/mythrealms.shop"],
    contactPoint: {
      "@type": "ContactPoint",
      email: "mythrealms@outlook.com",
      contactType: "customer service",
    },
  };
  return <JsonLd data={data} />;
}

export function FAQPageJsonLd({ questions }: { questions: Array<{ question: string; answer: string }> }) {
  const data = {
    "@context": "https://schema.org/",
    "@type": "FAQPage",
    mainEntity: questions.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
  return <JsonLd data={data} />;
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
