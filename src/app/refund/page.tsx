import Link from "next/link";
import type { Metadata } from "next";

import { BRAND } from "@/lib/brand-identity";
import { absoluteUrl } from "@/lib/site";
import { MERCHANT_FACTS } from "@/lib/storefront/merchant";
import { STORE_POLICY_FACTS } from "@/lib/storefront/policies";

export const metadata: Metadata = {
  title: `Refund & Return Policy — ${BRAND.name}`,
  description: `Current refund and return information for ${BRAND.name} orders.`,
  alternates: { canonical: absoluteUrl("/refund") },
};

export default function RefundPage() {
  const { returnWindowDays, refundInitiationBusinessDays } = STORE_POLICY_FACTS;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <nav className="mb-8 flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <Link href="/" className="transition hover:text-[var(--text)]">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Refund &amp; Return Policy</span>
      </nav>
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">{BRAND.name}</p>
      <h1 className="mb-4 font-serif text-4xl font-bold">Refund &amp; Return Policy</h1>
      <div className="space-y-8 leading-relaxed text-[var(--text-secondary)]">
        <section>
          <h2 className="mb-3 font-serif text-2xl font-bold text-[var(--text)]">Return window</h2>
          <p>
            Contact us within {returnWindowDays} days after delivery to start a return.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl font-bold text-[var(--text)]">Item condition</h2>
          <p>
            We accept unused or lightly used items. Returned items must be complete and
            must not be damaged beyond ordinary light use.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl font-bold text-[var(--text)]">Before mailing a return</h2>
          <p>
            Contact us before mailing any item. Include your order reference and reason for
            the return. We will provide return authorization and the current return address.
            Items sent without these instructions may not reach the correct return location.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl font-bold text-[var(--text)]">Return shipping costs</h2>
          <p>
            For a change-of-mind return, the customer is responsible for return shipping.
            If the item delivered is defective or is not the item ordered, Maverenne will
            provide return instructions and cover the return shipping cost.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl font-bold text-[var(--text)]">Refunds</h2>
          <p>
            After the returned item is received and inspected, an approved refund is initiated
            to the original payment method within {refundInitiationBusinessDays} business day.
            The payment provider may require additional time to post the refund after we initiate it.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl font-bold text-[var(--text)]">Start a return</h2>
          <p>
            Email your order reference to{" "}
            <a href={`mailto:${MERCHANT_FACTS.supportEmail}`} className="text-[var(--accent)] hover:underline">{MERCHANT_FACTS.supportEmail}</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
