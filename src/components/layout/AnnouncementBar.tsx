"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const MESSAGES = [
  "Free shipping over $69.99 | 30-day returns",
  "The Pearl Edit | Rings, bracelets, earrings and necklaces",
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % MESSAGES.length),
      4500,
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      role="region"
      aria-label="Announcement"
      className="relative z-40 min-h-9 bg-black"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <Link href="/collections/pearl-series" className="block text-[var(--announcement-text)]">
        <div className="mx-auto max-w-7xl px-4 py-2.5 text-center text-[11px] sm:text-sm">
          <span key={index} className="animate-fade-in">
            {MESSAGES[index]}
          </span>
        </div>
      </Link>
    </div>
  );
}
