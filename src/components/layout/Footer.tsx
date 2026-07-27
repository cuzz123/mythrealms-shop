"use client";

import Link from "next/link";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { BRAND } from "@/lib/brand-identity";
import { FOOTER_GROUPS } from "@/lib/storefront/navigation";

export function Footer() {
  return (
    <footer className="bg-[var(--charcoal)] text-[var(--announcement-text)]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 border-y border-white/15 py-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-xl font-semibold tracking-normal text-white">{BRAND.name}</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-[#B0A590]">
              {BRAND.tagline}
            </p>
            <div className="space-y-4 pt-2 text-sm text-[#b7c2bd]">
              <p className="font-medium text-white">{BRAND.newsletterTitle}</p>
              <p>New pieces and styling notes, sent occasionally.</p>
              <NewsletterForm tone="dark" />
            </div>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <div key={group.label}>
              <h3 className="mb-5 font-serif text-sm font-semibold tracking-normal text-white uppercase">{group.label}</h3>
              <ul className="space-y-3">
                {group.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="block py-2 text-sm text-[#b7c2bd] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl justify-center px-4 py-6 text-xs text-[#b7c2bd]">
          <p>&copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
