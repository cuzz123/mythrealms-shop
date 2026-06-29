"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
  { q:"How long does shipping take?", a:"Standard shipping takes 7-20 business days. Express shipping via DHL takes 6-8 business days. US orders typically arrive within 8-14 business days.", cat:"shipping" },
  { q:"Do you ship internationally?", a:"Yes! We ship to 36 countries including US, UK, Canada, Australia, all EU countries, Japan, Singapore, and more. See the full list at checkout.", cat:"shipping" },
  { q:"What is your return policy?", a:"30-day money-back guarantee. Items must be unused and in original packaging. Start a return at /returns or contact us.", cat:"returns" },
  { q:"How do I track my order?", a:"You will receive a confirmation email with a tracking number once your order ships. You can also check your order status at /track-order.", cat:"shipping" },
  { q:"What payment methods do you accept?", a:"We accept Visa, Mastercard, American Express, and Discover — all processed securely through LemonSqueezy. We also offer PayPal checkout directly on our site.", cat:"order" },
  { q:"How do I use a discount code?", a:"Enter your code at checkout in the Discount Code field and click Apply. First-time customers can use MYTH15 for 15% off.", cat:"order" },
  { q:"Are the gemstones genuine?", a:"Yes. We use authentic natural gemstones — black obsidian, rose quartz, amethyst, tiger's eye, moonstone, green aventurine, and freshwater pearls. Each stone is hand-selected for quality and character. Natural variations in color and pattern confirm authenticity.", cat:"products" },
  { q:"How do I care for my piece?", a:"Remove before swimming, showering, or exercising. Avoid contact with perfumes, lotions, and hairspray. Store in the provided soft pouch away from direct sunlight. Clean gently with the included polishing cloth.", cat:"products" },
  { q:"Why does it take 7-20 business days to deliver?", a:"Each bracelet is individually hand-strung and quality-checked before shipping. We do not mass-produce or warehouse thousands of units. Your piece is inspected, packaged, and shipped with care — this is not fast fashion. It is worth the wait.", cat:"products" },
  { q:"What size bracelet should I order?", a:"Our bracelets are designed to fit most wrists — one size with an elastic cord that comfortably fits wrist sizes 6.5 to 7.5 inches (16.5-19 cm). For specific sizing questions, see our Size Guide or email us.", cat:"products" },
  { q:"Can I change or cancel my order?", a:"Orders can be modified or cancelled within 4 hours of placement. Contact us immediately with your order number.", cat:"order" },
  { q:"How do I know which crystal intention is right for me?", a:"Trust what draws you. The stone you keep looking at — the one you click on and come back to — is usually the one. If you're unsure, take our Crystal Intention Quiz. It asks three questions and matches you to one of six archetypes: The Watchman (protection), The Heart Opener (self-love), The Seer (intuition), The Phoenix (renewal), The Strategist (confidence), or The Lion's Share (abundance).", cat:"products" },
  { q:"Do you offer gift wrapping?", a:"Every order arrives carefully packaged in a MythRealms box, ready to gift. No price tags are included.", cat:"order" },
  { q:"My item arrived damaged. What now?", a:"Email mythrealms@outlook.com within 48 hours of delivery with photos. We will arrange a free replacement or full refund immediately — no return shipping cost to you.", cat:"returns" },
  { q:"Do you offer wholesale or bulk orders?", a:"We offer wholesale pricing for orders of 10+ pieces. Ideal for boutiques, museum shops, and wellness studios. Email mythrealms@outlook.com for our catalog and pricing guide.", cat:"order" },
  { q:"Are your products ethically sourced?", a:"Yes. We work directly with trusted suppliers who guarantee fair labor practices and safe working conditions. Our gemstones and pearls are sourced from established markets with verified supply chains. We visit our suppliers and inspect every batch personally.", cat:"products" },
  { q:"Can I wear multiple intention bracelets at once?", a:"Absolutely. Many people stack two or three intentions — protection on one wrist, abundance on the other. The practice is personal. Wear what feels right.", cat:"products" },
  { q:"Are there physical stores?", a:"MythRealms is an online-only atelier, which allows us to offer handcrafted accessories at accessible prices — no retail markup, no middlemen. Every dollar goes into materials and quality.", cat:"order" },
  { q:"What if my piece breaks or needs repair?", a:"We offer complimentary repairs for manufacturing defects within one year of purchase. For wear-and-tear repairs after one year, contact us for a quote. We believe jewelry should last generations.", cat:"returns" },
  { q:"Are there physical stores?", a:"MythRealms is online-only, which allows us to offer handcrafted accessories at accessible prices — no retail markup, no middlemen.", cat:"order" },
];

export default function FAQPage() {
  const [activeCat, setActiveCat] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Show sticky contact bar after scrolling past first few FAQs
  useEffect(() => {
    const onScroll = () => setShowStickyBar(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = activeCat === "all" ? faqs : faqs.filter(f => f.cat === activeCat);
  const categories = ["all", "order", "shipping", "returns", "products"];

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <Link href="/" className="hover:text-[var(--text)]">Home</Link><span>/</span><span className="text-[var(--text)]">FAQs</span>
      </nav>

      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl font-bold text-[var(--text)] mb-3">Frequently Asked Questions</h1>
        <p className="text-[var(--text-muted)]">Find answers to common questions about our intention pieces and crystals, shipping, returns, and more</p>
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
        <a href="mailto:mythrealms@outlook.com" className="inline-block px-8 py-3 bg-[var(--accent)] text-[var(--bg)] rounded-full font-semibold hover:bg-[var(--accent-hover)] transition">Contact Us</a>
      </div>

      {/* Sticky contact bar — appears after scrolling past first few FAQs */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--surface)] border-t border-[var(--border)] shadow-[0_-4px_20px_rgba(0,0,0,0.5)] animate-slide-up">
          <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">Still have questions?</p>
              <p className="text-xs text-[var(--text-muted)]">Our support team typically responds within 24 hours</p>
            </div>
            <Link href="/contact" className="shrink-0 px-5 py-2 bg-[var(--accent)] text-white rounded-full text-sm font-semibold hover:bg-[var(--accent-hover)] transition">
              Contact Us
            </Link>
          </div>
        </div>
      )}

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
