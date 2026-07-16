"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  ProductFormCore,
  type Category,
  type ProductFormData,
  emptyFormData,
} from "@/components/admin/ProductFormCore";
import { getErrorMessage } from "@/lib/error-message";

type AdminProductVariant = {
  id?: string;
  name?: string;
  price?: number;
  stock?: number;
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [data, setData] = useState<ProductFormData>(emptyFormData());
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  // Fetch categories + product data
  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch(`/api/admin/products/${productId}`).then((r) => r.json()),
    ])
      .then(([cats, product]) => {
        setCategories(cats);
        if (product.id) {
          setData({
            name: product.name || "",
            slug: product.slug || "",
            description: product.description || "",
            categoryId: product.categoryId || "",
            stone: product.stone || "",
            material: product.material || "",
            intention: product.intention || "",
            comparePrice: product.comparePrice ? String(product.comparePrice) : "",
            isFeatured: !!product.isFeatured,
            isActive: !!product.isActive,
            variants: product.variants?.length
              ? product.variants.map((v: AdminProductVariant) => ({
                  key: v.id || Math.random().toString(36).slice(2, 8),
                  name: v.name || "",
                  price: String(v.price || ""),
                  stock: String(v.stock ?? "100"),
                }))
              : [{ key: "default", name: "Default", price: "", stock: "100" }],
            images: product.images
              ? (() => {
                  try {
                    const parsed = JSON.parse(product.images);
                    return (Array.isArray(parsed) ? parsed : []).map((url: string) => ({
                      key: Math.random().toString(36).slice(2, 8),
                      url,
                    }));
                  } catch {
                    return [{ key: Math.random().toString(36).slice(2, 8), url: "" }];
                  }
                })()
              : [{ key: Math.random().toString(36).slice(2, 8), url: "" }],
          });
        }
      })
      .catch(() => setError("Failed to load product"))
      .finally(() => setLoading(false));
  }, [productId]);

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
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
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
        throw new Error(err.error || "Failed to update product");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Something went wrong."));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
      </div>
    );
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
        <h1 className="font-serif text-3xl font-bold">Edit Product</h1>
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
        submitLabel="Save Changes"
      />
    </div>
  );
}
