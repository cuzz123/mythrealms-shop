// SEO/GEO — BreadcrumbList JSON-LD
import React from "react";

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  if (items.length === 0) return null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BlogPostJsonLd({ title, excerpt, image, datePublished, author, url }: {
  title: string; excerpt: string; image?: string; datePublished: string; author: string; url: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    ...(image ? { image } : {}),
    datePublished,
    author: { "@type": "Person", name: author },
    url,
    publisher: {
      "@type": "Organization",
      name: "MythRealms",
      url: process.env.NEXT_PUBLIC_APP_URL || "https://mythrealms-shop.vercel.app",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
