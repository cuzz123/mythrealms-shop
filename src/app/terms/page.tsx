import Link from "next/link";
import type { Metadata } from "next";

import { BRAND } from "@/lib/brand-identity";
import { absoluteUrl } from "@/lib/site";

const supportEmail = process.env.SUPPORT_EMAIL?.trim() || "support@maverenne.invalid";

export const metadata: Metadata = {
  title: `Terms of Service — ${BRAND.name}`,
  description: `Terms for using the ${BRAND.name} store.`,
  alternates: { canonical: absoluteUrl("/terms") },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <nav className="mb-8 flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <Link href="/" className="transition hover:text-[var(--text)]">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Terms of Service</span>
      </nav>
      <h1 className="mb-3 font-serif text-4xl font-bold">Terms of Service</h1>
      <p className="mb-10 text-sm text-[var(--text-muted)]">{BRAND.name}</p>
      <div className="space-y-8 leading-relaxed text-[var(--text-secondary)]">
        <section>
          <h2 className="mb-3 font-serif text-2xl font-bold text-[var(--text)]">Using the store</h2>
          <p>Use the site lawfully and provide accurate information when creating an account, contacting support, or placing an order.</p>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl font-bold text-[var(--text)]">Orders and payment</h2>
          <p>The item details and totals shown during checkout are the information presented for that order. Payments are completed through PayPal.</p>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl font-bold text-[var(--text)]">Shipping, refunds, and returns</h2>
          <p>See the current policy page for confirmed details.</p>
          <p className="mt-2"><Link href="/shipping" className="text-[var(--accent)] hover:underline">Shipping Information</Link>{" · "}<Link href="/refund" className="text-[var(--accent)] hover:underline">Refund &amp; Return Policy</Link></p>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl font-bold text-[var(--text)]">Site content</h2>
          <p>The site content and presentation may not be copied or represented as your own without permission.</p>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl font-bold text-[var(--text)]">Contact</h2>
          <p>Questions about these terms can be sent to <a href={`mailto:${supportEmail}`} className="text-[var(--accent)] hover:underline">{supportEmail}</a>.</p>
        </section>
        <p>If a detail is not stated on the relevant product or policy page, it is not confirmed.</p>
      </div>
    </div>
  );
}
