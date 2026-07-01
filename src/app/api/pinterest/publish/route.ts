// GET /api/pinterest/publish — Auto-publish pins from current product data
// Supports ?limit=N (default 5) to control how many pins per run
// Supports ?offset=N to skip already-published products

import { imageUrl } from "@/lib/images";
import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/1688-products";

export const dynamic = "force-dynamic";

function sanitize(text: string, max: number): string {
  return text
    .replace(/[^\x20-\x7E\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function buildPinData(product: typeof PRODUCTS[0], base: string) {
  const name = sanitize(product.name, 60);
  const intention = sanitize(product.intention || "Crystal Intention", 30);
  const title = `${name} — ${intention} | MythRealms`;

  const triple = sanitize(product.benefitTriplet || "", 80);
  const descRaw = product.description.replace(/\s+/g, " ").trim().slice(0, 250);
  const desc = `${triple}. ${descRaw} Shop MythRealms. Free shipping over $69.99.`;

  const imagePath = product.image.startsWith("/")
    ? product.image
    : `/images/products/1688-shop/${product.category}/${product.slug}-main.webp`;

  return {
    title: sanitize(title, 100),
    description: sanitize(desc, 500),
    link: `${base}/products/${product.slug}`,
    media_source: {
      source_type: "image_url",
      url: `${base}${imagePath}`,
    },
  };
}

export async function GET(request: NextRequest) {
  const TOKEN = process.env.PINTEREST_API_TOKEN || "";
  const BOARD_ID = process.env.PINTEREST_BOARD_ID || "";
  const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://mythrealms-shop.vercel.app";

  if (!TOKEN || !BOARD_ID) {
    return NextResponse.json({
      error: "Pinterest API not configured. Set PINTEREST_API_TOKEN and PINTEREST_BOARD_ID in env.",
      hint: "Get token: https://developers.pinterest.com/docs/getting-started/authentication/"
    }, { status: 500 });
  }

  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "5"), 20);
  const offset = parseInt(url.searchParams.get("offset") || "0");

  const activeProducts = PRODUCTS.filter(p => p.isActive && p.inStock);
  const batch = activeProducts.slice(offset, offset + limit);

  const results: { product: string; status: string; error?: string; pin_id?: string }[] = [];

  for (const product of batch) {
    try {
      const pinData = buildPinData(product, BASE);

      const r = await fetch("https://api.pinterest.com/v5/pins", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: pinData.title,
          description: pinData.description,
          link: pinData.link,
          board_id: BOARD_ID,
          media_source: pinData.media_source,
        }),
      });

      const body = await r.json();

      if (r.status === 201) {
        results.push({ product: product.name, status: "published", pin_id: body.id });
      } else if (r.status === 429) {
        results.push({ product: product.name, status: "rate_limited", error: body.message });
        break; // stop on rate limit, resume later
      } else {
        results.push({ product: product.name, status: "failed", error: body.message || JSON.stringify(body).slice(0, 200) });
      }
    } catch (e: any) {
      results.push({ product: product.name, status: "error", error: e.message?.slice(0, 200) });
    }

    await new Promise(r => setTimeout(r, 1100));
  }

  const published = results.filter(r => r.status === "published").length;
  const failed = results.filter(r => r.status !== "published").length;

  return NextResponse.json({
    summary: {
      published,
      failed,
      total_active: activeProducts.length,
      batch: { offset, limit: batch.length },
      has_more: offset + batch.length < activeProducts.length,
    },
    results,
    next: offset + batch.length < activeProducts.length
      ? `/api/pinterest/publish?limit=${limit}&offset=${offset + batch.length}`
      : null,
  });
}
