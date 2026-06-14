import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  const cats = [
    { name: "Moon Phases · 月相", slug: "moon-phases", description: "8 lunar bracelets — from crescent to full, each phase a moment in the moon goddess journey across the sky.", image: "/images/categories/28-mansions-bracelets.png", sortOrder: 12 },
    { name: "Celestial Stars · 星辰", slug: "celestial-stars", description: "Delicate star-inspired bracelets — the North Star, the Milky Way, and ancient Chinese constellations.", image: "/images/categories/28-mansions-bracelets.png", sortOrder: 13 },
    { name: "Ocean Pearls · 海珠", slug: "ocean-pearls", description: "Akoya pearls and aquamarine — each pearl a crystallized tear from the merfolk of ancient legend.", image: "/images/categories/28-mansions-bracelets.png", sortOrder: 14 },
    { name: "Butterfly Dream · 蝶梦", slug: "butterfly-dream", description: "Delicate butterfly bracelets — inspired by Zhuangzi dream. Are we dreaming, or being dreamed?", image: "/images/categories/28-mansions-bracelets.png", sortOrder: 15 },
  ];
  for (const c of cats) {
    await db.category.upsert({ where: { slug: c.slug }, update: c, create: c });
    console.log("  OK " + c.name);
  }
  console.log("Seeded 4 new categories");
  await db.$disconnect();
}
main();
