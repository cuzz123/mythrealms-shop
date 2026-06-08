import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-8">Orders</h1>
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-light)] text-left bg-[var(--bg)]">
              <th className="py-3 px-4 font-semibold">Order</th>
              <th className="py-3 px-4 font-semibold">Customer</th>
              <th className="py-3 px-4 font-semibold">Items</th>
              <th className="py-3 px-4 font-semibold">Total</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b border-[var(--border-light)]">
                <td className="py-3 px-4 font-mono text-xs">#{order.id.slice(-8)}</td>
                <td className="py-3 px-4">{order.email}</td>
                <td className="py-3 px-4">{order.items.length}</td>
                <td className="py-3 px-4 font-medium">${Number(order.total).toFixed(2)}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status==='PAID'?'bg-green-100 text-green-700':order.status==='PENDING'?'bg-yellow-100 text-yellow-700':order.status==='SHIPPED'?'bg-blue-100 text-blue-700':order.status==='CANCELLED'?'bg-red-100 text-red-700':'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-[var(--text-muted)]">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-center py-12 text-[var(--text-muted)]">No orders yet.</p>}
      </div>
    </div>
  );
}
