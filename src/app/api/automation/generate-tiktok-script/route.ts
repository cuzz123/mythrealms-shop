// GET /api/automation/generate-tiktok-script — Generate TikTok video scripts from product data
// If ?all=true, generates scripts for all active products and saves to content/tiktok/
// Otherwise, pass ?slug=xxx for a single product

import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/1688-products";
import { promises as fs } from "fs";
import path from "path";

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

function buildScript(product: (typeof PRODUCTS)[0], format: ScriptFormat): TiktokScript {
  const name = product.name.replace(/[^\x20-\x7E\s]/g, "").trim();
  const intention = product.intention || "Crystal Intention";
  const descClean = product.description.replace(/\s+/g, " ").trim();
  const shortDesc = descClean.slice(0, 120);
  const price = product.price;

  if (format === "unboxing") {
    return {
      productSlug: product.slug,
      productName: name,
      format: "unboxing",
      duration: "15-20s",
      hook: `[ASMR] Unboxing ${name} from MythRealms`,
      scenes: [
        { time: "0-3s", visual: "Close-up of packaging box being opened slowly", audio: "Soft rustling paper sound, ambient instrumental", textOverlay: `${name}` },
        { time: "3-8s", visual: "Slow reveal of jewelry piece, natural light catching the stone", audio: "Gentle chime or harp note", textOverlay: `${intention} \u2022 Handcrafted` },
        { time: "8-13s", visual: "Macro shot of gemstone texture, rotating slowly", audio: "Soft ambient music continues", textOverlay: `$${price}` },
        { time: "13-15s", visual: "Product on hand/model shot", audio: "Music fades", textOverlay: "MythRealms \u2022 Link in bio" },
      ],
      hashtags: ["mythicaljewelry", "unboxing", "crystaljewelry", "asmr", "handcrafted", "luxuryjewelry"],
      caption: `Unboxing the ${name} from MythRealms. ${intention}. Handcrafted in 14k gold and sterling silver. ${shortDesc.slice(0, 100)} #mythicaljewelry #unboxing`,
    };
  }

  if (format === "quiz") {
    return {
      productSlug: product.slug,
      productName: name,
      format: "quiz",
      duration: "25-35s",
      hook: "Which mythical guardian protects YOU? Take the quiz to find out \u2193",
      scenes: [
        { time: "0-5s", visual: "Screen recording of guardian-quiz page, showing first question", audio: "Upbeat curiosity-driven music", textOverlay: "Which Guardian Matches Your Spirit?" },
        { time: "5-15s", visual: "Quick cuts through quiz questions, text overlays", audio: "Music continues, soft typing sounds", textOverlay: "Answer 5 questions..." },
        { time: "15-25s", visual: "Dramatic reveal animation of result with product shown", audio: "Music swells, reveal sound effect", textOverlay: `You got: ${name}!` },
        { time: "25-30s", visual: "Product beauty shot with price", audio: "Music resolves", textOverlay: `$${price} \u2022 Link in bio` },
      ],
      hashtags: ["mythologyquiz", "whichguardianareyou", "chinesemythology", "personalityquiz", "mythicaljewelry", "fyp"],
      caption: `Which Chinese guardian matches your spirit? Take the quiz at mythrealms-shop.vercel.app/guardian-quiz and discover your mythical protector. #mythologyquiz #whichguardianareyou`,
    };
  }

  // Default: story format
  return {
    productSlug: product.slug,
    productName: name,
    format: "story",
    duration: "30-45s",
    hook: `Did you know? ${shortDesc.slice(0, 80)}...`,
    scenes: [
      { time: "0-5s", visual: "Text on screen with mystical background", audio: "Deep storytelling voice: 'What if your jewelry carried an ancient story?'", textOverlay: `The Legend of the ${name}` },
      { time: "5-15s", visual: "Product shown against natural textures (wood, stone, silk)", audio: "Voiceover: 'Inspired by the Classic of Mountains and Seas...'", textOverlay: `Shan Hai Jing \u2022 ${intention}` },
      { time: "15-25s", visual: "Close-up of the stone/gemstone, zoom in on details", audio: "Voiceover continues describing meaning", textOverlay: `$${price} \u2022 14k Gold & Sterling Silver` },
      { time: "25-30s", visual: "Model wearing the piece, lifestyle shot", audio: "Soft resolve: 'Wear your story.'", textOverlay: "MythRealms \u2022 Link in bio" },
    ],
    hashtags: ["chinesemythology", "mythicaljewelry", "shanhaijing", "storytime", "handcraftedjewelry", "crystalhealing", "fyp"],
    caption: `${name} \u2014 ${intention}. Inspired by ancient Chinese mythology. Handcrafted in 14k gold and sterling silver. ${shortDesc.slice(0, 80)} #chinesemythology #mythicaljewelry #shanhaijing`,
  };
}

export async function GET(request: NextRequest) {
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

      // Assign format rotation across products
      const scripts = active.map((p, i) => buildScript(p, formats[i % formats.length]));

      const outputPath = path.join(process.cwd(), "content", "tiktok", "scripts.json");
      const manifest = {
        generatedAt: new Date().toISOString(),
        total: scripts.length,
        scripts,
      };

      await fs.writeFile(outputPath, JSON.stringify(manifest, null, 2), "utf-8");

      return NextResponse.json({
        generated: true,
        total: scripts.length,
        formats: { story: scripts.filter((s) => s.format === "story").length, unboxing: scripts.filter((s) => s.format === "unboxing").length, quiz: scripts.filter((s) => s.format === "quiz").length },
        path: outputPath,
        sample: scripts.slice(0, 2),
      });
    }

    // Return first product as default
    const first = PRODUCTS.find((p) => p.isActive);
    if (!first) return NextResponse.json({ error: "No active products" }, { status: 404 });
    return NextResponse.json(buildScript(first, format));
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
