import Link from "next/link";
import type { Metadata } from "next";

import { BRAND } from "@/lib/brand-identity";
import { absoluteUrl } from "@/lib/site";

const supportEmail = process.env.SUPPORT_EMAIL?.trim() || "support@maverenne.invalid";

export const metadata: Metadata = {
  title: `Shipping Information — ${BRAND.name}`,
  description: `Current shipping information for ${BRAND.name} orders.`,
  alternates: { canonical: absoluteUrl("/shipping") },
};

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <nav className="mb-8 flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <Link href="/" className="transition hover:text-[var(--text)]">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Shipping Information</span>
      </nav>
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">{BRAND.name}</p>
      <h1 className="mb-4 font-serif text-4xl font-bold">Shipping Information</h1>
      <div className="space-y-6 leading-relaxed text-[var(--text-secondary)]">
        <p>Shipping availability, cost, and any estimated timing must be confirmed for the destination and order.</p>
        <p className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 font-medium text-[var(--text)]">
          See the current policy page for confirmed details.
        </p>
        <p>
          If checkout does not state the detail you need, contact us before ordering at{" "}
          <a href={`mailto:${supportEmail}`} className="text-[var(--accent)] hover:underline">{supportEmail}</a>.
        </p>
        <p>If a detail is not stated on the relevant product or policy page, it is not confirmed.</p>
      </div>
    </div>
  );
}
