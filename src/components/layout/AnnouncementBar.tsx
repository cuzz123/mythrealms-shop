"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const MESSAGES = [
  "Free Shipping Over $69.99",
  "New: Curated Stones Collection",
  "15% Off First Order — Code: MYTH15",
];

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % MESSAGES.length), 3500);
    return () => clearInterval(t);
  }, []);

  if (dismissed) return null;

  return (
    <div className="relative z-50 bg-[var(--announcement-bg)] text-[var(--announcement-text)]" role="region" aria-label="Announcement">
      <div className="mx-auto max-w-7xl px-10 py-2.5 text-center text-sm">
        <span key={idx} className="animate-fade-in">
          {MESSAGES[idx]}
        </span>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-[#8B7355] transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Close announcement"
      >
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  );
}
