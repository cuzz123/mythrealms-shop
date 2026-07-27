"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Loader2, Send } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/brand-identity";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        toast.success("Message sent.");
        setSent(true);
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to send message");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <nav className="mb-8 flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--text)]">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Contact</span>
      </nav>

      <div className="mb-10 text-center">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">{BRAND.name}</p>
        <h1 className="mb-3 font-serif text-5xl font-bold text-[var(--text)]">Contact Us</h1>
        <p className="mx-auto max-w-lg text-[var(--text-muted)]">
          Questions about a piece or an order? Send us a note and we will review the details.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8">
        {sent ? (
          <div className="py-8 text-center">
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-[var(--success)]" />
            <h2 className="mb-2 text-lg font-semibold text-[var(--text)]">Message Sent</h2>
            <p className="mb-6 text-sm text-[var(--text-muted)]">Thank you for reaching out.</p>
            <Link href="/collections/pearl-series"><Button variant="primary">Find Your Piece</Button></Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" required className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm" />
              <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Your email" required className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm" />
            </div>
            <input type="text" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} placeholder="Subject" required className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm" />
            <textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Your message" required rows={5} className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm" />
            <Button variant="primary" size="lg" type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : <><Send className="mr-2 h-4 w-4" /> Send Message</>}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
