type StoryContent = Readonly<{
  seo: Readonly<{
    title: string;
    description: string;
  }>;
  heading: string;
  statement: string;
  businessModel: string;
  fulfillment: string;
}>;

export const STORY_CONTENT = {
  seo: {
    title: "About Maverenne | Jewelry & Accessories",
    description:
      "Thoughtful jewelry and accessories for everyday moments that feel like your own.",
  },
  heading: "About Maverenne",
  statement:
    "Thoughtful jewelry and accessories for everyday moments that feel like your own.",
  businessModel:
    "Maverenne is an independent online jewelry retailer serving customers through maverenne.com.",
  fulfillment:
    "We use supplier-direct fulfillment, so an order may be packed and shipped directly by a supply partner. Maverenne remains your point of contact for product, order, shipping, and return questions.",
} as const satisfies StoryContent;
