"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  ProductFormCore,
  type Category,
  type VariantRow,
  type ImageRow,
  type ProductFormData,
  emptyFormData,
} from "@/components/admin/ProductFormCore";

export default function NewProductPage() {
  const router = useRouter();
  const [data, setData] = useState<ProductFormData>(emptyFormData());
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  async function handleUpload(file: File, imageKey: string) {
    setUploading(imageKey);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const blob = await res.json();
        setData({
          ...data,
          images: data.images.map((img) =>
            img.key === imageKey ? { ...img, url: blob.url } : img
          ),
        });
      } else {
        const err = await res.json();
        alert(err.error || "Upload failed");
      }
    } catch {
      alert("Upload failed. Check BLOB_READ_WRITE_TOKEN.");
    } finally {
      setUploading(null);
    }
  }

  async function handleSubmit() {
    if (!data.name || !data.slug || !data.categoryId) {
      setError("Please fill in all required fields.");
      return;
    }
    const variantList = data.variants.filter((v) => v.name.trim() !== "");
    if (variantList.length === 0) {
      setError("Please add at least one variant.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          slug: data.slug,
          description: data.description,
          categoryId: data.categoryId,
          stone: data.stone || undefined,
          material: data.material || undefined,
          intention: data.intention || undefined,
          comparePrice: data.comparePrice || undefined,
          isFeatured: data.isFeatured,
          isActive: data.isActive,
          variants: variantList.map((v) => ({ name: v.name, price: v.price, stock: v.stock })),
          images: data.images.filter((img) => img.url.trim() !== "").map((img) => img.url.trim()),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create product");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-[var(--border-light)] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-serif text-3xl font-bold">New Product</h1>
      </div>
      <ProductFormCore
        data={data}
        onChange={setData}
        categories={categories}
        uploading={uploading}
        onUpload={handleUpload}
        error={error}
        saving={saving}
        onSubmit={handleSubmit}
        submitLabel="Save Product"
      />
    </div>
  );
}
