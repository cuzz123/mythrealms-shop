import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@/components/layout/Analytics";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/ui/JsonLd";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { ScrollRevealEnhancer } from "@/components/ui/ScrollRevealEnhancer";
import { absoluteUrl, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "MythRealms | Pearl Jewelry for Everyday Light",
  description: "MythRealms curates pearl earrings, necklaces, bracelets, and rings with an easy, editorial point of view. Explore the Pearl Edit.",
  keywords: ["pearl jewelry", "pearl earrings", "pearl necklace", "pearl bracelet", "pearl ring", "freshwater pearl jewelry", "everyday pearl jewelry", "baroque pearl jewelry"],
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
  verification: {
    google: "uBe2lk1CCRJxdUU4b1HoJkR9KbnKodSifkNbU1XtLgs",
  },
  other: {
    "p:domain_verify": "f7403d777d8595e4acf712c703023325",
  },
  openGraph: {
    title: "MythRealms | Pearl Jewelry for Everyday Light",
    description: "Pearl earrings, necklaces, bracelets, and rings with an easy, editorial point of view.",
    type: "website",
    siteName: "MythRealms",
    images: [{ url: absoluteUrl("/images/brand/hero/pearl-earrings-editorial.png"), width: 1024, height: 1024, alt: "MythRealms pearl jewelry" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MythRealms | Pearl Jewelry for Everyday Light",
    description: "Pearl earrings, necklaces, bracelets, and rings with an easy, editorial point of view.",
    images: [absoluteUrl("/images/brand/hero/pearl-earrings-editorial.png")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className="antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--accent)] focus:text-white focus:rounded">Skip to main content</a>
        <Analytics />
        <ScrollRevealEnhancer />
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
