"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function DeleteButton({ productId }: { productId: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Product deleted");
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete product");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="p-2 hover:bg-red-50 rounded text-red-500"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
