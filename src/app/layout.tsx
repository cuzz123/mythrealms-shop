import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Providers } from "./providers";
import { Analytics } from "@/components/layout/Analytics";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { OrganizationJsonLd } from "@/components/ui/JsonLd";
import { BackToTop } from "@/components/layout/BackToTop";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://mythrealms-shop.vercel.app"),
  title: "MythRealms — Natural Stone Bracelets, Curated for the Modern Mystic",
  description: "Hand-selected crystal bracelets. Amethyst, rose quartz, black obsidian, moonstone, and tiger's eye. Artisan finishes. Pieces that feel like they've always belonged to you.",
  keywords: ["natural stone bracelets", "crystal bracelets", "amethyst", "rose quartz", "black obsidian", "moonstone", "tigers eye", "gemstone jewelry"],
  verification: {
    google: "uBe2lk1CCRJxdUU4b1HoJkR9KbnKodSifkNbU1XtLgs",
  },
  other: {
    "p:domain_verify": "f7403d777d8595e4acf712c703023325",
  },
  openGraph: {
    title: "MythRealms — Natural Stone Bracelets, Curated for the Modern Mystic",
    description: "Hand-selected crystal bracelets. Artisan finishes. Pieces that feel like they've always belonged to you.",
    type: "website",
    siteName: "MythRealms",
  },
  twitter: {
    card: "summary_large_image",
    title: "MythRealms — Natural Stone Bracelets, Curated for the Modern Mystic",
    description: "Hand-selected crystal bracelets. Artisan finishes. Pieces that feel like they've always belonged to you.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <OrganizationJsonLd />
      </head>
      <body className="antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--accent)] focus:text-white focus:rounded">Skip to main content</a>
        <Analytics />
        <Providers>
          <AnnouncementBar />
          <Header />
          <main
            id="main-content"
            className="min-h-screen pb-14 lg:pb-0"
            style={{ paddingBottom: "calc(3.5rem + env(safe-area-inset-bottom, 0px))" }}
          >
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <CookieConsent />
          <MobileBottomNav />
          <BackToTop />
          <Toaster position="bottom-center" />
        </Providers>
      </body>
    </html>
  );
}
