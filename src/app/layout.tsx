import type { Metadata } from "next";
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
import { SocialProof } from "@/components/ui/SocialProof";

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
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/images/1688-hero-mobile/手机hero1.webp" fetchPriority="high" media="(max-width: 767px)" />
        <link rel="preload" as="image" href="/images/1688-hero/轮播图1.webp" fetchPriority="high" media="(min-width: 768px)" />
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
