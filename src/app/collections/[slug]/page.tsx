import { db } from "@/lib/db";
import Link from "next/link";
import type { Metadata } from "next";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CollectionFilters } from "@/components/product/CollectionFilters";
import { CollectionToolbar } from "./CollectionToolbar";
import { BreadcrumbJsonLd } from "@/components/ui/JsonLd";
import { Suspense } from "react";
import { safeJsonParse } from "@/lib/utils";
import { Collection1688 } from "./1688-collection";
import { CATEGORIES } from "@/lib/1688-products";

// Quick stone filter chips for Curated Stones collection
const CURATED_STONES = ["Amethyst", "Rose Quartz", "Black Obsidian", "Moonstone", "Tiger's Eye"];

function StoneQuickFilters({ slug, currentStone }: { slug: string; currentStone: string[] }) {
  return (
    <div className="flex flex-wrap gap-2 pb-2">
      {CURATED_STONES.map((stone) => {
        const isActive = currentStone.includes(stone);
        const nextStones = isActive
          ? currentStone.filter((s) => s !== stone)
          : [...currentStone, stone];
        const params = new URLSearchParams();
        if (nextStones.length) params.set("stone", nextStones.join(","));
        const href = `/collections/${slug}${params.toString() ? "?" + params.toString() : ""}`;
        return (
          <Link
            key={stone}
            href={href}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              isActive
                ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/40 hover:text-[var(--text)]"
            }`}
          >
            {stone}
          </Link>
        );
      })}
    </div>
  );
}


const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://mythrealms-shop.vercel.app";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  // Check 1688 static categories first
  const cat1688 = CATEGORIES.find(c => c.slug === slug);
  if (cat1688) {
    const desc = cat1688.description?.slice(0, 155) || `Shop handcrafted ${cat1688.name} — gemstone crystal bracelets for the modern mystic.`;
    return {
      title: `${cat1688.name} — Crystal Bracelets | MythRealms`,
      description: desc,
      alternates: { canonical: `${SITE_URL}/collections/${slug}` },
      openGraph: {
        title: `${cat1688.name} — MythRealms`,
        description: desc,
        url: `${SITE_URL}/collections/${slug}`,
        type: "website",
      },
    };
  }

  const category = await db.category.findUnique({ where: { slug } });
  if (!category) return { title: "Collection Not Found — MythRealms" };
  const desc = category.description?.slice(0, 155) || `Shop handcrafted ${category.name} — gemstone crystal bracelets for the modern mystic.`;
  return {
    title: `${category.name} — ${slug === "curated-stones" ? "Natural Stone Bracelets" : "Crystal Bracelets"} | MythRealms`,
    description: desc,
    alternates: { canonical: `${SITE_URL}/collections/${slug}` },
    openGraph: {
      title: `${category.name} — MythRealms`,
      description: desc,
      url: `${SITE_URL}/collections/${slug}`,
      type: "website",
    },
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string; stone?: string; intention?: string; material?: string; priceMin?: string; priceMax?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  // 1688 static data categories
  if (CATEGORIES.some(c => c.slug === slug)) {
    return <Collection1688 slug={slug} />;
  }
  const page = parseInt(sp.page || "1");
  const sort = sp.sort || "featured";
  const limit = 24;

  const stones = sp.stone?.split(",").filter(Boolean) || [];
  const intentions = sp.intention?.split(",").filter(Boolean) || [];
  const materials = sp.material?.split(",").filter(Boolean) || [];
  const priceMin = sp.priceMin ? parseFloat(sp.priceMin) : undefined;
  const priceMax = sp.priceMax ? parseFloat(sp.priceMax) : undefined;

  const category = await db.category.findUnique({
    where: { slug },
    include: { children: { select: { id: true, name: true, slug: true } } },
  });
  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold mb-4">Category Not Found</h1>
        <p className="text-[var(--text-muted)]">The category you are looking for does not exist.</p>
      </div>
    );
  }

  // If this is a parent category, include child category products
  const childIds = category.children.map((c) => c.id);
  const categoryIds = childIds.length > 0 ? [category.id, ...childIds] : [category.id];

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

  const where: any = { categoryId: { in: categoryIds }, isActive: true };
  if (stones.length > 0) where.stone = { in: stones };
  if (intentions.length > 0) where.intention = { in: intentions };
  if (materials.length > 0) where.material = { in: materials };
  // Apply price filter at DB level so pagination stays correct
  if (priceMin !== undefined) where.minPrice = { ...(where.minPrice || {}), gte: priceMin };
  if (priceMax !== undefined) where.minPrice = { ...(where.minPrice || {}), lte: priceMax };

  const [products, total, stoneCounts, intentionCounts, materialCounts] = await Promise.all([
    db.product.findMany({
      where,
      include: { variants: true, reviews: { select: { rating: true } } },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.product.count({ where }),
    db.product.groupBy({ by: ["stone"], where: { categoryId: { in: categoryIds }, isActive: true }, _count: true, orderBy: { _count: { stone: "desc" } } }),
    db.product.groupBy({ by: ["intention"], where: { categoryId: { in: categoryIds }, isActive: true }, _count: true }),
    db.product.groupBy({ by: ["material"], where: { categoryId: { in: categoryIds }, isActive: true }, _count: true }),
  ]);

  const filterCounts = {
    stones: Object.fromEntries(stoneCounts.filter(s => s.stone).map(s => [s.stone!, s._count])),
    intentions: Object.fromEntries(intentionCounts.filter(i => i.intention).map(i => [i.intention!, i._count])),
    materials: Object.fromEntries(materialCounts.filter(m => m.material).map(m => [m.material!, m._count])),
  };

  let productsParsed = products.map((p) => ({
    ...p,
    images: safeJsonParse<string[]>(p.images as string, []),
    avgRating: p.reviews.length ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0,
    reviewCount: p.reviews.length,
  }));

  const finalProducts = productsParsed;

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-6">
      <BreadcrumbJsonLd items={[
        { name: "Home", url: `${SITE_URL}/` },
        { name: category.name, url: `${SITE_URL}/collections/${slug}` },
      ]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "CollectionPage",
        name: category.name,
        description: category.description || undefined,
        url: `${SITE_URL}/collections/${slug}`,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: total,
          itemListElement: finalProducts.slice(0, 24).map((p: any, i: number) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_URL}/products/${p.slug}`,
            name: p.name,
          })),
        },
      }) }} />
      <nav className="flex items-center gap-2 py-4 text-sm text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--text)]">Home</Link><span>/</span>
        <span className="text-[var(--text)]">{category.name}</span>
      </nav>

      <div className="pb-4">
        <h1 className="font-serif text-4xl font-bold mb-3 text-[var(--text)]">{category.name}</h1>
        {category.description && <p className="text-sm text-[var(--text-secondary)] max-w-3xl">{category.description}</p>}
      </div>

      {/* Subcategory links — shown for parent categories with children */}
      {childIds.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-6 border-b border-[var(--border)] mb-6">
          <Link
            href={`/collections/${slug}`}
            className="px-4 py-2 rounded-full text-sm font-medium bg-[var(--accent)] text-white border border-[var(--accent)]"
          >
            All
          </Link>
          {category.children.map((child) => (
            <Link
              key={child.id}
              href={`/collections/${child.slug}`}
              className="px-4 py-2 rounded-full text-sm text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)]/40 hover:text-[var(--text)] transition-colors"
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}

      {/* Quick stone filter chips — Curated Stones only */}
      {slug === "curated-stones" && (
        <div className="pb-2">
          <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-semibold mb-3">Filter by Stone</p>
          <StoneQuickFilters slug={slug} currentStone={stones} />
        </div>
      )}

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
                {slug === "curated-stones"
                  ? "Explore our hand-selected collection of natural stone bracelets, each piece chosen for its unique character and energy. From the deep purple of amethyst to the warm glow of tiger's eye, find the crystal that speaks to you."
                  : `Explore our handcrafted collection of ${category.name.toLowerCase()}, each piece hand-strung with intention. Discover authentic craftsmanship, premium natural stones, and timeless designs made to be worn daily.`}
              </p>
            </div>
          </div>
        </section>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-1 py-12">
          {Array.from({ length: Math.min(totalPages, 20) }, (_, i) => {
            const pageNum = i + 1;
            // Preserve all active filter/search params in pagination links
            const pageParams = new URLSearchParams();
            pageParams.set("page", String(pageNum));
            pageParams.set("sort", sort);
            if (stones.length) pageParams.set("stone", stones.join(","));
            if (intentions.length) pageParams.set("intention", intentions.join(","));
            if (materials.length) pageParams.set("material", materials.join(","));
            if (priceMin !== undefined) pageParams.set("priceMin", String(priceMin));
            if (priceMax !== undefined) pageParams.set("priceMax", String(priceMax));
            const qs = pageParams.toString();
            return (
              <Link key={pageNum} href={`/collections/${slug}?${qs}`}
                className={`min-w-[40px] h-10 flex items-center justify-center rounded-full text-sm font-medium ${pageNum === page ? "bg-[var(--text)] text-white" : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text)]"}`}>
                {pageNum}
              </Link>
            );
          })}
          {totalPages > 20 && (
            <span className="min-w-[40px] h-10 flex items-center justify-center text-sm text-[var(--text-muted)]">...</span>
          )}
        </div>
      )}
    </div>
  );
}
