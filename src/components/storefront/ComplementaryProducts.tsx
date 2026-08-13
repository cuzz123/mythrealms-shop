"use client";

import { useEffect, useMemo } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { productDisplayName } from "@/lib/brand";
import { CONSENT_CHANGED_EVENT } from "@/lib/analytics/consent";
import { trackSelectItem, trackViewItemList } from "@/lib/tracking";
import { getComplementaryProducts } from "@/lib/storefront/pearl-edits";
import { getStorefrontProducts, type StorefrontProduct } from "@/lib/storefront/catalog";

const defaultStorefrontProducts = getStorefrontProducts();

export function getComplementaryProductsForSources(
  sourceSlugs: readonly string[],
  products: readonly StorefrontProduct[],
): StorefrontProduct[] {
  const sourceSet = new Set(sourceSlugs);
  const candidates: StorefrontProduct[] = [];
  const seen = new Set<string>();

  for (const sourceSlug of sourceSlugs) {
    for (const product of getComplementaryProducts(sourceSlug, products)) {
      if (sourceSet.has(product.slug) || seen.has(product.slug)) continue;
      seen.add(product.slug);
      candidates.push(product);
      if (candidates.length === 4) return candidates;
    }
  }

  return candidates;
}

type ComplementaryProductsProps = {
  sourceSlug?: string;
  sourceSlugs?: readonly string[];
  products?: readonly StorefrontProduct[];
  title?: string;
};

export function ComplementaryProducts({
  sourceSlug,
  sourceSlugs,
  products,
  title = "Complete the edit",
}: ComplementaryProductsProps) {
  const resolvedProducts = products ?? defaultStorefrontProducts;
  const sourceKey = [...new Set([...(sourceSlugs ?? []), ...(sourceSlug ? [sourceSlug] : [])])].join(",");
  const sources = useMemo(
    () => (sourceKey ? sourceKey.split(",") : []),
    [sourceKey],
  );
  const candidates = useMemo(
    () => getComplementaryProductsForSources(sources, resolvedProducts),
    [resolvedProducts, sourceKey],
  );
  const listId = `complements:${sources.join(",")}`;

  useEffect(() => {
    if (candidates.length < 2) return;
    const trackList = () => trackViewItemList({
      id: listId,
      name: title,
      items: candidates.map((product) => ({
        id: product.id,
        name: productDisplayName(product),
        price: product.price,
        quantity: 1,
        category: product.categoryName,
        variant: product.slug,
      })),
    });

    trackList();
    window.addEventListener(CONSENT_CHANGED_EVENT, trackList);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, trackList);
  }, [candidates, listId, title]);

  if (candidates.length < 2) return null;

  return (
    <section className="border-t border-[var(--border)] pt-10" aria-labelledby={`${listId}-title`}>
      <h2 id={`${listId}-title`} className="font-serif text-2xl font-medium text-[var(--text)]">{title}</h2>
      <div
        className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-5"
        onClick={(event) => {
          const link = (event.target as Element).closest("a[href^='/products/']");
          const slug = link?.getAttribute("href")?.split("/").pop();
          const product = candidates.find((candidate) => candidate.slug === slug);
          if (!product) return;
          trackSelectItem(
            { id: listId, name: title },
            {
              id: product.id,
              name: productDisplayName(product),
              price: product.price,
              quantity: 1,
              category: product.categoryName,
              variant: product.slug,
            },
          );
        }}
      >
        {candidates.map((product) => (
          <ProductCard
            key={product.slug}
            product={{
              id: product.id,
              name: productDisplayName(product),
              slug: product.slug,
              images: [product.imageRoles?.primary || product.image],
              imageRoles: product.imageRoles,
              variants: [{ price: product.price }],
              comparePrice: product.compareAt ?? null,
            }}
          />
        ))}
      </div>
    </section>
  );
}
