// GET /api/pinterest/publish — Batch publish 28 mansion pins (runs from Vercel server)

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const TOKEN = "pina_AEA3SIAYADL2UBYAGDAMQDYHJDMMXHQBACGSPIUE6B7Q7MMFAVCG7JI72PSTYTPB3TOAEWJCRSTLMXA4KBLRGI2PJ37RC3QA";
  const BOARD_ID = "1137370149584940020";
  const BASE = "https://mythrealms-shop.vercel.app";

  const pins = [
    { title:"Jiao · 角 — 28 Mansions Lapis Bracelet", desc:"The first mansion of the Azure Dragon. Deep blue lapis lazuli beads with gold star spacers. 28 bracelets. 28 destinies. Find your star.", img:"/images/pins/pin28-jiao.png", link:"/products/jiao-mansion-bracelet" },
    { title:"Xing · 星 — Clear Quartz Bracelet | 28 Mansions", desc:"The Star Mansion of the Vermillion Bird. Clear quartz beads with gold star spacers. Wear your constellation.", img:"/images/pins/pin28-xing.png", link:"/products/xing-mansion-bracelet" },
    { title:"Nv · 女 — Rose Quartz Bracelet | Chinese Astrology", desc:"The Girl Mansion. Soft pink rose quartz with rose gold heart spacers. Divine feminine on your wrist.", img:"/images/pins/pin28-nv.png", link:"/products/nv-mansion-bracelet" },
    { title:"Dou · 斗 — Sodalite Bracelet | 28 Lunar Mansions", desc:"The Dipper Mansion. Deep navy sodalite beads with brushed gold spacers. For those who pour themselves fully.", img:"/images/pins/pin28-dou.png", link:"/products/dou-mansion-bracelet" },
    { title:"Wood · 木 — Jade Bracelet | Five Elements", desc:"Green jade beads with gold leaf spacers. The element of growth and new beginnings.", img:"/images/pins/pin5-wood.png", link:"/products/wood-element-bracelet" },
    { title:"Fire · 火 — Garnet Bracelet | Wu Xing Collection", desc:"Deep red garnet beads with gold flame spacers. The element of passion and transformation.", img:"/images/pins/pin5-fire.png", link:"/products/fire-element-bracelet" },
    { title:"Water · 水 — Lapis Bracelet | Five Elements", desc:"Deep blue lapis beads with gold wave spacers. The element of wisdom and adaptability.", img:"/images/pins/pin5-water.png", link:"/products/water-element-bracelet" },
    { title:"Full Moon · 满月 — Moonstone Bracelet | Lunar Collection", desc:"A full moonstone cabochon with 28 micro-diamond halo. The complete lunar cycle on your wrist.", img:"/images/pins/pin-moon-full.png", link:"/products/moon-full-medallion" },
    { title:"Crescent Moon · 蛾眉月 — Moonstone Bracelet | Lunar Jewelry", desc:"Rainbow moonstone beads with rose gold crescent spacers. The first light after darkness.", img:"/images/pins/pin-moon-crescent.png", link:"/products/moon-crescent-pendant" },
    { title:"Ocean Pearls · 海珠 — Akoya & Aquamarine Bracelet", desc:"Akoya pearls and aquamarine beads on a rose gold chain. Ocean palette on the wrist.", img:"/images/pins/pin-pearl-aqua.png", link:"/products/pearl-aquamarine-bracelet" },
    { title:"Single Pearl · 单珠 — Akoya Bracelet | Minimal Luxury", desc:"A single 8mm Akoya pearl with perfect pink luster. The purest form of elegance.", img:"/images/pins/pin-pearl-single.png", link:"/products/pearl-single-pendant" },
    { title:"Lotus · 莲花 — White Jade Bracelet | Floral Collection", desc:"White jade beads with gold lotus spacers. The flower that rises from mud unstained.", img:"/images/pins/pin-fl-lotus.png", link:"/products/floral-lotus" },
    { title:"Cherry Blossom · 樱花 — Pink Tourmaline Bracelet", desc:"Pink tourmaline beads with gold cherry blossom spacers. The beauty of transience.", img:"/images/pins/pin-fl-cherry.png", link:"/products/floral-cherry" },
    { title:"Butterfly Dream · 蝶梦 — Amethyst Bracelet", desc:"Lavender amethyst beads with gold butterfly spacers. Zhuangzi's dream in precious metal.", img:"/images/pins/pin-bf-bracelet.png", link:"/products/butterfly-bracelet" },
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
