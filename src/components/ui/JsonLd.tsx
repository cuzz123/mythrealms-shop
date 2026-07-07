// JSON-LD structured data for SEO rich snippets.

interface ProductSchemaProps {
  name: string;
  description: string;
  images: string[];
  price: number;
  comparePrice?: number | null;
  currency?: string;
  sku?: string;
  availability?: "InStock" | "OutOfStock";
  ratingValue?: number;
  reviewCount?: number;
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
  ratingValue,
  reviewCount,
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

  if (ratingValue && reviewCount) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: (Math.round(ratingValue * 10) / 10).toFixed(1),
      reviewCount,
    };
  }

  if (category) {
    data.category = category;
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
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
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org/",
    "@type": "Organization",
    name: "MythRealms",
    url: "https://mythrealms-shop.vercel.app",
    description:
      "Pearl and gemstone jewelry shaped around modern guardian archetypes, everyday intention, calm, renewal, boundaries, and soft power.",
    sameAs: ["https://instagram.com/mythrealms.shop"],
    contactPoint: {
      "@type": "ContactPoint",
      email: "mythrealms@outlook.com",
      contactType: "customer service",
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
