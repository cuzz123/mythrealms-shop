export type EditorialImage = {
  src: string;
  alt: string;
  objectPosition?: string;
};

export const HOMEPAGE_MEDIA = {
  hero: {
    src: "/images/brand/hero/pearl-earrings-editorial.png",
    alt: "Model wearing shell-and-pearl drop earrings in warm studio light",
    objectPosition: "center 38%",
  },
  everyday: {
    src: "/images/brand/editorial/model-short-bob-blue-linen.png",
    alt: "Model in pale linen wearing pearl jewelry outdoors",
  },
  earrings: {
    src: "/images/brand/hero/pearl-earrings-editorial.png",
    alt: "Model wearing shell-and-pearl drop earrings in warm studio light",
  },
  necklaces: {
    src: "/images/brand/hero/pearl-necklace-editorial.png",
    alt: "Pearl necklace displayed on a black jewelry stand",
  },
  bracelets: {
    src: "/images/brand/hero/pearl-bracelet-editorial.png",
    alt: "Gold wire pearl bracelet displayed on dark fabric",
  },
  eyewear: {
    src: "/images/brand/hero/pearl-eyewear-chain-editorial.png",
    alt: "Pearl eyewear chain attached to eyeglasses on a dark background",
  },
  seaside: {
    src: "/images/brand/editorial/scene-seaside-stairs.png",
    alt: "Sunlit limestone steps leading toward the sea",
  },
  courtyard: {
    src: "/images/brand/editorial/scene-olive-courtyard.png",
    alt: "Olive courtyard in warm afternoon light",
  },
} as const satisfies Record<string, EditorialImage>;

export const HOMEPAGE_CATEGORY_LINKS = [
  { label: "Everyday Pearl", href: "/collections/pearl-series", image: HOMEPAGE_MEDIA.everyday },
  { label: "Pearl Earrings", href: "/collections/pearl-series?type=earrings", image: HOMEPAGE_MEDIA.earrings },
  { label: "Pearl Necklaces", href: "/collections/pearl-series?type=necklaces", image: HOMEPAGE_MEDIA.necklaces },
  { label: "Pearl Bracelets", href: "/collections/pearl-series?type=bracelets", image: HOMEPAGE_MEDIA.bracelets },
  { label: "Pearl Eyewear Chains", href: "/collections/pearl-series?type=eyewear-chains", image: HOMEPAGE_MEDIA.eyewear },
] as const;

export const HOMEPAGE_EDITORIAL_LINKS = [
  {
    label: "Pearl Gift Guide",
    title: "Choose by the way they wear it.",
    copy: "Pearl gifts under $50 and $70, plus everyday and statement edits.",
    href: "/gifts",
    image: HOMEPAGE_MEDIA.earrings,
  },
  {
    label: "Pearl Knowledge",
    title: "Care, styling, and freshwater pearls.",
    copy: "Straight answers for choosing and looking after pearl jewelry.",
    href: "/pearls",
    image: HOMEPAGE_MEDIA.seaside,
    links: [
      { label: "Pearl Guide", href: "/pearls" },
      { label: "Pearl Care", href: "/pearls/care" },
      { label: "How to Wear Pearls", href: "/pearls/how-to-wear" },
    ],
  },
] as const;

export function homepageEditorialSources(): string[] {
  return [...new Set(Object.values(HOMEPAGE_MEDIA).map(({ src }) => src))];
}
