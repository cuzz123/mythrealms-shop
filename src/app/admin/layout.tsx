"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, FileText, LogOut, ChevronLeft } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: FileText, label: "Blog", href: "/admin/blog" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full" /></div>;
  }

  if (!session || (session.user as any)?.role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-[var(--text-muted)] mb-6">You need admin privileges to access this area.</p>
          <Link href="/auth/signin" className="inline-block px-6 py-3 bg-[var(--primary)] text-white rounded-full font-semibold">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A0808] text-white flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="font-serif text-xl font-bold">MythRealms</Link>
          <p className="text-xs text-white/40 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                pathname === item.href ? "bg-white/15 text-white font-medium" : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link href="/" className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition">
            <ChevronLeft className="w-4 h-4" /> Back to Store
          </Link>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0A0808] text-white z-50 flex justify-around py-3">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 text-xs ${pathname===item.href?'text-[var(--accent)]':'text-white/50'}`}>
            <item.icon className="w-5 h-5" /> {item.label}
          </Link>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 bg-[var(--bg)] p-6 lg:p-10 pb-20 lg:pb-10">{children}</main>
    </div>
  );
}
