"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCheck, Copy, Mail, Share2 } from "lucide-react";

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
    typeof window !== "undefined" ? window.location.origin : "https://mythrealms-shop.vercel.app";
  const referralLink = `${baseUrl}/checkout?ref=${referralCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
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

  const emailBody = `I found MythRealms, a pearl jewelry shop built around The Pearl Edit and guardian archetypes. Use this link to get $10 off your first order:\n\n${referralLink}\n\nTake the quiz or browse the pearl collection.`;
  const shareEmailLink = `mailto:?subject=${encodeURIComponent("Join MythRealms - Get $10 off your first order")}&body=${encodeURIComponent(emailBody)}`;
  const shareWhatsAppLink = `https://wa.me/?text=${encodeURIComponent(`I found MythRealms and The Pearl Edit. Use my referral link to get $10 off your first pearl jewelry order: ${referralLink}`)}`;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <nav className="mb-10 flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <Link href="/" className="hover:text-[var(--text)]">
          Home
        </Link>
        <span>/</span>
        <span className="text-[var(--text)]">Referral Program</span>
      </nav>

      <div className="relative mb-12 h-[300px] overflow-hidden rounded-2xl md:h-[360px]">
        <Image
          src="/images/gifts/referral-hero.webp"
          alt="MythRealms referral program"
          fill
          sizes="(max-width:768px) 100vw, 896px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 px-6 py-20 text-center">
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">
            Referral Program
          </span>
          <h1 className="mb-3 font-serif text-3xl font-bold text-white">Give $10, Get $10</h1>
          <p className="mx-auto max-w-md leading-relaxed text-white/70">
            Share MythRealms with someone who loves pearl jewelry. When they make
            their first purchase, you both get $10 off.
          </p>
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
        <h3 className="mb-4 font-serif text-sm font-semibold text-[var(--text)]">
          Your Referral Link
        </h3>
        <div className="mb-6 flex items-center gap-2">
          <div className="flex-1 select-all break-all rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-mono text-sm text-[var(--text)]">
            {referralLink}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
              copied
                ? "border border-green-500/30 bg-green-500/10 text-green-400"
                : "bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)]"
            }`}
          >
            {copied ? (
              <>
                <CheckCheck className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </button>
        </div>

        <h3 className="mb-4 font-serif text-sm font-semibold text-[var(--text)]">Share via</h3>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <Copy className="h-4 w-4" />
            Copy Link
          </button>
          <a
            href={shareEmailLink}
            className="flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <Mail className="h-4 w-4" />
            Email
          </a>
          <a
            href={shareWhatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <Share2 className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] p-6 md:p-8">
        <h3 className="mb-6 font-serif text-sm font-semibold text-[var(--text)]">How It Works</h3>
        <div className="space-y-5">
          {[
            {
              step: "1",
              title: "Share your link",
              desc: "Send your unique referral link to a friend by text, email, or DM.",
            },
            {
              step: "2",
              title: "They make their first purchase",
              desc: "When your friend uses your link and completes their first order, $10 is applied at checkout.",
            },
            {
              step: "3",
              title: "You both get rewarded",
              desc: "You receive a $10 credit on your next order. Share with as many friends as you like.",
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/10 text-sm font-bold text-[var(--accent)]">
                {item.step}
              </div>
              <div>
                <h4 className="mb-1 font-serif text-sm font-bold text-[var(--text)]">{item.title}</h4>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/collections/pearl-series"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-8 py-3 font-semibold text-[var(--bg)] transition hover:bg-[var(--accent-hover)]"
        >
          Shop Pearl Realms <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
