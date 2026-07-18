export type GuideSlug = "care" | "how-to-wear" | "freshwater-pearls";

export type GuideSection = Readonly<{
  id: string;
  heading: string;
  answer: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
  table?: Readonly<{
    headers: readonly string[];
    rows: readonly (readonly string[])[];
  }>;
}>;

export type PearlGuide = Readonly<{
  slug: GuideSlug;
  title: string;
  seoTitle: string;
  description: string;
  eyebrow: string;
  directAnswer: string;
  image: { src: string; alt: string; objectPosition?: string };
  author: "MythRealms Editorial";
  updated: "2026-07-18";
  sections: readonly GuideSection[];
  faq: readonly { question: string; answer: string }[];
  relatedTypes: readonly ("earrings" | "necklaces" | "bracelets" | "rings")[];
  sources: readonly { label: string; href: string }[];
}>;

export type PearlHubFaq = Readonly<{
  question: string;
  answer: string;
  href?: "/faq";
}>;

const GIA_CARE_URL = "https://my.gia.edu/faqs/gia-faq-about-gemstones-how-to-care-for-pearls";
const GIA_PEARL_TYPES_URL = "https://www.gia.edu/pearl-description";
const GIA_PEARL_BUYING_URL = "https://www.gia.edu/pearl/buyers-guide";

export const PEARL_HUB_FAQ: readonly PearlHubFaq[] = [
  {
    question: "How should I choose a pearl piece?",
    answer: "Start with the placement you will use most, then compare the product gallery, dimensions, materials, and current availability.",
  },
  {
    question: "How should I care for pearl jewelry?",
    answer: "Put pearls on after cosmetics, wipe them after wear, and store them separately in a dry, soft place.",
  },
  {
    question: "Where can I find customer help?",
    answer: "The complete customer FAQ covers orders, shipping, returns, and other store questions.",
    href: "/faq",
  },
];

export const PEARL_GUIDES: Readonly<Record<GuideSlug, PearlGuide>> = {
  care: {
    slug: "care",
    title: "Pearl Care",
    seoTitle: "How to Care for Pearl Jewelry",
    description: "A practical routine for wearing, cleaning, and storing pearl jewelry.",
    eyebrow: "Pearl Guide",
    directAnswer: "Put pearls on after cosmetics, wipe them after wear, keep them dry, and store them separately.",
    image: {
      src: "/images/brand/hero/pearl-bracelet-editorial.png",
      alt: "Pearl bracelet on a model's wrist",
      objectPosition: "center",
    },
    author: "MythRealms Editorial",
    updated: "2026-07-18",
    sections: [
      {
        id: "daily-routine",
        heading: "Daily routine",
        answer: "Make pearls the finishing step when getting ready and the first item you remove at the end of the day.",
        paragraphs: [
          "Apply cosmetics, fragrance, and hair products before putting on pearl jewelry. This reduces contact with residue from those products.",
          "After wear, use a soft, clean cloth to wipe the pearls and fittings before storage.",
        ],
      },
      {
        id: "cleaning",
        heading: "Cleaning",
        answer: "Use a soft cloth for routine care and avoid household cleaners.",
        paragraphs: [
          "Do not use abrasive cloths, ultrasonic cleaners, or harsh cleaning products on pearls. If a piece needs more than a gentle wipe, ask a qualified jeweler for advice.",
        ],
      },
      {
        id: "storage",
        heading: "Storage",
        answer: "Keep pearl jewelry dry and separate from pieces that can scratch it.",
        paragraphs: [
          "Store each piece in a soft pouch or lined compartment. Avoid leaving pearls in a hot, dry place or pressed against hard jewelry.",
        ],
      },
      {
        id: "avoid",
        heading: "What to avoid",
        answer: "Avoid chemicals, rough contact, and prolonged heat.",
        paragraphs: [
          "Take pearl jewelry off before using cleaning products or doing activities where it may rub against hard or rough surfaces.",
        ],
        table: {
          headers: ["Do", "Do not"],
          rows: [
            ["Wipe pearls with a soft cloth after wear.", "Spray fragrance or hairspray onto worn pearls."],
            ["Store pieces separately in a soft pouch or case.", "Store pearls loose against hard jewelry."],
            ["Ask a jeweler about repairs or restringing.", "Use household cleaners or ultrasonic cleaning."],
          ],
        },
      },
    ],
    faq: [
      {
        question: "Can I wear pearls after applying perfume?",
        answer: "Yes. Apply perfume first, let it settle, and put on pearl jewelry afterwards.",
      },
      {
        question: "Can pearl jewelry be cleaned in an ultrasonic cleaner?",
        answer: "Do not use an ultrasonic cleaner for pearls. Use a soft cloth for routine care instead.",
      },
      {
        question: "How should I store pearl jewelry?",
        answer: "Keep it dry in a soft pouch or lined compartment, separate from hard jewelry.",
      },
    ],
    relatedTypes: ["earrings", "necklaces", "bracelets", "rings"],
    sources: [
      { label: "GIA: How should I care for my pearls?", href: GIA_CARE_URL },
    ],
  },
  "how-to-wear": {
    slug: "how-to-wear",
    title: "How to Wear Pearls",
    seoTitle: "How to Wear Pearl Jewelry",
    description: "A placement-first guide to combining pearl jewelry with daily outfits.",
    eyebrow: "Pearl Guide",
    directAnswer: "Choose placement first, then scale, then neckline and outfit.",
    image: {
      src: "/images/brand/hero/pearl-earrings-editorial.png",
      alt: "Model wearing pearl earrings",
      objectPosition: "center",
    },
    author: "MythRealms Editorial",
    updated: "2026-07-18",
    sections: [
      {
        id: "earrings",
        heading: "Earrings",
        answer: "Choose earrings when you want the detail to sit close to the face.",
        paragraphs: [
          "Studs and small drops keep the focus near the ear. Longer drops add a vertical line and move with the wearer.",
          "For a coordinated look, keep other jewelry simple or repeat one metal tone already used in the earrings.",
        ],
      },
      {
        id: "necklaces",
        heading: "Necklaces",
        answer: "Choose the necklace length after checking the neckline it will sit against.",
        paragraphs: [
          "A close necklace works with open necklines when you want the jewelry near the collarbone. A longer pendant or lariat leaves more space between the neckline and the focal point.",
        ],
      },
      {
        id: "wrist-and-hand",
        heading: "Wrist and hand",
        answer: "Bracelets and rings add detail where the hands are already active.",
        paragraphs: [
          "Use one bracelet or ring as the main detail, then add other pieces only when they do not compete for the same attention. Check that a bracelet is comfortable for writing, carrying, and other regular movement.",
        ],
      },
      {
        id: "daily-wardrobes",
        heading: "Daily wardrobes",
        answer: "Build from one pearl piece, then decide whether the outfit needs another focal point.",
        paragraphs: [
          "With a plain shirt, knit, or jacket, pearl jewelry can be the clearest detail. With a patterned or detailed outfit, a smaller piece often keeps the overall look easier to read.",
        ],
        table: {
          headers: ["Placement", "Visual effect"],
          rows: [
            ["Near the face", "Draws attention to earrings or short necklaces."],
            ["At the collarbone", "Keeps the focal point close to the neckline."],
            ["At the wrist or hand", "Adds detail that appears during everyday movement."],
          ],
        },
      },
    ],
    faq: [
      {
        question: "How do I choose a necklace length?",
        answer: "Start with the neckline, then choose where you want the focal point to sit.",
      },
      {
        question: "Can I wear pearls with casual clothes?",
        answer: "Yes. Start with one piece and adjust the scale to the rest of the outfit.",
      },
      {
        question: "How many pearl pieces should I wear together?",
        answer: "Use one piece as the focus, then add another only when the placements do not compete.",
      },
    ],
    relatedTypes: ["earrings", "necklaces", "bracelets", "rings"],
    sources: [
      { label: "GIA: Pearl buyer's guide", href: GIA_PEARL_BUYING_URL },
    ],
  },
  "freshwater-pearls": {
    slug: "freshwater-pearls",
    title: "Freshwater Pearls",
    seoTitle: "What Are Freshwater Cultured Pearls?",
    description: "A plain-English overview of cultured freshwater pearls and the details to compare.",
    eyebrow: "Pearl Guide",
    directAnswer: "Cultured freshwater pearls are formed in freshwater mollusks through a cultivation process, and natural variation is part of their appearance.",
    image: {
      src: "/images/brand/hero/pearl-necklace-editorial.png",
      alt: "Model wearing a pearl necklace",
      objectPosition: "center",
    },
    author: "MythRealms Editorial",
    updated: "2026-07-18",
    sections: [
      {
        id: "formation",
        heading: "How cultured freshwater pearls form",
        answer: "A cultivation process begins inside a freshwater mollusk, which then forms nacre around the introduced material.",
        paragraphs: [
          "Cultured and natural pearls form through different starting conditions. With cultured pearls, people begin the process and the mollusk forms the pearl over time.",
          "Freshwater cultured pearls are grown in freshwater environments. A product listing should state any specific material information for that item.",
        ],
      },
      {
        id: "appearance",
        heading: "Shape, luster, surface, and tone",
        answer: "Compare visible appearance details individually because pearls vary naturally.",
        paragraphs: [
          "Shape can range from round to more irregular forms. Luster describes how light appears to reflect from the surface, while surface shows marks or texture that may be visible at close range.",
          "Tone and overtone can also differ between pearls. These differences are visual characteristics, not universal grades.",
        ],
      },
      {
        id: "comparison",
        heading: "Comparison considerations",
        answer: "Compare the same visible factors across pieces before deciding which one suits your use.",
        paragraphs: [
          "Consider placement, size, shape, luster, surface, tone, and the rest of the setting. A strand also adds matching between pearls as a separate visual consideration.",
        ],
        bullets: [
          "Placement and size",
          "Shape and surface appearance",
          "Luster and tone",
          "Materials and current product details",
        ],
      },
      {
        id: "purchase-checks",
        heading: "Purchase checks",
        answer: "Use each product gallery as the exact visual reference for the item you are considering.",
        paragraphs: [
          "Compare the gallery, dimensions, materials, and care notes on the individual product page. Do not treat a general guide image as a substitute for the images attached to that product record.",
        ],
      },
    ],
    faq: [
      {
        question: "Are freshwater pearls natural?",
        answer: "Freshwater pearls can be natural or cultured. A product record should identify the material information supplied for that item.",
      },
      {
        question: "Why do freshwater pearls vary in shape and color?",
        answer: "Pearls can vary naturally in visible characteristics such as shape, luster, surface, and tone.",
      },
      {
        question: "How should I compare pearl products online?",
        answer: "Use each product gallery as the exact visual reference, then compare its dimensions, materials, and care notes.",
      },
    ],
    relatedTypes: ["earrings", "necklaces", "bracelets", "rings"],
    sources: [
      { label: "GIA: Different pearl types and colors", href: GIA_PEARL_TYPES_URL },
      { label: "GIA: Pearl buyer's guide", href: GIA_PEARL_BUYING_URL },
    ],
  },
};
