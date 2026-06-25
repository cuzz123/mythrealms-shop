import Link from "next/link";
import type { Metadata } from "next";
import { Truck, Clock, Globe, Shield, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Information — MythRealms",
  description: "Free worldwide shipping on orders over $69.99. View delivery times by country, shipping methods, and tracking information.",
};

export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-8">
        <Link href="/" className="hover:text-[var(--text)] transition">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Shipping Information</span>
      </nav>

      <h1 className="font-serif text-4xl font-bold mb-3">Shipping Information</h1>
      <p className="text-sm text-[var(--text-muted)] mb-10">Everything you need to know about our shipping methods, delivery times, and rates.</p>

      {/* Highlights */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 text-center">
          <Globe className="w-6 h-6 text-[var(--accent)] mx-auto mb-3" />
          <h3 className="font-semibold text-[var(--text)] mb-1">Free Worldwide Shipping</h3>
          <p className="text-sm text-[var(--text-muted)]">On all orders over $69.99</p>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 text-center">
          <Truck className="w-6 h-6 text-[var(--accent)] mx-auto mb-3" />
          <h3 className="font-semibold text-[var(--text)] mb-1">36 Countries</h3>
          <p className="text-sm text-[var(--text-muted)]">We ship to most destinations worldwide</p>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 text-center">
          <Shield className="w-6 h-6 text-[var(--accent)] mx-auto mb-3" />
          <h3 className="font-semibold text-[var(--text)] mb-1">Tracked Delivery</h3>
          <p className="text-sm text-[var(--text-muted)]">All orders include tracking</p>
        </div>
      </div>

      <div className="space-y-10 text-[var(--text-secondary)] leading-relaxed">

        {/* Processing Time */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">1. Processing Time</h2>
          <p className="mb-3">
            All orders are processed within <strong>2-5 business days</strong> (Monday through Friday, excluding holidays). You will receive a confirmation email with your tracking number once your order has shipped.
          </p>
          <p className="mb-3">
            Processing time includes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Order verification</strong> — We review your order for accuracy and security</li>
            <li><strong>Quality inspection</strong> — Each piece is hand-inspected before packaging</li>
            <li><strong>Intention infusion</strong> — Pieces are prepared according to mythic tradition</li>
            <li><strong>Packaging</strong> — Carefully wrapped and packaged for safe transit</li>
          </ul>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 mt-4 flex gap-3">
            <Clock className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[var(--text-muted)]">
              During peak seasons (holidays, new collections, sales), processing times may extend to 5-7 business days. We appreciate your patience.
            </p>
          </div>
        </section>

        {/* Shipping Methods */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">2. Shipping Methods</h2>
          <p className="mb-6">We offer two shipping options to meet your needs:</p>

          <div className="space-y-4">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
              <h3 className="font-semibold text-[var(--text)] text-lg mb-2">Standard Shipping</h3>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li><span className="font-medium text-[var(--text)]">Delivery Time:</span> 7-20 business days</li>
                <li><span className="font-medium text-[var(--text)]">Cost:</span> Free on orders over $69.99; otherwise a flat rate calculated at checkout</li>
                <li><span className="font-medium text-[var(--text)]">Carrier:</span> Local postal services with tracking</li>
                <li><span className="font-medium text-[var(--text)]">Best For:</span> Non-urgent orders where budget is a priority</li>
              </ul>
            </div>

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
              <h3 className="font-semibold text-[var(--text)] text-lg mb-2">Express Shipping (DHL)</h3>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li><span className="font-medium text-[var(--text)]">Delivery Time:</span> 6-8 business days</li>
                <li><span className="font-medium text-[var(--text)]">Cost:</span> Calculated at checkout based on destination and weight</li>
                <li><span className="font-medium text-[var(--text)]">Carrier:</span> DHL Express</li>
                <li><span className="font-medium text-[var(--text)]">Best For:</span> Time-sensitive orders, gifts with deadlines, or when you want your piece sooner</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Delivery Times by Country */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">3. Estimated Delivery Times by Country</h2>
          <p className="mb-4">
            The following table shows estimated delivery times for Standard Shipping to our most popular destinations. Times are in <strong>business days</strong> (Monday-Friday, excluding holidays).
          </p>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg)] border-b border-[var(--border-light)]">
                  <th className="text-left px-6 py-3 font-semibold text-[var(--text)]">Country / Region</th>
                  <th className="text-center px-6 py-3 font-semibold text-[var(--text)]">Standard Shipping</th>
                  <th className="text-center px-6 py-3 font-semibold text-[var(--text)]">Express (DHL)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-light)]">
                <tr>
                  <td className="px-6 py-3 font-medium text-[var(--text)]">United States</td>
                  <td className="px-6 py-3 text-center">8-14 days</td>
                  <td className="px-6 py-3 text-center">6-8 days</td>
                </tr>
                <tr className="bg-[var(--bg)]/50">
                  <td className="px-6 py-3 font-medium text-[var(--text)]">United Kingdom</td>
                  <td className="px-6 py-3 text-center">7-12 days</td>
                  <td className="px-6 py-3 text-center">6-8 days</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-medium text-[var(--text)]">Germany</td>
                  <td className="px-6 py-3 text-center">7-12 days</td>
                  <td className="px-6 py-3 text-center">6-8 days</td>
                </tr>
                <tr className="bg-[var(--bg)]/50">
                  <td className="px-6 py-3 font-medium text-[var(--text)]">France</td>
                  <td className="px-6 py-3 text-center">7-12 days</td>
                  <td className="px-6 py-3 text-center">6-8 days</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-medium text-[var(--text)]">Italy</td>
                  <td className="px-6 py-3 text-center">7-12 days</td>
                  <td className="px-6 py-3 text-center">6-8 days</td>
                </tr>
                <tr className="bg-[var(--bg)]/50">
                  <td className="px-6 py-3 font-medium text-[var(--text)]">Spain</td>
                  <td className="px-6 py-3 text-center">7-12 days</td>
                  <td className="px-6 py-3 text-center">6-8 days</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-medium text-[var(--text)]">Canada</td>
                  <td className="px-6 py-3 text-center">10-18 days</td>
                  <td className="px-6 py-3 text-center">6-8 days</td>
                </tr>
                <tr className="bg-[var(--bg)]/50">
                  <td className="px-6 py-3 font-medium text-[var(--text)]">Australia</td>
                  <td className="px-6 py-3 text-center">10-18 days</td>
                  <td className="px-6 py-3 text-center">6-8 days</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-medium text-[var(--text)]">New Zealand</td>
                  <td className="px-6 py-3 text-center">10-18 days</td>
                  <td className="px-6 py-3 text-center">6-8 days</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-[var(--text-muted)] mt-4">
            If your country is not listed above, please contact us at <a href="mailto:support@mythrealms.com" className="text-[var(--accent)] hover:underline">support@mythrealms.com</a> for a delivery estimate. We ship to most countries worldwide.
          </p>
        </section>

        {/* Customs and Duties */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">4. Customs, Duties, and Taxes</h2>
          <p className="mb-3">
            International orders may be subject to customs duties, import taxes, and other fees imposed by your country&apos;s customs authority. These charges are <strong>not included</strong> in our prices or shipping costs and are the sole responsibility of the recipient.
          </p>
          <p className="mb-3">
            Customs policies vary widely from country to country. We recommend contacting your local customs office for information about potential charges before placing your order.
          </p>
          <p>
            We are unable to mark merchandise as a &quot;gift&quot; or declare a lower value on customs forms, as this violates international shipping regulations.
          </p>
        </section>

        {/* Order Tracking */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">5. Order Tracking</h2>
          <p className="mb-3">
            All orders include tracking. Once your order has shipped, you will receive a confirmation email containing:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Your <strong>tracking number</strong></li>
            <li>A <strong>link to track your package</strong> on the carrier&apos;s website</li>
            <li>The <strong>estimated delivery date</strong></li>
          </ul>
          <p>
            You can also track your order at any time by visiting our <Link href="/track-order" className="text-[var(--accent)] hover:underline">Track Order</Link> page and entering your order number and email address.
          </p>
        </section>

        {/* Shipping Restrictions */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">6. Shipping Restrictions</h2>
          <p className="mb-3">
            We currently ship to most countries worldwide with the following exceptions:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>We do not ship to PO boxes or APO/FPO addresses for Express (DHL) shipments</li>
            <li>Some remote regions may have extended delivery times or limited service</li>
            <li>Certain countries may be subject to shipping restrictions due to sanctions or trade regulations</li>
          </ul>
          <p>
            If your shipping address is not accepted at checkout, please contact us at <a href="mailto:support@mythrealms.com" className="text-[var(--accent)] hover:underline">support@mythrealms.com</a> to verify availability.
          </p>
        </section>

        {/* Delays and Issues */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">7. Delays and Issues</h2>
          <p className="mb-3">
            While we strive to meet the delivery estimates listed above, delays may occur due to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Customs clearance procedures</li>
            <li>Carrier service disruptions or peak season volumes</li>
            <li>Severe weather events or natural disasters</li>
            <li>Incorrect or incomplete shipping addresses</li>
            <li>Holiday periods and public holidays in origin or destination countries</li>
          </ul>
          <p>
            If your order has not arrived within the estimated delivery window, please first check your tracking number for the latest status. If you need further assistance, contact us at <a href="mailto:support@mythrealms.com" className="text-[var(--accent)] hover:underline">support@mythrealms.com</a> and we will help investigate.
          </p>
        </section>

        {/* Lost or Stolen Packages */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">8. Lost or Stolen Packages</h2>
          <p className="mb-3">
            We are not responsible for packages confirmed as delivered by the carrier but reported as not received. If your tracking shows delivered but you cannot locate the package:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Check with neighbors, building management, or family members</li>
            <li>Look around your delivery area — carriers sometimes leave packages in secure locations</li>
            <li>Contact the carrier directly with your tracking number</li>
            <li>Wait 24-48 hours — carriers occasionally mark packages as delivered before actual delivery</li>
          </ul>
          <p>
            If you believe your package is lost in transit (no tracking update for 14+ days), please contact us and we will open an investigation with the carrier. If the package is confirmed lost, we will send a replacement or issue a full refund.
          </p>
        </section>

        {/* FAQ Quick Links */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-8 text-center">
          <Truck className="w-8 h-8 text-[var(--accent)] mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-2">Questions About Your Order?</h2>
          <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
            Our support team is available to help with any shipping questions. We typically respond within 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="mailto:support@mythrealms.com"
              className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[var(--primary-hover)] transition"
            >
              support@mythrealms.com
            </a>
            <Link
              href="/track-order"
              className="inline-flex items-center gap-2 border border-[var(--border)] text-[var(--text)] px-6 py-3 rounded-full font-semibold text-sm hover:bg-[var(--bg)] transition"
            >
              Track Your Order
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
