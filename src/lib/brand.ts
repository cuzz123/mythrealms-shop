import type { Product } from "@/lib/1688-products";

export const brandPositioning = {
  eyebrow: "Pearl & Gemstone Jewelry",
  headline: "Jewelry for the version of you you're becoming.",
  subheadline:
    "Pearl and gemstone pieces inspired by ancient Chinese celestial lore, chosen for calm, renewal, boundaries, and soft power.",
  primaryCta: "Find Your Guardian",
  secondaryCta: "Shop Pearls",
};

export const intentionRealms = [
  {
    name: "Calm & Clarity",
    slug: "calm-clarity",
    href: "/collections/pearl-series",
    description: "Pearls and luminous pieces for stillness, focus, and emotional balance.",
    keywords: ["calm", "clarity", "wisdom", "peace", "emotional balance", "intuition"],
  },
  {
    name: "Protection & Boundaries",
    slug: "protection-boundaries",
    href: "/collections/curated-singles",
    description: "Darker stones and grounded silhouettes for clear boundaries and daily steadiness.",
    keywords: ["protection", "grounding", "stability", "boundaries"],
  },
  {
    name: "Renewal & New Beginnings",
    slug: "renewal",
    href: "/collections/pearl-crystal-series",
    description: "Pearl and crystal pieces for fresh starts, transitions, and becoming.",
    keywords: ["renewal", "transition", "transformation", "new beginning", "self-sourcing"],
  },
  {
    name: "Soft Power",
    slug: "soft-power",
    href: "/collections/pearl-series",
    description: "Soft luster, quiet confidence, and jewelry that does not need to shout.",
    keywords: ["self-love", "softness", "confidence", "love", "feminine power"],
  },
];

export const categoryMessaging: Record<string, { name: string; description: string; realm: string }> = {
  "pearl-series": {
    name: "The Pearl Realms",
    realm: "Calm & Clarity",
    description:
      "Pearls have long been tied to moonlight, water, patience, and quiet strength. These pieces are chosen for calm, renewal, and soft power.",
  },
  "luxe-collection": {
    name: "Celestial Intention",
    realm: "Direction & Clarity",
    description:
      "Refined gemstone pieces for focus, direction, and the moments when you need one clear signal to follow.",
  },
  "pearl-crystal-series": {
    name: "Balance & Light",
    realm: "Renewal",
    description:
      "Pearl and crystal held together: soft and sharp, rooted and luminous, made for thresholds and new chapters.",
  },
  "curated-singles": {
    name: "Guardian Archetypes",
    realm: "Protection & Becoming",
    description:
      "Six symbolic stones matched to modern guardian archetypes: boundaries, softness, renewal, confidence, intuition, and abundance.",
  },
};

const replacementPairs: Array<[string | RegExp, string]> = [
  [/鈥攞" "\}/g, " - "],
  [/鈥\?/g, "-"],
  [/锟\?/g, "-"],
  [/\uFFFD\?/g, "-"],
  [/\uFFFD/g, "-"],
  [/ 路 /g, " - "],
  [/·/g, "-"],
  [/\s+-\s+/g, " - "],
];

export function cleanDisplayText(value: string): string {
  return replacementPairs
    .reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value)
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function productDisplayName(product: Pick<Product, "name">): string {
  return cleanDisplayText(product.name);
}

export function productBenefitTriplet(product: Pick<Product, "benefitTriplet" | "intention">): string {
  return cleanDisplayText(product.benefitTriplet || product.intention || "Everyday Intention");
}

export function productShortDescription(product: Pick<Product, "description">): string {
  return cleanDisplayText(product.description);
}

export function realmForProduct(product: Pick<Product, "category" | "intention">): string {
  const categoryRealm = categoryMessaging[product.category]?.realm;
  if (categoryRealm) return categoryRealm;
  const intention = (product.intention || "").toLowerCase();
  return intentionRealms.find((realm) => realm.keywords.some((keyword) => intention.includes(keyword)))?.name || "Everyday Intention";
}
