"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Heart, Home, Compass, User } from "lucide-react";
import { useCartUIStore } from "@/lib/cart";
import { useWishlistStore } from "@/lib/wishlist";

export function MobileBottomNav() {
  const pathname = usePathname();
  const openCart = useCartUIStore((s) => s.openCart);

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/collections/28-mansions", label: "Shop", icon: Compass },
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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0808] border-t border-[var(--border)] safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {links.map((link) => {
          const Icon = link.icon;
          const active = link.href ? isActive(link.href) : false;
          return link.onClick ? (
            <button key={link.label} onClick={link.onClick} className="flex flex-col items-center justify-center gap-0.5 px-3 py-1 text-[var(--text-muted)] hover:text-[var(--accent)] transition">
              <Icon className="w-5 h-5" strokeWidth={1.8} />
              <span className="text-[10px]">{link.label}</span>
            </button>
          ) : (
            <Link key={link.href} href={link.href!} className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 transition ${active ? "text-[var(--accent)]" : "text-[var(--text-muted)] hover:text-[var(--accent)]"}`}>
              <Icon className="w-5 h-5" strokeWidth={1.8} />
              <span className="text-[10px]">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
