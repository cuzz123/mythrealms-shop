import { HOMEPAGE_MEDIA, type EditorialImage } from "@/lib/homepage-editorial";

type StoryAction = Readonly<{
  label: string;
  href: string;
}>;

type StoryDetail = Readonly<{
  title: string;
  text: string;
}>;

type StoryTextSection = Readonly<{
  kind: "text";
  id: "why-pearls";
  eyebrow: string;
  title: string;
  paragraphs: readonly string[];
}>;

type StoryDetailSection = Readonly<{
  kind: "details";
  id: "how-the-edit-is-built" | "what-we-promise";
  eyebrow: string;
  title: string;
  introduction: string;
  details: readonly StoryDetail[];
  closing?: string;
}>;

type StoryReferenceSection = Readonly<{
  kind: "reference";
  id: "product-reference";
  eyebrow: string;
  title: string;
  introduction: string;
  reference: StoryDetail & Readonly<{ image: EditorialImage }>;
  editorial: StoryDetail & Readonly<{ image: EditorialImage }>;
  disclosure: string;
}>;

export type StorySection = StoryTextSection | StoryDetailSection | StoryReferenceSection;

export type StoryContent = Readonly<{
  seo: Readonly<{
    title: string;
    description: string;
  }>;
  hero: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
    image: EditorialImage;
  }>;
  sections: readonly StorySection[];
  editorialStrip: Readonly<{
    eyebrow: string;
    title: string;
    description: string;
  }>;
  editorialImages: readonly EditorialImage[];
  actions: readonly StoryAction[];
}>;

export const STORY_CONTENT = {
  seo: {
    title: "Our Story | MythRealms Pearl Jewelry",
    description:
      "Discover the MythRealms pearl point of view, how the online edit is built, and how product reference photography differs from editorial styling.",
  },
  hero: {
    eyebrow: "Our Story",
    title: "Pearls, edited for real life.",
    description:
      "MythRealms is a focused online pearl edit, bringing pearls into everyday wardrobes, natural light, and the moments between ordinary and dressed up.",
    image: {
      ...HOMEPAGE_MEDIA.everyday,
      objectPosition: "center 38%",
    },
  },
  sections: [
    {
      kind: "text",
      id: "why-pearls",
      eyebrow: "Why pearls",
      title: "Why should pearls wait for an occasion?",
      paragraphs: [
        "Pearls bring their own light. Their luster changes with daylight, clothing, and skin, making them as easy to revisit as a familiar shirt or a favorite pair of earrings.",
        "Natural variation is part of what makes pearl jewelry visually alive. We focus on pieces that can move between ordinary days and dressier moments without asking the rest of a wardrobe to change around them.",
      ],
    },
    {
      kind: "details",
      id: "how-the-edit-is-built",
      eyebrow: "How the edit is built",
      title: "A focused storefront starts with a clear visual standard.",
      introduction:
        "Pieces enter the edit through recognizable product structure, wearability, gallery clarity, and their fit within a pearl-led storefront.",
      details: [
        {
          title: "Recognizable structure",
          text: "The product gallery must clearly support the visible shape, setting, scale, and arrangement of the piece.",
        },
        {
          title: "Wearability",
          text: "The design should make sense for repeat wear, whether it is a quiet detail or a more noticeable pearl statement.",
        },
        {
          title: "Gallery clarity",
          text: "Customers should be able to inspect the source-supplied views that support a buying decision.",
        },
        {
          title: "Pearl-led fit",
          text: "Each piece should contribute a distinct, useful option to an online storefront centered on pearl jewelry.",
        },
      ],
    },
    {
      kind: "reference",
      id: "product-reference",
      eyebrow: "Looking clearly",
      title: "Product reference and editorial styling",
      introduction:
        "The two image types have different jobs. Keeping that distinction visible makes browsing more useful and styling more honest.",
      reference: {
        title: "Product Reference",
        text: "Source-supplied product photos are the reference for product structure, color, proportion, surface, and the details visible for that SKU.",
        image: {
          src: "/images/products/1688-shop/pearl-series/pearl-series-13-main.webp",
          alt: "Source-supplied product reference photo of pearl earrings",
        },
      },
      editorial: {
        title: "Editorial Styling",
        text: "Editorial images show styling context, light, and wardrobe mood. They help express how pearl jewelry can sit within a look, not the exact details of a specific product.",
        image: HOMEPAGE_MEDIA.hero,
      },
      disclosure:
        "Some editorial images are digitally created. They provide styling context and are not a substitute for the source-supplied product galleries used to make a purchase decision.",
    },
    {
      kind: "details",
      id: "what-we-promise",
      eyebrow: "What we promise",
      title: "The practical details stay close to the product.",
      introduction:
        "A focused edit should make the information around a purchase as clear as the visual point of view.",
      details: [
        {
          title: "Current pricing and availability",
          text: "Product pages show the current listed price and availability for the active catalog.",
        },
        {
          title: "Product galleries",
          text: "The corresponding SKU gallery remains the reference for the product structure and visible details.",
        },
        {
          title: "Shipping and returns",
          text: "Shipping information and return information remain available before a customer commits to a purchase.",
        },
        {
          title: "Customer support",
          text: "A direct customer support path is available when an order or product question needs a closer look.",
        },
      ],
      closing:
        "Material details are stated only when they are confirmed for the individual SKU; the Story page does not add material, sourcing, or certification claims.",
    },
  ],
  editorialStrip: {
    eyebrow: "The Mediterranean edit",
    title: "Pearls in natural light.",
    description:
      "Model and scene imagery sets the editorial context: pale linen, sunlit stone, open water, and the quieter pace of an olive courtyard.",
  },
  editorialImages: [
    HOMEPAGE_MEDIA.everyday,
    HOMEPAGE_MEDIA.seaside,
    HOMEPAGE_MEDIA.courtyard,
  ],
  actions: [
    { label: "Shop the Pearl Edit", href: "/collections/pearl-series" },
    { label: "Read the Pearl Guide", href: "/pearls" },
    { label: "Explore Gifts", href: "/gifts" },
  ],
} as const satisfies StoryContent;
