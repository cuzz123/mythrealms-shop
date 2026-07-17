"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronDown, Heart, Menu, ShoppingBag, User, X } from "lucide-react";
import { useCartStore, useCartUIStore } from "@/lib/cart";
import { useWishlistStore } from "@/lib/wishlist";
import { SearchOverlay } from "./SearchOverlay";
import { useDialogFocus } from "@/lib/client/use-dialog-focus";

type NavigationLink = { label: string; href: string };
type DesktopMenu = "shop" | "intention" | null;

const shopLinks: NavigationLink[] = [
  { label: "All Pearl Jewelry", href: "/collections/pearl-series" },
  { label: "Pearl Rings", href: "/collections/pearl-series?type=rings" },
  { label: "Pearl Bracelets", href: "/collections/pearl-series?type=bracelets" },
  { label: "Pearl Earrings", href: "/collections/pearl-series?type=earrings" },
  { label: "Pearl Necklaces", href: "/collections/pearl-series?type=necklaces" },
  { label: "Pearl Eyewear Chains", href: "/collections/pearl-series?type=eyewear-chains" },
];

const intentionLinks: NavigationLink[] = [
  { label: "Find Your Guardian", href: "/guardian-quiz" },
  { label: "Pearl Guide", href: "/pearls" },
  { label: "Everyday Pearl", href: "/collections/pearl-series" },
  { label: "Our Story", href: "/about" },
];

const desktopMenus = [
  { id: "shop" as const, label: "Shop", links: shopLinks },
  { id: "intention" as const, label: "Intention", links: intentionLinks },
];

const navLinks: NavigationLink[] = [
  { label: "Pearls", href: "/collections/pearl-series" },
  { label: "Story", href: "/about" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopMenu, setDesktopMenu] = useState<DesktopMenu>(null);
  const [pendingMenuFocus, setPendingMenuFocus] = useState<DesktopMenu>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const itemCount = useCartStore((state) => state.itemCount());
  const openCart = useCartUIStore((state) => state.openCart);
  const wishlistCount = useWishlistStore((state) => state.count());
  const user = session?.user;
  const isHome = pathname === "/";
  const isOverlay = isHome && !isScrolled;
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileCloseRef = useRef<HTMLButtonElement>(null);
  const desktopNavigationRef = useRef<HTMLElement>(null);
  const menuTriggerRefs = useRef<Record<Exclude<DesktopMenu, null>, HTMLButtonElement | null>>({
    shop: null,
    intention: null,
  });
  const menuPanelRefs = useRef<Record<Exclude<DesktopMenu, null>, HTMLDivElement | null>>({
    shop: null,
    intention: null,
  });

  useDialogFocus({
    isOpen: mobileMenuOpen,
    onClose: () => setMobileMenuOpen(false),
    containerRef: mobileMenuRef,
    initialFocusRef: mobileCloseRef,
  });

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true);
      return;
    }

    const onScroll = () => setIsScrolled(window.scrollY > window.innerHeight * 0.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    setDesktopMenu(null);
    setPendingMenuFocus(null);
  }, [pathname]);

  useEffect(() => {
    if (!desktopMenu) return;

    const closeOnPointerOutside = (event: PointerEvent) => {
      if (!desktopNavigationRef.current?.contains(event.target as Node)) {
        setDesktopMenu(null);
        setPendingMenuFocus(null);
      }
    };

    document.addEventListener("pointerdown", closeOnPointerOutside);
    return () => document.removeEventListener("pointerdown", closeOnPointerOutside);
  }, [desktopMenu]);

  useEffect(() => {
    if (!desktopMenu || pendingMenuFocus !== desktopMenu) return;

    menuPanelRefs.current[desktopMenu]?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    setPendingMenuFocus(null);
  }, [desktopMenu, pendingMenuFocus]);

  const [justAdded, setJustAdded] = useState(false);
  const previousItemCount = useRef(itemCount);
  const bounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (itemCount > previousItemCount.current) {
      setJustAdded(true);
      if (bounceTimer.current) clearTimeout(bounceTimer.current);
      bounceTimer.current = setTimeout(() => setJustAdded(false), 300);
    }
    previousItemCount.current = itemCount;
    return () => {
      if (bounceTimer.current) clearTimeout(bounceTimer.current);
    };
  }, [itemCount]);

  const isActive = (links: NavigationLink[]) =>
    links.some((link) => pathname.startsWith(link.href.split("?")[0]));

  const closeDesktopMenu = (restoreFocus = false) => {
    const menuToClose = desktopMenu;
    setDesktopMenu(null);
    setPendingMenuFocus(null);
    if (restoreFocus && menuToClose) {
      window.requestAnimationFrame(() => menuTriggerRefs.current[menuToClose]?.focus());
    }
  };

  const openMenuAndFocusFirstItem = (menu: Exclude<DesktopMenu, null>) => {
    setDesktopMenu(menu);
    setPendingMenuFocus(menu);
  };

  const overlayControlClass = isOverlay
    ? "text-white hover:bg-white/15 hover:text-white"
    : "text-[var(--text-secondary)] hover:bg-[var(--surface-alt)] hover:text-[var(--text)]";

  return (
    <header
      data-visual-state={isOverlay ? "overlay" : "solid"}
      className={`sticky top-0 left-0 right-0 z-40 h-16 transition-colors duration-200 ${
        isOverlay
          ? "bg-transparent text-white"
          : "bg-[var(--surface)]/95 text-[var(--text)] shadow-sm backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)] focus-visible:ring-offset-2"
          aria-label="MythRealms home"
        >
          <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" className="h-7 w-7" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2L22 10L14 26L6 10L14 2Z" fill="currentColor" fillOpacity="0.92" />
            <path d="M14 8L18 12L14 20L10 12L14 8Z" fill="var(--primary)" fillOpacity="0.9" />
            <circle cx="14" cy="5" r="1.5" fill="currentColor" />
          </svg>
          <span className="font-serif text-[19px] font-semibold tracking-normal sm:text-[22px]">MythRealms</span>
        </Link>

        <nav
          ref={desktopNavigationRef}
          className="hidden items-center gap-1 lg:flex"
          aria-label="Main navigation"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) setDesktopMenu(null);
          }}
        >
          {desktopMenus.map((menu) => {
            const isOpen = desktopMenu === menu.id;
            return (
              <div key={menu.id} className="relative">
                <button
                  ref={(element) => {
                    menuTriggerRefs.current[menu.id] = element;
                  }}
                  type="button"
                  aria-label={`${menu.label} menu`}
                  aria-controls={`${menu.id}-menu`}
                  aria-expanded={isOpen}
                  aria-haspopup="menu"
                  onClick={() => setDesktopMenu((current) => (current === menu.id ? null : menu.id))}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      event.preventDefault();
                      closeDesktopMenu(true);
                    }
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      openMenuAndFocusFirstItem(menu.id);
                    }
                  }}
                  className={`inline-flex items-center gap-1 px-3 py-2.5 text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)] focus-visible:ring-offset-2 ${
                    isOverlay
                      ? "text-white hover:bg-white/15"
                      : isActive(menu.links)
                        ? "text-[var(--text)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface-alt)] hover:text-[var(--text)]"
                  }`}
                >
                  <span className="nav-underline inline-block">{menu.label}</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div
                    ref={(element) => {
                      menuPanelRefs.current[menu.id] = element;
                    }}
                    id={`${menu.id}-menu`}
                    role="menu"
                    aria-label={`${menu.label} links`}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        event.preventDefault();
                        closeDesktopMenu(true);
                      }
                    }}
                    className="absolute left-1/2 top-full z-50 grid w-[440px] max-w-[90vw] -translate-x-1/2 grid-cols-2 bg-[var(--surface)] p-3 text-[var(--text)] shadow-lg animate-slide-down"
                  >
                    {menu.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        role="menuitem"
                        onClick={() => setDesktopMenu(null)}
                        className={`px-4 py-3 text-[14px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--muted-blue)] hover:bg-[var(--surface-alt)] ${
                          pathname.startsWith(link.href.split("?")[0]) ? "font-medium text-[var(--accent)]" : "text-[var(--text)]"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2.5 text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)] focus-visible:ring-offset-2 ${
                isOverlay
                  ? "text-white hover:bg-white/15"
                  : isActive([link])
                    ? "text-[var(--text)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-alt)] hover:text-[var(--text)]"
              }`}
            >
              <span className="nav-underline inline-block">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <SearchOverlay isScrolled={!isOverlay} />
          <Link
            href="/account"
            aria-label={user ? `${user.name || "My account"} - View account` : "My account - Sign in"}
            title="My account"
            className={`hidden h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)] focus-visible:ring-offset-2 sm:flex ${overlayControlClass}`}
          >
            {user?.image ? (
              <img src={user.image} alt={user.name || "User"} className="h-5 w-5 rounded-full object-cover" />
            ) : (
              <User size={20} strokeWidth={1.8} />
            )}
          </Link>
          <Link
            href="/wishlist"
            aria-label={`Wishlist, ${wishlistCount} items`}
            title="Wishlist"
            className={`relative hidden h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)] focus-visible:ring-offset-2 sm:flex ${overlayControlClass}`}
          >
            <Heart size={20} strokeWidth={1.8} />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--sale)] px-1 text-[10px] font-semibold leading-none text-white">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={openCart}
            aria-label={`Shopping cart, ${itemCount} items`}
            title="Shopping cart"
            className={`relative flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)] focus-visible:ring-offset-2 ${overlayControlClass}`}
          >
            <ShoppingBag size={20} strokeWidth={1.8} className={justAdded ? "cart-slide-up" : ""} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--primary)] px-1 text-[10px] font-semibold leading-none text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            className={`ml-1 flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)] focus-visible:ring-offset-2 lg:hidden ${overlayControlClass}`}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            title={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? <X size={24} strokeWidth={1.8} /> : <Menu size={24} strokeWidth={1.8} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-50 bg-[var(--surface)] text-[var(--text)] animate-slide-down lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex h-[72px] items-center justify-end px-4">
            <button
              ref={mobileCloseRef}
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-alt)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)]"
              aria-label="Close navigation menu"
              title="Close navigation menu"
            >
              <X size={28} strokeWidth={1.8} />
            </button>
          </div>

          <nav className="flex flex-col gap-2 px-6 pt-4" aria-label="Mobile navigation">
            {desktopMenus.map((menu) => (
              <div key={menu.id} className="py-2">
                <div className="px-3 py-2 text-sm font-semibold uppercase tracking-normal text-[var(--text-muted)]">{menu.label}</div>
                {menu.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-[var(--radius-sm)] px-6 py-3.5 text-base font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface-alt)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--muted-blue)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-[var(--radius-sm)] px-3 py-3.5 text-base font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface-alt)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--muted-blue)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-10 left-0 right-0 flex justify-center">
            <span className="font-serif text-lg font-semibold tracking-normal text-[var(--text-muted)]">MythRealms</span>
          </div>
        </div>
      )}
    </header>
  );
}
