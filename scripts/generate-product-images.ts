/**
 * Batch generate product images via AGNES API
 * Style aligned with mythrealms-all-prompts.txt
 *
 * Usage: AGNES_API_KEY=xxx npx tsx scripts/generate-product-images.ts
 */

import fs from "fs";
import path from "path";

const AGNES_KEY = process.env.AGNES_API_KEY || "";
const API_BASE = "https://apihub.agnes-ai.com/v1/images/generations";
const MODEL = "agnes-image-2.1-flash";
const OUTPUT_DIR = "public/images/products";

interface ProductShot {
  slug: string;
  collection: string;
  prompt: string;
}

const STYLE = "white marble background, soft natural window light, Cartier feminine elegance, luxury editorial photography, gemstone as hero, no plastic shine, no dark background, 16:9 wide format, 8K 7680x4320, 300dpi";

const STYLE_BRACELET = "large 10-12mm gemstone beads alternating with ornate 14k gold spacer beads in varied shapes including stars faceted bicones engraved cylinders and filigree, on white marble with soft window light, Pinterest luxury editorial, no dark background, no plastic, no uniform tiny beads, 16:9 wide format, 8K 7680x4320, 300dpi";

// ═══════════════════════════════════════════
// Four Symbols · 四象
// ═══════════════════════════════════════════
const fourSymbols: ProductShot[] = [
  {
    slug: "azure-dragon-qinglong-bracelet",
    collection: "Four Symbols",
    prompt: `A luxury beaded bracelet with large 10-12mm deep blue lapis lazuli beads, alternating with ornate 14k gold spacers in star shapes and faceted bicones, a small gold dragon scale charm, the lapis glowing deep blue against the gold, ${STYLE_BRACELET}`,
  },
  {
    slug: "white-tiger-baihu-cuff",
    collection: "Four Symbols",
    prompt: `A wide brushed sterling silver cuff bracelet featuring a carved white jade tiger stripe inlay, the white jade luminous and cool, clean modern lines, Cartier minimal elegance, ${STYLE}`,
  },
  {
    slug: "vermillion-bird-zhuque-pendant",
    collection: "Four Symbols",
    prompt: `A rose gold pendant featuring a phoenix formed by five graduating red garnet gems arranged as wings, a tiny diamond at the head, suspended on a fine rose gold chain, delicate and warm, ${STYLE}`,
  },
  {
    slug: "black-tortoise-xuanwu-bracelet",
    collection: "Four Symbols",
    prompt: `A luxury bracelet with large 10-12mm black onyx beads alternating with brushed steel and matte gold spacers, a small tortoise shell charm in textured gold, grounded and substantial, ${STYLE_BRACELET}`,
  },
];

// ═══════════════════════════════════════════
// Eight Trigrams · 八卦
// ═══════════════════════════════════════════
const eightTrigrams: ProductShot[] = [
  {
    slug: "qian-heaven-bracelet",
    collection: "Eight Trigrams",
    prompt: `A luxury bracelet with large 10-12mm pure white jade beads, alternating with bright 14k gold spacers in geometric hexagon and disc shapes, three solid gold bars as trigram charm representing Heaven, luminous and commanding, ${STYLE_BRACELET}`,
  },
  {
    slug: "kun-earth-bracelet",
    collection: "Eight Trigrams",
    prompt: `A luxury bracelet with large 10-12mm warm tiger eye beads showing chatoyant golden bands, alternating with matte brass spacers in textured barrel shapes, three broken-line trigram charm representing Earth, grounding and nurturing, ${STYLE_BRACELET}`,
  },
  {
    slug: "zhen-thunder-bracelet",
    collection: "Eight Trigrams",
    prompt: `A luxury bracelet with large 10-12mm vibrant green aventurine beads with natural sparkle, alternating with gold lightning-bolt spacers and faceted bicones, dynamic and alive, representing Thunder, ${STYLE_BRACELET}`,
  },
  {
    slug: "xun-wind-bracelet",
    collection: "Eight Trigrams",
    prompt: `A delicate luxury bracelet with large 10-12mm pale aquamarine beads, alternating with white gold swirling spiral spacers and filigree tubes, representing Wind — soft flowing airy, ${STYLE_BRACELET}`,
  },
  {
    slug: "kan-water-bracelet",
    collection: "Eight Trigrams",
    prompt: `A luxury bracelet with large 10-12mm deep navy sodalite beads flecked with white, alternating with silver wave-pattern spacers and faceted bicones, representing Water — deep wisdom flowing below, ${STYLE_BRACELET}`,
  },
  {
    slug: "li-fire-bracelet",
    collection: "Eight Trigrams",
    prompt: `A luxury bracelet with large 10-12mm rich red carnelian beads glowing from within, alternating with gold flame-engraved spacers and star rondelles, representing Fire — warmth radiance clarity, ${STYLE_BRACELET}`,
  },
  {
    slug: "gen-mountain-bracelet",
    collection: "Eight Trigrams",
    prompt: `A luxury bracelet with large 10-12mm earthy brown agate beads with natural banding, alternating with textured gold spacers resembling mountain ridges and engraved cylinders, representing Mountain — stillness stability immovability, ${STYLE_BRACELET}`,
  },
  {
    slug: "dui-lake-bracelet",
    collection: "Eight Trigrams",
    prompt: `A luxury bracelet with large 10-12mm luminous moonstone beads with blue flash, alternating with mirrored silver spacers and hammered gold rings that catch light like still water, representing Lake — joy and reflection, ${STYLE_BRACELET}`,
  },
];

// ═══════════════════════════════════════════
// Dragon's Nine Sons · 龙生九子
// ═══════════════════════════════════════════
const nineSons: ProductShot[] = [
  {
    slug: "qiuniu-music-bracelet",
    collection: "Nine Sons",
    prompt: `A luxury bracelet with large 10-12mm white jade beads, alternating with gold musical-note spacers and faceted bicones, a small bronze dragon head charm, refined and artistic, representing Qiuniu who loves music, ${STYLE_BRACELET}`,
  },
  {
    slug: "yazi-warrior-cuff",
    collection: "Nine Sons",
    prompt: `A wide blackened silver cuff bracelet with red agate inlay at the center, engraved with a fierce dragon gripping a sword, battle-ready and powerful, modernist Cartier edge, ${STYLE}`,
  },
  {
    slug: "chaofeng-adventurer-pendant",
    collection: "Nine Sons",
    prompt: `A brushed gold pendant of a dragon perched on a cliff edge looking into distant horizons, suspended on a fine gold chain, representing Chaofeng the risk-taker who loves heights, adventurous spirit in precious metal, ${STYLE}`,
  },
  {
    slug: "pulao-roaring-bracelet",
    collection: "Nine Sons",
    prompt: `A luxury bracelet with large 10-12mm tiger eye beads showing warm golden bands, alternating with bronze bell-shaped spacers and engraved gold cylinders, a small roaring dragon head charm, loud and resonant, ${STYLE_BRACELET}`,
  },
  {
    slug: "suanni-meditation-bracelet",
    collection: "Nine Sons",
    prompt: `A serene luxury bracelet with large 10-12mm warm sandalwood-toned beads, alternating with matte gold spacers and filigree tubes, a seated dragon charm in lotus position, calm centered spiritual, representing Suanni who loves incense and stillness, ${STYLE_BRACELET}`,
  },
  {
    slug: "bixi-endurance-cuff",
    collection: "Nine Sons",
    prompt: `A heavy textured brushed gold cuff engraved with a dragon carrying a stone stele on its back, thick and substantial, representing Bixi who bears enormous weight, unyielding endurance in precious metal, ${STYLE}`,
  },
  {
    slug: "bian-justice-bracelet",
    collection: "Nine Sons",
    prompt: `A luxury bracelet with large 10-12mm black onyx beads, alternating with silver balance-scale spacers and geometric hexagons, a scroll-pattern dragon charm, authoritative and precise, representing Bian who loves justice, ${STYLE_BRACELET}`,
  },
  {
    slug: "chiwen-devouring-pendant",
    collection: "Nine Sons",
    prompt: `A bronze pendant of a dragon swallowing a roof ridge with patina green highlights, suspended on a fine gold chain, representing Chiwen who devours evil spirits, guardian energy in ancient bronze and gold, ${STYLE}`,
  },
  {
    slug: "chiwen-water-bracelet",
    collection: "Nine Sons",
    prompt: `A luxury bracelet with large 10-12mm deep blue lapis lazuli beads, alternating with silver wave spacers and faceted rondelles, a small dragon charm with water flowing from its mouth, representing Chiwen who extinguishes fire and protects, ${STYLE_BRACELET}`,
  },
];

const ALL_PRODUCTS = [...fourSymbols, ...eightTrigrams, ...nineSons];

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
    console.error("❌ AGNES_API_KEY not set.");
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`Generating ${ALL_PRODUCTS.length} product images in Cartier/Pinterest style...\n`);

  let success = 0;

  for (let i = 0; i < ALL_PRODUCTS.length; i++) {
    const product = ALL_PRODUCTS[i];
    const filename = `${product.slug}.png`;
    const filepath = path.join(OUTPUT_DIR, filename);

    // Force re-generate (remove old dark-style versions)
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    console.log(`  [${i + 1}/${ALL_PRODUCTS.length}] 🎨 ${product.collection}: ${product.slug}`);
    const imageUrl = await generateImage(product.prompt);

    if (!imageUrl) continue;

    try {
      await downloadImage(imageUrl, filepath);
      console.log(`      ✅ ${(fs.statSync(filepath).size / 1024).toFixed(0)}KB`);
      success++;
    } catch (error: unknown) {
      console.log(`      ❌ ${error instanceof Error ? error.message : "Unknown error"}`);
    }

    if (i < ALL_PRODUCTS.length - 1) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log(`\n✅ Generated: ${success}, Total: ${ALL_PRODUCTS.length}`);
}

main().catch((e) => { console.error("❌", e.message); process.exit(1); });
