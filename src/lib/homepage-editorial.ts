export type EditorialImage = {
  src: string;
  alt: string;
  objectPosition?: string;
};

export type HomepageHeroSlide = EditorialImage & {
  eyebrow: string;
  title: string;
  description: string;
};

export const HOMEPAGE_HERO_SLIDES = [
  {
    src: "/images/brand/home/hero-earrings-model-v2.png",
    alt: "Model wearing pearl drop earrings in Mediterranean sunlight",
    eyebrow: "Editorial / Summer 2026",
    title: "Pearls for sunlit days.",
    description: "Pearl jewelry selected for natural light, everyday movement, and the moments worth keeping.",
  },
  {
    src: "/images/brand/home/hero-necklace-model-v2.png",
    alt: "Model wearing a pearl and gold lariat necklace in a sunlit courtyard",
    eyebrow: "The Pearl Edit",
    title: "A quiet line of light.",
    description: "Pieces that settle easily into the days you already love to wear.",
  },
  {
    src: "/images/brand/home/hero-bracelet-model-v2.png",
    alt: "Model wearing a pearl and gold bracelet on a coastal terrace",
    eyebrow: "Everyday Rituals",
    title: "Details that move with you.",
    description: "Warm gold, soft pearl, and an easy sense of occasion in the everyday.",
  },
] as const satisfies readonly HomepageHeroSlide[];

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
    src: "/images/brand/home/hero-necklace-model-v2.png",
    alt: "Model wearing a pearl and gold lariat necklace in a sunlit courtyard",
    objectPosition: "82% center",
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

export const HOMEPAGE_CATEGORY_LINKS: readonly { label: string; href: string; image: EditorialImage }[] = [
  { label: "Everyday Pearl", href: "/collections/pearl-series", image: HOMEPAGE_MEDIA.everyday },
  { label: "Pearl Earrings", href: "/collections/pearl-series?type=earrings", image: HOMEPAGE_MEDIA.earrings },
  { label: "Pearl Necklaces", href: "/collections/pearl-series?type=necklaces", image: HOMEPAGE_MEDIA.necklaces },
  { label: "Pearl Bracelets", href: "/collections/pearl-series?type=bracelets", image: HOMEPAGE_MEDIA.bracelets },
  { label: "Pearl Eyewear Chains", href: "/collections/pearl-series?type=eyewear-chains", image: HOMEPAGE_MEDIA.eyewear },
];

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
  return [...new Set([...Object.values(HOMEPAGE_MEDIA), ...HOMEPAGE_HERO_SLIDES].map(({ src }) => src))];
}
