"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
  { q:"How long does shipping take?", a:"Standard shipping takes 7-20 business days. Express shipping via DHL takes 6-8 business days. US orders typically arrive within 8-14 business days.", cat:"shipping" },
  { q:"Do you ship internationally?", a:"Yes! We ship to 36 countries including US, UK, Canada, Australia, all EU countries, Japan, Singapore, and more. See the full list at checkout.", cat:"shipping" },
  { q:"What is your return policy?", a:"30-day money-back guarantee. Items must be unused and in original packaging. Return shipping is free if the item arrived damaged or incorrect. Contact us to initiate a return.", cat:"returns" },
  { q:"How do I track my order?", a:"You will receive a confirmation email with a tracking number once your order ships. You can also check your order status at /track-order.", cat:"shipping" },
  { q:"What payment methods do you accept?", a:"Visa, Mastercard, American Express, Discover, PayPal, Google Pay, and Apple Pay. All payments are processed securely through LemonSqueezy.", cat:"order" },
  { q:"How do I use a discount code?", a:"Enter your code at checkout in the Discount Code field and click Apply. First-time customers can use MYTH15 for 15% off.", cat:"order" },
  { q:"Are the gemstones and materials genuine?", a:"Absolutely. We source authentic gemstones — jade, lapis lazuli, garnet, citrine, onyx, and more. All metals are 925 sterling silver, 14k or 18k gold. Each piece comes with a material certification card.", cat:"products" },
  { q:"How do I care for my piece?", a:"Remove before swimming, showering, or exercising. Avoid contact with perfumes, lotions, and hairspray. Store in the provided soft pouch away from direct sunlight. Clean gently with the included polishing cloth.", cat:"products" },
  { q:"Why does it take 2-3 weeks to ship?", a:"Every MythRealms piece is handcrafted to order — not mass-produced. Your guardian is cast, polished, inspected, and packaged individually. This is slow luxury. It is worth the wait.", cat:"products" },
  { q:"What size bracelet should I order?", a:"Measure your wrist just below the wrist bone with a soft tape measure. Add 0.5 inch for snug fit, 1 inch for comfortable fit. Most bracelets are 16-18cm adjustable. We also offer custom sizing — email us.", cat:"products" },
  { q:"Can I change or cancel my order?", a:"Orders can be modified or cancelled within 4 hours of placement. Contact us immediately with your order number.", cat:"order" },
  { q:"Where do the mythical beast designs come from?", a:"Every design is researched from the Classic of Mountains and Seas (Shan Hai Jing) — China's oldest bestiary, compiled over 2,000 years ago. The 28 Mansions collection maps actual Chinese lunar astronomy. The Four Symbols are the cornerstone of Chinese cosmology.", cat:"products" },
  { q:"Do you offer gift wrapping?", a:"Yes. Every order arrives in a MythRealms gift box lined with silk, accompanied by a story card that explains the legend behind your guardian. No price tags are included — ready to gift directly.", cat:"order" },
  { q:"My item arrived damaged. What now?", a:"Email support@mythrealms.com within 48 hours of delivery with photos. We will arrange a free replacement or full refund immediately — no return shipping cost to you.", cat:"returns" },
  { q:"Do you offer wholesale or bulk orders?", a:"We offer wholesale pricing for orders of 10+ pieces. Ideal for boutiques, museum shops, and wellness studios. Email wholesale@mythrealms.com for our catalog and pricing guide.", cat:"order" },
  { q:"Are your products ethically sourced?", a:"Yes. Our gemstones are sourced from the same regions that supplied the ancient Silk Road — Burma, Afghanistan, Xinjiang — through suppliers who guarantee fair labor practices. Our precious metals are recycled where possible.", cat:"products" },
  { q:"How do the 28 Mansions bracelets work?", a:"Each of the 28 lunar mansions has a distinct astrological character. The bracelet you choose aligns with the mansion that matches your intention — protection, clarity, abundance, wisdom, or transformation. Each comes with a card explaining your mansion's meaning.", cat:"products" },
  { q:"Can I layer multiple bracelets?", a:"Absolutely. Many customers wear 2-3 mansion bracelets together, each representing a different intention. The 5 Elements collection is designed to be stacked. The Four Symbols stacking rings are meant to be worn together or separately.", cat:"products" },
  { q:"What if my piece breaks or needs repair?", a:"We offer complimentary repairs for manufacturing defects within one year of purchase. For wear-and-tear repairs after one year, contact us for a quote. We believe jewelry should last generations.", cat:"returns" },
  { q:"Do you have a physical store?", a:"MythRealms is an online-only atelier, which allows us to offer handcrafted luxury at accessible prices — no retail markup, no middlemen. Every dollar goes into materials and craftsmanship.", cat:"order" },
];

export default function FAQPage() {
  const [activeCat, setActiveCat] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filtered = activeCat === "all" ? faqs : faqs.filter(f => f.cat === activeCat);
  const categories = ["all", "order", "shipping", "returns", "products"];

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <Link href="/" className="hover:text-[var(--text)]">Home</Link><span>/</span><span className="text-[var(--text)]">FAQs</span>
      </nav>

      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl font-bold text-[var(--text)] mb-3">Frequently Asked Questions</h1>
        <p className="text-[var(--text-muted)]">Find answers to common questions about our mythical collections, shipping, returns, and more</p>
      </div>

      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {categories.map(cat => (
          <button key={cat} onClick={() => { setActiveCat(cat); setOpenIndex(null); }}
            className={`px-5 py-2 rounded-full text-sm font-medium transition border ${activeCat===cat?'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)]':'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]'}`}>
            {cat.charAt(0).toUpperCase()+cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((faq, i) => (
          <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
            <button onClick={() => setOpenIndex(openIndex===i?null:i)} className="w-full flex items-center justify-between p-5 text-left font-semibold text-[var(--text)] hover:bg-[var(--bg)] transition">
              {faq.q}
              {openIndex===i ? <Minus className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" /> : <Plus className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />}
            </button>
            {openIndex===i && <div className="px-5 pb-5 text-sm text-[var(--text-secondary)] leading-relaxed">{faq.a}</div>}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-[var(--text-muted)]">No FAQs match this filter.</p>
          </div>
        )}
      </div>

      <div className="text-center mt-16 pt-12 border-t border-[var(--border)]">
        <h3 className="font-serif text-2xl font-bold text-[var(--text)] mb-2">Still have questions?</h3>
        <p className="text-sm text-[var(--text-muted)] mb-4">Our support team typically responds within 24 hours</p>
        <a href="mailto:support@mythrealms.com" className="inline-block px-8 py-3 bg-[var(--accent)] text-[var(--bg)] rounded-full font-semibold hover:bg-[var(--accent-hover)] transition">Contact Us</a>
      </div>

      {/* FAQPage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: f.a,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
