// SEO/GEO — BreadcrumbList JSON-LD
import { JsonLd } from "@/components/ui/JsonLd";
import { BRAND } from "@/lib/brand-identity";
import { absoluteUrl } from "@/lib/site";

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
  return <JsonLd data={jsonLd} />;
}

export function BlogPostJsonLd({ title, excerpt, image, datePublished, dateModified, author: _author, url }: {
  title: string; excerpt: string; image?: string; datePublished: string; dateModified?: string; author: string; url: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    ...(image ? { image } : {}),
    datePublished,
    ...(dateModified ? { dateModified } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: `${BRAND.name} Editorial` },
    url,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: BRAND.name,
      url: absoluteUrl("/"),
      logo: { "@type": "ImageObject", url: absoluteUrl("/apple-icon.png") },
    },
  };
  return <JsonLd data={jsonLd} />;
}
