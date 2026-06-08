import { db } from "@/lib/db";
import { Package, ShoppingCart, FileText, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [productCount, orderCount, postCount, recentOrders] = await Promise.all([
    db.product.count(),
    db.order.count(),
    db.blogPost.count(),
    db.order.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { items: true } }),
  ]);

  const totalRevenue = await db.order.aggregate({
    _sum: { total: true },
    where: { status: "PAID" },
  });

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[
          { icon: Package, label: "Total Products", value: productCount, color: "text-blue-500" },
          { icon: ShoppingCart, label: "Total Orders", value: orderCount, color: "text-green-500" },
          { icon: TrendingUp, label: "Revenue", value: `$${Number(totalRevenue._sum.total || 0).toFixed(2)}`, color: "text-[var(--accent)]" },
          { icon: FileText, label: "Blog Posts", value: postCount, color: "text-purple-500" },
        ].map(stat => (
          <div key={stat.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
            <p className="text-sm text-[var(--text-muted)] mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="font-serif text-xl font-bold mb-4">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-light)] text-left">
                <th className="py-3 font-semibold">Order ID</th>
                <th className="py-3 font-semibold">Items</th>
                <th className="py-3 font-semibold">Total</th>
                <th className="py-3 font-semibold">Status</th>
                <th className="py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="border-b border-[var(--border-light)]">
                  <td className="py-3 font-mono text-xs">{order.id.slice(-8)}</td>
                  <td className="py-3">{order.items.length}</td>
                  <td className="py-3 font-medium">${Number(order.total).toFixed(2)}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status==='PAID'?'bg-green-100 text-green-700':
                      order.status==='PENDING'?'bg-yellow-100 text-yellow-700':
                      order.status==='SHIPPED'?'bg-blue-100 text-blue-700':
                      'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-[var(--text-muted)]">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
