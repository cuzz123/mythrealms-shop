"use client";

import { useState, useEffect, FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { slugify } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface VariantRow {
  key: string;
  name: string;
  price: string;
  stock: string;
}

interface ImageRow {
  key: string;
  url: string;
}

export default function NewProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [stone, setStone] = useState("");
  const [material, setMaterial] = useState("");
  const [intention, setIntention] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [variants, setVariants] = useState<VariantRow[]>([
    { key: "1", name: "Default", price: "", stock: "0" },
  ]);
  const [images, setImages] = useState<ImageRow[]>([{ key: "1", url: "" }]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const handleNameChange = useCallback(
    (value: string) => {
      setName(value);
      if (!slugManuallyEdited) {
        setSlug(slugify(value));
      }
    },
    [slugManuallyEdited]
  );

  const handleSlugChange = useCallback((value: string) => {
    setSlugManuallyEdited(true);
    setSlug(value);
  }, []);

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { key: String(Date.now()), name: "", price: "", stock: "0" },
    ]);
  };

  const removeVariant = (key: string) => {
    setVariants((prev) => prev.filter((v) => v.key !== key));
  };

  const updateVariant = (key: string, field: keyof VariantRow, value: string) => {
    setVariants((prev) =>
      prev.map((v) => (v.key === key ? { ...v, [field]: value } : v))
    );
  };

  const addImage = () => {
    setImages((prev) => [...prev, { key: String(Date.now()), url: "" }]);
  };

  const removeImage = (key: string) => {
    setImages((prev) => prev.filter((img) => img.key !== key));
  };

  const updateImage = (key: string, url: string) => {
    setImages((prev) =>
      prev.map((img) => (img.key === key ? { ...img, url } : img))
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !slug || !description || !categoryId) {
      setError("Please fill in all required fields.");
      return;
    }

    const variantList = variants.filter((v) => v.name.trim() !== "");
    if (variantList.length === 0) {
      setError("Please add at least one variant.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          description,
          categoryId,
          stone: stone || undefined,
          material: material || undefined,
          intention: intention || undefined,
          comparePrice: comparePrice || undefined,
          isFeatured,
          variants: variantList.map((v) => ({
            name: v.name,
            price: v.price,
            stock: v.stock,
          })),
          images: images.filter((img) => img.url.trim() !== "").map((img) => img.url.trim()),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

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

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <section className="bg-white border border-[var(--border-light)] rounded-xl p-6 space-y-5">
          <h2 className="font-serif text-lg font-bold">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Product Name <span className="text-[var(--accent)]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              placeholder="Amethyst Crystal Necklace"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Slug <span className="text-[var(--accent)]">*</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              placeholder="amethyst-crystal-necklace"
              required
            />
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Auto-generated from name. Edit manually if needed.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Description <span className="text-[var(--accent)]">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-y"
              placeholder="Describe the product..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Category <span className="text-[var(--accent)]">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
              required
            >
              <option value="">Select a category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Attributes */}
        <section className="bg-white border border-[var(--border-light)] rounded-xl p-6 space-y-5">
          <h2 className="font-serif text-lg font-bold">Attributes</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Stone</label>
              <input
                type="text"
                value={stone}
                onChange={(e) => setStone(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                placeholder="Amethyst"
                list="stone-suggestions"
              />
              <datalist id="stone-suggestions">
                <option value="Amethyst" />
                <option value="Rose Quartz" />
                <option value="Clear Quartz" />
                <option value="Jade" />
                <option value="Obsidian" />
                <option value="Citrine" />
                <option value="Lapis Lazuli" />
                <option value="Tiger's Eye" />
                <option value="Moonstone" />
                <option value="Turquoise" />
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Material</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                placeholder="Sterling Silver"
                list="material-suggestions"
              />
              <datalist id="material-suggestions">
                <option value="Sterling Silver" />
                <option value="Gold Plated" />
                <option value="14K Gold" />
                <option value="Copper" />
                <option value="Brass" />
                <option value="Leather" />
                <option value="Silk Cord" />
                <option value="Stainless Steel" />
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Intention</label>
              <input
                type="text"
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                placeholder="Calm & Clarity"
                list="intention-suggestions"
              />
              <datalist id="intention-suggestions">
                <option value="Calm & Clarity" />
                <option value="Love & Compassion" />
                <option value="Protection" />
                <option value="Prosperity" />
                <option value="Healing" />
                <option value="Focus" />
                <option value="Creativity" />
                <option value="Grounding" />
              </datalist>
            </div>
          </div>
        </section>

        {/* Pricing & Status */}
        <section className="bg-white border border-[var(--border-light)] rounded-xl p-6 space-y-5">
          <h2 className="font-serif text-lg font-bold">Pricing &amp; Status</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Compare Price</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={comparePrice}
                onChange={(e) => setComparePrice(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                placeholder="0.00"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Original/strikethrough price shown next to the sale price.
              </p>
            </div>

            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span className="text-sm font-medium">Featured Product</span>
              </label>
            </div>
          </div>
        </section>

        {/* Variants */}
        <section className="bg-white border border-[var(--border-light)] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold">Variants</h2>
            <Button type="button" variant="outline" size="sm" onClick={addVariant}>
              <Plus className="w-3.5 h-3.5" /> Add Variant
            </Button>
          </div>

          <div className="space-y-3">
            {variants.map((variant, idx) => (
              <div
                key={variant.key}
                className="flex items-end gap-3 p-3 bg-[var(--bg)] rounded-lg border border-[var(--border-light)]"
              >
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">
                    Name
                  </label>
                  <input
                    type="text"
                    value={variant.name}
                    onChange={(e) => updateVariant(variant.key, "name", e.target.value)}
                    className="w-full h-9 px-2.5 rounded border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    placeholder='e.g. "Small" or "Gold"'
                  />
                </div>
                <div className="w-28">
                  <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={variant.price}
                    onChange={(e) => updateVariant(variant.key, "price", e.target.value)}
                    className="w-full h-9 px-2.5 rounded border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    placeholder="0.00"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-xs font-medium mb-1 text-[var(--text-muted)]">
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(e) => updateVariant(variant.key, "stock", e.target.value)}
                    className="w-full h-9 px-2.5 rounded border border-[var(--border)] bg-white text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    placeholder="0"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeVariant(variant.key)}
                  disabled={variants.length <= 1}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Remove variant"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Images */}
        <section className="bg-white border border-[var(--border-light)] rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold">Images</h2>
            <Button type="button" variant="outline" size="sm" onClick={addImage}>
              <Plus className="w-3.5 h-3.5" /> Add Another
            </Button>
          </div>

          <div className="space-y-3">
            {images.map((img, idx) => (
              <div key={img.key} className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    type="url"
                    value={img.url}
                    onChange={(e) => updateImage(img.key, e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(img.key)}
                  disabled={images.length <= 1}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {images.some((img) => img.url.trim()) && (
            <div className="flex gap-2 flex-wrap pt-2">
              {images
                .filter((img) => img.url.trim())
                .map((img) => (
                  <img
                    key={img.key}
                    src={img.url.trim()}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded border border-[var(--border)]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ))}
            </div>
          )}
        </section>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <Button type="submit" variant="accent" size="lg" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Product
              </>
            )}
          </Button>
          <Link href="/admin/products">
            <Button type="button" variant="ghost" size="lg">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
