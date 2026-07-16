"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { AnnouncementBar } from "./AnnouncementBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import { MobileBottomNav } from "./MobileBottomNav";
import { CookieConsent } from "./CookieConsent";
import { BackToTop } from "./BackToTop";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");

  return (
    <>
      {!isStudio && <AnnouncementBar />}
      {!isStudio && <Header />}
      <main
        id="main-content"
        className={isStudio ? "" : "min-h-screen pb-28 lg:pb-0"}
      >
        {children}
      </main>
      {!isStudio && <Footer />}
      {!isStudio && <CartDrawer />}
      {!isStudio && <CookieConsent />}
      {!isStudio && <MobileBottomNav />}
      {!isStudio && <BackToTop />}
      <Toaster position="bottom-center" />
    </>
  );
}
