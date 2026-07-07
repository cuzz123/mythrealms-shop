"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CheckCircle, Clock, Loader2, Mail, MapPin, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Message sent! We'll get back to you within 24 hours.");
        setSent(true);
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to send message");
      }
    } catch {
      toast.error("Something went wrong. Please try again or email us directly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <nav className="mb-4 flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--text)]">
          Home
        </Link>
        <span>/</span>
        <span className="text-[var(--text)]">Contact Us</span>
      </nav>

      <div className="mb-12 text-center">
        <h1 className="mb-3 font-serif text-5xl font-bold text-[var(--text)]">Contact Us</h1>
        <p className="mx-auto max-w-lg text-[var(--text-muted)]">
          Questions about a pearl piece, guardian match, shipping, or an order? Send us a note.
        </p>
      </div>

      <div className="mb-12 grid gap-8 md:grid-cols-3">
        {[
          { icon: Mail, title: "Email", info: "mythrealms@outlook.com", desc: "We reply within 24 hours" },
          { icon: Clock, title: "Hours", info: "Mon-Fri 9:00-18:00 (EST)", desc: "Weekend inquiries replied on Monday" },
          { icon: MapPin, title: "Location", info: "Online atelier", desc: "Ships worldwide from partner logistics" },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
            <item.icon className="mx-auto mb-3 h-8 w-8 text-[var(--accent)]" />
            <h3 className="mb-1 font-semibold text-[var(--text)]">{item.title}</h3>
            <p className="text-sm font-medium text-[var(--text)]">{item.info}</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-2xl rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8">
        <h2 className="mb-6 font-serif text-2xl font-bold text-[var(--text)]">Send us a message</h2>
        {sent ? (
          <div className="py-8 text-center">
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
            <h3 className="mb-2 text-lg font-semibold text-[var(--text)]">Message Sent!</h3>
            <p className="mb-6 text-sm text-[var(--text-muted)]">
              Thank you for reaching out. We will get back to you soon.
            </p>
            <div className="flex justify-center gap-3">
              <Link href="/collections/pearl-series">
                <Button variant="primary">Shop Pearls</Button>
              </Link>
              <Link href="/guardian-quiz">
                <Button variant="outline">Take the Quiz</Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                required
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]"
              />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Your email"
                required
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]"
              />
            </div>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Subject"
              required
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]"
            />
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Your message"
              required
              rows={5}
              className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]"
            />
            <Button variant="primary" size="lg" type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Send Message
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
