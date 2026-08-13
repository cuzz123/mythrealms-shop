import type { Metadata } from "next";
import { BRAND } from "@/lib/brand-identity";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: `Contact ${BRAND.name}`,
  description: `Contact ${BRAND.name} customer support for help with an order, product, or general question.`,
  alternates: { canonical: absoluteUrl("/contact") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/contact"),
    title: `Contact ${BRAND.name}`,
    description: `Get in touch with ${BRAND.name} customer support.`,
  },
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
