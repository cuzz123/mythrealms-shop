import { PRODUCTS } from "../src/lib/1688-products.ts";
import fs from "fs";
import path from "path";

const base = "https://mythrealms-shop.vercel.app";
const active = PRODUCTS.filter((p: any) => p.isActive && p.inStock);

const lib = active.map((p: any) => {
  const name = p.name.replace(/[^\x20-\x7E\s]/g, "").trim();
  const intention = p.intention || "Crystal Intention";
  const triplet = p.benefitTriplet ? p.benefitTriplet.replace(/[^\x20-\x7E\s]/g, "").trim() : "";
  const dc = p.description.replace(/\s+/g, " ").trim().slice(0, 250);
  return {
    productSlug: p.slug, productName: name, intention,
    title: (name + " - " + intention + " | MythRealms").slice(0, 100),
    description: (triplet ? triplet + ". " : "") + dc + " Handcrafted. Free shipping over $69.99.",
    link: base + "/products/" + p.slug,
    imageUrl: base + (p.image.startsWith("/") ? p.image : "/images/products/1688-shop/" + p.category + "/" + p.slug + "-main.webp"),
    tags: ["mythicaljewelry", "chinesemythology", "handcrafted", "intentionjewelry", intention.toLowerCase().replace(/\s+/g, "")],
    board: intention === "Emotional Balance" ? "Serenity & Peace" : "Mythical Jewelry Collection",
    isBestSeller: p.isBestSeller, isNew: p.isNew, category: p.categoryName, price: p.price,
  };
});

const byCategory: Record<string, typeof lib> = {};
lib.forEach((p: any) => { if (!byCategory[p.category]) byCategory[p.category] = []; byCategory[p.category].push(p); });

const outDir = path.join(process.cwd(), "content", "pin-library");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "all-pins.json"), JSON.stringify({ generatedAt: new Date().toISOString(), total: lib.length, pins: lib, byCategory }, null, 2));
console.log("Generated " + lib.length + " pins into content/pin-library/all-pins.json");
console.log("Categories: " + Object.keys(byCategory).join(", "));
