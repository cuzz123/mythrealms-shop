import type { MetadataRoute } from "next";

import type { StorefrontProduct } from "@/lib/storefront/catalog";

export interface SitemapPost {
  slug: string;
  updatedAt: Date;
}

export function buildSitemapEntries(
  baseUrl: string,
  products: StorefrontProduct[],
  posts: SitemapPost[],
): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/collections`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/collections/pearl-series`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/collections/new-arrivals`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/gifts`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/guardian-quiz`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/pearls`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/pearls/care`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/pearls/how-to-wear`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/pearls/freshwater-pearls`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/faq`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/size-guide`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/shipping`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/refund`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const entries: MetadataRoute.Sitemap = [
    ...staticPages,
    ...products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
