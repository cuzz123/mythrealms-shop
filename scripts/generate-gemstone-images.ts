/**
 * Batch generate gemstone product images via AGNES API
 * Premium jewelry photography style with individual stone aesthetics
 *
 * Usage: AGNES_API_KEY=xxx npx tsx scripts/generate-gemstone-images.ts
 */

import fs from "fs";
import path from "path";

const AGNES_KEY = process.env.AGNES_API_KEY || "";
const API_BASE = "https://apihub.agnes-ai.com/v1/images/generations";
const MODEL = "agnes-image-2.1-flash";
const OUTPUT_DIR = "public/images/products";

interface ProductShot {
  slug: string;
  stone: string;
  prompt: string;
}

// Style prefixes for different aesthetics
const STYLE_WHITE_MARBLE = "on white marble surface, soft natural window light from left, clean minimal composition, premium jewelry photography, editorial quality, sharp focus on gemstone detail, no dark background, no plastic shine";
const STYLE_LINEN = "on cream linen fabric, natural diffused light, romantic and minimal aesthetic, premium jewelry product shot, clean composition, soft shadows, editorial quality, 8K";
const STYLE_VELVET_DARK = "on dark grey velvet, natural window light, soft shadows, premium jewelry photography, clean minimal composition, Wanderlust Life aesthetic, editorial quality, 8K";
const STYLE_RAW_STONE = "on raw natural slate, dramatic single light source, gallery aesthetic, premium still life, sharp detail on crystal facets, editorial quality, 8K";
const STYLE_LAYS_FLAT = "laid flat on textured handmade paper, overhead natural light, minimal editorial aesthetic, clean composition, luxury catalog style, 8K";
const STYLE_RUSTIC = "on weathered wood surface, warm afternoon light, artisan jewelry aesthetic, natural organic feel, premium product shot, editorial quality, 8K";

// ═══════════════════════════════════════════
// AMETHYST COLLECTION
// ═══════════════════════════════════════════
const amethyst: ProductShot[] = [
  {
    slug: "lavender-amethyst-bracelet",
    stone: "Amethyst",
    prompt: `A delicate amethyst bead bracelet with 8mm round purple gemstone beads ranging from soft lavender to deep violet, one larger focal bead at center, ${STYLE_VELVET_DARK}, the amethyst translucent with natural color banding visible, premium beaded bracelet on wrist form display`,
  },
  {
    slug: "amethyst-gold-spacer-bracelet",
    stone: "Amethyst",
    prompt: `A refined 6mm amethyst bead bracelet alternating with 14k gold-plated spacer beads in floral and geometric shapes, delicate gold lobster clasp visible, ${STYLE_WHITE_MARBLE}, the small amethyst beads creating a rhythmic purple-and-gold pattern, elegant fine jewelry style`,
  },
];

// ═══════════════════════════════════════════
// ROSE QUARTZ COLLECTION
// ═══════════════════════════════════════════
const roseQuartz: ProductShot[] = [
  {
    slug: "blush-rose-quartz-bracelet",
    stone: "Rose Quartz",
    prompt: `A soft pink rose quartz bracelet with 10mm round beads in translucent blush pink, some beads showing natural milky inclusions and tiny crackle patterns, subtle gold-toned spacer beads between every third stone, ${STYLE_LINEN}, romantic dreamy soft-focus background, feminine luxury aesthetic`,
  },
  {
    slug: "rose-quartz-pearl-bracelet",
    stone: "Rose Quartz & Pearl",
    prompt: `A romantic mixed bracelet of soft pink rose quartz beads alternating with luminous white freshwater pearls, tiny gold-filled spacer beads between each stone, ${STYLE_LINEN}, the pearls with natural iridescent luster, rose quartz in soft blush tones, delicate feminine luxury aesthetic, scattered rose petals barely visible at edges`,
  },
];

// ═══════════════════════════════════════════
// BLACK OBSIDIAN COLLECTION
// ═══════════════════════════════════════════
const blackObsidian: ProductShot[] = [
  {
    slug: "black-obsidian-guardian-bracelet",
    stone: "Black Obsidian",
    prompt: `A bold black obsidian bracelet with 12mm faceted beads, each facet catching light like a dark mirror, the obsidian deep black with subtle volcanic glass sheen, ${STYLE_RAW_STONE}, dramatic contrast between the glossy faceted beads and raw slate surface, powerful masculine-meets-unisex aesthetic`,
  },
  {
    slug: "obsidian-hematite-stack",
    stone: "Obsidian & Hematite",
    prompt: `A stacked bracelet of alternating faceted black obsidian beads and metallic hematite beads, the hematite with a gunmetal silver sheen contrasting against deep black obsidian, ${STYLE_RAW_STONE}, both stones showing their distinct reflective qualities, moody editorial jewelry photography, two bracelets stacked together on wrist`,
  },
];

// ═══════════════════════════════════════════
// MOONSTONE COLLECTION
// ═══════════════════════════════════════════
const moonstone: ProductShot[] = [
  {
    slug: "rainbow-moonstone-bracelet",
    stone: "Moonstone",
    prompt: `A luminous rainbow moonstone bracelet with 8mm round beads showing ethereal blue adularescent flash, each bead with milky white body and internal blue shimmer, ${STYLE_VELVET_DARK}, the moonstone catching light and revealing its signature blue glow, mystical ethereal aesthetic, premium beaded bracelet`,
  },
  {
    slug: "moonstone-silver-chain-bracelet",
    stone: "Moonstone",
    prompt: `A delicate sterling silver cable chain bracelet with small teardrop moonstone charms spaced along its length, each charm set in a fine silver bezel, the moonstones showing subtle blue flash, ${STYLE_WHITE_MARBLE}, the chain fine and elegant, minimalist luxury aesthetic, editorial jewelry flat-lay`,
  },
];

// ═══════════════════════════════════════════
// TIGER'S EYE COLLECTION
// ═══════════════════════════════════════════
const tigersEye: ProductShot[] = [
  {
    slug: "golden-tigers-eye-bracelet",
    stone: "Tiger's Eye",
    prompt: `A warm golden tiger's eye bracelet with 10mm round beads displaying rich chatoyant bands of brown, gold, and amber, the characteristic moving light line visible across multiple beads, ${STYLE_RUSTIC}, warm earthy tones, artisan jewelry aesthetic, the tiger's eye gleaming with natural chatoyancy`,
  },
  {
    slug: "tigers-eye-sandalwood-bracelet",
    stone: "Tiger's Eye & Sandalwood",
    prompt: `A mixed bracelet of golden tiger's eye beads alternating with warm brown sandalwood beads, the wood beads with visible natural grain, ${STYLE_RUSTIC}, organic natural artisan aesthetic, the contrast between cool polished stone and warm matte wood, bohemian luxury style`,
  },
];

// ═══════════════════════════════════════════
// MIXED / BEST SELLERS
// ═══════════════════════════════════════════
const mixed: ProductShot[] = [
  {
    slug: "essential-crystal-stack",
    stone: "Mixed Gemstones",
    prompt: `Three beaded bracelets stacked together on an elegant wrist: a purple amethyst bracelet, a soft pink rose quartz bracelet, and a black obsidian bracelet, all worn layered together, ${STYLE_WHITE_MARBLE}, the three stones creating a beautiful purple-pink-black color story, luxury bracelet stack editorial, wrist stack photography, Cartier layered aesthetic`,
  },
  {
    slug: "beginners-crystal-set",
    stone: "Mixed Gemstones",
    prompt: `Five crystal bracelets arranged in a fan pattern: amethyst purple, rose quartz pink, black obsidian, white moonstone with blue flash, and golden tiger's eye, all laid out ${STYLE_LAYS_FLAT}, each bracelet on its own display card, premium gift set presentation, complete crystal collection flat-lay, editorial catalog style`,
  },
];

const ALL_PRODUCTS = [...amethyst, ...roseQuartz, ...blackObsidian, ...moonstone, ...tigersEye, ...mixed];

async function generateImage(prompt: string): Promise<string | null> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AGNES_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      n: 1,
      size: "1792x1024",
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error(`  ❌ API error: ${JSON.stringify(err).slice(0, 200)}`);
    return null;
  }

  const data = await res.json();
  return data.data?.[0]?.url || null;
}

async function downloadImage(url: string, filepath: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  fs.writeFileSync(filepath, Buffer.from(await res.arrayBuffer()));
}

async function main() {
  if (!AGNES_KEY || AGNES_KEY.length < 10) {
    console.error("❌ AGNES_API_KEY not set. Set it in .env or pass via environment.");
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`Generating ${ALL_PRODUCTS.length} gemstone bracelet images...\n`);

  let success = 0;
  let skipped = 0;

  for (let i = 0; i < ALL_PRODUCTS.length; i++) {
    const product = ALL_PRODUCTS[i];
    const filename = `${product.slug}.png`;
    const filepath = path.join(OUTPUT_DIR, filename);

    // Skip if already exists
    if (fs.existsSync(filepath)) {
      console.log(`  [${i + 1}/${ALL_PRODUCTS.length}] ⏭ ${product.stone}: ${product.slug} (exists)`);
      skipped++;
      continue;
    }

    console.log(`  [${i + 1}/${ALL_PRODUCTS.length}] 🎨 ${product.stone}: ${product.slug}`);
    const imageUrl = await generateImage(product.prompt);

    if (!imageUrl) continue;

    try {
      await downloadImage(imageUrl, filepath);
      const sizeKB = (fs.statSync(filepath).size / 1024).toFixed(0);
      console.log(`      ✅ ${sizeKB}KB — ${imageUrl.slice(0, 60)}...`);
      success++;
    } catch (e: any) {
      console.log(`      ❌ ${e.message}`);
    }

    // Rate limit: 2-second delay between generations
    if (i < ALL_PRODUCTS.length - 1) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log(`\n✅ Generated: ${success} new images, ${skipped} skipped, ${ALL_PRODUCTS.length} total`);
}

main().catch((e) => { console.error("❌", e.message); process.exit(1); });
