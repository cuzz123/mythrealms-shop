import type { StorefrontProduct } from "@/lib/storefront/catalog";

export type PearlEdit = Readonly<{
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  productSlugs: readonly string[];
  route: `/edits/${string}`;
}>;

export const PEARL_EDITS: readonly PearlEdit[] = [
  {
    slug: "everyday-light",
    title: "Everyday Light",
    description: "Pearl pieces chosen for the small rituals and easy layers of an ordinary day.",
    heroImage: "/images/products/1688-shop/pearl-series/pearl-series-05-editorial-v1-01-hero.png",
    productSlugs: [
      "pearl-series-05",
      "pearl-series-13",
      "pearl-series-17",
      "new-series-white-shell-flower-drops",
    ],
    route: "/edits/everyday-light",
  },
  {
    slug: "dinner-by-the-water",
    title: "Dinner by the Water",
    description: "A polished pearl edit for late tables, low light, and an unhurried evening out.",
    heroImage: "/images/products/new-series/new-series-baroque-pearl-hoops/editorial-v1-01-hero.png",
    productSlugs: [
      "pearl-series-07",
      "new-series-baroque-pearl-hoops",
      "new-series-pearl-y-lariat",
      "new-series-black-drop-pearl-choker",
    ],
    route: "/edits/dinner-by-the-water",
  },
  {
    slug: "a-gift-to-keep",
    title: "A Gift to Keep",
    description: "Thoughtful pearl pieces with a personal feel, selected for giving and wearing often.",
    heroImage: "/images/products/new-series/new-series-gold-shell-teardrops/editorial-v1-01-hero.png",
    productSlugs: [
      "pearl-series-01",
      "pearl-series-02",
      "pearl-series-03",
      "new-series-gold-shell-teardrops",
    ],
    route: "/edits/a-gift-to-keep",
  },
  {
    slug: "soft-gold-and-pearl",
    title: "Soft Gold and Pearl",
    description: "Warm gold tones and luminous pearl details for a subtle, considered finish.",
    heroImage: "/images/products/new-series/new-series-round-shell-gold-cuff/editorial-v1-01-hero.png",
    productSlugs: [
      "new-series-gold-shell-teardrops",
      "new-series-round-shell-gold-cuff",
      "new-series-shell-twist-pearl-cuff",
      "new-series-pearl-drop-choker",
    ],
    route: "/edits/soft-gold-and-pearl",
  },
] as const;

export function getPearlEditBySlug(slug: string): PearlEdit | undefined {
  return PEARL_EDITS.find((edit) => edit.slug === slug);
}

export function getPearlEditProducts(
  edit: PearlEdit,
  products: readonly StorefrontProduct[],
): StorefrontProduct[] {
  const productsBySlug = new Map(products.map((product) => [product.slug, product]));

  return edit.productSlugs.map((slug) => {
    const product = productsBySlug.get(slug);
    if (!product) {
      throw new Error(`Pearl edit product ${slug} is not part of the storefront catalog`);
    }
    return product;
  });
}

export function getComplementaryProducts(
  productSlug: string,
  products: readonly StorefrontProduct[],
): StorefrontProduct[] {
  const edit = PEARL_EDITS.find((candidate) => candidate.productSlugs.includes(productSlug));
  if (!edit) return [];

  getPearlEditProducts(edit, products);
  const editProductSlugs = new Set(edit.productSlugs);

  return products
    .filter((product) => product.slug !== productSlug && editProductSlugs.has(product.slug))
    .slice(0, 4);
}
