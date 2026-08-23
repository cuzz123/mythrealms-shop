import type { Metadata } from "next";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Frequently Asked Questions | ${SITE_NAME}`,
  description: `Answers about ${SITE_NAME} shipping, international delivery, returns, jewelry care, orders, and payments.`,
  alternates: { canonical: absoluteUrl("/faq") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/faq"),
    title: `Frequently Asked Questions | ${SITE_NAME}`,
    description: `Shipping, returns, jewelry care, and ordering answers from ${SITE_NAME}.`,
  },
};

export default function FaqLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
