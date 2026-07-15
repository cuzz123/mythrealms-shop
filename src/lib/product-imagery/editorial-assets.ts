import { EDITORIAL_CATALOG } from "@/lib/product-imagery/editorial-catalog";

export const EDITORIAL_SLOTS = ["main", "on-model", "macro", "lifestyle"] as const;
export type EditorialSlot = (typeof EDITORIAL_SLOTS)[number];
export type EditorialGallery = readonly [string, string, string, string];

export function getApprovedEditorialGallery(slug: string): EditorialGallery | undefined {
  const gallery = EDITORIAL_CATALOG[slug];
  return gallery ? ([...gallery] as EditorialGallery) : undefined;
}
