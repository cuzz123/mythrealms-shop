"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const MESSAGES = [
  "Free Shipping Over $69.99  |  Hand-Selected Stones  |  30-Day Easy Returns  |  Ethically Sourced",
  "New: The Archetypes Collection — Shop Now",
  "15% Off First Order — Code: MYTH15",
  "Each stone hand-selected. Each intention uniquely yours.",
];

export function AnnouncementBar() {
  const [idx, setIdx] = useState(0);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % MESSAGES.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      role="region"
      aria-label="Announcement"
      className={`block ${isHome ? "absolute bg-black z-50" : "relative bg-black z-40"} top-0 left-0 right-0`}
      style={isHome ? { paddingTop: "env(safe-area-inset-top, 0px)" } : undefined}
    >
      <Link
        href="/collections/curated-singles"
        className="block text-[var(--announcement-text)]"
      >
        <div className="mx-auto max-w-7xl px-10 py-2.5 text-center text-sm tracking-widest">
          <span key={idx} className="animate-fade-in">
            {MESSAGES[idx]}
          </span>
        </div>
      </Link>
    </div>
  );
}
