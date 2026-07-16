"use client";

import {
  Activity,
  ChevronLeft,
  ClipboardList,
  FileText,
  Image,
  LayoutDashboard,
  Package,
  Search,
  ShoppingCart,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: Image, label: "Assets", href: "/admin/assets" },
  { icon: ClipboardList, label: "Ops Tasks", href: "/admin/social-tasks" },
  { icon: Activity, label: "运营中枢", href: "/admin/operations" },
  { icon: FileText, label: "Blog", href: "/admin/blog" },
  { icon: Search, label: "SEO", href: "/admin/seo" },
  { icon: Tag, label: "Discounts", href: "/admin/discounts" },
];

function isActive(pathname: string, href: string): boolean {
  return pathname === href || (href !== "/admin" && pathname.startsWith(href));
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-[#0A0808] text-white flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="font-serif text-xl font-bold">
            MythRealms
          </Link>
          <p className="text-xs text-white/40 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1" aria-label="Admin">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                  active
                    ? "bg-white/15 text-white font-medium"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Store
          </Link>
        </div>
      </aside>

      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0A0808] text-white z-50 flex overflow-x-auto py-3 safe-area-bottom"
        aria-label="Admin"
      >
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-20 flex-1 flex-col items-center gap-1 text-xs ${
                active ? "text-[var(--accent)]" : "text-white/50"
              }`}
            >
              <item.icon className="w-5 h-5" /> {item.label}
            </Link>
          );
        })}
      </nav>

      <main
        className="flex-1 bg-[var(--bg)] p-6 lg:p-10 pb-20 lg:pb-10"
        style={{ paddingBottom: "calc(5rem + env(safe-area-inset-bottom, 0px))" }}
      >
        {children}
      </main>
    </div>
  );
}
