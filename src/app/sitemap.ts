import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const staticPages = [
    "", "/about", "/faq", "/blog", "/contact", "/cart", "/checkout",
    "/track-order", "/shipping", "/refund", "/privacy", "/terms", "/size-guide",
    "/auth/signin", "/auth/register",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  // Dynamic: products
  const products = await db.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } });
  const productUrls = products.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic: collections
  const categories = await db.category.findMany({ select: { slug: true } });
  const collectionUrls = categories.map((c) => ({
    url: `${baseUrl}/collections/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Dynamic: blog posts
  const posts = await db.blogPost.findMany({ select: { slug: true, updatedAt: true } });
  const blogUrls = posts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...collectionUrls, ...productUrls, ...blogUrls];
}
