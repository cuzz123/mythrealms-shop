"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Copy, CheckCheck, Mail, ArrowRight, Users, Gift, Share2 } from "lucide-react";

function generateReferralCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);

  const referralCode = useMemo(() => generateReferralCode(), []);
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://mythrealms-shop.vercel.app";
  const referralLink = `${baseUrl}/checkout?ref=${referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareEmailLink = `mailto:?subject=Join%20MythRealms%20—%20Get%20$10%20off%20your%20first%20order&body=I%20found%20a%20shop%20that%20makes%20crystal%20bracelets%20with%20intention.%20Use%20this%20link%20to%20get%20$10%20off%20your%20first%20order:%0A%0A${encodeURIComponent(referralLink)}%0A%0AEach%20stone%20holds%20a%20purpose.%20Find%20the%20one%20that%20speaks%20to%20you.`;

  const shareWhatsAppLink = `https://wa.me/?text=${encodeURIComponent(`I found a crystal bracelet shop called MythRealms — each stone carries a specific intention. Use my referral link to get $10 off your first order: ${referralLink}`)}`;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-10">
        <Link href="/" className="hover:text-[var(--text)]">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Referral Program</span>
      </nav>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden mb-12 h-[300px] md:h-[360px]">
        <Image src="/images/gifts/referral-hero.webp" alt="MythRealms Referral Program" fill sizes="(max-width:768px) 100vw, 896px" className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center py-20 px-6">
          <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[var(--accent)] uppercase mb-3">Referral Program</span>
          <h1 className="font-serif text-3xl font-bold text-white mb-3">Give $10, Get $10</h1>
          <p className="text-white/70 max-w-md mx-auto leading-relaxed">Share MythRealms with someone you care about. When they make their first purchase, you both get $10 off.</p>
        </div>
      </div>

      {/* Referral Link Card */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 md:p-8 mb-8">
        <h3 className="font-serif text-sm font-semibold text-[var(--text)] mb-4">
          Your Referral Link
        </h3>
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] font-mono break-all select-all">
            {referralLink}
          </div>
          <button
            onClick={handleCopy}
            className={`shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
              copied
                ? "bg-green-500/10 border border-green-500/30 text-green-400"
                : "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
            }`}
          >
            {copied ? (
              <>
                <CheckCheck className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>

        <h3 className="font-serif text-sm font-semibold text-[var(--text)] mb-4">
          Share via
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-5 py-2.5 border border-[var(--border)] rounded-full text-sm font-medium text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copy Link
          </button>
          <a
            href={shareEmailLink}
            className="flex items-center gap-2 px-5 py-2.5 border border-[var(--border)] rounded-full text-sm font-medium text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            <Mail className="w-4 h-4" />
            Email
          </a>
          <a
            href={shareWhatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 border border-[var(--border)] rounded-full text-sm font-medium text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            <Share2 className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-[var(--surface-alt)] border border-[var(--border)] rounded-2xl p-6 md:p-8">
        <h3 className="font-serif text-sm font-semibold text-[var(--text)] mb-6">
          How It Works
        </h3>
        <div className="space-y-5">
          {[
            {
              step: "1",
              title: "Share your link",
              desc: "Send your unique referral link to a friend. Any channel works — text, email, DM, or carrier pigeon.",
            },
            {
              step: "2",
              title: "They make their first purchase",
              desc: "When your friend uses your link and completes their first order, $10 is automatically applied at checkout.",
            },
            {
              step: "3",
              title: "You both get rewarded",
              desc: "You receive a $10 credit on your next order. Share with as many friends as you like — there is no limit.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="shrink-0 w-9 h-9 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-sm font-bold text-[var(--accent)]">
                {item.step}
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-[var(--text)] mb-1">
                  {item.title}
                </h4>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-10 text-center">
        <Link
          href="/collections/curated-singles"
          className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--accent)] text-white rounded-full font-semibold hover:bg-[var(--accent-hover)] transition"
        >
          Browse the Collections <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
