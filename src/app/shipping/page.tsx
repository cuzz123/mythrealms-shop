import Link from "next/link";
import type { Metadata } from "next";

import { BRAND } from "@/lib/brand-identity";
import { absoluteUrl } from "@/lib/site";
import { MERCHANT_FACTS } from "@/lib/storefront/merchant";
import { STORE_POLICY_FACTS } from "@/lib/storefront/policies";

export const metadata: Metadata = {
  title: `Shipping Information — ${BRAND.name}`,
  description: `Current shipping information for ${BRAND.name} orders.`,
  alternates: { canonical: absoluteUrl("/shipping") },
};

export default function ShippingPage() {
  const {
    freeShippingThresholdUsd,
    standardShippingFlatRateUsd,
    handlingBusinessDays,
    usStandardTransitBusinessDays,
  } = STORE_POLICY_FACTS;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <nav className="mb-8 flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <Link href="/" className="transition hover:text-[var(--text)]">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Shipping Information</span>
      </nav>
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">{BRAND.name}</p>
      <h1 className="mb-4 font-serif text-4xl font-bold">Shipping Information</h1>
      <div className="space-y-8 leading-relaxed text-[var(--text-secondary)]">
        <section>
          <h2 className="mb-3 font-serif text-2xl font-bold text-[var(--text)]">Where we ship</h2>
          <p>
            We currently ship to eligible addresses in the United States. Destination
            availability is confirmed during checkout.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl font-bold text-[var(--text)]">Shipping cost</h2>
          <p>
            Standard shipping costs ${standardShippingFlatRateUsd.toFixed(2)} for orders below ${freeShippingThresholdUsd.toFixed(2)}.
            Shipping is free for orders of ${freeShippingThresholdUsd.toFixed(2)} or more.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl font-bold text-[var(--text)]">Estimated timing</h2>
          <p>
            Orders require {handlingBusinessDays.min}–{handlingBusinessDays.max} business days for processing before shipment.
            Standard transit is estimated at {usStandardTransitBusinessDays.min}–{usStandardTransitBusinessDays.max} business days after processing.
            These time ranges are estimates, not guaranteed delivery dates.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl font-bold text-[var(--text)]">How orders are fulfilled</h2>
          <p>
            Maverenne uses supplier-direct fulfillment. An order may be packed and shipped
            directly by a supply partner, while Maverenne remains your point of contact for
            order and policy questions.
          </p>
        </section>
        <section>
          <h2 className="mb-3 font-serif text-2xl font-bold text-[var(--text)]">Questions</h2>
          <p>
            Contact us before ordering at{" "}
            <a href={`mailto:${MERCHANT_FACTS.supportEmail}`} className="text-[var(--accent)] hover:underline">{MERCHANT_FACTS.supportEmail}</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
