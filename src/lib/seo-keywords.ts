// ============================================================
// SEO 自动化 — 关键词库
// 50 个长尾关键词，覆盖珍珠护理/水晶寓意/礼品指南/穿搭/灵性
// 每天自动轮换一个，50 天完成一个循环
// 由 /api/cron/seo-daily 消费
// ============================================================

/**
 * SEO Content Engine — Keyword bank for crystal/pearl jewelry
 * Each keyword targets a specific search intent
 */
export const SEO_KEYWORDS = [
  // Pearl care & education
  "how to clean freshwater pearl jewelry at home",
  "can you wear pearls in the shower or swimming",
  "difference between freshwater and akoya pearls",
  "how to tell if pearls are real or fake",
  "why do pearls turn yellow over time",
  "best way to store pearl jewelry long term",
  "do pearls need to be worn regularly to keep luster",
  "how are freshwater pearls different from saltwater pearls",
  "what is nacre and why it matters for pearl quality",
  "how to restring a pearl bracelet at home",

  // Crystal & stone meanings
  "black obsidian meaning protection and grounding",
  "rose quartz meaning self love and emotional healing",
  "amethyst crystal benefits for sleep and intuition",
  "tigers eye stone meaning confidence and courage",
  "moonstone meaning new beginnings and feminine energy",
  "green aventurine meaning abundance and luck",
  "which crystal bracelet should i wear on left wrist",
  "crystal bracelet combinations for anxiety and stress",
  "best crystals for protection from negative energy",
  "how to cleanse and charge crystal bracelets",

  // Gift guides & occasions
  "pearl jewelry gift ideas for girlfriend birthday",
  "crystal bracelet gift set for bridesmaids",
  "best jewelry gifts for spiritual women",
  "meaningful graduation gift jewelry with intention",
  "anniversary jewelry ideas pearl and crystal",
  "mothers day pearl jewelry gift guide",
  "valentines day crystal bracelet set for her",
  "wedding jewelry for bride freshwater pearl set",
  "push present jewelry ideas pearl necklace gift",

  // Styling & outfit
  "how to style pearl bracelet with everyday outfit",
  "pearl necklace layering ideas minimalist style",
  "crystal bracelet stacking guide how many to wear",
  "old money aesthetic jewelry pieces to invest in",
  "quiet luxury jewelry brands under 100 dollars",
  "minimalist jewelry capsule wardrobe essentials",
  "how to mix pearls with gold jewelry",
  "summer jewelry trends pearl and shell accessories",
  "work appropriate jewelry elegant office style",
  "date night jewelry styling pearl drop earrings",

  // Wellness & intention
  "morning ritual wearing intention jewelry",
  "how to set intentions with crystal bracelets",
  "crystals for meditation which stones to hold",
  "spiritual jewelry for emotional balance and calm",
  "wearing crystals daily does it really work",
  "best crystals for manifesting money and abundance",
  "crystals for self confidence before important meeting",
  "healing jewelry for grief and loss support",
  "crystal bracelet for new moon intention setting",
  "grounding stones for anxiety relief at work",
];

/** Pick the next keyword to write about (sequential rotation) */
export function getDailyKeyword(): string {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return SEO_KEYWORDS[dayOfYear % SEO_KEYWORDS.length];
}
