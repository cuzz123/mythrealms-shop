// ============================================================
// SEO 自动化 — 每日文章生成器
// 由 /api/cron/daily 调用，不接受直接外部请求
// 用 Agnes API (免费) 生成 1 篇 800-1200 字 SEO 文章
// 存入 BlogPost 表 → 自动出现在 /blog 页面 → Ping IndexNow 通知 Google
// ============================================================

/**
 * POST /api/cron/seo-daily
 * Vercel Cron calls this daily. Generates 1 SEO blog post using Agnes API.
 * No auth required — secured by Vercel Cron secret header.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getDailyKeyword } from "@/lib/seo-keywords";

const AGNES_KEY = process.env.AGNES_API_KEY || "";
const AGNES_URL = "https://apihub.agnes-ai.com/v1/chat/completions";
const CRON_SECRET = process.env.CRON_SECRET || "";

export async function POST(req: NextRequest) {
  // Verify cron secret
  if (CRON_SECRET) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!AGNES_KEY) {
    return NextResponse.json({ error: "AGNES_API_KEY not configured" }, { status: 500 });
  }

  const keyword = getDailyKeyword();

  try {
    // Step 1: Generate article via Agnes
    const articlePrompt = `Write a comprehensive, SEO-optimized blog article about "${keyword}".

Requirements:
- Title: Include the keyword naturally, make it click-worthy (50-70 chars)
- Length: 800-1200 words
- Structure: Introduction, 3-5 H2 sections, Conclusion
- Tone: Warm, knowledgeable, approachable — like a knowledgeable friend who happens to be a gemologist
- Include: 1-2 practical tips the reader can use immediately
- Mention: MythRealms (crystal and pearl jewelry brand) naturally in 1-2 places where it fits the context
- DO NOT: Write a sales pitch. This is an educational article.
- Format: Return as clean markdown. First line = title prefixed with "# ". Then blank line, then body.

Target audience: Women 25-45 interested in crystals, wellness, intention-setting, and meaningful jewelry.`;

    const res = await fetch(AGNES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AGNES_KEY}`,
      },
      body: JSON.stringify({
        model: "agnes-text-v1.0",
        messages: [
          { role: "system", content: "You are a professional jewelry and wellness writer. You write SEO-optimized blog articles that rank on Google. Return clean markdown. No fluff, no cliches." },
          { role: "user", content: articlePrompt },
        ],
        max_tokens: 2500,
        temperature: 0.7,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Agnes API error:", data.error?.message || data);
      return NextResponse.json(
        { error: `Agnes API error: ${data.error?.message || "Unknown"}` },
        { status: 500 }
      );
    }

    const content = data.choices?.[0]?.message?.content || "";

    if (!content || content.length < 200) {
      return NextResponse.json(
        { error: "Generated content too short or empty" },
        { status: 500 }
      );
    }

    // Step 2: Parse title and body from markdown
    const lines = content.trim().split("\n");
    const titleLine = lines[0].replace(/^#\s*/, "").trim();
    const title = titleLine || keyword;
    const body = lines.slice(1).join("\n").trim();

    // Step 3: Extract excerpt (first 155 chars of body, no markdown)
    const excerpt = body
      .replace(/[#*`\[\]()]/g, "")
      .replace(/\n+/g, " ")
      .slice(0, 155)
      .trim();

    // Step 4: Auto-generate a slug from the title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80);

    // Step 5: Save to database
    const post = await db.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || title,
        content: body,
        category: "crystal-wellness",
      },
    });

    // Step 6: Ping IndexNow for instant Google indexing
    try {
      const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://mythrealms-shop.vercel.app";
      await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: new URL(APP_URL).hostname,
          key: process.env.INDEXNOW_KEY || "default-key",
          urlList: [`${APP_URL}/blog/${slug}`],
        }),
      });
    } catch (e) {
      console.warn("IndexNow ping failed (non-critical):", e);
    }

    return NextResponse.json({
      success: true,
      keyword,
      slug,
      title,
      excerpt,
      wordCount: body.split(/\s+/).length,
    });
  } catch (error) {
    console.error("SEO daily cron error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
