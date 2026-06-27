"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

const question = {
  text: "What energy are you seeking right now?",
  options: [
    {
      label: "Clarity and focus — I need to cut through the noise",
      direction: "clarity",
      teaser: "You're drawn to stones of the mind. Amethyst, clear quartz, and lapis lazuli resonate with your path — stones that sharpen intuition and bring stillness to a busy mind.",
      guardians: ["Amethyst", "Clear Quartz", "Lapis Lazuli"],
    },
    {
      label: "Strength and protection — I'm holding a lot right now",
      direction: "strength",
      teaser: "You carry more than most. Black obsidian, tiger's eye, and hematite are your allies — stones that absorb what you cannot and return only what you need.",
      guardians: ["Black Obsidian", "Tiger's Eye", "Hematite"],
    },
    {
      label: "Love and renewal — I'm ready for a fresh chapter",
      direction: "transformation",
      teaser: "Something is ending. Something is beginning. Rose quartz, moonstone, and green aventurine walk with you through this threshold — stones of the heart, of new moons, of spring.",
      guardians: ["Rose Quartz", "Moonstone", "Green Aventurine"],
    },
  ],
} as const;

type Direction = (typeof question.options)[number] | null;

export function GuardianTeaser() {
  const [chosen, setChosen] = useState<Direction>(null);
  const [revealing, setRevealing] = useState(false);

  function handleChoose(option: Direction) {
    if (revealing) return;
    setRevealing(true);
    // Brief pause so the button press registers before the reveal
    setTimeout(() => {
      setChosen(option);
      setRevealing(false);
    }, 300);
  }

  function reset() {
    setChosen(null);
  }

  return (
    <section className="py-14 bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="max-w-2xl mx-auto px-6 text-center">
        {/* Heading — no eyebrow, just the question as the hook */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="text-xs font-semibold text-[var(--accent)] tracking-[0.04em]">
              Crystal Intention Quiz
            </span>
          </div>
          <h2 className="font-serif text-[clamp(1.5rem,3vw,2.25rem)] font-bold text-[var(--text)] text-balance leading-tight">
            {chosen ? "Your stones are calling" : "Which Crystal Speaks to Your Soul?"}
          </h2>
        </div>

        {/* Unanswered: show the question + 3 options */}
        {!chosen && (
          <div className="space-y-3" role="radiogroup" aria-label="Choose your answer">
            <p className="font-serif text-lg text-[var(--text-secondary)] mb-5 text-balance">
              {question.text}
            </p>
            {question.options.map((opt) => (
              <button
                key={opt.direction}
                type="button"
                role="radio"
                aria-checked={false}
                disabled={revealing}
                onClick={() => handleChoose(opt)}
                className="w-full text-left p-5 rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] transition-all duration-200 group disabled:opacity-60 disabled:cursor-default"
              >
                <span className="text-[15px] font-medium text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Reveal transition */}
        {revealing && (
          <div className="animate-fade-in py-8" aria-live="polite">
            <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-muted)]">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
              Reading the stars…
            </div>
          </div>
        )}

        {/* Answered: show teaser direction + CTA */}
        {chosen && !revealing && (
          <div className="animate-slide-up" aria-live="polite">
            {/* Teaser card */}
            <div className="bg-[var(--bg)] border border-[var(--accent)]/20 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center gap-1.5 mb-4">
                {chosen.guardians.map((g) => (
                  <span
                    key={g}
                    className="inline-block px-2.5 py-0.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[11px] font-semibold text-[var(--accent)]"
                  >
                    {g}
                  </span>
                ))}
              </div>
              <p className="text-[var(--text)] leading-relaxed text-[15px] text-balance">
                {chosen.teaser}
              </p>
            </div>

            {/* CTA to full quiz */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/guardian-quiz"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[var(--accent)] text-white rounded-full font-semibold text-sm hover:bg-[var(--accent-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] magnetic-glow"
              >
                <Sparkles className="w-4 h-4" />
                Take the Full Quiz
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={reset}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] rounded"
              >
                Choose differently
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
