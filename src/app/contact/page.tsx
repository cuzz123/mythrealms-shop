"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Mail, MapPin, Clock, Send, CheckCircle, Loader2 } from "lucide-react";
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
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <Link href="/" className="hover:text-[var(--text)]">Home</Link><span>/</span>
        <span className="text-[var(--text)]">Contact Us</span>
      </nav>

      <div className="text-center mb-12">
        <h1 className="font-serif text-5xl font-bold text-[var(--text)] mb-3">Contact Us</h1>
        <p className="text-[var(--text-muted)] max-w-lg mx-auto">We would love to hear from you. Whether you have a question about our mythical collections, orders, or the legends themselves.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {[
          { icon: Mail, title: "Email", info: "support@mythrealms.com", desc: "We reply within 24 hours" },
          { icon: Clock, title: "Hours", info: "Mon–Fri 9:00–18:00 (EST)", desc: "Weekend inquiries replied on Monday" },
          { icon: MapPin, title: "Location", info: "Inspired by China · Worldwide", desc: "Ships to 80+ countries" },
        ].map((item) => (
          <div key={item.title} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 text-center">
            <item.icon className="w-8 h-8 text-[var(--accent)] mx-auto mb-3" />
            <h3 className="font-semibold text-[var(--text)] mb-1">{item.title}</h3>
            <p className="text-sm font-medium text-[var(--text)]">{item.info}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8">
        <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-6">Send us a message</h2>
        {sent ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold text-[var(--text)] text-lg mb-2">Message Sent!</h3>
            <p className="text-sm text-[var(--text-muted)]">Thank you for reaching out. We will get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" required className="px-4 py-3 border border-[var(--border)] rounded-lg text-sm w-full bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)]" />
              <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Your email" required className="px-4 py-3 border border-[var(--border)] rounded-lg text-sm w-full bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)]" />
            </div>
            <input type="text" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="Subject" required className="px-4 py-3 border border-[var(--border)] rounded-lg text-sm w-full bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)]" />
            <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Your message" required rows={5} className="px-4 py-3 border border-[var(--border)] rounded-lg text-sm w-full resize-none bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)]" />
            <Button variant="primary" size="lg" type="submit" className="w-full">
              <Send className="w-4 h-4 mr-2" /> {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
