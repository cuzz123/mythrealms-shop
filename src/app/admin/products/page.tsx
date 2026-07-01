import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import { DeleteButton } from "./DeleteButton";
import { safeJsonParse } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PRODUCTS, CATEGORIES } from "@/lib/1688-products";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const session = await auth();
  const isAdmin = session && (session.user as any)?.role === "ADMIN";

  // Fetch DB products
  const products = await db.product.findMany({
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
  });

  // Group 1688 products by category for the catalog table
  const catalogByCategory = CATEGORIES.map((cat) => ({
    ...cat,
    products: PRODUCTS.filter((p) => p.category === cat.slug && p.isActive),
  }));

  const totalCatalog = PRODUCTS.filter((p) => p.isActive).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold">Products</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--text-muted)]">{products.length} DB · {totalCatalog} Catalog</span>
          <Link href="/admin/products/new"><Button variant="accent" size="sm"><Plus className="w-4 h-4 mr-1" /> Add Product</Button></Link>
        </div>
      </div>

      {/* ===== DB Products ===== */}
      <h2 className="font-serif text-xl font-bold mb-4 text-[var(--text-secondary)]">Database Products</h2>
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-light)] text-left bg-[var(--bg)]">
              <th className="py-3 px-4 font-semibold">Product</th>
              <th className="py-3 px-4 font-semibold">Category</th>
              <th className="py-3 px-4 font-semibold">Variants</th>
              <th className="py-3 px-4 font-semibold">Price</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b border-[var(--border-light)] hover:bg-[var(--bg)]">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img src={safeJsonParse<string[]>(product.images as string, [])[0]} alt={product.name} className="w-10 h-10 rounded object-cover" />
                    <span className="font-medium line-clamp-1 max-w-[300px]">{product.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-[var(--text-muted)]">{product.category.name}</td>
                <td className="py-3 px-4">{product.variants.length}</td>
                <td className="py-3 px-4 font-medium">
                  ${product.variants[0] ? Number(product.variants[0].price).toFixed(2) : "0.00"}
                  {product.comparePrice && <span className="text-xs text-[var(--text-muted)] line-through ml-2">${Number(product.comparePrice).toFixed(2)}</span>}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.isActive?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>
                    {product.isActive?"Active":"Draft"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Link href={`/admin/products/${product.id}`} className="p-2 hover:bg-[var(--border-light)] rounded"><Pencil className="w-4 h-4" /></Link>
                    <DeleteButton productId={product.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="text-center py-12 text-[var(--text-muted)]">No products yet. Create your first product.</p>}
      </div>

      {/* ===== 1688 Catalog Products ===== */}
      <h2 className="font-serif text-xl font-bold mt-10 mb-4 text-[var(--text-secondary)]">1688 Catalog ({totalCatalog} products)</h2>
      <p className="text-sm text-[var(--text-muted)] mb-4">These products are defined in the source catalog. To edit them, modify <code className="text-[var(--accent)]">src/lib/1688-products.ts</code>.</p>

      <div className="space-y-6">
        {catalogByCategory.map((cat) => (
          <div key={cat.slug} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-[var(--bg)] border-b border-[var(--border-light)]">
              <h3 className="font-semibold text-sm">{cat.name}</h3>
              <p className="text-xs text-[var(--text-muted)]">{cat.products.length} products</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-light)] text-left">
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold">Price</th>
                  <th className="py-3 px-4 font-semibold">Intention</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cat.products.map((p) => (
                  <tr key={p.id} className="border-b border-[var(--border-light)] hover:bg-[var(--bg)]">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover" />
                        <span className="font-medium line-clamp-1 max-w-[300px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">
                      ${p.price.toFixed(2)}
                      {p.compareAt && <span className="text-xs text-[var(--text-muted)] line-through ml-2">${p.compareAt.toFixed(2)}</span>}
                    </td>
                    <td className="py-3 px-4 text-[var(--text-muted)]">{p.intention || "—"}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        {p.tag || "Active"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/products/${p.slug}`}
                        className="inline-flex items-center gap-1 text-sm text-[var(--accent)] hover:underline"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {cat.products.length === 0 && (
              <p className="text-center py-6 text-[var(--text-muted)] text-sm">No active products in this collection.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
