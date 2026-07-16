import { PRODUCTS, type Product } from "@/lib/1688-products";
import { NEW_SERIES_PRODUCTS } from "@/lib/new-series-products";

export type StorefrontProduct = Product;

export const STOREFRONT_PRODUCT_TYPES = [
  "rings",
  "bracelets",
  "earrings",
  "necklaces",
  "hair-accessories",
  "eyewear-chains",
] as const;

export type StorefrontProductType = (typeof STOREFRONT_PRODUCT_TYPES)[number];

const PRODUCT_TYPES_BY_SLUG = {
  "pearl-series-01": "rings",
  "pearl-series-02": "rings",
  "pearl-series-03": "rings",
  "pearl-series-04": "bracelets",
  "pearl-series-05": "bracelets",
  "pearl-series-06": "bracelets",
  "pearl-series-07": "bracelets",
  "pearl-series-08": "bracelets",
  "pearl-series-09": "bracelets",
  "pearl-series-10": "bracelets",
  "pearl-series-11": "bracelets",
  "pearl-series-12": "bracelets",
  "pearl-series-13": "earrings",
  "pearl-series-14": "earrings",
  "pearl-series-15": "earrings",
  "pearl-series-16": "earrings",
  "pearl-series-17": "necklaces",
  "pearl-series-18": "necklaces",
  "pearl-series-19": "necklaces",
  "pearl-series-20": "necklaces",
  "new-series-white-shell-flower-drops": "earrings",
  "new-series-gold-shell-teardrops": "earrings",
  "new-series-baroque-pearl-hoops": "earrings",
  "new-series-purple-gem-pearl-drops": "earrings",
  "new-series-white-petal-flower-earrings": "earrings",
  "new-series-mother-of-pearl-cluster-earrings": "earrings",
  "new-series-white-shell-triple-drops": "earrings",
  "new-series-round-shell-disc-drops": "earrings",
  "new-series-pearl-jade-bracelet": "bracelets",
  "new-series-purple-gem-bangle": "bracelets",
  "new-series-shell-twist-pearl-cuff": "bracelets",
  "new-series-leaf-turquoise-pearl-cuff": "bracelets",
  "new-series-leaf-pearl-bracelet": "bracelets",
  "new-series-round-shell-gold-cuff": "bracelets",
  "new-series-purple-stone-pendant-necklace": "necklaces",
  "new-series-pearl-y-lariat": "necklaces",
  "new-series-green-layered-pendant-necklace": "necklaces",
  "new-series-pearl-dreamcatcher-lariat": "necklaces",
  "new-series-pearl-drop-choker": "necklaces",
  "new-series-multi-strand-pearl-choker": "necklaces",
  "new-series-black-drop-pearl-choker": "necklaces",
  "new-series-pearl-glasses-chain": "eyewear-chains",
  "new-series-shell-drop-glasses-chain": "eyewear-chains",
  "new-series-classic-pearl-chain": "eyewear-chains",
  "new-series-turquoise-bead-chain": "eyewear-chains",
} as const satisfies Record<string, StorefrontProductType>;

type StorefrontProductSlug = keyof typeof PRODUCT_TYPES_BY_SLUG;

function isStorefrontProductSlug(slug: string): slug is StorefrontProductSlug {
  return Object.prototype.hasOwnProperty.call(PRODUCT_TYPES_BY_SLUG, slug);
}

function cloneProduct(product: Product): Product {
  return { ...product, images: [...product.images] };
}

export function isCustomerVisibleProduct(
  product: Pick<Product, "category" | "inStock" | "isActive" | "slug">,
): boolean {
  return (
    product.category === "pearl-series" &&
    product.isActive &&
    product.inStock &&
    isStorefrontProductSlug(product.slug)
  );
}

const storefrontProducts = [...PRODUCTS, ...NEW_SERIES_PRODUCTS]
  .filter(isCustomerVisibleProduct)
  .map(cloneProduct);

export function getStorefrontProducts(): Product[] {
  return storefrontProducts.map(cloneProduct);
}

export function getStorefrontProductById(id: string): Product | undefined {
  const product = storefrontProducts.find((candidate) => candidate.id === id);
  return product ? cloneProduct(product) : undefined;
}

export function getStorefrontProductBySlug(slug: string): Product | undefined {
  const product = storefrontProducts.find((candidate) => candidate.slug === slug);
  return product ? cloneProduct(product) : undefined;
}

export function getProductType(
  product: Pick<Product, "slug">,
): StorefrontProductType {
  if (!isStorefrontProductSlug(product.slug)) {
    throw new Error(`Product ${product.slug} is not part of the storefront catalog`);
  }

  return PRODUCT_TYPES_BY_SLUG[product.slug];
}
