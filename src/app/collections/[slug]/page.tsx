import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { BreadcrumbJsonLd, JsonLd } from "@/components/ui/JsonLd";
import { Collection1688 } from "./1688-collection";
import { categoryMessaging, productDisplayName } from "@/lib/brand";
import {
  getStorefrontProducts,
  STOREFRONT_PRODUCT_TYPES,
  type StorefrontProductType,
} from "@/lib/storefront/catalog";
import { siteUrl } from "@/lib/site";
import { buildCollectionSchema } from "@/lib/seo/schema";

const RETIRED_COLLECTION_SLUGS = new Set([
  "luxe-collection",
  "pearl-crystal-series",
  "curated-singles",
]);

function parseProductType(value: string | string[] | undefined) {
  const normalized = Array.isArray(value) ? value[0] : value;
  return STOREFRONT_PRODUCT_TYPES.includes(normalized as StorefrontProductType)
    ? (normalized as StorefrontProductType)
    : undefined;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { slug } = await params;
  const query = await searchParams;
  if (slug !== "pearl-series" && !RETIRED_COLLECTION_SLUGS.has(slug)) {
    return { title: "Collection Not Found | MythRealms", robots: { index: false } };
  }

  const messaging = categoryMessaging["pearl-series"];
  const description = messaging.description.slice(0, 155);
  const hasQuery = Object.values(query).some(Boolean);
  return {
    title: `${messaging.name} | MythRealms`,
    description,
    robots: hasQuery ? { index: false, follow: true } : undefined,
    alternates: { canonical: `${siteUrl}/collections/pearl-series` },
    openGraph: {
      title: `${messaging.name} | MythRealms`,
      description,
      url: `${siteUrl}/collections/pearl-series`,
      type: "website",
    },
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  if (RETIRED_COLLECTION_SLUGS.has(slug)) {
    permanentRedirect("/collections/pearl-series");
  }
  if (slug !== "pearl-series") notFound();

  const query = await searchParams;
  const initialType = parseProductType(query.type);
  const messaging = categoryMessaging["pearl-series"];
  const products = getStorefrontProducts();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteUrl}/` },
          { name: messaging.name, url: `${siteUrl}/collections/pearl-series` },
        ]}
      />
      <JsonLd
        data={buildCollectionSchema({
          name: messaging.name,
          description: messaging.description,
          url: `${siteUrl}/collections/pearl-series`,
          products: products.map((product) => ({
            url: `${siteUrl}/products/${product.slug}`,
            name: productDisplayName(product),
          })),
        })}
      />
      <Collection1688 slug={slug} initialType={initialType} />
    </>
  );
}
