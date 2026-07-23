import { Toaster } from "react-hot-toast";
import { Providers } from "@/app/providers";
import { AnnouncementBar } from "./AnnouncementBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import { MobileBottomNav } from "./MobileBottomNav";
import { CookieConsent } from "./CookieConsent";
import { BackToTop } from "./BackToTop";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div data-storefront-chrome="header">
        <AnnouncementBar />
        <Providers>
          <Header />
        </Providers>
      </div>
      <main id="main-content" className="min-h-screen pb-28 lg:pb-0">
        {children}
      </main>
      <div data-storefront-chrome="footer">
        <Footer />
        <CartDrawer />
        <CookieConsent />
        <MobileBottomNav />
        <BackToTop />
      </div>
      <Toaster position="bottom-center" />
    </>
  );
}
