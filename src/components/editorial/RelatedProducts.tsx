import { ProductCard } from "@/components/product/ProductCard";
import { productDisplayName } from "@/lib/brand";
import type { StorefrontProduct } from "@/lib/storefront/catalog";

export type RelatedProductsProps = Readonly<{
  products: readonly StorefrontProduct[];
  title?: string;
  description?: string;
}>;

export function RelatedProducts({
  products,
  title = "Related products",
  description,
}: RelatedProductsProps) {
  const availableProducts = products.filter(
    (product) => product.isActive && product.inStock,
  );

  if (availableProducts.length === 0) {
    return null;
  }

  return (
    <section className="bg-[var(--surface-alt)] py-14 sm:py-16" aria-labelledby="related-products-title">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase text-[var(--accent)]">The Pearl Edit</p>
          <h2
            id="related-products-title"
            className="mt-3 font-serif text-3xl font-medium text-[var(--text)]"
          >
            {title}
          </h2>
          {description && (
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
              {description}
            </p>
          )}
        </div>
        <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
          {availableProducts.map((product) => (
            <ProductCard
              key={product.slug}
              product={{
                id: product.id,
                name: productDisplayName(product),
                slug: product.slug,
                images: [...product.images],
                imageRoles: product.imageRoles,
                variants: [{ price: product.price }],
                comparePrice: product.compareAt ?? null,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
