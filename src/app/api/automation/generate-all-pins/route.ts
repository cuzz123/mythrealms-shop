// POST /api/automation/generate-all-pins
// Batch-generate Pinterest copy for all active products.

import { NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/1688-products";
import { productBenefitTriplet, productDisplayName, productShortDescription, realmForProduct } from "@/lib/brand";
import { promises as fs } from "fs";
import path from "path";
import { requireAdminMutation } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const tagBase = ["pearljewelry", "gemstonejewelry", "intentionjewelry", "quietluxury", "jewelryinspo"];

function buildPin(product: (typeof PRODUCTS)[0], base: string) {
  const name = productDisplayName(product);
  const intention = realmForProduct(product);
  const triplet = productBenefitTriplet(product);
  const descClean = productShortDescription(product).replace(/\s+/g, " ").slice(0, 250);

  const title = `${name} | ${intention} Jewelry`;
  const description = `${triplet}. ${descClean} Pearl and gemstone jewelry for everyday intention. Free shipping over $69.99.`;
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
    tags: [...tagBase, intention.toLowerCase().replace(/[^a-z0-9]+/g, "")].filter(Boolean),
    board: intention === "Calm & Clarity" ? "Pearl Jewelry for Calm" : "Guardian Archetype Jewelry",
    isBestSeller: product.isBestSeller,
    isNew: product.isNew,
    category: product.categoryName,
    price: product.price,
  };
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminMutation(request);
  if (unauthorized) return unauthorized;

  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || "https://mythrealms-shop.vercel.app";
    const active = PRODUCTS.filter((p) => p.isActive && p.inStock);
    const library = active.map((p) => buildPin(p, base));

    const byCategory: Record<string, typeof library> = {};
    for (const pin of library) {
      if (!byCategory[pin.category]) byCategory[pin.category] = [];
      byCategory[pin.category].push(pin);
    }

    const outputDir = path.join(process.cwd(), "content", "pin-library");
    await fs.mkdir(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, "all-pins.json");
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
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to generate pin library" },
      { status: 500 }
    );
  }
}
