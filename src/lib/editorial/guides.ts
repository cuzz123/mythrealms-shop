import {
  getProductType,
  getStorefrontProducts,
  type StorefrontProduct,
} from "@/lib/storefront/catalog";
import { BRAND } from "@/lib/brand-identity";

const EDITORIAL_AUTHOR = `${BRAND.name} Editorial` as const;

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
  author: typeof EDITORIAL_AUTHOR;
  published: "2026-07-18";
  updated: "2026-07-18" | "2026-07-26";
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
const GIA_JEWELRY_CARE_URL = "https://www.gia.edu/articles/gia-news-research-tips-caring-jewelry";
const GIA_PEARL_CARE_URL = "https://www.gia.edu/gia-news-research/pearl-care-cleaning";
const GIA_PEARL_TYPES_URL = "https://www.gia.edu/pearl-description";
const GIA_PEARL_BUYING_URL = "https://www.gia.edu/pearl/buyers-guide";
const FTC_PEARL_BUYING_URL = "https://consumer.ftc.gov/articles/buying-gemstones-diamonds-and-pearls";
const FTC_JEWELRY_ADVERTISING_URL = "https://www.ftc.gov/business-guidance/resources/loupe-advertising-diamond-gemstones-pearls";

export const PEARL_HUB_FAQ: readonly PearlHubFaq[] = [
  {
    question: "How should I choose a pearl piece?",
    answer: "Start with the placement you will use most, then compare the product gallery, dimensions, materials, and current availability.",
  },
  {
    question: "How should I care for pearl jewelry?",
    answer: "Put pearls on after cosmetics, wipe them after wear, and let a cleaned or wet piece air-dry fully before storing it flat in a soft pouch, separate from harder jewelry.",
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
    title: "How to Care for Pearl Jewelry",
    seoTitle: "How to Care for Pearl Jewelry | Pearl Care Guide",
    description: "Learn general pearl jewelry care: when to put it on, how to wipe it after wear, and why heat, chemicals, steam, and ultrasonic cleaning need care.",
    eyebrow: "Pearl Guide",
    directAnswer: "Care for pearl jewelry by putting it on after cosmetics and fragrance, wiping it with a very soft clean cloth after wear, and keeping it away from chemicals, high heat, steam, ultrasonic cleaners, and rough contact. These are general precautions, not item instructions. Use item-specific care only if it is explicitly stated on the exact item page; otherwise, do not infer it.",
    image: {
      src: "/images/brand/hero/pearl-bracelet-editorial.png",
      alt: "Gold wire pearl bracelet displayed on dark fabric",
      objectPosition: "center",
    },
    author: EDITORIAL_AUTHOR,
    published: "2026-07-18",
    updated: "2026-07-26",
    sections: [
      {
        id: "daily-routine",
        heading: "What is a practical daily pearl routine?",
        answer: "Make pearls the finishing step when getting ready and the first item you remove at the end of the day.",
        paragraphs: [
          "Apply cosmetics, fragrance, and hair products before putting on pearl jewelry. This reduces contact with residue from those products.",
          "After wear, use a soft, clean cloth to wipe the pearls and fittings before storage.",
        ],
      },
      {
        id: "cleaning",
        heading: "How should pearl jewelry be cleaned?",
        answer: "Use a very soft, clean cloth for general routine care. Use item-specific directions only if they are explicitly stated on the exact item page; otherwise, do not infer that water or a cleaner is suitable.",
        paragraphs: [
          "Do not use abrasive cloths, ultrasonic cleaners, steam cleaners, or harsh cleaning products on pearls. A finished piece may include other components with different care limits, so contact support or ask a qualified jeweler when the exact item page does not state the needed information.",
        ],
      },
      {
        id: "storage",
        heading: "How should pearl jewelry be stored?",
        answer: "Let a cleaned or wet piece air-dry fully, then store it flat in a soft pouch or cloth, separate from pieces that can scratch it.",
        paragraphs: [
          "Keep pearls away from heat and overly dry environments, and never hang strands because hanging can stretch the thread.",
        ],
      },
      {
        id: "avoid",
        heading: "Can I shower or swim while wearing pearls?",
        answer: "Remove pearl jewelry before showering or swimming.",
        paragraphs: [
          "Showering can expose pearl jewelry to soaps and other products, while swimming can expose it to chlorinated water. Take the piece off first, then put it back on only after you are dry and finished with cosmetics or hair products.",
          "Also remove pearl jewelry before using household cleaners or doing activities where it may rub against hard or rough surfaces.",
        ],
        table: {
          headers: ["Do", "Do not"],
          rows: [
            ["Wipe pearls with a soft cloth after wear.", "Spray fragrance or hairspray onto worn pearls."],
            ["Store pieces flat and separately in a soft pouch or cloth.", "Hang pearl strands or store them loose against hard jewelry."],
            ["Remove pearl jewelry before showering or swimming.", "Wear pearls in chlorinated pools or while using soaps."],
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
        answer: "Do not use an ultrasonic or steam cleaner for pearls. Use a very soft, clean cloth for general routine care. Only use item-specific directions if they are explicitly stated on the exact item page.",
      },
      {
        question: "How should I store pearl jewelry?",
        answer: "Let it air-dry fully if cleaned or wet, then store it flat in a soft pouch or cloth, separate from hard jewelry and away from heat and overly dry environments. Never hang strands.",
      },
    ],
    relatedTypes: ["earrings", "necklaces", "bracelets", "rings"],
    sources: [
      { label: "GIA: How should I care for my pearls?", href: GIA_CARE_URL },
      { label: "GIA: Tips on caring for jewelry", href: GIA_JEWELRY_CARE_URL },
      { label: "GIA: Pearl care and cleaning guide", href: GIA_PEARL_CARE_URL },
      { label: "FTC: Advertising diamonds, gemstones, and pearls", href: FTC_JEWELRY_ADVERTISING_URL },
    ],
  },
  "how-to-wear": {
    slug: "how-to-wear",
    title: "How to Wear Pearl Jewelry Every Day",
    seoTitle: "How to Wear Pearl Jewelry Every Day | Pearl Guide",
    description: "Learn simple ways to style pearl jewelry with everyday outfits, from proportion and repetition to occasion-aware finishing touches. General styling guidance only.",
    eyebrow: "Pearl Guide",
    directAnswer: "Wear pearl jewelry as a considered accent: start with one piece, choose a proportion that feels balanced with your neckline or sleeve, and keep the rest of the outfit simple. Use photos, measurements, or fastening details only if they are explicitly stated on the exact item page; otherwise, do not infer them. General styling ideas do not establish a specific item's fit, material, or composition.",
    image: {
      src: "/images/brand/hero/pearl-earrings-editorial.png",
      alt: "Model wearing pearl earrings",
      objectPosition: "center",
    },
    author: EDITORIAL_AUTHOR,
    published: "2026-07-18",
    updated: "2026-07-26",
    sections: [
      {
        id: "earrings",
        heading: "How do I choose pearl earrings for my face?",
        answer: "Compare earring scale and length near your face instead of treating face shape as a fixed rule.",
        paragraphs: [
          "Studs and small drops keep the focus near the ear. Longer drops add a vertical line and move with the wearer.",
          "Facial proportions differ, so use a mirror to compare where a stud, short drop, or longer drop might sit. Use dimensions only if they are explicitly stated on the exact item page; otherwise, do not infer scale from a photograph.",
          "For a coordinated look, keep other jewelry simple or repeat one metal tone already used in the earrings.",
        ],
      },
      {
        id: "necklaces",
        heading: "How do I match a pearl necklace to a neckline?",
        answer: "Choose the necklace length after checking the neckline it will sit against.",
        paragraphs: [
          "A close necklace works with open necklines when you want the jewelry near the collarbone. A longer pendant or lariat leaves more space between the neckline and the focal point.",
        ],
      },
      {
        id: "wrist-and-hand",
        heading: "How do I style pearls at the wrist and hand?",
        answer: "Bracelets and rings add detail where the hands are already active.",
        paragraphs: [
          "Use one bracelet or ring as the main detail, then add other pieces only when they do not compete for the same attention. Use dimensions or fastening information only if explicitly stated on the exact item page; otherwise, do not infer fit, comfort, or suitability from a photograph.",
        ],
      },
      {
        id: "daily-wardrobes",
        heading: "How can pearls work for casual and formal occasions?",
        answer: "Build from one pearl piece, then adjust its scale and placement to the occasion and outfit.",
        paragraphs: [
          "With a plain shirt, knit, or jacket, pearl jewelry can be the clearest detail. With a patterned or detailed outfit, a smaller piece often keeps the overall look easier to read.",
          "For formal occasions, the same placement-first approach still applies: check the neckline, choose one focal piece, and add another only when the two placements do not compete.",
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
        answer: "Yes. As a general styling idea, start with one piece and adjust the scale to the rest of the outfit. Use item details only if explicitly stated on the exact item page; otherwise, do not infer suitability for a specific activity.",
      },
      {
        question: "How many pearl pieces should I wear together?",
        answer: "Use one piece as the focus, then add another only when the placements do not compete.",
      },
    ],
    relatedTypes: ["earrings", "necklaces", "bracelets", "rings"],
    sources: [
      { label: "GIA: Pearl buyer's guide", href: GIA_PEARL_BUYING_URL },
      { label: "GIA: Pearl care and cleaning guide", href: GIA_PEARL_CARE_URL },
      { label: "FTC: Buying gemstones, diamonds, and pearls", href: FTC_PEARL_BUYING_URL },
    ],
  },
  "freshwater-pearls": {
    slug: "freshwater-pearls",
    title: "Freshwater Pearls",
    seoTitle: "What Are Freshwater Cultured Pearls?",
    description: "A plain-English overview of cultured freshwater pearls and the details to compare.",
    eyebrow: "Pearl Guide",
    directAnswer: "Cultured freshwater pearls form in freshwater mollusks after people begin the cultivation process. Their visible shape, luster, surface, and tone can vary naturally, so compare those characteristics piece by piece. For any item you are considering, use its own gallery, dimensions, materials, and care notes as the exact product reference.",
    image: {
      src: "/images/brand/hero/pearl-necklace-editorial.png",
      alt: "Pearl necklace displayed on a black jewelry stand",
      objectPosition: "center",
    },
    author: EDITORIAL_AUTHOR,
    published: "2026-07-18",
    updated: "2026-07-18",
    sections: [
      {
        id: "formation",
        heading: "How do cultured freshwater pearls form?",
        answer: "A cultivation process begins inside a freshwater mollusk, which then forms nacre around the introduced material.",
        paragraphs: [
          "Cultured and natural pearls form through different starting conditions. With cultured pearls, people begin the process and the mollusk forms the pearl over time.",
          "Freshwater cultured pearls are grown in freshwater environments. A product listing should state any specific material information for that item.",
        ],
      },
      {
        id: "appearance",
        heading: "How do shape, luster, surface, and tone vary?",
        answer: "Compare visible appearance details individually because pearls vary naturally.",
        paragraphs: [
          "Shape can range from round to more irregular forms. Luster describes how light appears to reflect from the surface, while surface shows marks or texture that may be visible at close range.",
          "Tone and overtone can also differ between pearls. These differences are visual characteristics, not universal grades.",
        ],
      },
      {
        id: "comparison",
        heading: "How do freshwater pearls compare with other cultured types?",
        answer: "Freshwater, Akoya, South Sea, and Tahitian cultured pearls differ by growing environment, mollusk, and typical appearance ranges.",
        paragraphs: [
          "GIA identifies freshwater, Akoya, South Sea, and Tahitian as four major types of cultured whole pearls. Freshwater cultured pearls are generally grown in lakes and ponds, while Akoya, South Sea, and Tahitian cultured pearls are saltwater types.",
          "These are broad type characteristics, not guarantees about an individual piece. Use the product record for any stated material or pearl identity, and compare its own gallery and dimensions before buying.",
        ],
        table: {
          headers: ["Cultured pearl type", "Growing environment", "Typical appearance described by GIA"],
          rows: [
            ["Freshwater", "Freshwater lakes and ponds", "A broad range of sizes, shapes, and colors"],
            ["Akoya", "Saltwater", "Often white or cream and familiar in classic strands"],
            ["South Sea", "Saltwater", "White to silver or golden, with generally larger sizes"],
            ["Tahitian", "Saltwater", "Gray, black, or brown with varied overtones"],
          ],
        },
      },
      {
        id: "purchase-checks",
        heading: "What should I check before buying pearl jewelry?",
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

export function getRelatedGuideProducts(
  guide: Pick<PearlGuide, "relatedTypes">,
  limit = 6,
): StorefrontProduct[] {
  return getStorefrontProducts()
    .filter(
      (product) =>
        product.isActive &&
        product.inStock &&
        guide.relatedTypes.some((type) => type === getProductType(product)),
    )
    .slice(0, limit);
}
