import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unsubscribed — MythRealms",
  robots: { index: false },
};

export default function UnsubscribePage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <h1 className="font-serif text-3xl font-bold text-[var(--text)] mb-4">
        You have been unsubscribed
      </h1>
      <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
        You will no longer receive marketing emails from MythRealms. If this was
        a mistake, you can re-subscribe at any time from your account settings.
      </p>
      <Link
        href="/"
        className="inline-block px-8 py-3 bg-[var(--accent)] text-[var(--bg)] rounded-full font-semibold hover:bg-[var(--accent-hover)] transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
