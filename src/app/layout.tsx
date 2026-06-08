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
import { CookieConsent } from "@/components/layout/CookieConsent";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MythRealms — Ancient Beasts & Chinese Constellations",
  description: "Jewelry inspired by the Classic of Mountains and Seas. Nine-Tailed Fox, Qilin, Azure Dragon. Where ancient myths come alive.",
  keywords: ["shan hai jing", "mythical beasts", "chinese constellations", "nine-tailed fox", "qilin"],
  openGraph: {
    title: "MythRealms — Ancient Beasts & Chinese Constellations",
    description: "Jewelry inspired by China's oldest book of legends. 2000 years before Tolkien, there was the Classic of Mountains and Seas.",
    type: "website",
    siteName: "MythRealms",
  },
  twitter: {
    card: "summary_large_image",
    title: "MythRealms — Ancient Beasts & Chinese Constellations",
    description: "Jewelry inspired by China's oldest book of legends.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--accent)] focus:text-white focus:rounded">Skip to main content</a>
        <Analytics />
        <Providers>
          <AnnouncementBar />
          <Header />
          <main id="main-content" className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
          <CookieConsent />
          <Toaster position="bottom-center" />
        </Providers>
      </body>
    </html>
  );
}
