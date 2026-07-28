import { productDisplayName } from "@/lib/brand";
import { getProductType, getStorefrontProducts } from "@/lib/storefront/catalog";

export interface StorefrontSearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
}

export function searchStorefrontProducts(query: string): StorefrontSearchResult[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length < 2) return [];

  return getStorefrontProducts()
    .filter((product) =>
      [
        productDisplayName(product),
        product.description,
        product.intention || "",
        `pearl ${getProductType(product)}`,
      ].some((value) => value.toLowerCase().includes(normalizedQuery)),
    )
    .slice(0, 8)
    .map((product) => ({
      id: product.id,
      name: productDisplayName(product),
      slug: product.slug,
      price: product.price,
      image: product.image,
      category: getProductType(product).replace("-", " "),
    }));
}
