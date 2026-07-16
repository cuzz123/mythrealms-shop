import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact MythRealms",
  description: "Contact MythRealms customer support for help with an order, product, shipping, return, or general question.",
  alternates: { canonical: absoluteUrl("/contact") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/contact"),
    title: "Contact MythRealms",
    description: "Get in touch with MythRealms customer support.",
  },
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
