import type { Metadata } from "next";

import { absoluteImageUrl } from "@/lib/images";
import { absoluteUrl } from "@/lib/site";

interface BlogMetadataPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string | null;
}

interface BlogEditorialPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
}

const RETIRED_EDITORIAL_LANGUAGE =
  /\bcrystals?\b|\bgemstones?\b|\bobsidian\b|\bamethyst\b|rose quartz|tiger'?s eye|aventurine|chakra|energy healing|the serenity collection|balance\s*&\s*light|the intention stones|the archetypes|curated singles|emotional balance/i;

export function isPearlEditorialPost(post: BlogEditorialPost): boolean {
  const searchableText = [
    post.slug,
    post.title,
    post.excerpt,
    post.content,
    post.category,
  ].join(" ");

  return /\bpearls?\b/i.test(searchableText) &&
    !RETIRED_EDITORIAL_LANGUAGE.test(searchableText);
}

export function buildBlogMetadata({
  slug,
  title,
  excerpt,
  image,
}: BlogMetadataPost): Metadata {
  const url = absoluteUrl(`/blog/${slug}`);
  const images = image ? [{ url: absoluteImageUrl(image) }] : [];

  return {
    title: `${title} | MythRealms`,
    description: excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description: excerpt,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: excerpt,
      images: images.map((image) => image.url),
    },
  };
}
