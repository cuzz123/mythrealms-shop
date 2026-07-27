export type NavigationLink = Readonly<{ label: string; href: string }>;
export type HeaderMenuId = "shop" | "gifts" | "discover";
export type HeaderMenu = Readonly<{
  id: HeaderMenuId;
  label: string;
  links: readonly NavigationLink[];
}>;
export type FooterGroup = Readonly<{
  label: string;
  links: readonly NavigationLink[];
}>;

export const HEADER_MENUS: readonly HeaderMenu[] = [] as const;

export const HEADER_LINKS = [
  { label: "New", href: "/collections/new-arrivals" },
  { label: "Jewelry", href: "/collections" },
  { label: "The Pearl Edit", href: "/collections/pearl-series" },
  { label: "Gifts", href: "/gifts" },
  { label: "Journal", href: "/blog" },
  { label: "About", href: "/about" },
] as const;

export const FOOTER_GROUPS: readonly FooterGroup[] = [
  {
    label: "Shop",
    links: [
      { label: "The Pearl Edit", href: "/collections/pearl-series" },
      { label: "New Arrivals", href: "/collections/new-arrivals" },
      { label: "Pearl Earrings", href: "/collections/pearl-series?type=earrings" },
      { label: "Pearl Necklaces", href: "/collections/pearl-series?type=necklaces" },
      { label: "Pearl Bracelets", href: "/collections/pearl-series?type=bracelets" },
      { label: "Pearl Rings", href: "/collections/pearl-series?type=rings" },
      { label: "Pearl Eyewear Chains", href: "/collections/pearl-series?type=eyewear-chains" },
    ],
  },
  {
    label: "Learn",
    links: [
      { label: "Pearl Guide", href: "/pearls" },
      { label: "Pearl Care", href: "/pearls/care" },
      { label: "Pearl Stories", href: "/pearls/stories" },
      { label: "Pearl Symbolism", href: "/pearls/symbolism" },
      { label: "How to Wear Pearls", href: "/pearls/how-to-wear" },
      { label: "Freshwater Pearls", href: "/pearls/freshwater-pearls" },
      { label: "FAQs", href: "/faq" },
    ],
  },
  {
    label: "About",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    label: "Help",
    links: [
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Refund Policy", href: "/refund" },
      { label: "Track Order", href: "/track-order" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
] as const;
