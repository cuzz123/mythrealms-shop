// GET /api/automation/generate-all-pins — Batch generate Pin content for all products
// Iterates PRODUCTS array, generates title/description/tags per product,
// saves to content/pin-library/ as a JSON manifest

import { NextResponse } from "next/server";
import { PRODUCTS, getBestSellers } from "@/lib/1688-products";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

function buildPin(product: (typeof PRODUCTS)[0], base: string) {
  const name = product.name.replace(/[^\x20-\x7E\s]/g, "").trim();
  const intention = product.intention || "Crystal Intention";
  const triplet = product.benefitTriplet
    ? product.benefitTriplet.replace(/[^\x20-\x7E\s]/g, "").trim()
    : "";
  const descClean = product.description.replace(/\s+/g, " ").trim().slice(0, 250);

  const title = `${name} — ${intention} | MythRealms`;
  const description = `${triplet ? `${triplet}. ` : ""}${descClean} Handcrafted in 14k gold and sterling silver. Free shipping over $69.99.`;
  const imagePath = product.image.startsWith("/")
    ? product.image
    : `/images/products/1688-shop/${product.category}/${product.slug}-main.webp`;

  return {
    productSlug: product.slug,
    productName: name,
    intention,
    title: title.slice(0, 100),
    description: description.slice(0, 500),
    link: `${base}/products/${product.slug}`,
    imageUrl: `${base}${imagePath}`,
    tags: ["mythicaljewelry", "chinesemythology", "handcrafted", "intentionjewelry", intention.toLowerCase().replace(/\s+/g, "")],
    board: intention === "Emotional Balance" ? "Serenity & Peace" : "Mythical Jewelry Collection",
    isBestSeller: product.isBestSeller,
    isNew: product.isNew,
    category: product.categoryName,
    price: product.price,
  };
}

export async function GET() {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || "https://mythrealms-shop.vercel.app";
    const active = PRODUCTS.filter((p) => p.isActive && p.inStock);

    const library = active.map((p) => buildPin(p, base));

    // Group by category for convenience
    const byCategory: Record<string, typeof library> = {};
    for (const pin of library) {
      if (!byCategory[pin.category]) byCategory[pin.category] = [];
      byCategory[pin.category].push(pin);
    }

    // Write to content/pin-library/ as JSON
    const outputPath = path.join(process.cwd(), "content", "pin-library", "all-pins.json");
    const manifest = {
      generatedAt: new Date().toISOString(),
      total: library.length,
      pins: library,
      byCategory,
    };

    await fs.writeFile(outputPath, JSON.stringify(manifest, null, 2), "utf-8");

    return NextResponse.json({
      generated: true,
      total: library.length,
      categories: Object.keys(byCategory).map((c) => ({ name: c, count: byCategory[c].length })),
      bestSellers: library.filter((p) => p.isBestSeller).length,
      path: outputPath,
      sample: library.slice(0, 2),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
