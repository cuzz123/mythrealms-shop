"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const MESSAGES = [
  "Free Shipping Over $69.99  |  Hand-Selected Stones  |  30-Day Easy Returns  |  Ethically Sourced",
  "New: Curated Stones Collection — Shop Now",
  "15% Off First Order — Code: MYTH15",
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
    <Link
      href="/collections/curated-singles"
      className={`block ${isHome ? "absolute bg-black z-50" : "relative bg-black z-40"} top-0 left-0 right-0 text-[var(--announcement-text)]`}
      role="region"
      aria-label="Announcement"
    >
      <div className="mx-auto max-w-7xl px-10 py-2.5 text-center text-sm tracking-widest">
        <span key={idx} className="animate-fade-in">
          {MESSAGES[idx]}
        </span>
      </div>
    </Link>
  );
}
