"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { User, ShoppingBag, Heart, Menu, X, ChevronDown } from "lucide-react";
import { useCartStore, useCartUIStore } from "@/lib/cart";
import { useWishlistStore } from "@/lib/wishlist";
import { SearchOverlay } from "./SearchOverlay";

const shopLinks = [
  { label: "Copper Braid Collection", href: "/collections/copper-braid-series" },
  { label: "Golden Luxe Collection", href: "/collections/golden-luxe-series" },
  { label: "Dark Mineral Collection", href: "/collections/dark-mineral-series" },
  { label: "Pearl & Crystal", href: "/collections/pearl-crystal-series" },
  { label: "Curated Singles", href: "/collections/curated-singles" },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "#", children: shopLinks },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const shopTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shopRef = useRef<HTMLDivElement>(null);

  const openShop = () => {
    if (shopTimeout.current) clearTimeout(shopTimeout.current);
    setShopOpen(true);
  };
  const closeShop = () => {
    shopTimeout.current = setTimeout(() => setShopOpen(false), 150);
  };
  const { data: session } = useSession();
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount());
  const openCart = useCartUIStore((s) => s.openCart);
  const wishlistCount = useWishlistStore((s) => s.count());
  const user = session?.user;

  // Cart bounce animation on add
  const [justAdded, setJustAdded] = useState(false);
  const prevCount = useRef(itemCount);
  const bounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (itemCount > prevCount.current) {
      setJustAdded(true);
      if (bounceTimer.current) clearTimeout(bounceTimer.current);
      bounceTimer.current = setTimeout(() => setJustAdded(false), 300);
    }
    prevCount.current = itemCount;
    return () => {
      if (bounceTimer.current) clearTimeout(bounceTimer.current);
    };
  }, [itemCount]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [mobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "#") return shopLinks.some((l) => pathname.startsWith(l.href));
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 h-[72px] bg-[#0A0808]/0">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        {/* Left — Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="MythRealms home"
        >
          {/* Gemstone SVG */}
          <svg
            viewBox="0 0 28 28"
            fill="none"
            aria-hidden="true"
            className="h-7 w-7"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 2L22 10L14 26L6 10L14 2Z"
              fill="var(--accent)"
              fillOpacity="0.9"
            />
            <path
              d="M14 8L18 12L14 20L10 12L14 8Z"
              fill="var(--primary)"
              fillOpacity="0.8"
            />
            <circle cx="14" cy="5" r="1.5" fill="var(--accent)" />
          </svg>

          <span className="font-serif text-[22px] font-semibold tracking-tight text-white">
            MythRealms
          </span>
        </Link>

        {/* Center — Desktop navigation */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.href} ref={shopRef} className="relative" onMouseEnter={openShop} onMouseLeave={closeShop}>
                <button
                  type="button"
                  onClick={() => setShopOpen(!shopOpen)}
                  className={`text-[15px] tracking-wide px-4 py-2 font-medium transition-all inline-flex items-center gap-1 ${
                    shopOpen
                      ? "bg-white text-gray-900"
                      : isActive(link.href) ? "text-white" : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${shopOpen ? "rotate-180" : ""}`} />
                </button>
                {shopOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[560px] max-w-[90vw] bg-white shadow-2xl z-50" style={{borderRadius: 0}}>
                    <div className="grid grid-cols-2 gap-0 p-6">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setShopOpen(false)}
                          className={`block px-4 py-3 text-[14px] transition-colors hover:bg-gray-50 ${
                            pathname.startsWith(child.href) ? "text-[var(--accent)] font-medium" : "text-gray-700"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[15px] tracking-wide px-4 py-2 font-medium transition-all ${
                  isActive(link.href) ? "text-white" : "text-white/80 hover:bg-white hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Right — Icon buttons */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <SearchOverlay />

          {/* Account */}
          <Link
            href="/account"
            aria-label={user ? `${user.name || "My account"} — View account` : "My account — Sign in"}
            className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-white/80 transition-colors hover:bg-white/10 hover:text-white"
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
            className="relative flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-white/80 transition-colors hover:bg-white/10 hover:text-white"
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
            className="relative flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ShoppingBag size={20} strokeWidth={1.8} className={justAdded ? "animate-cart-bounce" : ""} />
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
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-white/80 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
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

      {/* Mobile navigation — full overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A0808] animate-slide-down lg:hidden">
          {/* Top bar with X button */}
          <div className="flex items-center justify-end px-4 h-[72px]">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close navigation menu"
            >
              <X size={28} strokeWidth={1.8} />
            </button>
          </div>

          <nav className="flex flex-col gap-2 px-6 pt-4" aria-label="Mobile navigation">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.href} className="py-2">
                  <div className="px-3 py-2 text-sm font-semibold text-[#B0A590] uppercase tracking-wider">
                    {link.label}
                  </div>
                  {link.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-[var(--radius-sm)] px-6 py-3.5 text-base font-medium text-white transition-colors hover:bg-white/10"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-[var(--radius-sm)] px-3 py-3.5 text-base font-medium text-white transition-colors hover:bg-white/10"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Bottom branding */}
          <div className="absolute bottom-10 left-0 right-0 flex justify-center">
            <span className="font-serif text-lg font-semibold tracking-tight text-white/30">
              MythRealms
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
