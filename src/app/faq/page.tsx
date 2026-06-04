"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  { q:"How long does shipping take?", a:"Standard shipping takes 7-20 business days. Express shipping via DHL takes 6-8 business days. US orders typically arrive within 8-14 business days.", cat:"shipping" },
  { q:"Do you ship internationally?", a:"Yes! We offer worldwide free shipping on all orders over $69.99 to 80+ countries.", cat:"shipping" },
  { q:"What is your return policy?", a:"30-day money-back guarantee. Items must be unused and in original packaging. Sale items are non-returnable.", cat:"returns" },
  { q:"How do I track my order?", a:"You will receive a confirmation email with a tracking number once your order ships.", cat:"shipping" },
  { q:"What payment methods do you accept?", a:"Visa, Mastercard, American Express, Discover, PayPal, Google Pay, and Apple Pay.", cat:"order" },
  { q:"How do I use a discount code?", a:"Enter your code at checkout in the 'Discount Code' field and click Apply.", cat:"order" },
  { q:"Are the materials genuine?", a:"Absolutely. We personally source every material and guarantee authenticity. Natural variations are not defects — they make each piece unique.", cat:"products" },
  { q:"How do I care for my piece?", a:"Remove before swimming or showering. Avoid perfumes and lotions. Store in a soft pouch away from sunlight.", cat:"products" },
  { q:"What size bracelet should I order?", a:"Measure your wrist just below the wrist bone. For snug fit, choose exact measurement. For loose fit, add 1-2cm.", cat:"products" },
  { q:"Can I change or cancel my order?", a:"You can modify or cancel within 2 hours of placing it. Contact us immediately with your order number.", cat:"order" },
  { q:"Where do the mythical beast designs come from?", a:"Every design is researched from the Classic of Mountains and Seas (Shan Hai Jing) — China's oldest bestiary, dating back over 2,000 years.", cat:"products" },
  { q:"Do you offer gift wrapping?", a:"Yes! All orders come in a MythRealms gift box with a story card explaining the legend behind your piece.", cat:"order" },
  { q:"My item arrived damaged. What now?", a:"Email us within 48 hours of delivery with photos. We will arrange a replacement or full refund immediately.", cat:"returns" },
  { q:"Do you offer wholesale?", a:"Yes! Contact us at support@mythrealms.com for minimum order quantities and pricing.", cat:"order" },
  { q:"Are your products ethically sourced?", a:"Yes. We partner directly with artisan communities, ensuring fair wages and safe working conditions.", cat:"products" },
];

export default function FAQPage() {
  const [activeCat, setActiveCat] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filtered = activeCat === "all" ? faqs : faqs.filter(f => f.cat === activeCat);
  const categories = ["all", "order", "shipping", "returns", "products"];

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <a href="/" className="hover:text-[var(--text)]">Home</a><span>/</span><span className="text-[var(--text)]">FAQs</span>
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
      </div>

      <div className="text-center mt-16 pt-12 border-t border-[var(--border)]">
        <h3 className="font-serif text-2xl font-bold text-[var(--text)] mb-2">Still have questions?</h3>
        <p className="text-sm text-[var(--text-muted)] mb-4">Our support team typically responds within 24 hours</p>
        <a href="mailto:support@mythrealms.com" className="inline-block px-8 py-3 bg-[var(--accent)] text-[var(--bg)] rounded-full font-semibold hover:bg-[var(--accent-hover)] transition">Contact Us</a>
      </div>
    </div>
  );
}
