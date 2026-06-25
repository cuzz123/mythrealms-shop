"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Truck, CheckCircle, XCircle, Loader2, Package, Mail, Calendar, Hash } from "lucide-react";
import toast from "react-hot-toast";

interface OrderItem {
  id: string; quantity: number; price: number;
  product: { name: string; slug: string; images: string };
  variant?: { name: string } | null;
}

interface Order {
  id: string; email: string; items: OrderItem[];
  subtotal: number; shipping: number; discount: number; total: number;
  status: string; createdAt: string;
  shippingAddress?: string;
  trackingNumber?: string;
  notes?: string;
  stripeSessionId?: string;
}

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["SHIPPED", "REFUNDED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "REFUNDED"],
  DELIVERED: ["REFUNDED"],
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending Payment",
  PAID: "Paid",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  REFUNDED: "Refunded",
  CANCELLED: "Cancelled",
};

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [trackingInput, setTrackingInput] = useState("");

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error || "Order not found");
        return r.json();
      })
      .then((data) => {
        setOrder(data);
        setTrackingInput(data.trackingNumber || "");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function updateStatus(newStatus: string) {
    setUpdating(true);
    try {
      const body: any = { status: newStatus };
      if (trackingInput && trackingInput !== order?.trackingNumber) {
        body.trackingNumber = trackingInput;
      }
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Update failed");
      const updated = await res.json();
      setOrder(updated);
      setTrackingInput(updated.trackingNumber || "");
      toast.success(`Order marked as ${STATUS_LABELS[newStatus] || newStatus}`);
    } catch (e: any) {
      toast.error(e.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  }

  const statusBadge = (s: string) => {
    const colors: Record<string, string> = {
      PAID: "bg-green-900/30 text-green-400",
      PENDING: "bg-yellow-900/30 text-yellow-400",
      SHIPPED: "bg-blue-900/30 text-blue-400",
      DELIVERED: "bg-purple-900/30 text-purple-400",
      REFUNDED: "bg-orange-900/30 text-orange-400",
      CANCELLED: "bg-red-900/30 text-red-400",
    };
    return `px-3 py-1 rounded-full text-xs font-semibold ${colors[s] || "bg-gray-900/30 text-gray-400"}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--text-muted)] mb-4">{error || "Order not found"}</p>
        <Link href="/admin/orders" className="text-[var(--accent)] hover:underline text-sm">
          Back to Orders
        </Link>
      </div>
    );
  }

  const address = order.shippingAddress ? (() => { try { return JSON.parse(order.shippingAddress); } catch { return null; } })() : null;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/orders" className="text-[var(--text-muted)] hover:text-[var(--text)] transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold text-[var(--text)]">
            Order <span className="font-mono text-xl text-[var(--text-muted)]">#{order.id.slice(-8)}</span>
          </h1>
          <span className={statusBadge(order.status)}>{STATUS_LABELS[order.status] || order.status}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border)]">
              <h2 className="font-semibold text-[var(--text)] flex items-center gap-2">
                <Package className="w-4 h-4" /> Items ({order.items.length})
              </h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left bg-[var(--bg)]">
                  <th className="py-3 px-6 font-semibold text-[var(--text-muted)]">Product</th>
                  <th className="py-3 px-6 font-semibold text-[var(--text-muted)]">Variant</th>
                  <th className="py-3 px-6 font-semibold text-[var(--text-muted)] text-center">Qty</th>
                  <th className="py-3 px-6 font-semibold text-[var(--text-muted)] text-right">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-3 px-6">
                      <Link href={`/products/${item.product.slug}`} className="text-[var(--accent)] hover:underline font-medium">
                        {item.product.name}
                      </Link>
                    </td>
                    <td className="py-3 px-6 text-[var(--text-muted)]">
                      {item.variant?.name || "-"}
                    </td>
                    <td className="py-3 px-6 text-center text-[var(--text)]">{item.quantity}</td>
                    <td className="py-3 px-6 text-right text-[var(--text)]">${item.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tracking */}
          {order.status === "SHIPPED" || order.status === "DELIVERED" ? (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
              <h2 className="font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4" /> Tracking
              </h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="Tracking number"
                  className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
                />
                <button
                  onClick={() => {
                    if (trackingInput !== order.trackingNumber) {
                      updateStatus(order.status);
                    }
                  }}
                  disabled={updating || trackingInput === order.trackingNumber}
                  className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition"
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                </button>
              </div>
            </div>
          ) : order.status !== "CANCELLED" && order.status !== "REFUNDED" ? (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
              <h2 className="font-semibold text-[var(--text)] mb-3">Tracking Number</h2>
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="Add tracking number when shipped"
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          ) : null}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <h2 className="font-semibold text-[var(--text)] mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>Shipping</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-[var(--text)] pt-2 border-t border-[var(--border)]">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <h2 className="font-semibold text-[var(--text)] mb-3">Customer</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <Mail className="w-4 h-4" />
                <span className="text-[var(--text)]">{order.email}</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <Calendar className="w-4 h-4" />
                <span>{new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })}</span>
              </div>
              {order.stripeSessionId && (
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Hash className="w-4 h-4" />
                  <span className="font-mono text-xs">{order.stripeSessionId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {address && (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
              <h2 className="font-semibold text-[var(--text)] mb-3">Shipping Address</h2>
              <div className="text-sm text-[var(--text-secondary)] leading-relaxed space-y-0.5">
                <p className="font-medium text-[var(--text)]">{address.name}</p>
                {address.line1 && <p>{address.line1}</p>}
                {address.line2 && <p>{address.line2}</p>}
                <p>{[address.city, address.state, address.zip].filter(Boolean).join(", ")}</p>
                <p>{address.country}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          {order.status !== "CANCELLED" && order.status !== "REFUNDED" && (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
              <h2 className="font-semibold text-[var(--text)] mb-3">Actions</h2>
              <div className="space-y-2">
                {order.status === "PAID" && (
                  <button
                    onClick={() => updateStatus("SHIPPED")}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                    Mark as Shipped
                  </button>
                )}
                {order.status === "SHIPPED" && (
                  <button
                    onClick={() => updateStatus("DELIVERED")}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Delivered
                  </button>
                )}
                {(order.status === "PENDING" || order.status === "PAID") && (
                  <button
                    onClick={() => updateStatus("CANCELLED")}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-900/30 disabled:opacity-50 transition"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel Order
                  </button>
                )}
                {(order.status === "PAID" || order.status === "SHIPPED" || order.status === "DELIVERED") && (
                  <button
                    onClick={() => updateStatus("REFUNDED")}
                    disabled={updating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-orange-900/20 text-orange-400 hover:bg-orange-900/40 border border-orange-900/30 disabled:opacity-50 transition"
                  >
                    Refund Order
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
              <h2 className="font-semibold text-[var(--text)] mb-2">Notes</h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
