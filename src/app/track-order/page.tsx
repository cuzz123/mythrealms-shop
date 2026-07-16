"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Search, Package, MapPin, Clock } from "lucide-react";

type TrackingEvent = {
  date: string;
  time: string;
  location: string;
  status: string;
};

type TrackingDetails = {
  status: string;
  estimated: string;
  origin: string;
  destination: string;
  events: TrackingEvent[];
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [tracking, setTracking] = useState<TrackingDetails | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    setSearched(true);
    setTracking(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/track-order?orderId=${encodeURIComponent(orderId.trim())}&email=${encodeURIComponent(email.trim())}`);
      if (res.ok) {
        const order = await res.json();
        if (order.id) {
          setTracking({
            status: order.status,
            estimated: new Date(order.estimatedDelivery).toLocaleDateString(),
            origin: "Fulfillment Center",
            destination: order.destination,
            events: [
              { date: new Date(order.createdAt).toLocaleDateString(), time: "", location: "Online", status: "Order placed" },
              ...(order.status === "Shipped" || order.status === "In Transit" ? [{ date: "", time: "", location: "In Transit", status: "Package in transit" }] : []),
              ...(order.status === "Delivered" ? [{ date: new Date(order.estimatedDelivery).toLocaleDateString(), time: "", location: order.destination, status: "Delivered" }] : []),
            ],
          });
          setLoading(false);
          return;
        }
      }
    } catch { /* API error, show not found */ }

    setLoading(false);
    setTracking(null);
  }

  const inputClass = "w-full px-4 py-3 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)]";

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <Link href="/" className="hover:text-[var(--text)]">Home</Link><span>/</span>
        <span className="text-[var(--text)]">Track Your Order</span>
      </nav>

      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl font-bold text-[var(--text)] mb-3">Track Your Order</h1>
        <p className="text-[var(--text-muted)]">Enter your order ID and email to check your package status</p>
      </div>

      <form onSubmit={handleTrack} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 mb-8">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-[var(--text)] mb-1.5 block">Order ID</label>
            <input type="text" value={orderId} onChange={e=>setOrderId(e.target.value)} placeholder="e.g. MR-2026-0001" required className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--text)] mb-1.5 block">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Order email address" required className={inputClass} />
          </div>
        </div>
        <Button variant="primary" size="lg" type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Searching...
            </span>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" /> Track Package
            </>
          )}
        </Button>
      </form>

      {searched && !tracking && (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
          <h3 className="font-semibold text-[var(--text)] mb-1">Order Not Found</h3>
          <p className="text-sm text-[var(--text-muted)]">Please check your order ID and try again. For demo, try: MR-2026-0001 or MR-2026-0042</p>
        </div>
      )}

      {tracking && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 space-y-6 animate-slide-up">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-[var(--text)]">{orderId}</h2>
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mt-1">
                <MapPin className="w-3.5 h-3.5" /> {tracking.origin} {String.fromCharCode(8594)} {tracking.destination}
              </div>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${tracking.status==='Delivered'?'bg-[#1A2E1A] text-[var(--success)]':'bg-blue-900/20 text-blue-400'}`}>
              {tracking.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="text-sm text-[var(--text-muted)]">Estimated delivery: <strong className="text-[var(--text)]">{tracking.estimated}</strong></span>
          </div>

          {/* Timeline */}
          <div className="relative pl-6 border-l-2 border-[var(--border)] space-y-6">
            {tracking.events.map((event, i) => (
              <div key={i} className="relative">
                <div className={`absolute -left-[29px] w-4 h-4 rounded-full border-2 ${i===0?'bg-[var(--accent)] border-[var(--accent)]':'bg-[var(--surface)] border-[var(--border)]'}`} />
                <p className="text-sm font-medium text-[var(--text)]">{event.status}</p>
                <p className="text-xs text-[var(--text-muted)]">{event.location}</p>
                <p className="text-xs text-[var(--text-muted)]">{event.date} at {event.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
