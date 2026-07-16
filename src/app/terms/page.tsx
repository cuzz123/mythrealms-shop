import Link from "next/link";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service — MythRealms",
  description: "Read the terms and conditions for using the MythRealms website and purchasing our products. Understand your rights and obligations.",
  alternates: { canonical: absoluteUrl("/terms") },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-8">
        <Link href="/" className="hover:text-[var(--text)] transition">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Terms of Service</span>
      </nav>

      <h1 className="font-serif text-4xl font-bold mb-3">Terms of Service</h1>
      <p className="text-sm text-[var(--text-muted)] mb-10">Last updated: June 1, 2026</p>

      <div className="space-y-10 text-[var(--text-secondary)] leading-relaxed">

        {/* Agreement */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">1. Agreement to Terms</h2>
          <p className="mb-3">
            By accessing or using mythrealms.com (the &quot;Website&quot;) and our services (collectively, the &quot;Services&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you may not access or use our Services.
          </p>
          <p>
            These Terms constitute a legally binding agreement between you (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) and MythRealms (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We reserve the right to modify these Terms at any time. Changes take effect immediately upon posting. Your continued use of the Services after any changes constitutes acceptance of the modified Terms.
          </p>
        </section>

        {/* Eligibility */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">2. Eligibility</h2>
          <p className="mb-3">
            To use our Services, you must be at least 16 years of age, or the age of majority in your jurisdiction, whichever is greater. By using our Services, you represent and warrant that you meet these eligibility requirements.
          </p>
          <p>
            If you are using the Services on behalf of a business or organization, you represent and warrant that you have authority to bind that entity to these Terms.
          </p>
        </section>

        {/* Account */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">3. Account Registration</h2>
          <p className="mb-3">
            To access certain features, you may need to create an account. You agree to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Provide accurate, current, and complete registration information</li>
            <li>Maintain and promptly update your account information</li>
            <li>Keep your password secure and confidential</li>
            <li>Be responsible for all activities that occur under your account</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
          </ul>
          <p>
            We reserve the right to suspend or terminate your account at our sole discretion if we suspect any violation of these Terms or fraudulent activity.
          </p>
        </section>

        {/* Products & Orders */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">4. Products and Orders</h2>

          <h3 className="font-serif text-lg font-bold text-[var(--text)] mb-2">Product Descriptions</h3>
          <p className="mb-3">
            We strive to display our products accurately, including colors, images, and descriptions. However, we cannot guarantee that your device&apos;s display accurately reflects the actual product colors. All product descriptions, pricing, and availability are subject to change without notice.
          </p>

          <h3 className="font-serif text-lg font-bold text-[var(--text)] mb-2">Natural Variations</h3>
          <p className="mb-3">
            Product pages and galleries describe the information currently available for each piece. Color, finish, and scale may appear different across lighting and screens. Review the complete gallery and contact us before ordering if a specific detail is essential to your purchase.
          </p>

          <h3 className="font-serif text-lg font-bold text-[var(--text)] mb-2">Order Acceptance</h3>
          <p className="mb-3">
            We reserve the right to refuse or cancel any order at our sole discretion. In the event we cancel an order, we will notify you promptly and issue a full refund. Orders may be limited by available inventory, error in pricing or product information, suspected fraud, or other circumstances.
          </p>

          <h3 className="font-serif text-lg font-bold text-[var(--text)] mb-2">Order Modification and Cancellation</h3>
          <p>
            You may modify or cancel your order within 2 hours of placing it by contacting us at <a href="mailto:mythrealms@outlook.com" className="text-[var(--accent)] hover:underline">mythrealms@outlook.com</a>. After 2 hours, orders may already be in processing and cannot be modified or canceled.
          </p>
        </section>

        {/* Pricing & Payment */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">5. Pricing and Payment</h2>
          <p className="mb-3">
            All prices are listed in US Dollars (USD) unless otherwise stated. Prices are subject to change without notice. We are not responsible for pricing errors or inaccuracies displayed on the Website.
          </p>
          <p className="mb-3">
            We currently accept PayPal. PayPal controls the funding options available to each buyer. By completing payment through PayPal, you represent and warrant that you are authorized to use the selected funding option. You agree to pay all charges incurred at the prices in effect when such charges are incurred, including any applicable taxes and shipping fees.
          </p>
          <p>
            For international orders, you are responsible for any customs duties, import taxes, or other fees imposed by your country&apos;s customs authority. These charges are not included in our prices or shipping costs.
          </p>
        </section>

        {/* Shipping */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">6. Shipping and Delivery</h2>
          <p className="mb-3">
            Shipping times and costs vary based on destination and shipping method selected at checkout. Standard shipping typically takes 7-20 business days. Express shipping via DHL takes 6-8 business days. For full details, please see our <Link href="/shipping" className="text-[var(--accent)] hover:underline">Shipping Information</Link> page.
          </p>
          <p>
            We are not responsible for delays caused by customs clearance, carrier service disruptions, severe weather, incorrect shipping addresses, or other circumstances beyond our control. Title and risk of loss pass to you upon delivery of the products to the carrier.
          </p>
        </section>

        {/* Returns & Refunds */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">7. Returns and Refunds</h2>
          <p>
            We offer a 30-day return policy for most items. Items must be unused, in their original condition, and in original packaging. Sale items and gift cards are non-returnable. Return shipping costs are the customer&apos;s responsibility unless the return is due to our error. For complete details, please see our <Link href="/refund" className="text-[var(--accent)] hover:underline">Refund &amp; Return Policy</Link> page.
          </p>
        </section>

        {/* Intellectual Property */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">8. Intellectual Property</h2>
          <p className="mb-3">
            All content on the Website, including but not limited to text, images, graphics, logos, designs, product names, photographs, videos, and software, is the property of MythRealms or its content suppliers and is protected by copyright, trademark, and other intellectual property laws.
          </p>
          <p>
            You may not reproduce, distribute, modify, create derivative works from, publicly display, or otherwise exploit any content from our Website without our prior written consent. The MythRealms name, logo, and all related product names are trademarks of MythRealms and may not be used without permission.
          </p>
        </section>

        {/* User Conduct */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">9. User Conduct</h2>
          <p className="mb-3">You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Use the Services for any unlawful purpose or in violation of these Terms</li>
            <li>Interfere with or disrupt the operation of the Website or its servers</li>
            <li>Attempt to gain unauthorized access to any part of the Website or its systems</li>
            <li>Use any automated means (bots, scrapers, crawlers) to access or collect data from the Website without our permission</li>
            <li>Upload or transmit malicious code, viruses, or harmful content</li>
            <li>Engage in fraudulent activity, including use of stolen payment methods</li>
            <li>Post false, misleading, or defamatory content or reviews</li>
            <li>Impersonate another person or entity</li>
          </ul>
          <p>
            We reserve the right to terminate your access to the Services for any violation of this section.
          </p>
        </section>

        {/* Disclaimer */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">10. Disclaimer of Warranties</h2>
          <p className="mb-3">
            THE SERVICES AND ALL PRODUCTS ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p>
            We do not warrant that the Website will be uninterrupted, error-free, secure, or free of viruses or other harmful components. We make no warranty regarding the accuracy, completeness, or reliability of any content on the Website. Any reliance on the material on this Website is at your own risk.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">11. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MYTHREALMS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, LOSS OF DATA, LOSS OF GOODWILL, OR PERSONAL INJURY, ARISING OUT OF OR RELATED TO YOUR USE OF (OR INABILITY TO USE) THE SERVICES OR PRODUCTS, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR TOTAL LIABILITY TO YOU FOR ANY CLAIM SHALL NOT EXCEED THE AMOUNT YOU PAID US FOR THE APPLICABLE PRODUCT OR SERVICE IN THE TWELVE MONTHS PRECEDING THE CLAIM.
          </p>
        </section>

        {/* Indemnification */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">12. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless MythRealms and its officers, directors, employees, and affiliates from and against any claims, damages, liabilities, costs, and expenses (including reasonable attorneys&apos; fees) arising out of or related to your violation of these Terms, your use of the Services, or your violation of any rights of a third party.
          </p>
        </section>

        {/* Product Disclaimer */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">13. Product Disclaimer</h2>
          <p className="mb-3">
            Our products are intended as spiritual tools and decorative accessories. Statements regarding metaphysical properties, energetic qualities, or spiritual benefits are based on cultural traditions and personal beliefs and are not scientifically validated.
          </p>
          <p>
            Our products are not intended to diagnose, treat, cure, or prevent any disease or medical condition. If you have a medical concern, please consult a qualified healthcare professional. Our bracelets and jewelry contain small parts and may present a choking hazard — keep away from small children.
          </p>
        </section>

        {/* Governing Law */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">14. Governing Law and Dispute Resolution</h2>
          <p className="mb-3">
            These Terms shall be governed by and construed in accordance with the laws of Hong Kong SAR, without regard to its conflict of law principles. Any dispute arising from or relating to these Terms or your use of the Services shall first be resolved through good-faith negotiation.
          </p>
          <p>
            If a dispute cannot be resolved informally, it shall be submitted to binding arbitration administered in Hong Kong in accordance with the rules of the Hong Kong International Arbitration Centre (HKIAC). You agree to resolve disputes on an individual basis and waive any right to participate in a class action or class-wide arbitration.
          </p>
        </section>

        {/* Termination */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">15. Termination</h2>
          <p>
            These Terms remain in effect while you use the Services. We may suspend or terminate your access to the Services at any time, with or without cause, without prior notice. Upon termination, your right to use the Services will immediately cease. Provisions of these Terms that by their nature should survive termination (including but not limited to intellectual property, disclaimers, limitations of liability, and indemnification) shall survive.
          </p>
        </section>

        {/* General */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">16. General Provisions</h2>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Severability:</strong> If any provision of these Terms is found unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.</li>
            <li><strong>Waiver:</strong> Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.</li>
            <li><strong>Entire Agreement:</strong> These Terms, together with our Privacy Policy and any other policies referenced herein, constitute the entire agreement between you and MythRealms concerning the Services.</li>
            <li><strong>Assignment:</strong> You may not assign or transfer your rights or obligations under these Terms without our written consent. We may assign our rights and obligations at any time.</li>
            <li><strong>Force Majeure:</strong> We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control.</li>
          </ul>
        </section>

        {/* Contact */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">17. Contact Information</h2>
          <p className="mb-3">
            For questions, concerns, or notices regarding these Terms of Service, please contact us:
          </p>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6 space-y-2">
            <p><span className="font-semibold text-[var(--text)]">Email:</span> <a href="mailto:mythrealms@outlook.com" className="text-[var(--accent)] hover:underline">mythrealms@outlook.com</a></p>
            <p><span className="font-semibold text-[var(--text)]">Website:</span> mythrealms.com</p>
          </div>
        </section>

      </div>
    </div>
  );
}
