// POST /api/automation/generate-pin
// Generate Pinterest pin copy for MythRealms products.

import { NextRequest, NextResponse } from "next/server";

const fallbackTags = [
  "pearljewelry",
  "gemstonejewelry",
  "intentionjewelry",
  "quietluxury",
  "jewelryinspo",
];

export async function POST(request: NextRequest) {
  try {
    const { productSlug, productName, mood } = await request.json();
    const name = productName || "Pearl & Gemstone Jewelry";

    const apiKey = process.env.PIN_AI_API_KEY || process.env.AGNES_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        title: `${name} | MythRealms Intention Jewelry`,
        description: `Discover ${name} from MythRealms: pearl and gemstone jewelry made for calm, renewal, boundaries, and soft power. Free shipping on orders over $69.99.`,
        link: `https://mythrealms-shop.vercel.app/products/${productSlug || ""}`,
        board: "Pearl & Gemstone Intention Jewelry",
        tags: fallbackTags,
      });
    }

    const prompt =
      mood === "story"
        ? `Write Pinterest copy for ${name} from MythRealms, a pearl and gemstone jewelry brand built around modern guardian archetypes and intention. Do not claim 14k gold, sterling silver, healing, medical effects, or guaranteed spiritual outcomes. Title max 100 characters. Description max 500 characters. Include a soft CTA. Format as JSON {"title":"...","description":"..."}`
        : `Write Pinterest copy for ${name} from MythRealms. Focus on ${mood || "pearl and gemstone styling, intention, and everyday wear"}. Do not claim 14k gold, sterling silver, healing, medical effects, or guaranteed spiritual outcomes. Format as JSON {"title":"...","description":"..."}`;

    const res = await fetch("https://apihub.agnes-ai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "agnes-text-v1.0",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
      }),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";

    let parsed: { title?: string; description?: string } | null;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      parsed = null;
    }

    return NextResponse.json({
      title: parsed?.title || `${name} | MythRealms`,
      description:
        parsed?.description ||
        `${name}. Pearl and gemstone jewelry for calm, renewal, boundaries, and soft power. Free shipping over $69.99.`,
      link: `https://mythrealms-shop.vercel.app/products/${productSlug || ""}`,
      board: mood === "story" ? "Guardian Archetype Jewelry" : "Pearl & Gemstone Jewelry",
      tags: fallbackTags,
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to generate Pinterest copy" },
      { status: 500 }
    );
  }
}
