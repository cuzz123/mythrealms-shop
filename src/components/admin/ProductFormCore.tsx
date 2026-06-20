"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Upload, Loader2, Save } from "lucide-react";
import { slugify } from "@/lib/utils";

// ---- Types (shared between create and edit) ----

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface VariantRow {
  key: string;
  name: string;
  price: string;
  stock: string;
}

export interface ImageRow {
  key: string;
  url: string;
}

export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  stone: string;
  material: string;
  intention: string;
  comparePrice: string;
  isFeatured: boolean;
  isActive: boolean;
  variants: VariantRow[];
  images: ImageRow[];
}

// ---- Defaults ----

export const emptyVariant = (): VariantRow => ({
  key: Math.random().toString(36).slice(2, 8),
  name: "Default",
  price: "",
  stock: "100",
});

export const emptyImage = (): ImageRow => ({
  key: Math.random().toString(36).slice(2, 8),
  url: "",
});

export const emptyFormData = (): ProductFormData => ({
  name: "",
  slug: "",
  description: "",
  categoryId: "",
  stone: "",
  material: "",
  intention: "",
  comparePrice: "",
  isFeatured: false,
  isActive: true,
  variants: [emptyVariant()],
  images: [emptyImage()],
});

// ---- Form Core Props ----

interface ProductFormCoreProps {
  data: ProductFormData;
  onChange: (data: ProductFormData) => void;
  categories: Category[];
  uploading: string | null;
  onUpload: (file: File, imageKey: string) => void;
  error: string | null;
  saving: boolean;
  onSubmit: () => void;
  submitLabel?: string;
}

// ---- Reusable form fields (shared between create & edit) ----

export function ProductFormCore({
  data,
  onChange,
  categories,
  uploading,
  onUpload,
  error,
  saving,
  onSubmit,
  submitLabel = "Save Product",
}: ProductFormCoreProps) {
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const set = (patch: Partial<ProductFormData>) =>
    onChange({ ...data, ...patch });

  const handleNameChange = useCallback(
    (value: string) => {
      const patch: Partial<ProductFormData> = { name: value };
      if (!slugManuallyEdited) {
        patch.slug = slugify(value);
      }
      onChange({ ...data, ...patch });
    },
    [data, slugManuallyEdited, onChange]
  );

  const handleSlugChange = useCallback(
    (value: string) => {
      setSlugManuallyEdited(true);
      set({ slug: value });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  );

  function addVariant() {
    set({ variants: [...data.variants, emptyVariant()] });
  }

  function removeVariant(key: string) {
    set({ variants: data.variants.filter((v) => v.key !== key) });
  }

  function updateVariant(key: string, field: keyof VariantRow, value: string) {
    set({
      variants: data.variants.map((v) =>
        v.key === key ? { ...v, [field]: value } : v
      ),
    });
  }

  function addImage() {
    set({ images: [...data.images, emptyImage()] });
  }

  function removeImage(key: string) {
    set({ images: data.images.filter((img) => img.key !== key) });
  }

  function updateImage(key: string, url: string) {
    set({
      images: data.images.map((img) =>
        img.key === key ? { ...img, url } : img
      ),
    });
  }

  function handleImageSelect(imageKey: string) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) onUpload(file, imageKey);
    };
    input.click();
  }

  const fieldClass =
    "w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent";
  const labelClass = "block text-sm font-medium mb-1.5";

  return (
    <form className="max-w-3xl space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <section className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 space-y-5">
        <h2 className="font-serif text-lg font-bold">Basic Information</h2>

        <div>
          <label className={labelClass}>
            Product Name <span className="text-[var(--accent)]">*</span>
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={fieldClass}
            placeholder="Amethyst Crystal Necklace"
            required
          />
        </div>

        <div>
          <label className={labelClass}>
            Slug <span className="text-[var(--accent)]">*</span>
          </label>
          <input
            type="text"
            value={data.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            className={`${fieldClass} font-mono`}
            placeholder="amethyst-crystal-necklace"
            required
          />
        </div>

        <div>
          <label className={labelClass}>
            Description <span className="text-[var(--accent)]">*</span>
          </label>
          <textarea
            value={data.description}
            onChange={(e) => set({ description: e.target.value })}
            rows={5}
            className={`${fieldClass} h-auto py-3`}
            placeholder="Describe the product..."
            required
          />
        </div>

        <div>
          <label className={labelClass}>
            Category <span className="text-[var(--accent)]">*</span>
          </label>
          <select
            value={data.categoryId}
            onChange={(e) => set({ categoryId: e.target.value })}
            className={fieldClass}
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Compare At Price</label>
          <input
            type="number"
            step="0.01"
            value={data.comparePrice}
            onChange={(e) => set({ comparePrice: e.target.value })}
            className={fieldClass}
            placeholder="e.g. 49.99"
          />
        </div>
      </section>

      {/* Attributes */}
      <section className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 space-y-5">
        <h2 className="font-serif text-lg font-bold">Attributes</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Stone</label>
            <input
              type="text"
              value={data.stone}
              onChange={(e) => set({ stone: e.target.value })}
              className={fieldClass}
              placeholder="e.g. Lapis Lazuli"
            />
          </div>
          <div>
            <label className={labelClass}>Material</label>
            <input
              type="text"
              value={data.material}
              onChange={(e) => set({ material: e.target.value })}
              className={fieldClass}
              placeholder="e.g. 14k Gold"
            />
          </div>
          <div>
            <label className={labelClass}>Intention</label>
            <input
              type="text"
              value={data.intention}
              onChange={(e) => set({ intention: e.target.value })}
              className={fieldClass}
              placeholder="e.g. Protection"
            />
          </div>
        </div>
      </section>

      {/* Variants */}
      <section className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold">
            Variants <span className="text-[var(--accent)]">*</span>
          </h2>
          <button
            type="button"
            onClick={addVariant}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            <Plus className="w-4 h-4" /> Add Variant
          </button>
        </div>

        {data.variants.map((v) => (
          <div
            key={v.key}
            className="grid grid-cols-12 gap-3 items-center p-3 bg-[var(--bg)] rounded-lg border border-[var(--border)]"
          >
            <input
              type="text"
              value={v.name}
              onChange={(e) => updateVariant(v.key, "name", e.target.value)}
              className={`col-span-4 ${fieldClass}`}
              placeholder="Variant name"
              required
            />
            <input
              type="number"
              step="0.01"
              value={v.price}
              onChange={(e) => updateVariant(v.key, "price", e.target.value)}
              className={`col-span-3 ${fieldClass}`}
              placeholder="Price"
              required
            />
            <input
              type="number"
              value={v.stock}
              onChange={(e) => updateVariant(v.key, "stock", e.target.value)}
              className={`col-span-3 ${fieldClass}`}
              placeholder="Stock"
            />
            <button
              type="button"
              onClick={() => removeVariant(v.key)}
              disabled={data.variants.length <= 1}
              className="col-span-2 flex justify-center p-2 text-[var(--text-muted)] hover:text-red-400 disabled:opacity-30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </section>

      {/* Images */}
      <section className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold">Images</h2>
          <button
            type="button"
            onClick={addImage}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            <Plus className="w-4 h-4" /> Add Image
          </button>
        </div>

        {data.images.map((img) => (
          <div
            key={img.key}
            className="flex items-center gap-3 p-3 bg-[var(--bg)] rounded-lg border border-[var(--border)]"
          >
            <input
              type="url"
              value={img.url}
              onChange={(e) => updateImage(img.key, e.target.value)}
              className={`flex-1 ${fieldClass}`}
              placeholder="https://... or /images/products/..."
            />
            {img.url && (
              <img
                src={img.url}
                alt="Preview"
                className="w-10 h-10 rounded object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <button
              type="button"
              onClick={() => handleImageSelect(img.key)}
              disabled={!!uploading}
              className="flex items-center gap-1 px-3 h-10 text-sm font-medium border border-[var(--border)] rounded-lg hover:bg-[var(--border-light)] disabled:opacity-50"
            >
              {uploading === img.key ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => removeImage(img.key)}
              disabled={data.images.length <= 1}
              className="p-2 text-[var(--text-muted)] hover:text-red-400 disabled:opacity-30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </section>

      {/* Toggles */}
      <section className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 space-y-4">
        <h2 className="font-serif text-lg font-bold">Settings</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.isFeatured}
            onChange={(e) => set({ isFeatured: e.target.checked })}
            className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
          />
          <span className="text-sm font-medium">Featured Product</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.isActive}
            onChange={(e) => set({ isActive: e.target.checked })}
            className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
          />
          <span className="text-sm font-medium">Active (visible to customers)</span>
        </label>
      </section>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          onClick={(e) => { e.preventDefault(); onSubmit(); }}
          className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--accent)] text-white rounded-lg font-semibold text-sm hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving…
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> {submitLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
