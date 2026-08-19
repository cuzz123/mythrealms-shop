export const PURCHASE_GUIDE_SLUGS = [
  "how-to-choose-pearl-earrings",
  "pearl-necklace-length-guide",
  "bracelet-size-and-fit-guide",
  "how-to-wear-pearl-hair-accessories",
  "how-to-choose-a-glasses-chain",
  "pearl-jewelry-buying-checklist",
] as const;

export type PurchaseGuideSlug = (typeof PURCHASE_GUIDE_SLUGS)[number];

export const ACTIVE_PURCHASE_GUIDE_SLUGS = [
  "how-to-choose-pearl-earrings",
  "pearl-necklace-length-guide",
  "bracelet-size-and-fit-guide",
] as const satisfies readonly PurchaseGuideSlug[];

const activePurchaseGuideSlugs = new Set<PurchaseGuideSlug>(
  ACTIVE_PURCHASE_GUIDE_SLUGS,
);

export function isActivePurchaseGuideSlug(
  slug: PurchaseGuideSlug,
): slug is (typeof ACTIVE_PURCHASE_GUIDE_SLUGS)[number] {
  return activePurchaseGuideSlugs.has(slug);
}

export function isVisiblePurchaseGuideRelatedHref(href: string) {
  const prefix = "/pearls/";
  if (!href.startsWith(prefix)) return true;
  const slug = href.slice(prefix.length);
  if (!(PURCHASE_GUIDE_SLUGS as readonly string[]).includes(slug)) return true;
  return isActivePurchaseGuideSlug(slug as PurchaseGuideSlug);
}

export type PurchaseGuide = Readonly<{
  slug: PurchaseGuideSlug;
  seoTitle: string;
  description: string;
  h1: string;
  eyebrow: "Pearl Buying Guide";
  directAnswer: string;
  boundary: string;
  published: "2026-08-12";
  updated: "2026-08-12";
  sourceReviewedOn: "2026-08-12";
  sections: readonly Readonly<{ id: string; heading: string; paragraphs: readonly string[] }>[];
  faq: readonly Readonly<{ question: string; answer: string }>[];
  sources: readonly Readonly<{ label: string; href: string }>[];
  relatedLinks: readonly Readonly<{ label: string; href: string }>[];
}>;

export const PURCHASE_GUIDE_SOURCES = {
  giaBuyerGuide: {
    label: "GIA: Pearl Buyer's Guide",
    href: "https://www.gia.edu/pearl/buyers-guide",
  },
  ftcConsumerPearls: {
    label: "FTC: Buying Gemstones, Diamonds, and Pearls",
    href: "https://consumer.ftc.gov/articles/buying-gemstones-diamonds-and-pearls",
  },
  ftcJewelryAdvertising: {
    label: "FTC: In the Loupe: Advertising Diamonds, Gemstones and Pearls",
    href: "https://www.ftc.gov/business-guidance/resources/loupe-advertising-diamond-gemstones-pearls",
  },
  googlePeopleFirst: {
    label: "Google Search Central: Creating helpful, reliable, people-first content",
    href: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
  },
  googleEcommerceStructure: {
    label: "Google Search Central: Ecommerce website navigation structure",
    href: "https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure?hl=en",
  },
} as const;

const boundary = "This guide provides general decision steps. Confirm dimensions, materials, pearl description, fastening, care, and compatibility only from the exact approved product record. If a decision-critical fact is missing, ask before buying.";
const dates = { published: "2026-08-12", updated: "2026-08-12", sourceReviewedOn: "2026-08-12" } as const;
const consumerSources = [PURCHASE_GUIDE_SOURCES.giaBuyerGuide, PURCHASE_GUIDE_SOURCES.ftcConsumerPearls] as const;
const pearlGuide = { label: "Pearl Guide", href: "/pearls" } as const;
const howToWear = { label: "How to Wear Pearl Jewelry", href: "/pearls/how-to-wear" } as const;
const buyingChecklist = { label: "Pearl Jewelry Buying Checklist", href: "/pearls/pearl-jewelry-buying-checklist" } as const;

export const PURCHASE_GUIDES = {
  "how-to-choose-pearl-earrings": {
    slug: "how-to-choose-pearl-earrings",
    seoTitle: "How to Choose Pearl Earrings | Maverenne",
    description: "Compare pearl earring scale, outline, and drop using verified product images and item-specific details, without relying on fixed face-shape rules.",
    h1: "How to Choose Pearl Earrings",
    eyebrow: "Pearl Buying Guide",
    directAnswer: "Choose pearl earrings by comparing their visible outline, scale, and drop near the face, then check the exact product gallery and any verified dimensions. Treat face-shape advice as an option, not a rule. Do not infer weight, comfort, fastening, metal, or pearl type from a styling photograph.",
    boundary,
    ...dates,
    sections: [
      { id: "visible-outline", heading: "Start with the visible outline", paragraphs: ["Look first at the outline you can actually see: rounded, elongated, clustered, or linear. Use that outline to decide whether the earring should feel quiet or prominent beside the face, without treating the photograph as proof of its dimensions or construction."] },
      { id: "compare-scale", heading: "Compare scale instead of following a face-shape rule", paragraphs: ["Compare the earring's visible scale with your features and the amount of emphasis you want. Face-shape categories can suggest options, but they do not determine what you must wear and cannot establish comfort or fit."] },
      { id: "check-drop", heading: "Check how the drop changes the focal point", paragraphs: ["A shorter or longer visible drop moves the focal point differently beside the jaw and neckline. Compare that visual position in the exact gallery, then use only verified item dimensions for an actual size decision."] },
      { id: "exact-item-record", heading: "Use the exact item record before deciding", paragraphs: ["Before deciding, review the exact item's approved gallery and any supplied dimensions, pearl description, materials, fastening, and care details. If one of those facts matters and is not stated, ask rather than infer it."] },
    ],
    faq: [
      { question: "Which pearl earring shape should I choose?", answer: "Compare the visible outline near your face and choose the shape that supports the look you want. A general guide cannot establish the fit or comfort of a specific pair." },
      { question: "Do pearl earrings need to match my face shape?", answer: "No. Face-shape suggestions are optional styling ideas. Compare scale, outline, and drop in relation to your own features instead of treating them as fixed rules." },
      { question: "Can a product photo tell me the earring size?", answer: "A photograph can show visible proportions but cannot establish exact scale. Use dimensions only when the exact product record states them." },
      { question: "What should I verify before buying earrings?", answer: "Check the exact gallery and any verified dimensions, materials, fastening details, and care information supplied for that item." },
    ],
    sources: consumerSources,
    relatedLinks: [pearlGuide, howToWear, buyingChecklist, { label: "Shop the Pearl Edit", href: "/collections/pearl-series" }],
  },
  "pearl-necklace-length-guide": {
    slug: "pearl-necklace-length-guide",
    seoTitle: "Pearl Necklace Length Guide | Maverenne",
    description: "Learn how to measure where a pearl necklace may sit and compare that position with a neckline using verified item dimensions.",
    h1: "Pearl Necklace Length Guide",
    eyebrow: "Pearl Buying Guide",
    directAnswer: "Choose a pearl necklace length by measuring where you want its focal point to sit, then compare that position with the neckline you plan to wear. Use only dimensions stated on the exact product page. A photograph cannot confirm length, clasp, extender, adjustability, comfort, or fit for a particular person.",
    boundary,
    ...dates,
    sections: [
      { id: "measure-position", heading: "Measure the position, not a label", paragraphs: ["Mark the point where you want the necklace's focal detail to sit, using a flexible tape or non-stretch cord. Measure that position flat instead of relying on a generic length label that may not describe the item."] },
      { id: "compare-neckline", heading: "Compare the measured position with the neckline", paragraphs: ["Put the intended necklace position and the planned neckline in the same view. Decide whether you want the necklace above, within, or below that opening, then compare your measurement only with a verified item length."] },
      { id: "necklace-shape", heading: "Allow for the shape of the necklace", paragraphs: ["The visible fall can change when a necklace includes a pendant, spaced elements, or a curved strand. Use the exact gallery to understand the outline, but do not use a model photograph as a measurement for another person."] },
      { id: "verify-item-details", heading: "Verify the exact item details", paragraphs: ["Confirm the stated length, clasp, extender, adjustability, materials, and care information in the approved item record when those facts are supplied. A general guide cannot fill in a missing item-specific detail."] },
    ],
    faq: [
      { question: "How do I measure for a pearl necklace?", answer: "Use a flexible tape or a non-stretch cord to mark the position where you want the necklace to sit, then measure that length flat." },
      { question: "Which necklace length works with an open neckline?", answer: "Choose the visible position you want relative to the neckline, then compare it with a verified item length. There is no single required length." },
      { question: "Can I estimate necklace length from a model photo?", answer: "A model photograph can show styling context but cannot establish exact scale for another person. Use a stated measurement from the exact item record." },
      { question: "Does this guide confirm that a necklace is adjustable?", answer: "No. Adjustability, clasp, extender, and exact length are item-specific facts that must come from the approved product record." },
    ],
    sources: consumerSources,
    relatedLinks: [pearlGuide, howToWear, buyingChecklist, { label: "Shop the Pearl Edit", href: "/collections/pearl-series" }],
  },
  "bracelet-size-and-fit-guide": {
    slug: "bracelet-size-and-fit-guide",
    seoTitle: "Pearl Bracelet Size and Fit Guide | Maverenne",
    description: "Measure your wrist and compare a preferred visual fit with verified bracelet dimensions, without assuming adjustability or comfort.",
    h1: "Pearl Bracelet Size and Fit Guide",
    eyebrow: "Pearl Buying Guide",
    directAnswer: "Choose a pearl bracelet size by measuring your wrist at the intended position and deciding whether you prefer a closer or looser visual fit. Compare that measurement only with dimensions verified for the exact item. Do not infer comfort, adjustability, fastening, weight, or wrist suitability from an image or category name.",
    boundary,
    ...dates,
    sections: [
      { id: "measure-wrist", heading: "Measure the intended wrist position", paragraphs: ["Wrap a flexible tape around the place where you expect the bracelet to sit and record the measurement without pulling tight. Repeat the measurement if the bracelet may sit at more than one wrist position."] },
      { id: "visual-fit", heading: "Choose a closer or looser visual fit", paragraphs: ["Decide whether you want the bracelet to appear closer to the wrist or to show more movement. That choice is a visual preference, not a universal allowance or a guarantee that a particular item will fit."] },
      { id: "design-scale", heading: "Consider the visible scale of the design", paragraphs: ["Compare the visible size and spacing of the bracelet's elements with the effect you want on the wrist. Use the gallery for appearance only; it does not establish weight, comfort, or exact dimensions."] },
      { id: "bracelet-record", heading: "Check the exact bracelet record", paragraphs: ["Compare your wrist measurement with verified item dimensions and review any approved fastening, adjustability, construction, and care details. If the record does not state a needed fact, do not assume it from the image."] },
    ],
    faq: [
      { question: "How do I measure my wrist for a bracelet?", answer: "Wrap a flexible tape around the wrist position where you expect the bracelet to sit and record the measurement without pulling the tape tight." },
      { question: "How much extra room should a bracelet have?", answer: "Extra room is a personal visual and movement preference. This guide does not prescribe an allowance or guarantee the fit of a particular bracelet." },
      { question: "Can a bracelet photo show whether it will fit?", answer: "No. A photograph shows styling context, not an exact fit for your wrist. Compare your measurement with verified item dimensions." },
      { question: "Does this guide confirm that a bracelet is adjustable?", answer: "No. Adjustability, fastening, dimensions, and construction must be stated in the exact approved product record." },
    ],
    sources: consumerSources,
    relatedLinks: [pearlGuide, howToWear, buyingChecklist, { label: "Shop the Pearl Edit", href: "/collections/pearl-series" }],
  },
  "how-to-wear-pearl-hair-accessories": {
    slug: "how-to-wear-pearl-hair-accessories",
    seoTitle: "How to Wear Pearl Hair Accessories | Maverenne",
    description: "Use placement, hairstyle balance, and visible scale to style pearl hair accessories while keeping hold and compatibility claims item-specific.",
    h1: "How to Wear Pearl Hair Accessories",
    eyebrow: "Pearl Buying Guide",
    directAnswer: "Wear pearl hair accessories by choosing one visible placement, balancing its scale with the hairstyle, and keeping nearby jewelry restrained. Use the exact product images to compare shape and orientation. Do not infer hold strength, hair-type compatibility, comfort, fastening, construction, or performance from a general styling image.",
    boundary,
    ...dates,
    sections: [
      { id: "visible-placement", heading: "Choose one visible placement", paragraphs: ["Select the point the accessory should emphasize, such as beside a twist or above a low arrangement. Keep that placement visually clear so the pearl detail reads as intentional rather than competing with several focal points."] },
      { id: "balance-scale", heading: "Balance scale with the hairstyle", paragraphs: ["Compare the accessory's visible scale with the volume and shape of the hairstyle. Use this only as a composition check; the image cannot establish hold, comfort, fastening, or hair-type compatibility."] },
      { id: "restrain-accessories", heading: "Keep nearby accessories restrained", paragraphs: ["When pearl earrings or a necklace are also visible, let one area remain dominant and keep the others quieter. This is a styling choice, not a rule about which products can be worn together."] },
      { id: "orientation-details", heading: "Check orientation and item-specific details", paragraphs: ["Review the exact gallery to understand the accessory's shape and intended orientation. Confirm fastening, dimensions, construction, compatibility, and care only when those details appear in the approved item record."] },
    ],
    faq: [
      { question: "Where should I place a pearl hair accessory?", answer: "Choose the point you want to emphasize, such as beside a twist or above a low arrangement, then compare the accessory's visible shape in its exact gallery." },
      { question: "Can I wear pearl hair accessories with pearl earrings?", answer: "Yes as a styling idea, but keep one placement visually dominant so the two details do not compete." },
      { question: "Will a hair accessory work for my hair type?", answer: "This guide cannot establish compatibility or hold. Use only item-specific fastening and construction information that the approved product record provides." },
      { question: "Can a styling photo prove how securely an accessory holds?", answer: "No. A photograph shows appearance at one moment; it does not prove hold strength, comfort, compatibility, or performance." },
    ],
    sources: consumerSources,
    relatedLinks: [pearlGuide, howToWear, buyingChecklist, { label: "View New Arrivals", href: "/collections/new-arrivals" }],
  },
  "how-to-choose-a-glasses-chain": {
    slug: "how-to-choose-a-glasses-chain",
    seoTitle: "How to Choose a Glasses Chain | Maverenne",
    description: "Compare a glasses chain's visible connector, length, and styling context while reserving compatibility and strength claims for verified item details.",
    h1: "How to Choose a Glasses Chain",
    eyebrow: "Pearl Buying Guide",
    directAnswer: "Choose a glasses chain by checking its visible connector style, comparing any verified length with where you want the chain to fall, and deciding how prominent it should look. Confirm compatibility from the exact item record. Do not infer security, strength, material, comfort, or fit from a photograph.",
    boundary,
    ...dates,
    sections: [
      { id: "connector-style", heading: "Inspect the visible connector style", paragraphs: ["Look closely at how the connector is shown attaching to the glasses frame and compare that form with your intended use. Only the approved item description can confirm compatibility with a particular frame."] },
      { id: "intended-drop", heading: "Compare a verified length with the intended drop", paragraphs: ["Decide where you want the chain to fall when the glasses are worn or lowered, then compare that position with a verified item length. Do not estimate the measurement from a model photograph."] },
      { id: "chain-prominence", heading: "Choose how prominent the chain should look", paragraphs: ["Compare the chain's visible line, pearl spacing, and decorative scale with the amount of emphasis you want. The gallery can support a styling choice but cannot prove material, strength, or durability."] },
      { id: "compatibility-construction", heading: "Confirm compatibility and construction", paragraphs: ["Use the exact approved record to verify connector description, length, materials, construction, and permitted uses when supplied. If necklace use or frame compatibility is not stated, do not infer it."] },
    ],
    faq: [
      { question: "What should I check on a glasses-chain connector?", answer: "Inspect the exact product gallery and any verified connector description. A general guide cannot confirm compatibility with a particular frame." },
      { question: "How long should a glasses chain be?", answer: "Choose where you want the chain to fall, then compare that position with a length stated for the exact item. This guide does not prescribe one length." },
      { question: "Can a glasses chain be worn as a necklace?", answer: "Only rely on that use if the exact approved product record states it. A styling image or category name is not sufficient evidence." },
      { question: "Does a product photo prove that the chain is secure?", answer: "No. A photograph cannot establish security, connector strength, compatibility, material, comfort, or durability." },
    ],
    sources: consumerSources,
    relatedLinks: [pearlGuide, howToWear, buyingChecklist, { label: "View New Arrivals", href: "/collections/new-arrivals" }],
  },
  "pearl-jewelry-buying-checklist": {
    slug: "pearl-jewelry-buying-checklist",
    seoTitle: "Pearl Jewelry Buying Checklist | Maverenne",
    description: "Use a concise checklist to compare pearl terminology, item-specific dimensions and images, current policies, and missing product facts before buying.",
    h1: "Pearl Jewelry Buying Checklist",
    eyebrow: "Pearl Buying Guide",
    directAnswer: "Before buying pearl jewelry, check how the item describes its pearl type and materials, compare verified dimensions with the exact gallery, review fastening and care details when supplied, and read current shipping and return pages. If an important fact is missing, ask rather than infer it from an image or guide.",
    boundary,
    ...dates,
    sections: [
      { id: "pearl-material-description", heading: "Read the pearl and material description precisely", paragraphs: ["Read the exact item wording and distinguish what it states from what an image merely suggests. Pearl type, materials, treatment, origin, and construction are item-specific facts and should not be supplied by an editorial guide."] },
      { id: "dimensions-gallery", heading: "Compare dimensions with the exact gallery", paragraphs: ["Use verified dimensions to understand scale, then compare them with the exact gallery for visible shape and proportion. Neither source should be silently replaced by a category label, price, or unrelated styling image."] },
      { id: "fastening-care", heading: "Check fastening and care details when supplied", paragraphs: ["Look for approved information about fastening, adjustability, handling, and care when it is provided for the item. If a detail affects your decision and is missing, ask instead of creating an assumption."] },
      { id: "current-policies", heading: "Read current policy pages", paragraphs: ["Open the store's current shipping and refund pages before deciding. The guide links to those live policy routes rather than copying terms that may change or implying a delivery or return promise."] },
      { id: "missing-facts", heading: "Ask when a decision-critical fact is missing", paragraphs: ["Make a short list of unanswered facts that could change your decision and send those questions through the contact route. A missing fact remains unknown until an authorized item record or response supplies it."] },
    ],
    faq: [
      { question: "What pearl terminology should I look for?", answer: "Look for a clear item-specific description. The FTC distinguishes natural, cultured, and imitation pearls and advises sellers to describe them accurately." },
      { question: "Can an editorial image verify a product's materials?", answer: "No. Use the exact approved product record for pearl type, materials, treatment, origin, dimensions, fastening, and care facts." },
      { question: "Which store policies should I read before buying?", answer: "Read the current shipping and refund pages linked by the store rather than relying on a general article to restate volatile terms." },
      { question: "What should I do when an important product fact is missing?", answer: "Do not infer it from a photograph, slug, category, price, or general guide. Ask for verified item-specific information before deciding." },
    ],
    sources: [...consumerSources, PURCHASE_GUIDE_SOURCES.ftcJewelryAdvertising],
    relatedLinks: [
      pearlGuide,
      { label: "What Are Freshwater Cultured Pearls?", href: "/pearls/freshwater-pearls" },
      { label: "Shipping Information", href: "/shipping" },
      { label: "Refund Policy", href: "/refund" },
      { label: "Contact Maverenne", href: "/contact" },
    ],
  },
} as const satisfies Record<PurchaseGuideSlug, PurchaseGuide>;

export function getPurchaseGuide(slug: PurchaseGuideSlug): PurchaseGuide {
  return PURCHASE_GUIDES[slug];
}
