export const BRAND = {
  name: "Maverenne",
  pronunciation: "MAV-uh-ren",
  descriptor: "Jewelry & Accessories",
  tagline: "Come back to yourself.",
  promise:
    "Thoughtful jewelry and accessories for everyday moments that feel like your own.",
  heroTitle: "A little something for yourself.",
  heroDescription:
    "Jewelry and accessories for finding your way back to you.",
  primaryCta: {
    label: "Find Your Piece",
    href: "/collections/pearl-series",
  },
  secondaryCta: {
    label: "Shop the Pearl Edit",
    href: "/collections/pearl-series",
  },
  newsletterTitle: "A quiet note for you.",
} as const;

export type BrandIdentity = typeof BRAND;
