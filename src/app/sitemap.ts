import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const staticPages = [
    "", "/about", "/faq", "/blog", "/contact", "/cart", "/checkout",
    "/track-order", "/shipping", "/refund", "/privacy", "/terms", "/size-guide",
    "/auth/signin", "/auth/register", "/wishlist", "/search",
    "/guardian-quiz", "/collections",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path === "/collections" ? 0.9 : 0.8,
  }));

  // Dynamic pages with error fallback
  async function safeProductUrls() {
    try {
      const products = await db.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } });
      return products.map((p) => ({
        url: `${baseUrl}/products/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    } catch (err) {
      console.warn("[sitemap] Failed to load products for sitemap:", err);
      return [];
    }
  }

  async function safeCollectionUrls() {
    try {
      const categories = await db.category.findMany({ select: { slug: true } });
      return categories.map((c) => ({
        url: `${baseUrl}/collections/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.9,
      }));
    } catch (err) {
      console.warn("[sitemap] Failed to load collections for sitemap:", err);
      return [];
    }
  }

  async function safeBlogUrls() {
    try {
      const posts = await db.blogPost.findMany({ select: { slug: true, updatedAt: true } });
      return posts.map((p) => ({
        url: `${baseUrl}/blog/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    } catch (err) {
      console.warn("[sitemap] Failed to load blog posts for sitemap:", err);
      return [];
    }
  }

  const [productUrls, collectionUrls, blogUrls] = await Promise.all([
    safeProductUrls(), safeCollectionUrls(), safeBlogUrls(),
  ]);

  return [...staticPages, ...collectionUrls, ...productUrls, ...blogUrls];
}
