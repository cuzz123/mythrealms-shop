"use client";
import { PRODUCTS, CATEGORIES } from "@/lib/1688-products";
import { ProductCard } from "@/components/product/ProductCard";

export function Collection1688({ slug }: { slug: string }) {
  const cat = CATEGORIES.find(c => c.slug === slug);
  const products = PRODUCTS.filter(p => p.category === slug);

  if (!cat || products.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="font-serif text-3xl lg:text-4xl font-bold text-[var(--text)]">{cat.name}</h1>
        <p className="mt-2 text-[var(--text-muted)] max-w-2xl">{cat.description}</p>
        <p className="mt-1 text-sm text-[var(--accent)]">{products.length} styles</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p, i) => (
          <div key={p.slug} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms`, animationFillMode: "backwards" }}>
            <ProductCard product={{
              id: p.id,
              name: p.name,
              slug: p.slug,
              images: p.images,
              variants: [{ price: p.price }],
              comparePrice: p.compareAt ?? null,
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}