import type { Product } from "@/lib/1688-products";
import { absoluteImageUrl } from "@/lib/images";
import { productDisplayName } from "@/lib/brand";
import { absoluteUrl } from "@/lib/site";
import { getStorefrontProducts } from "@/lib/storefront/catalog";

const fallbackTags = [
  "pearljewelry",
  "pearlearrings",
  "pearlnecklace",
  "quietluxury",
  "jewelryinspo",
];

type AgnesResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

export type PinterestContent = {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  tags: string[];
};

export function getEligiblePinterestProducts(): Product[] {
  return getStorefrontProducts();
}

export async function generatePinterestContent(product: Product, mood = "styling"): Promise<PinterestContent> {
  const name = productDisplayName(product);
  const fallback = buildFallbackContent(product, name);
  const apiKey = process.env.PIN_AI_API_KEY || process.env.AGNES_API_KEY;

  if (!apiKey) return fallback;

  const prompt = [
    `Write Pinterest copy for ${name} from MythRealms.`,
    `Focus on ${mood}, pearl styling, and everyday wear.`,
    "Do not claim precious-metal specifications, healing, medical effects, or guaranteed spiritual outcomes.",
    "Use a warm editorial tone. Title: 100 characters maximum. Description: 500 characters maximum. Include a soft CTA.",
    'Return only valid JSON: {"title":"...","description":"..."}.',
  ].join(" ");

  try {
    const response = await fetch("https://apihub.agnes-ai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "agnes-text-v1.0",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) return fallback;

    const data = (await response.json()) as AgnesResponse;
    const content = data.choices?.[0]?.message?.content || "";
    const parsed = parsePinterestCopy(content);

    return {
      ...fallback,
      title: sanitizeCopy(parsed?.title || fallback.title, 100),
      description: sanitizeCopy(parsed?.description || fallback.description, 500),
    };
  } catch {
    return fallback;
  }
}

function buildFallbackContent(product: Product, name: string): PinterestContent {
  const intention = sanitizeCopy(product.intention || "Everyday intention", 48);
  const description = `${name} from The Pearl Edit brings light-catching pearl detail to everyday styling. A thoughtful choice for ${intention.toLowerCase()}, quiet confidence, and meaningful gifting. Explore the piece.`;

  return {
    title: sanitizeCopy(`${name} | The Pearl Edit`, 100),
    description: sanitizeCopy(description, 500),
    imageUrl: absoluteImageUrl(product.image),
    link: absoluteUrl(`/products/${product.slug}`),
    tags: fallbackTags,
  };
}

function parsePinterestCopy(content: string): { title?: string; description?: string } | null {
  try {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) return null;

    const value = JSON.parse(match[0]) as unknown;
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;

    const record = value as Record<string, unknown>;
    return {
      title: typeof record.title === "string" ? record.title : undefined,
      description: typeof record.description === "string" ? record.description : undefined,
    };
  } catch {
    return null;
  }
}

function sanitizeCopy(value: string, maxLength: number): string {
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}
