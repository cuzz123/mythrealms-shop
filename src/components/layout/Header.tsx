"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { User, ShoppingBag, Heart, Menu, X, ChevronDown } from "lucide-react";
import { useCartStore, useCartUIStore } from "@/lib/cart";
import { useWishlistStore } from "@/lib/wishlist";
import { SearchOverlay } from "./SearchOverlay";
import { useDialogFocus } from "@/lib/client/use-dialog-focus";

const shopLinks = [
  { label: "All Pearl Jewelry", href: "/collections/pearl-series" },
  { label: "Pearl Rings", href: "/collections/pearl-series?type=rings" },
  { label: "Pearl Bracelets", href: "/collections/pearl-series?type=bracelets" },
  { label: "Pearl Earrings", href: "/collections/pearl-series?type=earrings" },
  { label: "Pearl Necklaces", href: "/collections/pearl-series?type=necklaces" },
  { label: "Pearl Eyewear Chains", href: "/collections/pearl-series?type=eyewear-chains" },
];

const navLinks = [
  { label: "Shop", href: "#", children: shopLinks },
  { label: "Pearls", href: "/collections/pearl-series" },
  { label: "Story", href: "/about" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount());
  const openCart = useCartUIStore((s) => s.openCart);
  const wishlistCount = useWishlistStore((s) => s.count());
  const user = session?.user;
  const isHome = pathname === "/";
  const useLightHeader = isHome || isScrolled;
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileCloseRef = useRef<HTMLButtonElement>(null);

  useDialogFocus({
    isOpen: mobileMenuOpen,
    onClose: () => setMobileMenuOpen(false),
    containerRef: mobileMenuRef,
    initialFocusRef: mobileCloseRef,
  });

  // Scroll detection
  useEffect(() => {
    if (!isHome) { setIsScrolled(true); return; }
    const onScroll = () => setIsScrolled(window.scrollY > window.innerHeight * 0.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

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

  const isActive = (link: (typeof navLinks)[number]) => {
    if (link.href === "/") return pathname === "/";
    if (link.children) return link.children.some((child) => pathname.startsWith(child.href));
    return pathname.startsWith(link.href);
  };

  const headerBg = "sticky top-0 bg-[var(--bg)]/95 text-[var(--text)] shadow-sm backdrop-blur-md";

  return (
    <header
      className={`${headerBg} left-0 right-0 z-40 h-[64px] transition-all duration-300`}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left — Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="MythRealms home"
        >
          {/* Brand mark */}
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

          <span className="font-serif text-[19px] font-semibold tracking-tight text-[var(--text)] sm:text-[22px]">
            MythRealms
          </span>
        </Link>

        {/* Center — Desktop navigation */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navLinks.map((link) => {
            return link.children ? (
              <details key={link.label} name="desktop-navigation" className="group relative">
                <summary
                  className={`inline-flex cursor-pointer list-none items-center gap-1 px-3 py-2.5 text-[15px] font-medium tracking-wide transition-all [&::-webkit-details-marker]:hidden ${
                    isActive(link) ? "text-[var(--text)]" : "text-[var(--text-secondary)] hover:text-[var(--text)]"
                  } group-open:bg-[var(--surface-alt)] group-open:text-[var(--text)]`}
                >
                  <span className="nav-underline inline-block">{link.label}</span>
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
                </summary>
                <div className="absolute left-1/2 top-full z-50 w-[440px] max-w-[90vw] -translate-x-1/2 bg-[var(--surface)] shadow-lg animate-slide-down" style={{ borderRadius: 0 }}>
                  <div className="grid grid-cols-2 gap-0 p-6">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className={`block px-4 py-3 text-[14px] transition-colors hover:bg-[var(--surface-alt)] ${
                          pathname.startsWith(child.href) ? "text-[var(--accent)] font-medium" : "text-[var(--text)]"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </details>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[15px] tracking-wide px-3 py-2.5 font-medium transition-all ${
                  isActive(link) ? "text-[var(--text)]" : "text-[var(--text-secondary)] hover:text-[var(--text)]"
                }`}
              >
                <span className="nav-underline inline-block">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right — Icon buttons */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <SearchOverlay isScrolled={useLightHeader} />

          {/* Account */}
          <Link
            href="/account"
            aria-label={user ? `${user.name || "My account"} - View account` : "My account - Sign in"}
            className="hidden h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-alt)] hover:text-[var(--text)] sm:flex"
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
            className="relative hidden h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-alt)] hover:text-[var(--text)] sm:flex"
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
            className="relative flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-alt)] hover:text-[var(--text)]"
          >
            <ShoppingBag size={20} strokeWidth={1.8} className={justAdded ? "cart-slide-up" : ""} />
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
            className="ml-1 flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-alt)] hover:text-[var(--text)] lg:hidden"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X size={24} strokeWidth={1.8} />
            ) : (
              <Menu size={24} strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation — full overlay */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-50 bg-[var(--surface)] animate-slide-down lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Top bar with X button */}
          <div className="flex items-center justify-end px-4 h-[72px]">
            <button
              ref={mobileCloseRef}
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-alt)] hover:text-[var(--text)]"
              aria-label="Close navigation menu"
            >
              <X size={28} strokeWidth={1.8} />
            </button>
          </div>

          <nav className="flex flex-col gap-2 px-6 pt-4" aria-label="Mobile navigation">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="py-2">
                  <div className="px-3 py-2 text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    {link.label}
                  </div>
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-[var(--radius-sm)] px-6 py-3.5 text-base font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface-alt)]"
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
                  className="rounded-[var(--radius-sm)] px-3 py-3.5 text-base font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface-alt)]"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Bottom branding */}
          <div className="absolute bottom-10 left-0 right-0 flex justify-center">
            <span className="font-serif text-lg font-semibold tracking-tight text-[var(--text-muted)]">
              MythRealms
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
