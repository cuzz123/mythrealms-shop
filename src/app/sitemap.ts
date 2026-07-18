import type { MetadataRoute } from "next";

import { db } from "@/lib/db";
import { buildSitemapEntries } from "@/lib/seo/sitemap";
import { siteUrl } from "@/lib/site";
import { getStorefrontProducts } from "@/lib/storefront/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await db.blogPost.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  return buildSitemapEntries(siteUrl, getStorefrontProducts(), posts);
}
