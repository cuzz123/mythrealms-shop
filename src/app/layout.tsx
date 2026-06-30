import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Providers } from "./providers";
import { Analytics } from "@/components/layout/Analytics";
import { OrganizationJsonLd } from "@/components/ui/JsonLd";
import { BackToTop } from "@/components/layout/BackToTop";

// Lazy-load non-critical components to reduce initial JS bundle
const CookieConsent = dynamic(() => import("@/components/layout/CookieConsent").then(m => ({ default: m.CookieConsent })), { ssr: false });
const SocialProof = dynamic(() => import("@/components/ui/SocialProof").then(m => ({ default: m.SocialProof })), { ssr: false });
const MobileBottomNav = dynamic(() => import("@/components/layout/MobileBottomNav").then(m => ({ default: m.MobileBottomNav })), { ssr: false });

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
  title: "MythRealms — Stones With Intention. Wear Your Becoming.",
  description: "Intention-based crystal and pearl jewelry. Protection, clarity, love, abundance — each stone holds a purpose. Hand-selected. Artisan-finished. Wear your becoming.",
  keywords: ["intention bracelet", "crystal healing bracelet", "spiritual wellness jewelry", "protection bracelet", "self-love jewelry", "gemstone bracelet", "pearl bracelet", "amethyst", "rose quartz", "black obsidian", "moonstone", "tigers eye"],
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
    title: "MythRealms — Stones With Intention. Wear Your Becoming.",
    description: "Intention-based crystal and pearl jewelry. Protection, clarity, love, abundance — each stone holds a purpose. Hand-selected. Artisan-finished. Wear your becoming.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    type: "website",
    siteName: "MythRealms",
    images: [{ url: `${process.env.NEXT_PUBLIC_APP_URL}/images/1688-hero/轮播图1.webp`, width: 1792, height: 1008 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MythRealms — Stones With Intention. Wear Your Becoming.",
    description: "Intention-based crystal and pearl jewelry. Protection, clarity, love, abundance — each stone holds a purpose. Hand-selected. Artisan-finished. Wear your becoming.",
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/images/1688-hero/轮播图1.webp`],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: process.env.NEXT_PUBLIC_APP_URL },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <link rel="preload" as="image" href="/images/1688-hero/轮播图1.webp" fetchPriority="high" />
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
            className="min-h-screen pb-28 lg:pb-0"
          >
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <CookieConsent />
          <SocialProof />
          <MobileBottomNav />
          <BackToTop />
          <Toaster position="bottom-center" />
        </Providers>
      </body>
    </html>
  );
}
