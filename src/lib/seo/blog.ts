import type { Metadata } from "next";

import { absoluteImageUrl } from "@/lib/images";
import { absoluteUrl } from "@/lib/site";

interface BlogMetadataPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string | null;
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
