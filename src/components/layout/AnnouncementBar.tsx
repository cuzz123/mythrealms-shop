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
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-sm text-[var(--announcement-text)]" role="region" aria-label="Announcement">
      <div className="mx-auto max-w-7xl px-10 py-1.5 text-center text-xs">
        <span key={idx} className="animate-fade-in">
          {MESSAGES[idx]}
        </span>
      </div>
      {/* Progress bar integrated into announcement bar */}
      <div className="flex gap-0">
        {MESSAGES.map((_, i) => (
          <div key={i} className="flex-1 h-[2px] bg-white/15">
            <div
              className="h-full bg-white/60 transition-none"
              style={{
                width: i === idx ? "100%" : "0%",
                animation: i === idx ? "progressFill 3.5s linear forwards" : "none",
              }}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full text-[#8B7355] transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Close announcement"
      >
        <X size={16} strokeWidth={2} />
      </button>
    </div>
  );
}
