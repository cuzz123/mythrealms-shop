"use client";

import { useState, useEffect } from "react";
import { Truck, CheckCircle, XCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/error-message";

interface OrderItem {
  id: string; quantity: number; price: number;
  product: { name: string; slug: string };
}

interface Order {
  id: string; email: string; items: OrderItem[];
  total: number; status: string; createdAt: string;
  trackingNumber?: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(orderId: string, status: string) {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      toast.success(`Order ${status.toLowerCase()}`);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Update failed"));
    } finally {
      setUpdating(null);
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
    return `px-2 py-1 rounded-full text-xs font-semibold ${colors[s] || "bg-gray-900/30 text-gray-400"}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-[var(--text)] mb-8">Orders</h1>
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-left bg-[var(--bg)]">
              <th className="py-3 px-4 font-semibold text-[var(--text-muted)]">Order</th>
              <th className="py-3 px-4 font-semibold text-[var(--text-muted)]">Customer</th>
              <th className="py-3 px-4 font-semibold text-[var(--text-muted)]">Items</th>
              <th className="py-3 px-4 font-semibold text-[var(--text-muted)]">Total</th>
              <th className="py-3 px-4 font-semibold text-[var(--text-muted)]">Status</th>
              <th className="py-3 px-4 font-semibold text-[var(--text-muted)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-[var(--border)]">
                <td className="py-3 px-4 font-mono text-xs text-[var(--text-secondary)]">#{order.id.slice(-8)}</td>
                <td className="py-3 px-4 text-[var(--text-secondary)] text-xs">{order.email}</td>
                <td className="py-3 px-4 text-[var(--text-secondary)]">{order.items.length}</td>
                <td className="py-3 px-4 font-medium text-[var(--text)]">${Number(order.total).toFixed(2)}</td>
                <td className="py-3 px-4"><span className={statusBadge(order.status)}>{order.status}</span></td>
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    {order.status === "PAID" && (
                      <button
                        onClick={() => updateStatus(order.id, "SHIPPED")}
                        disabled={updating === order.id}
                        className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-blue-900/20 text-blue-400 hover:bg-blue-900/40 transition"
                      >
                        {updating === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Truck className="w-3 h-3" />}
                        Ship
                      </button>
                    )}
                    {order.status === "SHIPPED" && (
                      <button
                        onClick={() => updateStatus(order.id, "DELIVERED")}
                        disabled={updating === order.id}
                        className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-900/20 text-green-400 hover:bg-green-900/40 transition"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Deliver
                      </button>
                    )}
                    {(order.status === "PENDING" || order.status === "PAID") && (
                      <button
                        onClick={() => updateStatus(order.id, "CANCELLED")}
                        disabled={updating === order.id}
                        className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-900/20 text-red-400 hover:bg-red-900/40 transition"
                      >
                        <XCircle className="w-3 h-3" />
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="text-center py-12 text-[var(--text-muted)]">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
