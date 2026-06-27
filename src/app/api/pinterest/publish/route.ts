// GET /api/pinterest/publish — Batch publish 28 mansion pins (runs from Vercel server)

import { imageUrl } from "@/lib/images";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const TOKEN = process.env.PINTEREST_API_TOKEN || "";
  const BOARD_ID = process.env.PINTEREST_BOARD_ID || "";
  const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://mythrealms-shop.vercel.app";

  if (!TOKEN || !BOARD_ID) {
    return NextResponse.json({ error: "Pinterest API not configured" }, { status: 500 });
  }

  const pins = [
    { title:"The Watchman Bracelet — Black Obsidian Protection Stone", desc:"Protection — Grounding — Clarity. Black obsidian beads with sterling silver spacers. When you need a shield against negativity and chaos. Wear your Watcher.", img:imageUrl("/images/pins/pin-cs-watchman.png"), link:"/products/curated-singles-01" },
    { title:"The Heart Opener — Rose Quartz Self-Love Bracelet", desc:"Love — Tenderness — Acceptance. Soft pink rose quartz beads with rose gold heart spacers. Open yourself to giving and receiving love. Every heart deserves this.", img:imageUrl("/images/pins/pin-cs-heart.png"), link:"/products/curated-singles-02" },
    { title:"The Seer Bracelet — Amethyst Crystal for Intuition", desc:"Intuition — Calm — Insight. Deep purple amethyst beads with silver lotus spacers. For those who trust their inner voice before the world's noise.", img:imageUrl("/images/pins/pin-cs-seer.png"), link:"/products/curated-singles-03" },
    { title:"The Phoenix Bracelet — Moonstone for New Beginnings", desc:"Renewal — Hope — Transformation. Rainbow moonstone beads with gold crescent spacers. Rise from where you were into who you are becoming.", img:imageUrl("/images/pins/pin-cs-phoenix.png"), link:"/products/curated-singles-04" },
    { title:"The Strategist Bracelet — Tiger's Eye Confidence Stone", desc:"Confidence — Focus — Courage. Tiger's eye beads with brushed gold spacers. For the boardroom, the pitch, and every room where you need to own your power.", img:imageUrl("/images/pins/pin-cs-strategist.png"), link:"/products/curated-singles-05" },
    { title:"The Lion's Share — Green Aventurine Abundance Bracelet", desc:"Abundance — Opportunity — Growth. Green aventurine beads with gold coin spacers. Wear the frequency of prosperity and watch doors open.", img:imageUrl("/images/pins/pin-cs-lion.png"), link:"/products/curated-singles-06" },
    { title:"Serenity Collection — Freshwater Pearl Emotional Balance", desc:"Calm — Purity — Grace. Freshwater pearls hand-knotted on silk. The original intention stone — formed layer by layer, a meditation in material form.", img:imageUrl("/images/pins/pin-pearl-serenity.png"), link:"/collections/pearl-series" },
    { title:"The Bridge Bracelet — Pearl & Crystal Balance Piece", desc:"Balance — Harmony — Connection. Freshwater pearls paired with your choice of crystal. Where ocean meets earth, where soft meets strong.", img:imageUrl("/images/pins/pin-bridge.png"), link:"/collections/pearl-crystal-series" },
    { title:"The Keeper — Freshwater Pearl Wisdom Bracelet", desc:"Wisdom — Integrity — Stillness. Baroque freshwater pearls with gold knot spacers. For those who hold space for others — and finally, for themselves.", img:imageUrl("/images/pins/pin-cs-keeper.png"), link:"/products/curated-singles-02" },
    { title:"The Anchor Earrings — Grounding Stone Jewelry", desc:"Stability — Presence — Strength. Natural stone drops on sterling silver hooks. When the world spins, wear your center.", img:imageUrl("/images/pins/pin-cs-anchor.png"), link:"/products/curated-singles-01" },
    { title:"The Creator Bracelet — Clear Quartz Manifestation Stone", desc:"Clarity — Focus — Creation. Clear quartz beads with silver intention spacers. The master amplifier — program it with what you are calling in.", img:imageUrl("/images/pins/pin-cs-creator.png"), link:"/products/curated-singles-03" },
    { title:"The Lightkeeper Necklace — Crystal Clarity Jewelry", desc:"Clarity — Guidance — Truth. Pendant necklace with a single faceted crystal. A compass point over your heart — wear it and remember who you are.", img:imageUrl("/images/pins/pin-cs-lightkeeper.png"), link:"/products/curated-singles-04" },
    { title:"Crystal Intention Jewelry — Hand-Selected Stone Bracelets", desc:"Protection · Love · Clarity · Abundance · Confidence · Balance. Each bracelet carries its own purpose. Hand-selected stones. Artisan-finished. Free shipping over $69.99. Shop the intention collection.", img:imageUrl("/images/pins/pin-brand-intention.png"), link:"/collections/curated-singles" },
  ];

  const results: string[] = [];
  let count = 0;

  for (const pin of pins) {
    try {
      const r = await fetch("https://api.pinterest.com/v5/pins", {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          title: pin.title,
          description: pin.desc,
          link: `${BASE}${pin.link}`,
          board_id: BOARD_ID,
          media_source: { source_type: "image_url", url: `${BASE}${pin.img}` },
        }),
      });

      if (r.status === 201) {
        count++;
        results.push(`✅ ${pin.title.slice(0, 40)}`);
      } else {
        const err = await r.text();
        results.push(`❌ ${r.status} ${err.slice(0, 80)}`);
      }
    } catch (e: any) {
      results.push(`⚡ ${e.message.slice(0, 60)}`);
    }
  }

  return NextResponse.json({ published: count, total: pins.length, results });
}
