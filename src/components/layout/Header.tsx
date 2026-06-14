"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { User, ShoppingBag, Heart, Menu, X } from "lucide-react";
import { useCartStore, useCartUIStore } from "@/lib/cart";
import { useWishlistStore } from "@/lib/wishlist";
import { SearchOverlay } from "./SearchOverlay";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "28 Mansions", href: "/collections/28-mansions" },
  { label: "Elements", href: "/collections/five-elements" },
  { label: "Moon", href: "/collections/moon-phases" },
  { label: "Pearls", href: "/collections/ocean-pearls" },
  { label: "Quiz", href: "/guardian-quiz" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount());
  const openCart = useCartUIStore((s) => s.openCart);
  const wishlistCount = useWishlistStore((s) => s.count());
  const user = session?.user;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 h-[72px] border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        {/* Left — Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="MythRealms home"
        >
          {/* Dragon scale / flame SVG */}
          <svg
            viewBox="0 0 28 28"
            fill="none"
            aria-hidden="true"
            className="h-7 w-7"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 2C14 2 18 8 18 13C18 15.5 17 17 15 18.5L20 22L16 24L14 26L12 24L8 22L13 18.5C11 17 10 15.5 10 13C10 8 14 2 14 2Z"
              fill="var(--accent)"
              fillOpacity="0.7"
            />
            <path
              d="M14 6C14 6 16 10 16 13C16 14.5 15.5 15.5 14.5 16.5L17 19L14 20.5L11 19L13.5 16.5C12.5 15.5 12 14.5 12 13C12 10 14 6 14 6Z"
              fill="var(--primary)"
              fillOpacity="0.6"
            />
            <circle cx="14" cy="9" r="1.5" fill="var(--accent)" />
          </svg>

          <span className="font-serif text-xl font-semibold tracking-tight text-[var(--text)]">
            MythRealms
          </span>
        </Link>

        {/* Center — Desktop navigation */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--border-light)] hover:text-[var(--text)] ${
                isActive(link.href) ? "text-[var(--accent)] bg-[var(--accent)]/10" : "text-[var(--text-secondary)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right — Icon buttons */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <SearchOverlay />

          {/* Account */}
          <Link
            href="/account"
            aria-label={user ? `${user.name || "My account"} — View account` : "My account — Sign in"}
            className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--border-light)] hover:text-[var(--text)]"
          >
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="h-5 w-5 rounded-full object-cover"
              />
            ) : (
              <User size={20} strokeWidth={1.8} />
            )}
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            aria-label={`Wishlist, ${wishlistCount} items`}
            className="relative flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--border-light)] hover:text-[var(--sale)]"
          >
            <Heart size={20} strokeWidth={1.8} />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--sale)] px-1 text-[10px] font-semibold leading-none text-white">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart with badge */}
          <button
            type="button"
            onClick={openCart}
            aria-label={`Shopping cart, ${itemCount} items`}
            className="relative flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--border-light)] hover:text-[var(--text)]"
          >
            <ShoppingBag size={20} strokeWidth={1.8} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--primary)] px-1 text-[10px] font-semibold leading-none text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--border-light)] hover:text-[var(--text)] lg:hidden"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X size={22} strokeWidth={1.8} />
            ) : (
              <Menu size={22} strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation dropdown */}
      {mobileMenuOpen && (
        <div className="animate-fade-in border-b border-[var(--border)] bg-[var(--surface)] lg:hidden">
          <nav
            className="flex flex-col gap-0.5 px-4 py-3"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-[var(--radius-sm)] px-3 py-3 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--border-light)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
