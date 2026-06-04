"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, Mail, LogOut, ShoppingBag, Package, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  productSnapshot: string | null;
  product: {
    name: string;
    slug: string;
    images: string;
  } | null;
}

interface Order {
  id: string;
  status: string;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      setOrdersLoading(true);
      setOrdersError("");
      fetch("/api/account/orders")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load orders");
          return res.json();
        })
        .then((data) => setOrders(data.orders || []))
        .catch((err) => setOrdersError(err.message || "Failed to load orders"))
        .finally(() => setOrdersLoading(false));
    }
  }, [status]);

  // --- Not logged in ---
  if (status === "unauthenticated") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--border-light)]">
          <User size={28} strokeWidth={1.5} className="text-[var(--text-muted)]" />
        </div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-[var(--text)]">
          My Account
        </h1>
        <p className="mt-3 text-[var(--text-secondary)]">
          Sign in to view your orders and manage your profile.
        </p>
        <Link
          href="/auth/signin"
          className="mt-8 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--primary)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-hover)]"
        >
          Sign In
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
      </div>
    );
  }

  // --- Loading ---
  if (status === "loading") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-48 rounded bg-[var(--border-light)]" />
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8">
            <div className="h-5 w-32 rounded bg-[var(--border-light)]" />
            <div className="mt-2 h-4 w-48 rounded bg-[var(--border-light)]" />
          </div>
        </div>
      </div>
    );
  }

  // --- Logged in ---
  const user = session?.user;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-[var(--text)]">
        My Account
      </h1>

      {/* Profile Card */}
      <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--border-light)]">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user?.name || "User"}
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <User size={24} strokeWidth={1.5} className="text-[var(--text-muted)]" />
              )}
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-[var(--text)]">
                {user?.name || "User"}
              </h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                <Mail size={14} strokeWidth={1.5} />
                {user?.email || "No email"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--border-light)] hover:text-[var(--text)]"
          >
            <LogOut size={16} strokeWidth={1.8} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Order History */}
      <div className="mt-10">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-[var(--text)]">
          Order History
        </h2>

        {ordersLoading ? (
          <div className="mt-6 animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 rounded-[var(--radius-md)] bg-[var(--border-light)]"
              />
            ))}
          </div>
        ) : ordersError ? (
          <p className="mt-6 text-sm text-red-500">{ordersError}</p>
        ) : orders.length === 0 ? (
          <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-sm)]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--border-light)]">
              <Package size={24} strokeWidth={1.5} className="text-[var(--text-muted)]" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-[var(--text)]">
              No orders yet
            </h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Start shopping and your orders will appear here.
            </p>
            <Link
              href="/collections/star-bracelets"
              className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-hover)]"
            >
              <ShoppingBag size={16} strokeWidth={2} />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--border-light)]">
                  <th className="px-6 py-3 font-medium text-[var(--text)]">Order ID</th>
                  <th className="px-6 py-3 font-medium text-[var(--text)]">Date</th>
                  <th className="px-6 py-3 font-medium text-[var(--text)]">Items</th>
                  <th className="px-6 py-3 font-medium text-[var(--text)]">Total</th>
                  <th className="px-6 py-3 font-medium text-[var(--text)]">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const itemCount = order.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  );
                  const itemNames = order.items
                    .map((item) => {
                      const snapshot = item.productSnapshot
                        ? (() => {
                            try {
                              return JSON.parse(item.productSnapshot);
                            } catch {
                              return null;
                            }
                          })()
                        : null;
                      return snapshot?.productName || item.product?.name || "Product";
                    })
                    .join(", ");

                  const statusLabel =
                    order.status === "PAID" || order.status === "COMPLETED"
                      ? "Paid"
                      : order.status === "SHIPPED"
                        ? "Shipped"
                        : order.status === "CANCELLED"
                          ? "Cancelled"
                          : order.status === "PENDING"
                            ? "Pending"
                            : order.status;

                  const statusColor =
                    order.status === "PAID" || order.status === "COMPLETED" || order.status === "SHIPPED"
                      ? "text-[var(--success)]"
                      : order.status === "CANCELLED"
                        ? "text-[var(--sale)]"
                        : "text-[var(--text-muted)]";

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-[var(--border)] bg-[var(--surface)] transition-colors last:border-b-0 hover:bg-[var(--border-light)]"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-[var(--text-secondary)]">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-[var(--text-secondary)]">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[var(--text-secondary)]">
                          {itemCount} {itemCount === 1 ? "item" : "items"}
                        </span>
                        <span className="ml-2 text-xs text-[var(--text-muted)] line-clamp-2">
                          {itemNames}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-[var(--text)]">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-[var(--radius-sm)] bg-[var(--border-light)] px-2.5 py-0.5 text-xs font-medium ${statusColor}`}
                        >
                          {statusLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
