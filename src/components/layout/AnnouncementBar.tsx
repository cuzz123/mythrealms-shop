"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative z-50" role="region" aria-label="Announcements">
      {/* Top bar — Free Shipping */}
      <div className="bg-[var(--announcement-bg)] text-[var(--announcement-text)]">
        <div className="mx-auto max-w-7xl px-4 py-2.5 text-center text-sm leading-relaxed">
          <span>
            Free Shipping Over $69.99{" "}
            <span className="text-[#8B7355]">|</span>{" "}
            New: Curated Stones Collection{" "}
            <span className="text-[#8B7355]">|</span>{" "}
            15% Off First Order: MYTH15
          </span>
        </div>
      </div>

      {/* Bottom bar — Trust & Quality */}
      <div className="bg-[#1A1210] text-[var(--announcement-text)]">
        <div className="mx-auto max-w-7xl px-4 py-2.5 text-center text-sm leading-relaxed">
          <div className="flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-3">
            <span>Hand-Selected Stones · 30-Day Easy Returns · Ethically Sourced</span>
          </div>
        </div>
      </div>

      {/* Dismiss button */}
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-[#8B7355] transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Close announcement banner"
      >
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  );
}
