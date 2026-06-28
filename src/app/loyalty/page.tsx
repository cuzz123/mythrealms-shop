import type { Metadata } from "next";
import Link from "next/link";
import { Crown, Shield, Sparkles, ArrowRight, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Loyalty Program — MythRealms | Earn Points on Every Purchase",
  description:
    "Earn 1 point per $1 spent. Unlock Silver and Gold tiers for discounts and early access to new stones.",
};

const tiers = [
  {
    name: "Bronze",
    icon: Shield,
    range: "0 – 99 points",
    color: "#CD7F32",
    benefit: "You're just starting your journey",
    perks: ["1 point per $1 spent", "Access to all collections"],
  },
  {
    name: "Silver",
    icon: Star,
    range: "100 – 499 points",
    color: "#C0C0C0",
    benefit: "5% off all orders",
    perks: [
      "5% off every order",
      "1 point per $1 spent",
      "Early access to seasonal drops",
    ],
  },
  {
    name: "Gold",
    icon: Crown,
    range: "500+ points",
    color: "#D4A84B",
    benefit: "10% off + early access to new stones",
    perks: [
      "10% off every order",
      "Early access to new stones",
      "Exclusive Gold-only pieces",
      "Priority customer support",
    ],
  },
];

export default function LoyaltyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-10">
        <Link href="/" className="hover:text-[var(--text)]">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Loyalty Program</span>
      </nav>

      {/* Hero */}
      <div className="text-center mb-12">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center">
          <Crown className="w-7 h-7 text-[var(--accent)]" strokeWidth={1.5} />
        </div>
        <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[var(--accent)] uppercase mb-3">
          Loyalty Program
        </span>
        <h1 className="font-serif text-3xl font-bold text-[var(--text)] mb-3">
          Earn Points. Unlock Rewards.
        </h1>
        <p className="text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
          1 point per $1 spent. 100 points = $5 off. Stack your points and
          climb the tiers for exclusive benefits.
        </p>
      </div>

      {/* Points Overview */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 md:p-8 mb-10">
        <h3 className="font-serif text-sm font-semibold text-[var(--text)] mb-4">
          How Points Work
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: "Earn", value: "1 pt / $1", desc: "On every purchase" },
            {
              label: "Redeem",
              value: "100 pts = $5",
              desc: "Discount at checkout",
            },
            {
              label: "No Expiry",
              value: "Points last",
              desc: "As long as your account",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl p-4 text-center"
            >
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                {item.label}
              </p>
              <p className="font-serif text-lg font-bold text-[var(--accent)]">
                {item.value}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar (conceptual) */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 md:p-8 mb-10">
        <h3 className="font-serif text-sm font-semibold text-[var(--text)] mb-6">
          Your Tier Progress
        </h3>

        {/* Tier markers */}
        <div className="relative mb-3">
          <div className="h-2 bg-[var(--surface-alt)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, #CD7F32 0%, #C0C0C0 50%, #D4A84B 100%)",
                width: "100%",
              }}
            />
          </div>
          {/* Markers */}
          <div className="flex justify-between mt-2">
            {[
              { label: "Bronze", points: "0", position: "0%" },
              { label: "Silver", points: "100", position: "33%" },
              { label: "Gold", points: "500", position: "66%" },
            ].map((m) => (
              <div
                key={m.label}
                className="text-center"
                style={{ flexBasis: "33%", maxWidth: "33%" }}
              >
                <div className="w-3 h-3 rounded-full bg-[var(--accent)] mx-auto -mt-[18px] mb-2" />
                <p className="text-xs font-semibold text-[var(--text)]">
                  {m.label}
                </p>
                <p className="text-[10px] text-[var(--text-muted)]">
                  {m.points} pts
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tier Cards */}
      <div className="space-y-4 mb-10">
        <h3 className="font-serif text-sm font-semibold text-[var(--text)] mb-2">
          Tiers & Benefits
        </h3>
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 group hover:border-[var(--accent)]/30 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div
                className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: `${tier.color}15`,
                  border: `1px solid ${tier.color}30`,
                }}
              >
                <tier.icon
                  className="w-6 h-6"
                  style={{ color: tier.color }}
                  strokeWidth={1.5}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4
                    className="font-serif text-lg font-bold"
                    style={{ color: tier.color }}
                  >
                    {tier.name}
                  </h4>
                  <span className="text-xs text-[var(--text-muted)]">
                    {tier.range}
                  </span>
                </div>
                <p className="text-sm text-[var(--text)] font-medium mb-3">
                  {tier.benefit}
                </p>
                <ul className="space-y-1.5">
                  {tier.perks.map((perk) => (
                    <li
                      key={perk}
                      className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
                    >
                      <Sparkles
                        className="w-3.5 h-3.5 shrink-0"
                        style={{ color: tier.color }}
                        strokeWidth={1.5}
                      />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--accent)] text-white rounded-full font-semibold hover:bg-[var(--accent-hover)] transition"
        >
          Sign Up / View Your Points <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="mt-4 text-sm text-[var(--text-muted)]">
          Points program coming soon — sign up to be notified when it launches.
        </p>
      </div>
    </div>
  );
}
