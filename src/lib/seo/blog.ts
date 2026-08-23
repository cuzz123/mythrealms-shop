import type { Metadata } from "next";

import { absoluteImageUrl } from "@/lib/images";
import { BRAND } from "@/lib/brand-identity";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

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

export type PearlStoryPost = BlogEditorialPost;

const RETIRED_EDITORIAL_LANGUAGE =
  /\bcrystals?\b|\bgemstones?\b|\bobsidian\b|\bamethyst\b|rose quartz|tiger'?s eye|aventurine|chakra|energy healing|the serenity collection|balance\s*&\s*light|the intention stones|the archetypes|curated singles|emotional balance/i;

const RETIRED_BRAND_LANGUAGE = /myth\s*realms/i;

const PEARL_STORY_TOPIC =
  /\b(style|styling|care|gift|gifting|wear|wearing|choose|choosing|layer|layering|occasion|freshwater)\b/i;

export function isPearlEditorialPost(post: BlogEditorialPost): boolean {
  const searchableText = [
    post.slug,
    post.title,
    post.excerpt,
    post.content,
    post.category,
  ].join(" ");

  return /\bpearls?\b/i.test(searchableText) &&
    !RETIRED_EDITORIAL_LANGUAGE.test(searchableText) &&
    !RETIRED_BRAND_LANGUAGE.test(searchableText);
}

export function getPublicBlogAuthorName(authorName: string | null | undefined): string {
  const normalizedAuthorName = authorName?.trim();
  return normalizedAuthorName && !RETIRED_BRAND_LANGUAGE.test(normalizedAuthorName)
    ? normalizedAuthorName
    : SITE_NAME;
}

export function isPearlStoryPost(post: PearlStoryPost): boolean {
  return isPearlEditorialPost(post) && PEARL_STORY_TOPIC.test([
    post.slug,
    post.title,
    post.excerpt,
    post.content,
    post.category,
  ].join(" "));
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
    title: `${title} | ${BRAND.name}`,
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
