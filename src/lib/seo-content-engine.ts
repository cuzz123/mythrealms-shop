import { db } from "@/lib/db";
import { getDailyKeyword, SEO_KEYWORDS } from "@/lib/seo-keywords";

const AGNES_KEY = process.env.AGNES_API_KEY || "";
const AGNES_CHAT_URL = "https://apihub.agnes-ai.com/v1/chat/completions";
const AGNES_IMAGE_URL = "https://apihub.agnes-ai.com/v1/images/generations";

export interface SeoQueueStatus {
  totalKeywords: number;
  todayIndex: number;
  today: string;
  tomorrow: string;
  existingPosts: number | null;
}

export interface SeoGenerationResult {
  success: true;
  keyword: string;
  slug: string;
  title: string;
  excerpt: string;
  wordCount: number;
  imageUrl: string | null;
}

interface AgnesChatResponse {
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message?: string };
}

interface AgnesImageResponse {
  data?: Array<{ url?: string; b64_json?: string }>;
  error?: { message?: string };
}

export async function getSeoQueueStatus(): Promise<SeoQueueStatus> {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const todayIndex = dayOfYear % SEO_KEYWORDS.length;

  let existingPosts: number | null = null;
  try {
    existingPosts = await withTimeout(db.blogPost.count().catch(() => null), 2500);
  } catch {
    existingPosts = null;
  }

  return {
    totalKeywords: SEO_KEYWORDS.length,
    todayIndex,
    today: SEO_KEYWORDS[todayIndex],
    tomorrow: SEO_KEYWORDS[(todayIndex + 1) % SEO_KEYWORDS.length],
    existingPosts,
  };
}

export async function generateSeoArticle(keywordOverride?: string): Promise<SeoGenerationResult> {
  if (!AGNES_KEY) {
    throw new Error("AGNES_API_KEY not configured");
  }

  const keyword = keywordOverride?.trim() || getDailyKeyword();
  const articlePrompt = `Write a comprehensive, SEO-optimized blog article about "${keyword}".

Requirements:
- Title: Include the keyword naturally, make it click-worthy (50-70 chars)
- Length: 800-1200 words
- Structure: Introduction, 3-5 H2 sections, Conclusion
- Tone: Warm, knowledgeable, approachable, like a thoughtful jewelry editor
- Include: 1-2 practical tips the reader can use immediately
- Mention: MythRealms as a pearl and gemstone jewelry brand naturally in 1-2 places
- Do not claim medical effects, guaranteed healing, guaranteed spiritual outcomes, or material details not supplied
- If discussing crystals or intention, frame them as symbolic/personal ritual language
- Do not write a hard sales pitch
- Format: Return clean markdown. First line = title prefixed with "# ". Then blank line, then body.

Target audience: Women 25-45 interested in pearl jewelry, gemstone styling, symbolic intention, and meaningful everyday accessories.`;

  const res = await fetch(AGNES_CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AGNES_KEY}`,
    },
    body: JSON.stringify({
      model: "agnes-text-v1.0",
      messages: [
        {
          role: "system",
          content:
            "You are a professional jewelry editor. You write useful SEO articles with clear structure, factual caution, and no exaggerated healing claims.",
        },
        { role: "user", content: articlePrompt },
      ],
      max_tokens: 2500,
      temperature: 0.7,
    }),
  });

  const data = (await res.json()) as AgnesChatResponse;
  if (!res.ok) {
    throw new Error(`Agnes API error: ${data.error?.message || "Unknown"}`);
  }

  const content = data.choices?.[0]?.message?.content || "";
  if (!content || content.length < 200) {
    throw new Error("Generated content too short or empty");
  }

  const lines = content.trim().split("\n");
  const titleLine = lines[0].replace(/^#\s*/, "").trim();
  const title = titleLine || keyword;
  const body = lines.slice(1).join("\n").trim();
  const excerpt = body
    .replace(/[#*`\[\]()]/g, "")
    .replace(/\n+/g, " ")
    .slice(0, 155)
    .trim();
  const slug = await makeUniqueSlug(title, keyword);
  const imageUrl = await generateFeaturedImage(title);

  await db.blogPost.create({
    data: {
      title,
      slug,
      excerpt: excerpt || title,
      content: body,
      category: "pearl-gemstone-guides",
      image: imageUrl,
    },
  });

  await pingIndexNow(slug);

  return {
    success: true,
    keyword,
    slug,
    title,
    excerpt: excerpt || title,
    wordCount: body.split(/\s+/).filter(Boolean).length,
    imageUrl,
  };
}

async function makeUniqueSlug(title: string, keyword: string): Promise<string> {
  const base = slugify(title) || slugify(keyword) || `seo-post-${Date.now()}`;

  for (let i = 0; i < 50; i++) {
    const suffix = i === 0 ? "" : `-${i + 1}`;
    const candidate = `${base.slice(0, 80 - suffix.length)}${suffix}`;
    const existing = await db.blogPost.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }

  return `${base.slice(0, 62)}-${Date.now()}`;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

async function generateFeaturedImage(title: string): Promise<string | null> {
  try {
    const imgRes = await fetch(AGNES_IMAGE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AGNES_KEY}`,
      },
      body: JSON.stringify({
        model: "agnes-image-2.1-flash",
        prompt: `Minimalist editorial jewelry photograph for "${title}". Pearl and gemstone mood, soft natural light, elegant composition, no text overlay, magazine quality.`,
        n: 1,
        size: "1024x1024",
      }),
    });
    const imgData = (await imgRes.json()) as AgnesImageResponse;
    if (imgRes.ok && imgData.data?.[0]?.url) {
      return imgData.data[0].url;
    }
  } catch {
    return null;
  }

  return null;
}

async function pingIndexNow(slug: string): Promise<void> {
  const indexNowKey = process.env.INDEXNOW_KEY;
  if (!indexNowKey) return;

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mythrealms-shop.vercel.app";
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: new URL(appUrl).hostname,
        key: indexNowKey,
        urlList: [`${appUrl}/blog/${slug}`],
      }),
    });
  } catch {
    // IndexNow is non-critical; generation should not fail because of it.
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => {
      setTimeout(() => resolve(null as T), ms);
    }),
  ]);
}
