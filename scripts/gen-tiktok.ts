import { PRODUCTS } from "../src/lib/1688-products.ts";
import fs from "fs";
import path from "path";

type Format = "story" | "unboxing" | "quiz";
const formats: Format[] = ["story", "unboxing", "quiz"];

const active = PRODUCTS.filter((p: any) => p.isActive && p.inStock);

function buildScript(p: any, fmt: Format) {
  const name = p.name.replace(/[^\x20-\x7E\s]/g, "").trim();
  const intention = p.intention || "Crystal Intention";
  const desc = p.description.replace(/\s+/g, " ").trim();
  const price = p.price;
  const base = (s: string) => s.slice(0, 120);

  const baseScript = {
    productSlug: p.slug,
    productName: name,
    format: fmt,
    hashtags: ["mythicaljewelry", "chinesemythology", "handcrafted", "intentionjewelry"]
  };

  if (fmt === "unboxing") {
    return {
      ...baseScript,
      duration: "15-20s",
      hook: "ASMR Unboxing " + name + " from MythRealms",
      scenes: [
        { time: "0-3s", visual: "Opening jewelry box slowly", audio: "Soft paper rustling", textOverlay: name },
        { time: "3-8s", visual: "Reveal jewelry piece in natural light", audio: "Gentle chime", textOverlay: intention + " | Handcrafted" },
        { time: "8-13s", visual: "Macro shot of gemstone", audio: "Ambient music", textOverlay: "$" + price },
        { time: "13-15s", visual: "Product on model", audio: "Music fades", textOverlay: "MythRealms | Link in bio" }
      ],
      caption: "Unboxing the " + name + " from MythRealms. " + intention + ". Handcrafted in 14k gold and sterling silver. #mythicaljewelry #unboxing"
    };
  }

  if (fmt === "quiz") {
    return {
      ...baseScript,
      duration: "25-35s",
      hook: "Which mythical guardian protects YOU? Take the quiz ->",
      scenes: [
        { time: "0-5s", visual: "Screen recording of guardian-quiz page", audio: "Upbeat music", textOverlay: "Which Guardian Matches Your Spirit?" },
        { time: "5-15s", visual: "Quick cuts through quiz questions", audio: "Music continues", textOverlay: "Answer 5 questions..." },
        { time: "15-25s", visual: "Reveal of quiz result with product", audio: "Music swells", textOverlay: "You got: " + name + "!" },
        { time: "25-30s", visual: "Product beauty shot", audio: "Music resolves", textOverlay: "$" + price + " | Link in bio" }
      ],
      caption: "Which Chinese guardian matches your spirit? Take the quiz at mythrealms-shop.vercel.app/guardian-quiz and discover your mythical protector. #mythologyquiz #whichguardianareyou"
    };
  }

  // story format
  return {
    ...baseScript,
    duration: "30-45s",
    hook: "Did you know? " + base(desc) + "...",
    scenes: [
      { time: "0-5s", visual: "Text on screen with mystical background", audio: "Storytelling voice", textOverlay: "The Legend of " + name },
      { time: "5-15s", visual: "Product on natural textures", audio: "Voiceover: Inspired by ancient mythology...", textOverlay: "Shan Hai Jing | " + intention },
      { time: "15-25s", visual: "Close-up of gemstone details", audio: "Voiceover continues", textOverlay: "$" + price + " | 14k Gold & Sterling Silver" },
      { time: "25-30s", visual: "Model wearing the piece", audio: "Soft resolve", textOverlay: "MythRealms | Link in bio" }
    ],
    caption: name + " - " + intention + ". Inspired by ancient Chinese mythology. Handcrafted in 14k gold and sterling silver. " + base(desc) + " #chinesemythology #mythicaljewelry"
  };
}

const scripts = active.map((p: any, i: number) => buildScript(p, formats[i % formats.length]));

const outDir = path.join(process.cwd(), "content", "tiktok");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "scripts.json"), JSON.stringify({ generatedAt: new Date().toISOString(), total: scripts.length, scripts }, null, 2));
console.log("Generated " + scripts.length + " TikTok scripts into content/tiktok/scripts.json");
const fmtCount: Record<string, number> = {};
scripts.forEach((s: any) => { fmtCount[s.format] = (fmtCount[s.format] || 0) + 1; });
console.log("Formats: " + JSON.stringify(fmtCount));
