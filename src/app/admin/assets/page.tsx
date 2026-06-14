"use client";

import { useState, useEffect } from "react";
import { Upload, Loader2, Check, ExternalLink, ImageOff } from "lucide-react";
import toast from "react-hot-toast";

interface Asset {
  id: string;
  type: string;
  name: string;
  slug: string;
  image: string;
  updateField: string;
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/assets")
      .then((r) => r.json())
      .then((data) => setAssets(data.assets || []))
      .finally(() => setLoading(false));
  }, []);

  async function handleReplace(asset: Asset) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg,image/webp";
    input.onchange = async (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;
      setUploading(asset.id);
      try {
        // Step 1: Upload file
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        if (!uploadData.url) throw new Error(uploadData.error || "Upload failed");

        // Step 2: Update asset record
        const updateRes = await fetch(`/api/admin/assets/${asset.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: asset.type, imageUrl: uploadData.url }),
        });
        if (!updateRes.ok) throw new Error("Update failed");

        // Step 3: Update local state
        setAssets((prev) => prev.map((a) => (a.id === asset.id ? { ...a, image: uploadData.url } : a)));
        toast.success("Image updated");
      } catch (err: any) {
        toast.error(err.message || "Failed to update");
      } finally {
        setUploading(null);
      }
    };
    input.click();
  }

  async function handlePasteUrl(asset: Asset) {
    const url = prompt("Paste image URL:", asset.image);
    if (!url || url === asset.image) return;
    setUploading(asset.id);
    try {
      const res = await fetch(`/api/admin/assets/${asset.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: asset.type, imageUrl: url }),
      });
      if (!res.ok) throw new Error("Update failed");
      setAssets((prev) => prev.map((a) => (a.id === asset.id ? { ...a, image: url } : a)));
      toast.success("Image URL updated");
    } catch {
      toast.error("Failed to update");
    } finally {
      setUploading(null);
    }
  }

  const filtered = filter === "all" ? assets : assets.filter((a) => a.type === filter);
  const types = ["all", "blog", "category"];
  const typeLabels: Record<string, string> = { all: "All", blog: "Blog Posts", category: "Categories" };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold text-[var(--text)]">Image Assets</h1>
        <span className="text-sm text-[var(--text-muted)]">{assets.length} images</span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === t ? "bg-[var(--accent)] text-white" : "bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--text-muted)]"
            }`}
          >
            {typeLabels[t]}
          </button>
        ))}
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map((asset) => (
          <div key={asset.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden group">
            {/* Preview */}
            <div className="aspect-square bg-[var(--bg)] relative overflow-hidden">
              {asset.image ? (
                <img src={asset.image} alt={asset.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageOff className="w-8 h-8 text-[var(--text-muted)]" />
                </div>
              )}
              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleReplace(asset)}
                  disabled={uploading === asset.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--accent)] text-white rounded-lg text-xs font-semibold hover:bg-[var(--accent-hover)] transition disabled:opacity-50"
                >
                  {uploading === asset.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  Upload
                </button>
                <button
                  onClick={() => handlePasteUrl(asset)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 text-white rounded-lg text-xs font-semibold hover:bg-white/30 transition"
                >
                  URL
                </button>
              </div>
            </div>
            {/* Info */}
            <div className="p-3">
              <span className="text-[10px] uppercase tracking-wider text-[var(--accent)] font-semibold">{asset.type}</span>
              <p className="text-sm font-medium text-[var(--text)] line-clamp-1 mt-0.5">{asset.name}</p>
              <a href={asset.image} target="_blank" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] truncate block mt-1">
                <ExternalLink className="w-3 h-3 inline mr-0.5" />
                {asset.image?.split("/").pop() || "No image"}
              </a>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-[var(--text-muted)]">
          <p>No assets found.</p>
        </div>
      )}
    </div>
  );
}
