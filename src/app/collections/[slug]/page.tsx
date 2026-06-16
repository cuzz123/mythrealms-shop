import { db } from "@/lib/db";
import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CollectionFilters } from "@/components/product/CollectionFilters";
import { CollectionToolbar } from "./CollectionToolbar";
import { Suspense } from "react";

export const dynamic = "force-dynamic"

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string; stone?: string; intention?: string; material?: string; priceMin?: string; priceMax?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = parseInt(sp.page || "1");
  const sort = sp.sort || "featured";
  const limit = 24;

  const stones = sp.stone?.split(",").filter(Boolean) || [];
  const intentions = sp.intention?.split(",").filter(Boolean) || [];
  const materials = sp.material?.split(",").filter(Boolean) || [];
  const priceMin = sp.priceMin ? parseFloat(sp.priceMin) : undefined;
  const priceMax = sp.priceMax ? parseFloat(sp.priceMax) : undefined;

  const category = await db.category.findUnique({ where: { slug } });
  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold mb-4">Category Not Found</h1>
        <p className="text-[var(--text-muted)]">The category you are looking for does not exist.</p>
      </div>
    );
  }

  // Price sorting is done in JS after fetch — SQLite cannot sort by related variant prices
  // Use DB-level price sorting via minPrice field
  let orderBy: any = { createdAt: "desc" };
  switch (sort) {
    case "price-low": orderBy = { minPrice: "asc" }; break;
    case "price-high": orderBy = { minPrice: "desc" }; break;
    case "newest": orderBy = { createdAt: "desc" }; break;
    case "a-z": orderBy = { name: "asc" }; break;
    case "z-a": orderBy = { name: "desc" }; break;
  }

  const where: any = { categoryId: category.id, isActive: true };
  if (stones.length > 0) where.stone = { in: stones };
  if (intentions.length > 0) where.intention = { in: intentions };
  if (materials.length > 0) where.material = { in: materials };

  const [products, total, stoneCounts, intentionCounts, materialCounts] = await Promise.all([
    db.product.findMany({
      where,
      include: { variants: true, reviews: { select: { rating: true } } },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.product.count({ where }),
    db.product.groupBy({ by: ["stone"], where: { categoryId: category.id, isActive: true }, _count: true, orderBy: { _count: { stone: "desc" } } }),
    db.product.groupBy({ by: ["intention"], where: { categoryId: category.id, isActive: true }, _count: true }),
    db.product.groupBy({ by: ["material"], where: { categoryId: category.id, isActive: true }, _count: true }),
  ]);

  const filterCounts = {
    stones: Object.fromEntries(stoneCounts.filter(s => s.stone).map(s => [s.stone!, s._count])),
    intentions: Object.fromEntries(intentionCounts.filter(i => i.intention).map(i => [i.intention!, i._count])),
    materials: Object.fromEntries(materialCounts.filter(m => m.material).map(m => [m.material!, m._count])),
  };

  // Apply price filter in-memory using DB minPrice field
  let filteredProducts = products;
  if (priceMin !== undefined || priceMax !== undefined) {
    filteredProducts = products.filter((p) => {
      const minP = p.minPrice ?? Math.min(...p.variants.map((v) => v.price));
      if (priceMin !== undefined && minP < priceMin) return false;
      if (priceMax !== undefined && minP > priceMax) return false;
      return true;
    });
  }

  let productsParsed = filteredProducts.map((p) => ({
    ...p,
    images: JSON.parse(p.images as string),
    avgRating: p.reviews.length ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0,
    reviewCount: p.reviews.length,
  }));

  const finalProducts = productsParsed;

  const totalPages = Math.ceil(filteredProducts.length / limit);

  return (
    <div className="max-w-7xl mx-auto px-6">
      <nav className="flex items-center gap-2 py-4 text-sm text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--text)]">Home</Link><span>/</span>
        <span className="text-[var(--text)]">{category.name}</span>
      </nav>

      <div className="pb-4">
        <h1 className="font-serif text-4xl font-bold mb-3 text-[var(--text)]">{category.name}</h1>
        {category.description && <p className="text-sm text-[var(--text-secondary)] max-w-3xl">{category.description}</p>}
      </div>

      <div className="flex items-center justify-between py-4 border-t border-[var(--border)] mb-6 gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Suspense fallback={<div className="w-24 h-10" />}>
            <CollectionFilters initialCounts={filterCounts} />
          </Suspense>
        </div>
        <CollectionToolbar total={total} sort={sort} slug={slug} />
      </div>

      <ProductGrid products={finalProducts} />

      {/* SEO Content Zone */}
      {category.description && (
        <section className="mt-16 mb-8 py-12 px-6 bg-[var(--border-light)]/50 rounded-xl">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">
              About {category.name}
            </h2>
            <div className="prose prose-invert prose-sm mx-auto text-[var(--text-secondary)] leading-relaxed max-w-prose">
              <p>{category.description}</p>
              <p className="mt-3 text-xs text-[var(--text-muted)]">
                Explore our handcrafted collection of {category.name.toLowerCase()}, each piece inspired by the ancient myths and legends of the Classic of Mountains and Seas. Discover authentic craftsmanship, premium materials, and timeless designs that honor China&apos;s rich cultural heritage.
              </p>
            </div>
          </div>
        </section>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-1 py-12">
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <Link key={pageNum} href={`/collections/${slug}?page=${pageNum}&sort=${sort}`}
                className={`min-w-[40px] h-10 flex items-center justify-center rounded-full text-sm font-medium ${pageNum === page ? "bg-[var(--text)] text-white" : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text)]"}`}>
                {pageNum}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
