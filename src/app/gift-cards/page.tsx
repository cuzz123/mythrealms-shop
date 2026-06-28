"use client";

import { useState } from "react";
import Link from "next/link";
import { Gift, CheckCircle, ArrowRight, Loader2 } from "lucide-react";

const amountOptions = [25, 50, 100] as const;

export default function GiftCardsPage() {
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [giftCode, setGiftCode] = useState("");

  const selectedAmount = amount ?? (customAmount ? Number(customAmount) : null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedAmount || selectedAmount < 1) {
      setError("Please select or enter a valid amount.");
      return;
    }
    if (!recipientName.trim()) {
      setError("Please enter the recipient's name.");
      return;
    }
    if (!recipientEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
      setError("Please enter a valid recipient email.");
      return;
    }
    if (!senderEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/gift-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedAmount,
          recipientName: recipientName.trim(),
          recipientEmail: recipientEmail.trim(),
          message: message.trim(),
          senderEmail: senderEmail.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setGiftCode(data.code);
      setSent(true);
    } catch {
      setError("Failed to send gift card. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-[var(--accent)]" strokeWidth={1.5} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[var(--text)] mb-3">
            Gift Card Sent!
          </h1>
          <p className="text-[var(--text-secondary)] mb-2 leading-relaxed">
            Your ${selectedAmount} gift card has been sent to{" "}
            <span className="text-[var(--text)] font-semibold">{recipientName}</span>{" "}
            at {recipientEmail}.
          </p>
          {giftCode && (
            <div className="mt-4 inline-block bg-[var(--surface-alt)] border border-[var(--border)] rounded-lg px-5 py-3">
              <p className="text-xs text-[var(--text-muted)] mb-1">Gift Card Code</p>
              <p className="font-mono text-lg font-bold text-[var(--accent)] tracking-wider">
                {giftCode}
              </p>
            </div>
          )}
          <div className="mt-8">
            <Link
              href="/collections/curated-singles"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white rounded-full font-semibold hover:bg-[var(--accent-hover)] transition"
            >
              Shop The Archetypes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-10">
        <Link href="/" className="hover:text-[var(--text)]">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Gift Cards</span>
      </nav>

      <div className="text-center mb-10">
        <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[var(--accent)] uppercase mb-3">
          Digital Gift Card
        </span>
        <h1 className="font-serif text-3xl font-bold text-[var(--text)] mb-3">
          Give the Gift of Intention
        </h1>
        <p className="text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
          A MythRealms gift card lets someone choose the stone that speaks to them.
          Sent instantly via email — perfect for last-minute gifts.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 md:p-8 space-y-8"
      >
        {/* Amount Selection */}
        <div>
          <label className="block font-serif text-sm font-semibold text-[var(--text)] mb-4">
            Select Amount
          </label>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {amountOptions.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => {
                  setAmount(val);
                  setCustomAmount("");
                }}
                className={`py-3 px-4 rounded-xl border text-center font-semibold text-sm transition-all ${
                  amount === val
                    ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)]/50"
                }`}
              >
                ${val}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium">
              $
            </span>
            <input
              type="number"
              min="1"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setAmount(null);
              }}
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
        </div>

        <div className="h-px bg-[var(--border)]" />

        {/* Recipient Details */}
        <div className="space-y-5">
          <h3 className="font-serif text-sm font-semibold text-[var(--text)]">
            Recipient Details
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                Recipient Name
              </label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Their name"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                Recipient Email
              </label>
              <input
                type="email"
                required
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="their@email.com"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
              Personal Message <span className="text-[var(--text-muted)] font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              maxLength={300}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a short message to the recipient..."
              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
            />
            <p className="text-xs text-[var(--text-muted)] mt-1 text-right">
              {message.length}/300
            </p>
          </div>
        </div>

        <div className="h-px bg-[var(--border)]" />

        {/* Sender Details */}
        <div>
          <h3 className="font-serif text-sm font-semibold text-[var(--text)] mb-4">
            Your Details
          </h3>
          <div>
            <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
              Your Email
            </label>
            <input
              type="email"
              required
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
            <p className="text-xs text-[var(--text-muted)] mt-1.5">
              We&apos;ll send a confirmation to this address.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[var(--accent)] text-white rounded-full font-semibold hover:bg-[var(--accent-hover)] transition disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Gift className="w-4 h-4" />
              Send Gift Card — ${selectedAmount || "?"}
            </>
          )}
        </button>
      </form>

      {/* Info section */}
      <div className="mt-10 grid sm:grid-cols-3 gap-4 text-center">
        {[
          { title: "Instant Delivery", desc: "Gift card is sent via email immediately after purchase." },
          { title: "No Expiration", desc: "Gift cards never expire. Use them whenever you are ready." },
          { title: "Any Collection", desc: "Redeemable on any MythRealms piece across all collections." },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl p-5"
          >
            <h3 className="font-serif text-sm font-bold text-[var(--text)] mb-1.5">
              {item.title}
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
