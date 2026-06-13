// POST /api/automation/generate-pin — AI generate Pinterest pin content

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { productSlug, productName, mood } = await request.json();

    const apiKey = process.env.PIN_AI_API_KEY || process.env.AGNES_API_KEY;
    if (!apiKey) {
      // Return template-based content if no AI key
      const title = `${productName || "Mythical Guardian"} — Handcrafted Luxury Jewelry`;
      const description = `Discover the legend behind this ${productName || "piece"}. Handcrafted in 14k gold and sterling silver. Free shipping on orders over $69.99. Shop the collection at mythrealms-shop.vercel.app`;
      return NextResponse.json({
        title,
        description,
        link: `https://mythrealms-shop.vercel.app/products/${productSlug || ""}`,
        board: "Mythical Jewelry Collection",
        tags: ["mythicaljewelry", "chinesemythology", "luxuryjewelry"],
      });
    }

    const prompt = mood === "story"
      ? `Write a Pinterest pin title and description for ${productName || "a mythical beast jewelry piece"} from MythRealms. Title: max 100 chars, keyword-rich. Description: max 500 chars, natural language, emotional, includes CTA. Format: JSON {\"title\":\"...\",\"description\":\"...\"}`
      : `Write a Pinterest pin title and description for ${productName || "a luxury jewelry piece"} from MythRealms. Focus on ${mood || "craftsmanship and materials"}. Format: JSON {\"title\":\"...\",\"description\":\"...\"}`;

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

    // Parse JSON from AI response
    let parsed;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch { parsed = null; }

    return NextResponse.json({
      title: parsed?.title || `${productName} — MythRealms`,
      description: parsed?.description || `${productName}. Handcrafted luxury jewelry. Free shipping.`,
      link: `https://mythrealms-shop.vercel.app/products/${productSlug || ""}`,
      board: mood === "story" ? "Chinese Mythology & Legends" : "Mythical Jewelry Collection",
      tags: ["mythicaljewelry", "chinesemythology", "luxuryjewelry", "shanhaijing"],
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
