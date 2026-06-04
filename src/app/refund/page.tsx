import Link from "next/link";
import type { Metadata } from "next";
import { RotateCcw, Package, AlertCircle, Gift, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Refund & Return Policy — MythRealms",
  description: "30-day return policy for MythRealms products. Learn about our refund process, return conditions, and how to initiate a return.",
};

export default function RefundPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-8">
        <Link href="/" className="hover:text-[var(--text)] transition">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Refund &amp; Return Policy</span>
      </nav>

      <h1 className="font-serif text-4xl font-bold mb-3">Refund &amp; Return Policy</h1>
      <p className="text-sm text-[var(--text-muted)] mb-10">Last updated: June 1, 2026</p>

      {/* Highlights */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-white border border-[var(--border-light)] rounded-lg p-5 flex gap-4">
          <RotateCcw className="w-6 h-6 text-[var(--accent)] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-[var(--text)] mb-1">30-Day Return Window</h3>
            <p className="text-sm text-[var(--text-muted)]">You have 30 days from the delivery date to initiate a return.</p>
          </div>
        </div>
        <div className="bg-white border border-[var(--border-light)] rounded-lg p-5 flex gap-4">
          <Package className="w-6 h-6 text-[var(--accent)] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-[var(--text)] mb-1">Unused Condition</h3>
            <p className="text-sm text-[var(--text-muted)]">Items must be unused, unworn, and in original packaging.</p>
          </div>
        </div>
        <div className="bg-white border border-[var(--border-light)] rounded-lg p-5 flex gap-4">
          <AlertCircle className="w-6 h-6 text-[var(--accent)] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-[var(--text)] mb-1">Sale Items Final</h3>
            <p className="text-sm text-[var(--text-muted)]">Items marked as sale or clearance are non-returnable.</p>
          </div>
        </div>
        <div className="bg-white border border-[var(--border-light)] rounded-lg p-5 flex gap-4">
          <Gift className="w-6 h-6 text-[var(--accent)] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-[var(--text)] mb-1">Gift Cards Non-Returnable</h3>
            <p className="text-sm text-[var(--text-muted)]">Gift cards and e-gift cards cannot be returned or refunded.</p>
          </div>
        </div>
      </div>

      <div className="space-y-10 text-[var(--text-secondary)] leading-relaxed">

        {/* Overview */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">1. Return Eligibility</h2>
          <p className="mb-3">
            We want you to be completely satisfied with your purchase. If you are not satisfied for any reason, you may return eligible items within <strong>30 calendar days</strong> of the delivery date for a full refund of the product price.
          </p>
          <p className="mb-3">
            To be eligible for a return, your item must meet the following conditions:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The item is <strong>unused</strong> and in the same condition that you received it</li>
            <li>The item is in its <strong>original packaging</strong> with all tags and accessories included</li>
            <li>The return is initiated within <strong>30 days</strong> of the delivery date</li>
            <li>You have proof of purchase (order number, receipt, or order confirmation email)</li>
          </ul>
        </section>

        {/* Non-Returnable Items */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">2. Non-Returnable Items</h2>
          <p className="mb-3">The following items cannot be returned or refunded:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Sale items</strong> — Items purchased at a discounted or clearance price</li>
            <li><strong>Gift cards and e-gift cards</strong> — Both physical and digital gift cards</li>
            <li><strong>Custom or personalized items</strong> — Made-to-order or engraved pieces</li>
            <li><strong>Intimate or sanitary items</strong> — For hygiene reasons, certain items cannot be returned once opened</li>
          </ul>
          <p>
            If you are unsure whether your item qualifies for a return, please contact us before initiating a return at <a href="mailto:support@mythrealms.com" className="text-[var(--accent)] hover:underline">support@mythrealms.com</a>.
          </p>
        </section>

        {/* Return Shipping */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">3. Return Shipping Costs</h2>
          <div className="space-y-4">
            <div className="bg-white border border-[var(--border-light)] rounded-lg p-5">
              <h3 className="font-semibold text-[var(--text)] mb-2">When We Pay Return Shipping</h3>
              <p className="text-sm text-[var(--text-muted)]">
                We will cover the cost of return shipping and provide a prepaid return label if the return is due to our error — for example:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2 text-sm text-[var(--text-muted)]">
                <li>You received a defective or damaged item</li>
                <li>You received the wrong item (incorrect size, color, or product)</li>
                <li>The item does not match its description on our website</li>
              </ul>
            </div>

            <div className="bg-white border border-[var(--border-light)] rounded-lg p-5">
              <h3 className="font-semibold text-[var(--text)] mb-2">When You Pay Return Shipping</h3>
              <p className="text-sm text-[var(--text-muted)]">
                Return shipping costs are the customer&apos;s responsibility in all other cases, including:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2 text-sm text-[var(--text-muted)]">
                <li>You changed your mind or no longer want the item</li>
                <li>You ordered the wrong size or color</li>
                <li>The item was a gift you do not wish to keep</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How to Return */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">4. How to Initiate a Return</h2>
          <ol className="list-decimal pl-6 space-y-3 mb-4">
            <li>
              <strong>Contact Us:</strong> Email <a href="mailto:support@mythrealms.com" className="text-[var(--accent)] hover:underline">support@mythrealms.com</a> with your order number, the item(s) you wish to return, and the reason for the return.
            </li>
            <li>
              <strong>Receive Authorization:</strong> We will review your request and, if approved, provide a Return Merchandise Authorization (RMA) number and return instructions. Do not ship items back without authorization.
            </li>
            <li>
              <strong>Package Your Return:</strong> Securely package the item(s) in their original packaging (if available). Include all accessories, tags, and documentation. Write the RMA number clearly on the outside of the package.
            </li>
            <li>
              <strong>Ship the Package:</strong> Use a trackable shipping service and retain the tracking number. We are not responsible for packages lost or damaged in return transit.
            </li>
            <li>
              <strong>Inspection and Refund:</strong> Once we receive and inspect your return, we will notify you of the approval or rejection of your refund.
            </li>
          </ol>
          <p className="text-sm text-[var(--text-muted)]">
            Please allow 2-5 business days for the return to be processed after it reaches our facility.
          </p>
        </section>

        {/* Refunds */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">5. Refund Process</h2>
          <p className="mb-3">
            Once your return is received and inspected, we will send you an email notification regarding the status of your refund. Approved refunds will be processed as follows:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Refunds are issued to the <strong>original payment method</strong> used for the purchase</li>
            <li>Refunds typically appear within <strong>5-10 business days</strong> after approval, depending on your payment provider</li>
            <li>If you paid via bank transfer or wire, additional processing time may apply</li>
            <li>Original shipping charges are <strong>non-refundable</strong> (except in cases where the return is due to our error)</li>
          </ul>
          <p>
            If you have not received your refund within 15 business days of approval, please first check with your bank or credit card company, then contact us at <a href="mailto:support@mythrealms.com" className="text-[var(--accent)] hover:underline">support@mythrealms.com</a>.
          </p>
        </section>

        {/* Damaged or Defective Items */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">6. Damaged or Defective Items</h2>
          <p className="mb-3">
            If your item arrives damaged or defective, please contact us within <strong>48 hours</strong> of delivery at <a href="mailto:support@mythrealms.com" className="text-[var(--accent)] hover:underline">support@mythrealms.com</a>.
          </p>
          <p className="mb-3">
            Include the following information in your email:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Your order number</li>
            <li>Clear photos of the damaged or defective item</li>
            <li>A description of the damage or defect</li>
          </ul>
          <p>
            Upon verification, we will offer you the choice of a free replacement (shipped at our expense) or a full refund including original shipping costs.
          </p>
        </section>

        {/* Exchanges */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">7. Exchanges</h2>
          <p className="mb-3">
            We do not offer direct exchanges at this time. If you would like a different size, color, or product, please initiate a return for the original item (following the procedure above) and place a new order for the desired item.
          </p>
          <p>
            If you are unsure about sizing, please consult our <Link href="/size-guide" className="text-[var(--accent)] hover:underline">Size Guide</Link> before ordering.
          </p>
        </section>

        {/* Late or Missing Refunds */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">8. Late or Missing Refunds</h2>
          <p className="mb-3">
            If you have been notified that your refund was approved but you have not received it:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Check your bank account again — processing times vary by institution</li>
            <li>Contact your credit card company or bank — they may have a holding period before posting the refund</li>
            <li>If you still have not received it, contact us at <a href="mailto:support@mythrealms.com" className="text-[var(--accent)] hover:underline">support@mythrealms.com</a></li>
          </ul>
        </section>

        {/* Contact */}
        <section className="bg-white border border-[var(--border-light)] rounded-lg p-8">
          <div className="flex items-center gap-4 mb-4">
            <Mail className="w-8 h-8 text-[var(--accent)]" />
            <h2 className="font-serif text-2xl font-bold text-[var(--text)]">Need Help With a Return?</h2>
          </div>
          <p className="text-[var(--text-secondary)] mb-4">
            Our support team is here to help. We typically respond within 24 hours.
          </p>
          <a
            href="mailto:support@mythrealms.com"
            className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[var(--primary-hover)] transition"
          >
            <Mail className="w-4 h-4" />
            support@mythrealms.com
          </a>
        </section>

      </div>
    </div>
  );
}
