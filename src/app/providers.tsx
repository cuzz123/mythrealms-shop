"use client";

import { SessionProvider } from "next-auth/react";
import { FirstOrderInvitation } from "@/components/growth/FirstOrderInvitation";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <FirstOrderInvitation campaignCode={process.env.NEXT_PUBLIC_FIRST_ORDER_CODE} />
    </SessionProvider>
  );
}
