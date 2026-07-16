import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";
import { getStorefrontProducts } from "@/lib/storefront/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/collections/pearl-series`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/pearls`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/faq`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/size-guide`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/shipping`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/refund`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const products: MetadataRoute.Sitemap = getStorefrontProducts().map(
    (product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  return [...staticPages, ...products];
}
