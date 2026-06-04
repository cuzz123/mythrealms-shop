import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Providers } from "./providers";
import { Analytics } from "@/components/layout/Analytics";

export const metadata: Metadata = {
  title: "MythRealms — Ancient Beasts & Chinese Constellations",
  description: "Jewelry inspired by the Classic of Mountains and Seas. Nine-Tailed Fox, Qilin, Azure Dragon. Where ancient myths come alive.",
  keywords: ["shan hai jing", "mythical beasts", "chinese constellations", "nine-tailed fox", "qilin"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/fonts/fonts.css" />
      </head>
      <body className="antialiased"><Analytics />
        <Providers>
          <AnnouncementBar />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster position="bottom-center" />
        </Providers>
      </body>
    </html>
  );
}
