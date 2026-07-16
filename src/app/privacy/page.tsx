import Link from "next/link";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy — MythRealms",
  description: "Learn how MythRealms collects, uses, and protects your personal information. Our commitment to your privacy and data security.",
  alternates: { canonical: absoluteUrl("/privacy") },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-8">
        <Link href="/" className="hover:text-[var(--text)] transition">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Privacy Policy</span>
      </nav>

      <h1 className="font-serif text-4xl font-bold mb-3">Privacy Policy</h1>
      <p className="text-sm text-[var(--text-muted)] mb-10">Last updated: June 1, 2026</p>

      <div className="space-y-10 text-[var(--text-secondary)] leading-relaxed">

        {/* Introduction */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">1. Introduction</h2>
          <p className="mb-3">
            MythRealms (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <strong>mythrealms.com</strong> or make a purchase from our store.
          </p>
          <p>
            By using our website, you consent to the data practices described in this policy. If you do not agree with any part of this policy, please discontinue use of our site immediately.
          </p>
        </section>

        {/* Information We Collect */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">2. Information We Collect</h2>

          <h3 className="font-serif text-lg font-bold text-[var(--text)] mb-2">Personal Information You Provide</h3>
          <p className="mb-3">
            When you place an order, create an account, or contact us, we may collect the following personal information:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Full name and contact details (email address, phone number, shipping address)</li>
            <li>Payment information (credit card details are processed securely by our payment partners and are never stored on our servers)</li>
            <li>Account credentials (username and encrypted password)</li>
            <li>Order history and preferences</li>
            <li>Communications you send to us (emails, chat messages, feedback)</li>
          </ul>

          <h3 className="font-serif text-lg font-bold text-[var(--text)] mb-2">Information Collected Automatically</h3>
          <p className="mb-3">
            When you visit our website, we automatically collect certain information about your device and browsing behavior:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>IP address, browser type, operating system, and device information</li>
            <li>Pages visited, time spent on pages, and navigation patterns</li>
            <li>Referring website or search engine that brought you to us</li>
            <li>Cookies and similar tracking technologies (see Section 5 below)</li>
          </ul>
        </section>

        {/* How We Use Your Information */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">3. How We Use Your Information</h2>
          <p className="mb-3">We use the information we collect for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Order Processing:</strong> To process, fulfill, and ship your orders; to send order confirmations, tracking information, and delivery updates.</li>
            <li><strong>Customer Support:</strong> To respond to your inquiries, resolve disputes, and provide assistance.</li>
            <li><strong>Account Management:</strong> To create and maintain your account, process returns and refunds, and manage your preferences.</li>
            <li><strong>Marketing:</strong> To send you promotional emails, newsletters, and special offers (only with your consent; you may opt out at any time).</li>
            <li><strong>Site Improvement:</strong> To analyze usage patterns, improve our website design, and enhance your shopping experience.</li>
            <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes; to prevent fraud and protect our rights.</li>
          </ul>
          <p>
            We will never sell, rent, or trade your personal information to third parties for their own marketing purposes.
          </p>
        </section>

        {/* Data Sharing */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">4. How We Share Your Information</h2>
          <p className="mb-3">We may share your information with trusted third-party service providers who help us operate our business, including:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Payment Processor:</strong> PayPal processes payments. Payment credentials are handled by PayPal and are not stored by MythRealms.</li>
            <li><strong>Shipping Carriers:</strong> To deliver your orders (e.g., DHL, FedEx, local postal services)</li>
            <li><strong>Email Service Providers:</strong> To send transactional and marketing emails</li>
            <li><strong>Analytics Providers:</strong> To understand how visitors use our website (e.g., Google Analytics)</li>
            <li><strong>Hosting and Infrastructure:</strong> To host our website and store data securely</li>
          </ul>
          <p>
            All third-party providers are contractually obligated to protect your data and use it only for the specific services they provide to us. We may also disclose information if required by law, court order, or governmental regulation.
          </p>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">5. Cookies and Tracking Technologies</h2>
          <p className="mb-3">
            We use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small text files placed on your device that help us:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Remember items in your shopping cart</li>
            <li>Keep you signed in to your account</li>
            <li>Understand how you interact with our website</li>
            <li>Show you relevant advertisements on other platforms</li>
            <li>Remember your preferences (language, currency, region)</li>
          </ul>
          <p>
            You can control cookie settings through your browser preferences. Disabling cookies may affect certain features of our website, including the shopping cart and checkout process.
          </p>
        </section>

        {/* Data Security */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">6. Data Security</h2>
          <p className="mb-3">
            We implement industry-standard security measures to protect your personal information, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>SSL/TLS encryption for all data transmitted between your browser and our servers</li>
            <li>Secure, encrypted storage of sensitive data</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Strict access controls limiting employee access to personal data</li>
          </ul>
          <p>
            However, no method of electronic transmission or storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
          </p>
        </section>

        {/* Data Retention */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">7. Data Retention</h2>
          <p>
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. When your data is no longer needed, we securely delete or anonymize it. You may request deletion of your account and associated data at any time by contacting us at <a href="mailto:mythrealms@outlook.com" className="text-[var(--accent)] hover:underline">mythrealms@outlook.com</a>.
          </p>
        </section>

        {/* Your Rights */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">8. Your Rights</h2>
          <p className="mb-3">Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
            <li><strong>Correction:</strong> Request that we correct any inaccurate or incomplete data</li>
            <li><strong>Deletion:</strong> Request that we delete your personal data (&quot;right to be forgotten&quot;)</li>
            <li><strong>Portability:</strong> Request a copy of your data in a machine-readable format</li>
            <li><strong>Objection:</strong> Object to processing of your data for direct marketing purposes</li>
            <li><strong>Withdraw Consent:</strong> Withdraw previously given consent at any time</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at <a href="mailto:mythrealms@outlook.com" className="text-[var(--accent)] hover:underline">mythrealms@outlook.com</a>. We will respond to your request within 30 days. We may need to verify your identity before processing your request.
          </p>
        </section>

        {/* Children's Privacy */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">9. Children&apos;s Privacy</h2>
          <p>
            Our website is not intended for use by children under the age of 16. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately and we will promptly delete it.
          </p>
        </section>

        {/* International Transfers */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">10. International Data Transfers</h2>
          <p>
            Your information may be transferred to, stored in, and processed in countries outside your country of residence. We ensure appropriate safeguards are in place to protect your data when transferred internationally, including the use of standard contractual clauses approved by relevant authorities.
          </p>
        </section>

        {/* Third-Party Links */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">11. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites or services. We are not responsible for the privacy practices or content of those sites. We encourage you to review the privacy policies of any third-party services before providing them with your personal information.
          </p>
        </section>

        {/* Changes to Policy */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">12. Changes to This Privacy Policy</h2>
          <p className="mb-3">
            We reserve the right to update this Privacy Policy at any time. When we do, we will revise the &quot;Last updated&quot; date at the top of this page and post the updated policy on our website. We encourage you to review this page periodically for any changes.
          </p>
          <p>
            Material changes will be communicated via email to account holders or through a prominent notice on our website prior to the change becoming effective.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">13. Contact Us</h2>
          <p className="mb-3">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
          </p>
          <ul className="list-none space-y-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
            <li className="flex items-center gap-2">
              <span className="font-semibold text-[var(--text)] w-20">Email:</span>
              <a href="mailto:mythrealms@outlook.com" className="text-[var(--accent)] hover:underline">mythrealms@outlook.com</a>
            </li>
            <li className="flex items-center gap-2">
              <span className="font-semibold text-[var(--text)] w-20">Website:</span>
              <span>mythrealms.com</span>
            </li>
          </ul>
        </section>

      </div>
    </div>
  );
}
