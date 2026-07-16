import type { Product } from "@/lib/1688-products";

export const brandPositioning = {
  eyebrow: "Pearl Jewelry",
  headline: "Jewelry for the version of you you're becoming.",
  subheadline:
    "Pearl pieces chosen for everyday light, small rituals, and a more personal way to get dressed.",
  primaryCta: "Explore the Pearl Edit",
  secondaryCta: "Shop Pearls",
};

export const intentionRealms = [
  {
    name: "Everyday Pearl",
    slug: "calm-clarity",
    href: "/collections/pearl-series",
    description: "Easy pearl pieces for mornings, dinners, and the moments in between.",
    keywords: ["calm", "clarity", "wisdom", "peace", "emotional balance", "intuition"],
  },
  {
    name: "Pearl Earrings",
    slug: "pearl-earrings",
    href: "/collections/pearl-series?type=earrings",
    description: "Small, luminous earrings with an easy sense of movement.",
    keywords: ["light", "balance", "renewal", "grounding"],
  },
  {
    name: "Pearl Necklaces",
    slug: "pearl-necklaces",
    href: "/collections/pearl-series?type=necklaces",
    description: "Light-catching layers to wear close to the collarbone.",
    keywords: ["renewal", "transition", "transformation", "new beginning", "self-sourcing"],
  },
  {
    name: "Pearl Bracelets",
    slug: "pearl-bracelets",
    href: "/collections/pearl-series?type=bracelets",
    description: "Soft luster, quiet confidence, and jewelry that moves with you.",
    keywords: ["self-love", "softness", "confidence", "love", "feminine power"],
  },
  {
    name: "Pearl Eyewear Chains",
    slug: "pearl-eyewear-chains",
    href: "/collections/pearl-series?type=eyewear-chains",
    description: "Functional pearl-led chains that keep glasses close and add a light-catching detail.",
    keywords: ["eyewear", "glasses", "chain", "functional"],
  },
];

export const categoryMessaging: Record<string, { name: string; description: string; realm: string }> = {
  "pearl-series": {
    name: "The Pearl Edit",
    realm: "Everyday Pearl",
    description:
      "Pearls have long been tied to moonlight, water, patience, and quiet strength. These pieces are made for everyday light and an unforced sense of occasion.",
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
