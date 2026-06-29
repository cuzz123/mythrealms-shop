"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ReturnsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ orderId: "", email: "", reason: "", description: "" });

  const inputClass = "w-full px-4 py-3 border border-[var(--border)] rounded-lg text-sm bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] outline-none";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch {
      setLoading(false);
    }

    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold text-[var(--text)] mb-4">Return Request Received</h1>
        <p className="text-[var(--text-muted)] mb-6">We will review your request and respond within 24 hours. No need to ship anything yet — wait for our confirmation email with return instructions.</p>
        <Link href="/" className="px-6 py-3 bg-[var(--accent)] text-white rounded-full font-semibold hover:bg-[var(--accent-hover)] transition">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <Link href="/" className="hover:text-[var(--text)]">Home</Link><span>/</span>
        <span className="text-[var(--text)]">Return Request</span>
      </nav>

      <h1 className="font-serif text-3xl font-bold text-[var(--text)] mb-2">Start a Return</h1>
      <p className="text-[var(--text-muted)] mb-8">30-day return policy. Fill out the form below and we&apos;ll send return instructions.</p>

      <form onSubmit={handleSubmit} className="space-y-5 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
        <div>
          <label className="text-sm font-medium text-[var(--text)] mb-1.5 block">Order ID</label>
          <input type="text" required value={form.orderId} onChange={e => setForm({...form, orderId: e.target.value})} placeholder="e.g. cm2abc123..." className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-[var(--text)] mb-1.5 block">Email</label>
          <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Order email address" className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-[var(--text)] mb-1.5 block">Reason</label>
          <select required value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} className={inputClass}>
            <option value="">Select a reason</option>
            <option value="wrong-size">Wrong size / Doesn&apos;t fit</option>
            <option value="not-as-described">Not as described</option>
            <option value="defective">Defective or damaged</option>
            <option value="changed-mind">Changed my mind</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-[var(--text)] mb-1.5 block">Details (optional)</label>
          <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Any additional information..." className={inputClass} />
        </div>
        <Button variant="primary" size="lg" type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : "Submit Return Request"}
        </Button>
      </form>
    </div>
  );
}
