// POST /api/automation/generate-tiktok-script
// Generate TikTok video scripts from product data.
// Use ?slug=xxx for one product, ?all=true for the full product library.

import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/1688-products";
import {
  productBenefitTriplet,
  productDisplayName,
  productShortDescription,
  realmForProduct,
} from "@/lib/brand";
import { promises as fs } from "fs";
import path from "path";
import { requireAdminMutation } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

type ScriptFormat = "story" | "unboxing" | "quiz";

interface TiktokScript {
  productSlug: string;
  productName: string;
  format: ScriptFormat;
  duration: string;
  hook: string;
  scenes: { time: string; visual: string; audio: string; textOverlay: string }[];
  hashtags: string[];
  caption: string;
}

const formatPrice = (price: number) => `$${price.toFixed(2).replace(/\.00$/, "")}`;

function buildScript(product: (typeof PRODUCTS)[0], format: ScriptFormat): TiktokScript {
  const name = productDisplayName(product);
  const intention = realmForProduct(product);
  const benefit = productBenefitTriplet(product);
  const shortDesc = productShortDescription(product).replace(/\s+/g, " ").slice(0, 120);
  const price = formatPrice(product.price);

  if (format === "unboxing") {
    return {
      productSlug: product.slug,
      productName: name,
      format: "unboxing",
      duration: "15-20s",
      hook: `[ASMR] Unboxing ${name} from MythRealms`,
      scenes: [
        {
          time: "0-3s",
          visual: "Close-up of the parcel and pouch being opened slowly.",
          audio: "Soft paper and pouch sounds, minimal ambient music.",
          textOverlay: name,
        },
        {
          time: "3-8s",
          visual: "Slow reveal of the pearl or gemstone piece in natural window light.",
          audio: "Gentle chime, no spoken words yet.",
          textOverlay: benefit,
        },
        {
          time: "8-13s",
          visual: "Macro detail shot: luster, texture, clasp, and how it catches light.",
          audio: "Whisper voiceover: 'A piece for this season of you.'",
          textOverlay: price,
        },
        {
          time: "13-20s",
          visual: "Try-on shot on wrist, neckline, or ear; end on the quiz URL.",
          audio: "Music resolves softly.",
          textOverlay: "Find your guardian - Link in bio",
        },
      ],
      hashtags: [
        "pearljewelry",
        "gemstonejewelry",
        "jewelryunboxing",
        "jewelrytok",
        "intentionjewelry",
        "quietluxury",
      ],
      caption: `Unboxing ${name} from MythRealms. ${intention}. ${shortDesc.slice(0, 100)} #pearljewelry #jewelryunboxing #intentionjewelry`,
    };
  }

  if (format === "quiz") {
    return {
      productSlug: product.slug,
      productName: name,
      format: "quiz",
      duration: "25-35s",
      hook: "Which guardian archetype matches this season of you?",
      scenes: [
        {
          time: "0-5s",
          visual: "Screen recording of the guardian quiz, showing the first question.",
          audio: "Curiosity-driven music with soft taps.",
          textOverlay: "Find your guardian",
        },
        {
          time: "5-15s",
          visual: "Quick cuts through the three quiz questions.",
          audio: "Music continues, soft typing sounds.",
          textOverlay: "Calm, renewal, boundaries, or soft power?",
        },
        {
          time: "15-25s",
          visual: "Result reveal followed by a product detail shot.",
          audio: "Music swells, gentle reveal sound.",
          textOverlay: `Your match: ${intention}`,
        },
        {
          time: "25-35s",
          visual: "Final product beauty shot and URL overlay.",
          audio: "Music resolves.",
          textOverlay: `${price} - Take the quiz`,
        },
      ],
      hashtags: [
        "guardianquiz",
        "jewelryquiz",
        "pearljewelry",
        "personalityquiz",
        "intentionjewelry",
        "jewelrytok",
      ],
      caption:
        "Which guardian archetype matches your current season? Take the MythRealms quiz and find the pearl or gemstone piece that fits. #guardianquiz #jewelrytok",
    };
  }

  return {
    productSlug: product.slug,
    productName: name,
    format: "story",
    duration: "30-45s",
    hook: `A jewelry piece for ${intention.toLowerCase()}.`,
    scenes: [
      {
        time: "0-5s",
        visual: "Pearl or gemstone close-up over silk, water, or dark wood.",
        audio: "Voiceover: 'Not every kind of power has to announce itself.'",
        textOverlay: name,
      },
      {
        time: "5-15s",
        visual: "Slow cinematic product movements and hand detail shots.",
        audio: `Voiceover: '${benefit}. A reminder you can wear.'`,
        textOverlay: benefit,
      },
      {
        time: "15-25s",
        visual: "Model wearing the piece in a simple outfit, clean framing.",
        audio: "Voiceover explains the intention without making healing claims.",
        textOverlay: `${intention} - ${price}`,
      },
      {
        time: "25-35s",
        visual: "Show guardian quiz or product page on phone, then final beauty shot.",
        audio: "Soft resolve: 'Find the one that fits this season.'",
        textOverlay: "MythRealms - Link in bio",
      },
    ],
    hashtags: [
      "pearljewelry",
      "gemstonejewelry",
      "intentionjewelry",
      "quietluxury",
      "jewelrytok",
      "storytime",
    ],
    caption: `${name} - ${intention}. ${shortDesc.slice(0, 90)} #pearljewelry #gemstonejewelry #jewelrytok`,
  };
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminMutation(request);
  if (unauthorized) return unauthorized;

  try {
    const url = new URL(request.url);
    const all = url.searchParams.get("all") === "true";
    const slug = url.searchParams.get("slug");
    const format = (url.searchParams.get("format") as ScriptFormat) || "story";

    if (slug) {
      const product = PRODUCTS.find((p) => p.slug === slug);
      if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
      return NextResponse.json(buildScript(product, format));
    }

    if (all) {
      const formats: ScriptFormat[] = ["story", "unboxing", "quiz"];
      const active = PRODUCTS.filter((p) => p.isActive && p.inStock);
      const scripts = active.map((p, i) => buildScript(p, formats[i % formats.length]));

      const outputDir = path.join(process.cwd(), "content", "tiktok");
      await fs.mkdir(outputDir, { recursive: true });
      const outputPath = path.join(outputDir, "scripts.json");
      const manifest = {
        generatedAt: new Date().toISOString(),
        total: scripts.length,
        scripts,
      };

      await fs.writeFile(outputPath, JSON.stringify(manifest, null, 2), "utf-8");

      return NextResponse.json({
        generated: true,
        total: scripts.length,
        formats: {
          story: scripts.filter((s) => s.format === "story").length,
          unboxing: scripts.filter((s) => s.format === "unboxing").length,
          quiz: scripts.filter((s) => s.format === "quiz").length,
        },
        path: outputPath,
        sample: scripts.slice(0, 2),
      });
    }

    const first = PRODUCTS.find((p) => p.isActive);
    if (!first) return NextResponse.json({ error: "No active products" }, { status: 404 });
    return NextResponse.json(buildScript(first, format));
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to generate TikTok script" },
      { status: 500 }
    );
  }
}
