type StoryContent = Readonly<{
  seo: Readonly<{
    title: string;
    description: string;
  }>;
  heading: string;
  statement: string;
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
} as const satisfies StoryContent;
