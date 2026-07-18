import {
  getStorefrontProducts,
  type StorefrontProduct,
} from "@/lib/storefront/catalog";

export const EVERYDAY_SLUGS = [
  "pearl-series-05",
  "pearl-series-13",
  "pearl-series-17",
  "new-series-white-shell-flower-drops",
  "new-series-pearl-drop-choker",
  "new-series-pearl-glasses-chain",
] as const;

export const STATEMENT_SLUGS = [
  "pearl-series-12",
  "pearl-series-14",
  "pearl-series-20",
  "new-series-mother-of-pearl-cluster-earrings",
  "new-series-pearl-y-lariat",
  "new-series-multi-strand-pearl-choker",
] as const;

export type GiftSection = Readonly<{
  id: "under-50" | "under-70" | "everyday" | "statement";
  title: string;
  description: string;
  products: readonly StorefrontProduct[];
}>;

export function selectNewArrivalProducts<
  T extends Pick<StorefrontProduct, "isNew" | "isActive" | "inStock">
>(products: readonly T[]): T[] {
  return products.filter((product) => product.isNew && product.isActive && product.inStock);
}

export function getNewArrivalProducts(): StorefrontProduct[] {
  return selectNewArrivalProducts(getStorefrontProducts());
}

function visibleStorefrontProducts(): StorefrontProduct[] {
  return getStorefrontProducts().filter((product) => product.isActive && product.inStock);
}

function sortByPrice(products: readonly StorefrontProduct[]): StorefrontProduct[] {
  return [...products].sort((left, right) => left.price - right.price || left.slug.localeCompare(right.slug));
}

function selectEditorialProducts(
  products: readonly StorefrontProduct[],
  slugs: readonly string[],
): StorefrontProduct[] {
  const productsBySlug = new Map(products.map((product) => [product.slug, product]));
  return slugs.flatMap((slug) => {
    const product = productsBySlug.get(slug);
    return product ? [product] : [];
  });
}

export function getGiftSections(): GiftSection[] {
  const products = visibleStorefrontProducts();
  const under50 = sortByPrice(products.filter((product) => product.price < 50)).slice(0, 8);
  const under50Slugs = new Set(under50.map((product) => product.slug));
  const under70 = sortByPrice(
    products.filter((product) => product.price < 70 && !under50Slugs.has(product.slug)),
  ).slice(0, 8);

  return [
    {
      id: "under-50",
      title: "Under $50",
      description: "Pearl pieces priced below $50.",
      products: under50,
    },
    {
      id: "under-70",
      title: "Under $70",
      description: "Additional pearl pieces priced below $70.",
      products: under70,
    },
    {
      id: "everyday",
      title: "Everyday",
      description: "A concise selection for regular wear.",
      products: selectEditorialProducts(products, EVERYDAY_SLUGS),
    },
    {
      id: "statement",
      title: "Statement",
      description: "A concise selection with more visual presence.",
      products: selectEditorialProducts(products, STATEMENT_SLUGS),
    },
  ];
}

export function getUniqueGiftProducts(
  sections: readonly Pick<GiftSection, "products">[],
): StorefrontProduct[] {
  const seenSlugs = new Set<string>();

  return sections.flatMap(({ products }) =>
    products.filter(({ slug }) => {
      if (seenSlugs.has(slug)) return false;
      seenSlugs.add(slug);
      return true;
    }),
  );
}
