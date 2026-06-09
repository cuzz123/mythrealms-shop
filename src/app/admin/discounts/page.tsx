"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Tag, Plus, Edit2, Trash2, Loader2, Check, X } from "lucide-react";
import toast from "react-hot-toast";

interface DiscountCode {
  id: string;
  code: string;
  type: string;
  value: number;
  label: string;
  description?: string;
  minSubtotal: number;
  maxUses: number;
  usedCount: number;
  firstOrderOnly: boolean;
  isActive: boolean;
  expiresAt?: string;
}

export default function AdminDiscountsPage() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    code: "",
    type: "percentage",
    value: "",
    label: "",
    description: "",
    minSubtotal: "",
    maxUses: "",
    firstOrderOnly: false,
  });

  useEffect(() => {
    fetch("/api/admin/discounts")
      .then((r) => r.json())
      .then(setCodes)
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          value: Number(form.value),
          minSubtotal: Number(form.minSubtotal) || 0,
          maxUses: Number(form.maxUses) || 0,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to create");
        return;
      }
      const created = await res.json();
      setCodes([created, ...codes]);
      setShowForm(false);
      setForm({ code: "", type: "percentage", value: "", label: "", description: "", minSubtotal: "", maxUses: "", firstOrderOnly: false });
      toast.success("Discount code created");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(code: DiscountCode) {
    try {
      const res = await fetch(`/api/admin/discounts/${code.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !code.isActive }),
      });
      if (!res.ok) throw new Error();
      setCodes(codes.map((c) => (c.id === code.id ? { ...c, isActive: !c.isActive } : c)));
      toast.success(code.isActive ? "Deactivated" : "Activated");
    } catch {
      toast.error("Failed to update");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this discount code?")) return;
    try {
      await fetch(`/api/admin/discounts/${id}`, { method: "DELETE" });
      setCodes(codes.filter((c) => c.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

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
        <h1 className="font-serif text-3xl font-bold text-[var(--text)]">Discount Codes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--accent-hover)] transition"
        >
          <Plus className="w-4 h-4" /> New Code
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 mb-8 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Code *</label>
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full px-3 py-2 border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)] text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Type *</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)] text-sm">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed ($)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Value *</label>
            <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="w-full px-3 py-2 border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)] text-sm" required placeholder={form.type === "percentage" ? "15" : "4.99"} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Label</label>
            <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="w-full px-3 py-2 border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)] text-sm" placeholder="e.g. MYTH15" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Description</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)] text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Min Subtotal ($)</label>
            <input type="number" value={form.minSubtotal} onChange={(e) => setForm({ ...form, minSubtotal: e.target.value })} className="w-full px-3 py-2 border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)] text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">Max Uses (0=unlimited)</label>
            <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} className="w-full px-3 py-2 border border-[var(--border)] rounded bg-[var(--bg)] text-[var(--text)] text-sm" />
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-[var(--text)] cursor-pointer">
              <input type="checkbox" checked={form.firstOrderOnly} onChange={(e) => setForm({ ...form, firstOrderOnly: e.target.checked })} className="accent-[var(--accent)]" />
              First order only
            </label>
          </div>
          <div className="col-span-2 flex gap-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--accent-hover)] transition disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-[var(--border)] rounded-lg text-sm">Cancel</button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left">
              <th className="py-3 px-4 font-semibold text-[var(--text-muted)]">Code</th>
              <th className="py-3 px-4 font-semibold text-[var(--text-muted)]">Type</th>
              <th className="py-3 px-4 font-semibold text-[var(--text-muted)]">Value</th>
              <th className="py-3 px-4 font-semibold text-[var(--text-muted)]">Used</th>
              <th className="py-3 px-4 font-semibold text-[var(--text-muted)]">Active</th>
              <th className="py-3 px-4 font-semibold text-[var(--text-muted)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((c) => (
              <tr key={c.id} className="border-b border-[var(--border)] last:border-b-0">
                <td className="py-3 px-4">
                  <span className="font-mono font-semibold text-[var(--text)]">{c.code}</span>
                  {c.description && <p className="text-xs text-[var(--text-muted)]">{c.description}</p>}
                </td>
                <td className="py-3 px-4 text-[var(--text-secondary)] capitalize">{c.type}</td>
                <td className="py-3 px-4 text-[var(--text-secondary)]">{c.type === "percentage" ? `${c.value}%` : `$${c.value}`}</td>
                <td className="py-3 px-4 text-[var(--text-secondary)]">{c.usedCount}{c.maxUses > 0 ? `/${c.maxUses}` : ""}</td>
                <td className="py-3 px-4">
                  <button onClick={() => toggleActive(c)} className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${c.isActive ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                    {c.isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    {c.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="py-3 px-4">
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-red-900/20 rounded text-[var(--text-muted)] hover:text-red-400 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
