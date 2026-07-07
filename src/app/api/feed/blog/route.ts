import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://mythrealms-shop.vercel.app";

interface FeedPost {
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: Date;
  category: string | null;
}

export async function GET() {
  let posts: FeedPost[] = [];

  try {
    posts = await Promise.race([
      db.blogPost
        .findMany({
          orderBy: { publishedAt: "desc" },
          take: 20,
          select: {
            title: true,
            slug: true,
            excerpt: true,
            publishedAt: true,
            category: true,
          },
        })
        .catch(() => []),
      new Promise<FeedPost[]>((resolve) => setTimeout(() => resolve([]), 2500)),
    ]);
  } catch (error) {
    console.warn("[blog-feed] Failed to load posts:", error);
  }

  const items = posts
    .map(
      (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${APP_URL}/blog/${encodeURIComponent(p.slug)}</link>
      <guid isPermaLink="true">${APP_URL}/blog/${encodeURIComponent(p.slug)}</guid>
      <description>${escapeXml(p.excerpt || "")}</description>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <category>${escapeXml(p.category || "jewelry")}</category>
    </item>`
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MythRealms Blog - Pearl &amp; Gemstone Jewelry Journal</title>
    <link>${APP_URL}/blog</link>
    <description>Pearl care, gemstone styling, symbolic intention, and modern guardian archetype jewelry notes from MythRealms.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${APP_URL}/api/feed/blog" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
