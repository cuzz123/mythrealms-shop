import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | MythRealms",
  description: "Answers about MythRealms shipping, international delivery, returns, jewelry care, orders, and payments.",
  alternates: { canonical: absoluteUrl("/faq") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/faq"),
    title: "Frequently Asked Questions | MythRealms",
    description: "Shipping, returns, jewelry care, and ordering answers from MythRealms.",
  },
};

export default function FaqLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
