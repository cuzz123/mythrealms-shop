"use client";

import Link from "next/link";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

const exploreLinks = [
  { label: "Serenity Collection", href: "/collections/pearl-series" },
  { label: "The Intention Stones", href: "/collections/luxe-collection" },
  { label: "Balance & Light", href: "/collections/pearl-crystal-series" },
  { label: "The Archetypes", href: "/collections/curated-singles" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
];

const supportLinks = [
  { label: "Contact", href: "/contact" },
  { label: "Track Order", href: "/track-order" },
  { label: "FAQs", href: "/faq" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/mythrealms.shop",
    icon: (
      <svg viewBox="0 0 18 18" fill="none" className="h-4 w-4" aria-hidden="true">
        <rect
          x="1.5"
          y="1.5"
          width="15"
          height="15"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="13.5" cy="4.5" r="0.9" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/mythrealms.shop",
    icon: (
      <svg viewBox="0 0 18 18" fill="none" className="h-4 w-4" aria-hidden="true">
        <path
          d="M10.5 16v-5.5h1.85l.28-2.15H10.5V7c0-.59.15-1 .98-1H12.7V3.82a15 15 0 00-1.62-.07c-1.52 0-2.56.93-2.56 2.63v1.47H6.5v2.15h2.02V16h1.98z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@mythrealms",
    icon: (
      <svg viewBox="0 0 18 18" fill="none" className="h-4 w-4" aria-hidden="true">
        <path
          d="M15.66 5.47a1.88 1.88 0 00-1.32-1.33C13.03 3.75 9 3.75 9 3.75s-4.03 0-5.34.39A1.88 1.88 0 002.34 5.47 22.9 22.9 0 002 9c0 1.24.11 2.4.34 3.53a1.88 1.88 0 001.32 1.33c1.31.39 5.34.39 5.34.39s4.03 0 5.34-.39a1.88 1.88 0 001.32-1.33c.23-1.13.34-2.29.34-3.53s-.11-2.4-.34-3.53z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M7.5 11.35l3.5-2.35L7.5 6.65v4.7z" fill="currentColor" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="bg-[#0A0808] text-[var(--announcement-text)]">
      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 — Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-xl font-semibold tracking-tight text-white">
                MythRealms
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-[#B0A590]">
              Stones with intention. Artisan finishes. Each piece holds a purpose
              — find the one that names what you are becoming.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#3A3228] text-[#8B7B64] transition-colors hover:border-[#B0A590] hover:text-white"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Explore */}
          <div>
            <h3 className="mb-5 font-serif text-sm font-semibold tracking-wide text-white uppercase">
              Explore
            </h3>
            <ul className="space-y-3">
              {exploreLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="block py-2 text-sm text-[#B0A590] transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Support */}
          <div>
            <h3 className="mb-5 font-serif text-sm font-semibold tracking-wide text-white uppercase">
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="block py-2 text-sm text-[#B0A590] transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact & Newsletter */}
          <div>
            <h3 className="mb-5 font-serif text-sm font-semibold tracking-wide text-white uppercase">
              Stay Connected
            </h3>
            <div className="space-y-4 text-sm text-[#B0A590]">
              <p>
                New intentions, stone stories, and subscriber-only offers
                — no spam, just the good stuff.
              </p>
              <NewsletterForm />
              <div className="pt-2 space-y-2">
                <a
                  href="mailto:mythrealms@outlook.com"
                  className="inline-block text-white transition-colors hover:text-[var(--accent)]"
                >
                  mythrealms@outlook.com
                </a>
                <p>Mon &ndash; Fri, 9am &ndash; 6pm EST</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#2A2218]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-[#8B7B64] sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} MythRealms. All rights
            reserved.
          </p>
          <p>
            We accept: VISA &bull; Mastercard &bull; AMEX &bull; PayPal
          </p>
        </div>
      </div>
    </footer>
  );
}
