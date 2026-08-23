import type { MetadataRoute } from "next";

import { ACTIVE_PURCHASE_GUIDE_SLUGS } from "@/lib/editorial/purchase-guides";
import type { StorefrontProduct } from "@/lib/storefront/catalog";

export const SEO_FOUNDATION_LAST_MODIFIED = "2026-08-23";

const STATIC_PATHS_WITH_LAST_MODIFIED = new Set([
  "/collections",
  "/collections/pearl-series",
  "/guardian-quiz",
  "/blog",
  "/faq",
  "/size-guide",
]);

export interface SitemapPost {
  slug: string;
  updatedAt: Date;
}

export function buildSitemapEntries(
  baseUrl: string,
  products: StorefrontProduct[],
  posts: SitemapPost[],
  editPaths: readonly string[] = [],
  discoveryPaths: readonly string[] = [],
): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/collections",
    "/collections/pearl-series",
    "/collections/new-arrivals",
    "/gifts",
    "/guardian-quiz",
    "/pearls",
    "/pearls/care",
    "/pearls/how-to-wear",
    "/pearls/freshwater-pearls",
    "/blog",
    "/about",
    "/faq",
    "/contact",
    "/size-guide",
    "/shipping",
    "/refund",
    "/privacy",
    "/terms",
  ];
  const staticPages: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    ...(STATIC_PATHS_WITH_LAST_MODIFIED.has(path)
      ? { lastModified: SEO_FOUNDATION_LAST_MODIFIED }
      : {}),
  }));

  const entries: MetadataRoute.Sitemap = [
    ...staticPages,
    ...products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: SEO_FOUNDATION_LAST_MODIFIED,
    })),
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
    })),
    ...editPaths.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: SEO_FOUNDATION_LAST_MODIFIED,
    })),
    ...discoveryPaths.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: SEO_FOUNDATION_LAST_MODIFIED,
    })),
    ...ACTIVE_PURCHASE_GUIDE_SLUGS.map((slug) => ({
      url: `${baseUrl}/pearls/${slug}`,
    })),
  ];

  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
