"use client";

import { useEffect, useState } from "react";

const CITIES = ["New York", "Los Angeles", "London", "Toronto", "Sydney", "Melbourne", "Chicago", "Miami", "San Francisco", "Seattle", "Austin", "Vancouver", "Dublin"];
const PRODUCTS = ["The Watchman", "The Heart Opener", "The Seer", "The Phoenix", "The Strategist", "The Lion's Share", "The Calm Tide", "The First Light", "The Keeper"];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function SocialProof() {
  const [popup, setPopup] = useState<{ city: string; product: string; timeAgo: string } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function showPopup() {
      setPopup({
        city: randomItem(CITIES),
        product: randomItem(PRODUCTS),
        timeAgo: `${Math.floor(Math.random() * 120) + 5} minutes ago`,
      });
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
    }

    // First popup after 5s, then every 20-40s
    const initial = setTimeout(showPopup, 5000);
    const interval = setInterval(showPopup, 20000 + Math.random() * 20000);

    return () => { clearTimeout(initial); clearInterval(interval); };
  }, []);

  if (!popup) return null;

  return (
    <div
      className={`fixed bottom-20 left-4 z-50 max-w-xs transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-lg text-sm">
        <p className="text-gray-500 text-xs">Someone from <span className="font-semibold text-gray-700">{popup.city}</span></p>
        <p className="text-gray-900 font-medium mt-0.5">bought <span className="text-[var(--accent)]">{popup.product}</span></p>
        <p className="text-gray-400 text-[11px] mt-1">{popup.timeAgo}</p>
      </div>
    </div>
  );
}
