"use client";

import { useState, useEffect } from "react";
import { Cookie, ShieldCheck } from "lucide-react";
import Link from "next/link";
import {
  CONSENT_CHANGED_EVENT,
  CONSENT_STORAGE_KEY,
  hasValidStoredConsent,
  serializeConsent,
} from "@/lib/analytics/consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let hasValidConsent = false;
    try {
      hasValidConsent = hasValidStoredConsent(localStorage.getItem(CONSENT_STORAGE_KEY));
    } catch {
      hasValidConsent = false;
    }

    if (!hasValidConsent) {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  function acceptAll() {
    localStorage.setItem(CONSENT_STORAGE_KEY, serializeConsent("all"));
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT));
    setVisible(false);
  }

  function acceptNecessary() {
    localStorage.setItem(CONSENT_STORAGE_KEY, serializeConsent("essential"));
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[300] animate-slide-up"
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
    >
      <div className="bg-[var(--surface-raised)] border-t border-[var(--border)] shadow-[var(--shadow-xl)]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Content */}
            <div className="flex items-start gap-3 min-w-0">
              <Cookie className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-[var(--text)] font-medium mb-0.5">
                  This website uses cookies
                </p>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  We use cookies to enhance your browsing experience, analyze
                  site traffic, and personalize content. By clicking
                  &ldquo;Accept All&rdquo;, you consent to our use of cookies.
                  Read our{" "}
                  <Link
                    href="/privacy"
                    className="text-[var(--accent)] underline underline-offset-2 hover:text-[var(--accent-hover)]"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={acceptNecessary}
                className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] border border-[var(--border)] rounded-lg hover:bg-[var(--border-light)] hover:text-[var(--text)] transition"
              >
                Essential Only
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="px-5 py-2 text-sm font-semibold text-[var(--bg)] bg-[var(--accent)] rounded-lg hover:bg-[var(--accent-hover)] transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
