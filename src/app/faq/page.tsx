"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HelpCircle, Minus, Plus } from "lucide-react";

const faqs = [
  {
    q: "How long does shipping take?",
    a: "Standard shipping usually takes 7-20 business days. Express shipping, when available, usually takes 6-8 business days. You will receive tracking once your order ships.",
    cat: "shipping",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes. We ship to many major markets including the United States, United Kingdom, Canada, Australia, EU countries, Japan, Singapore, and more. Available destinations are shown at checkout.",
    cat: "shipping",
  },
  {
    q: "Why does delivery take longer than a big marketplace?",
    a: "MythRealms is a lean launch, so we do not hold deep inventory for every style. Many pieces are prepared after ordering through trusted jewelry suppliers and partner workshops. This keeps the collection focused and avoids over-ordering before demand is proven.",
    cat: "shipping",
  },
  {
    q: "What is your return policy?",
    a: "We offer a 30-day return window. Items must be unused and in original packaging. Start a return through the returns page or contact mythrealms@outlook.com.",
    cat: "returns",
  },
  {
    q: "My item arrived damaged. What should I do?",
    a: "Email mythrealms@outlook.com within 48 hours of delivery with your order number and clear photos. We will review it quickly and help with a replacement or refund.",
    cat: "returns",
  },
  {
    q: "Can I change or cancel my order?",
    a: "Orders can usually be modified or cancelled within 4 hours of purchase. Contact us as soon as possible with your order number.",
    cat: "order",
  },
  {
    q: "What payment methods do you accept?",
    a: "We currently accept PayPal checkout. Funding options shown inside PayPal vary by account and country.",
    cat: "order",
  },
  {
    q: "How do I use a discount code?",
    a: "Enter your code at checkout in the discount code field and apply it before payment. First-time customers can try MYTH15 for 15% off.",
    cat: "order",
  },
  {
    q: "Are your pearls and gemstones natural?",
    a: "Product pages describe the available material information for each piece. Natural pearls and gemstones can vary in tone, size, surface texture, and luster, so small differences are expected and part of the character of the piece.",
    cat: "products",
  },
  {
    q: "Why are some product photos supplier-style images?",
    a: "We are launching lean, so some early product images are supplier-provided while we test demand and replace key styles with in-house creative over time. We keep the product page focused on the actual piece, color family, and styling expectation.",
    cat: "products",
  },
  {
    q: "How do I choose the right intention?",
    a: "Start with the feeling you want to carry: calm, renewal, boundaries, clarity, soft power, or balance. If you are unsure, take the Guardian Archetype Quiz and use the result as a starting point.",
    cat: "products",
  },
  {
    q: "Are the guardian archetypes literal product shapes?",
    a: "No. The guardian is the story layer and personality match behind the piece. Most products are wearable pearl and gemstone jewelry, not literal animal or mythical creature designs.",
    cat: "products",
  },
  {
    q: "Do the stones have healing effects?",
    a: "Our intention language is symbolic and emotional. It is meant for personal ritual, styling, and meaning, not medical, spiritual, or guaranteed outcome claims.",
    cat: "products",
  },
  {
    q: "How do I care for my jewelry?",
    a: "Remove your piece before swimming, showering, exercising, or sleeping. Avoid perfume, lotion, and hairspray. Store it in a pouch or jewelry box and clean gently with a soft cloth.",
    cat: "products",
  },
  {
    q: "What size bracelet should I order?",
    a: "Many bracelets are designed to fit most wrists with an elastic or adjustable structure. Check each product page for details, and contact us before ordering if you need help with sizing.",
    cat: "products",
  },
  {
    q: "Can I wear multiple intentions at once?",
    a: "Yes. Many customers stack calm with protection, renewal with clarity, or pearls with darker stones. The practice is personal, so choose what feels natural to wear.",
    cat: "products",
  },
  {
    q: "Do you offer gift wrapping?",
    a: "Orders arrive carefully packaged and ready to gift. No price tags are included.",
    cat: "order",
  },
  {
    q: "Are there physical stores?",
    a: "MythRealms is online-only for now. This lets us keep the launch focused, test demand style by style, and avoid unnecessary retail markup.",
    cat: "order",
  },
  {
    q: "Do you offer wholesale or bulk orders?",
    a: "For boutique, studio, or event inquiries, email mythrealms@outlook.com with the styles and quantities you are considering.",
    cat: "order",
  },
];

export default function FAQPage() {
  const [activeCat, setActiveCat] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowStickyBar(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filtered = activeCat === "all" ? faqs : faqs.filter((f) => f.cat === activeCat);
  const categories = ["all", "order", "shipping", "returns", "products"];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <nav className="mb-4 flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--text)]">
          Home
        </Link>
        <span>/</span>
        <span className="text-[var(--text)]">FAQs</span>
      </nav>

      <div className="mb-10 text-center">
        <h1 className="mb-3 font-serif text-4xl font-bold text-[var(--text)]">
          Frequently Asked Questions
        </h1>
        <p className="text-[var(--text-muted)]">
          Answers about pearl and gemstone pieces, guardian archetypes, shipping, and returns.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setActiveCat(cat);
              setOpenIndex(null);
            }}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
              activeCat === cat
                ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--bg)]"
                : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((faq, i) => (
          <div key={faq.q} className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]">
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between p-5 text-left font-semibold text-[var(--text)] transition hover:bg-[var(--bg)]"
            >
              {faq.q}
              {openIndex === i ? (
                <Minus className="h-4 w-4 flex-shrink-0 text-[var(--text-muted)]" />
              ) : (
                <Plus className="h-4 w-4 flex-shrink-0 text-[var(--text-muted)]" />
              )}
            </button>
            {openIndex === i && (
              <div className="px-5 pb-5 text-sm leading-relaxed text-[var(--text-secondary)]">
                {faq.a}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <HelpCircle className="mx-auto mb-3 h-10 w-10 text-[var(--text-muted)]" />
            <p className="text-[var(--text-muted)]">No FAQs match this filter.</p>
          </div>
        )}
      </div>

      <div className="mt-16 border-t border-[var(--border)] pt-12 text-center">
        <h3 className="mb-2 font-serif text-2xl font-bold text-[var(--text)]">Still have questions?</h3>
        <p className="mb-4 text-sm text-[var(--text-muted)]">We usually respond within 24 hours.</p>
        <a
          href="mailto:mythrealms@outlook.com"
          className="inline-block rounded-full bg-[var(--accent)] px-8 py-3 font-semibold text-[var(--bg)] transition hover:bg-[var(--accent-hover)]"
        >
          Contact Us
        </a>
      </div>

      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up border-t border-[var(--border)] bg-[var(--surface)] shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-3">
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">Still have questions?</p>
              <p className="text-xs text-[var(--text-muted)]">We usually respond within 24 hours.</p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-[var(--bg)] transition hover:bg-[var(--accent-hover)]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}

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
