"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Heart, Home, Compass, User } from "lucide-react";
import { useCartUIStore } from "@/lib/cart";

export function MobileBottomNav() {
  const pathname = usePathname();
  const openCart = useCartUIStore((s) => s.openCart);

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/collections/pearl-series", label: "Shop", icon: Compass },
    { label: "Cart", icon: ShoppingBag, onClick: () => openCart() },
    { href: "/wishlist", label: "Saved", icon: Heart },
    { href: "/account", label: "Account", icon: User },
  ];

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)]/70 bg-[var(--surface-raised)]/95 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] shadow-[0_-1px_0_rgba(20,18,15,0.04)] backdrop-blur-md lg:hidden">
      <div className="flex h-14 items-center justify-around">
        {links.map((link) => {
          const Icon = link.icon;
          const active = link.href ? isActive(link.href) : false;
          return link.onClick ? (
            <button key={link.label} onClick={link.onClick} className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-[var(--radius-sm)] px-3 py-1 text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-alt)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)]">
              <Icon className="w-5 h-5" strokeWidth={1.8} />
              <span className="text-[10px]">{link.label}</span>
            </button>
          ) : (
            <Link key={link.href} href={link.href!} className={`flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 rounded-[var(--radius-sm)] px-3 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)] ${active ? "text-[var(--accent)]" : "text-[var(--text-muted)] hover:bg-[var(--surface-alt)] hover:text-[var(--accent)]"}`}>
              <Icon className="w-5 h-5" strokeWidth={1.8} />
              <span className="text-[10px]">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
