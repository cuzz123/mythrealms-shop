import Link from "next/link";
import type { Metadata } from "next";

import { BRAND } from "@/lib/brand-identity";
import { absoluteUrl } from "@/lib/site";

const supportEmail = process.env.SUPPORT_EMAIL?.trim() || "support@maverenne.invalid";

export const metadata: Metadata = {
  title: `Privacy Policy — ${BRAND.name}`,
  description: `How ${BRAND.name} handles information provided through the store.`,
  alternates: { canonical: absoluteUrl("/privacy") },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <nav className="mb-8 flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <Link href="/" className="transition hover:text-[var(--text)]">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Privacy Policy</span>
      </nav>
      <h1 className="mb-3 font-serif text-4xl font-bold">Privacy Policy</h1>
      <p className="mb-10 text-sm text-[var(--text-muted)]">{BRAND.name}</p>
      <div className="space-y-8 leading-relaxed text-[var(--text-secondary)]">
        <section>
          <h2 className="mb-3 font-serif text-2xl font-bold text-[var(--text)]">Information you provide</h2>
          <p>We process information you submit when you place an order, create an account, subscribe, or contact us so we can provide the requested store function.</p>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl font-bold text-[var(--text)]">Payments and service providers</h2>
          <p>Payment credentials are handled by PayPal and are not stored by {BRAND.name}. Other service providers may process only the information needed to operate hosting, communications, analytics selected through consent, and order support.</p>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl font-bold text-[var(--text)]">Cookies and choices</h2>
          <p>Required storage supports core store functions. Optional analytics depends on the consent choice shown on the site.</p>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl font-bold text-[var(--text)]">Questions and requests</h2>
          <p>To ask about your information, contact <a href={`mailto:${supportEmail}`} className="text-[var(--accent)] hover:underline">{supportEmail}</a>. We may need to verify the requester before acting on an account or order.</p>
        </section>
        <p>If a detail is not stated on the relevant product or policy page, it is not confirmed.</p>
      </div>
    </div>
  );
}
