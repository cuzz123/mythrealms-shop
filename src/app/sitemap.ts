import type { MetadataRoute } from "next";

import { db } from "@/lib/db";
import { buildSitemapEntries } from "@/lib/seo/sitemap";
import { isPearlEditorialPost } from "@/lib/seo/blog";
import { siteUrl } from "@/lib/site";
import { getStorefrontProducts } from "@/lib/storefront/catalog";
import { PEARL_EDITS } from "@/lib/storefront/pearl-edits";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    getStorefrontProducts(),
    posts.filter(isPearlEditorialPost),
    PEARL_EDITS.map((edit) => edit.route),
  );
}
