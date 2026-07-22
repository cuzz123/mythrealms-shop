import type { MetadataRoute } from "next";

import { db } from "@/lib/db";
import { buildSitemapEntries } from "@/lib/seo/sitemap";
import { isPearlEditorialPost } from "@/lib/seo/blog";
import { siteUrl } from "@/lib/site";
import { getStorefrontProducts } from "@/lib/storefront/catalog";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = getStorefrontProducts();
  const posts = await db.blogPost.findMany({
    select: {
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      category: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return buildSitemapEntries(
    siteUrl,
    products,
    posts.filter(isPearlEditorialPost),
  );
}
