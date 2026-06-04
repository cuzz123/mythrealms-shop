import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DeleteButton } from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new"><Button variant="accent" size="sm"><Plus className="w-4 h-4 mr-1" /> Add Product</Button></Link>
      </div>

      <div className="bg-white border border-[var(--border-light)] rounded-xl overflow-hidden">
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
                    <img src={JSON.parse(product.images as string)[0]} alt={product.name} className="w-10 h-10 rounded object-cover" />
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
    </div>
  );
}
