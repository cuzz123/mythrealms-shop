import { db } from "@/lib/db";
import { ProductGrid } from "@/components/product/ProductGrid";

export async function FeaturedProductsSection() {
  const featuredProducts = await db.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: { variants: true, reviews: { select: { rating: true } } },
    take: 8,
    orderBy: { sortOrder: "asc" },
  });

  const products = featuredProducts.map((p) => ({
    ...p,
    images: JSON.parse(p.images as string),
    avgRating: p.reviews.length
      ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
      : 0,
    reviewCount: p.reviews.length,
  }));

  return (
    <ProductGrid products={products} />
  );
}

function FeaturedSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-2 animate-pulse">
          <div className="aspect-[3/4] bg-[var(--border)] rounded-[var(--radius-lg)]" />
          <div className="h-4 w-3/4 bg-[var(--border)] rounded" />
          <div className="h-4 w-1/3 bg-[var(--border)] rounded" />
        </div>
      ))}
    </div>
  );
}

export function FeaturedProductsFallback() {
  return <FeaturedSkeleton />;
}
