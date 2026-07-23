import type { Metadata } from "next";

import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function AccountLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Providers>{children}</Providers>;
}
