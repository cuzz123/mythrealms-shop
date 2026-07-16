"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { getStorefrontProductBySlug } from "@/lib/storefront/catalog";
import { productDisplayName } from "@/lib/brand";

type Archetype = "phoenix" | "moon-rabbit" | "white-tiger" | "azure-dragon" | "nine-tailed-fox" | "black-tortoise";

const questions = [
  {
    text: "What kind of season are you entering?",
    options: [
      { label: "A fresh start after an ending.", archetypes: ["phoenix", "azure-dragon"] as Archetype[] },
      { label: "A quieter season where I need to protect my peace.", archetypes: ["white-tiger", "black-tortoise"] as Archetype[] },
      { label: "A softer, more magnetic version of myself.", archetypes: ["moon-rabbit", "nine-tailed-fox"] as Archetype[] },
    ],
  },
  {
    text: "What do you need your jewelry to remind you of?",
    options: [
      { label: "I can begin again before I feel ready.", archetypes: ["phoenix", "azure-dragon"] as Archetype[] },
      { label: "My boundaries are allowed to be beautiful.", archetypes: ["white-tiger", "black-tortoise"] as Archetype[] },
      { label: "Softness can still be power.", archetypes: ["moon-rabbit", "nine-tailed-fox"] as Archetype[] },
    ],
  },
  {
    text: "Which material feels closest to you today?",
    options: [
      { label: "Pearl: calm water, moonlight, quiet strength.", archetypes: ["moon-rabbit", "phoenix"] as Archetype[] },
      { label: "Cool pearl: clear lines, composure, quiet focus.", archetypes: ["white-tiger", "black-tortoise"] as Archetype[] },
      { label: "Sculptural pearl: movement, direction, visible becoming.", archetypes: ["azure-dragon", "nine-tailed-fox"] as Archetype[] },
    ],
  },
];

const results: Record<Archetype, {
  title: string;
  theme: string;
  description: string;
  productSlugs: string[];
}> = {
  phoenix: {
    title: "Phoenix",
    theme: "Renewal / Rebirth / New Beginnings",
    description:
      "Your season is about beginning again without waiting for perfect certainty. Choose luminous pearls and light-toned pieces that feel like first light after a long night.",
    productSlugs: ["pearl-series-05", "pearl-series-12", "pearl-series-18"],
  },
  "moon-rabbit": {
    title: "Moon Rabbit",
    theme: "Softness / Restoration / Quiet Luck",
    description:
      "Your strength is subtle. Pearl, pink tones, and gentle silhouettes keep you close to softness without making you feel fragile.",
    productSlugs: ["pearl-series-01", "pearl-series-13", "pearl-series-17"],
  },
  "white-tiger": {
    title: "White Tiger",
    theme: "Boundaries / Courage / Protection",
    description:
      "You are learning where your energy ends and everyone else's begins. Cool-toned pearls and clean lines give this archetype a grounded, decisive feel.",
    productSlugs: ["pearl-series-03", "pearl-series-07", "pearl-series-16"],
  },
  "azure-dragon": {
    title: "Azure Dragon",
    theme: "Growth / Vision / Direction",
    description:
      "This archetype belongs to movement, leadership, and the next horizon. Choose pearls with cool light and silhouettes that carry a sense of direction.",
    productSlugs: ["pearl-series-08", "pearl-series-12", "pearl-series-20"],
  },
  "nine-tailed-fox": {
    title: "Nine-Tailed Fox",
    theme: "Magnetism / Self-Worth / Charm",
    description:
      "Your current lesson is not to chase attention, but to inhabit your own value. Pearls, rose tones, and warm details carry this quiet magnetism well.",
    productSlugs: ["pearl-series-02", "pearl-series-14", "pearl-series-19"],
  },
  "black-tortoise": {
    title: "Black Tortoise",
    theme: "Stability / Patience / Grounding",
    description:
      "You are building something that needs steadiness more than speed. Choose balanced pearl pieces that feel calm and easy to wear every day.",
    productSlugs: ["pearl-series-04", "pearl-series-09", "pearl-series-11"],
  },
};

function getProduct(slug: string) {
  return getStorefrontProductBySlug(slug);
}

export function GuardianQuizClient() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<Archetype, number>>({} as Record<Archetype, number>);
  const [result, setResult] = useState<Archetype | null>(null);

  function handleAnswer(option: (typeof questions)[number]["options"][number]) {
    const nextScores = { ...scores };
    option.archetypes.forEach((archetype) => {
      nextScores[archetype] = (nextScores[archetype] || 0) + 1;
    });
    setScores(nextScores);

    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }

    const winner = Object.entries(nextScores).sort((a, b) => b[1] - a[1])[0]?.[0] as Archetype;
    setResult(winner || "moon-rabbit");
  }

  function reset() {
    setStep(0);
    setScores({} as Record<Archetype, number>);
    setResult(null);
  }

  if (result) {
    const archetype = results[result];
    const products = archetype.productSlugs.map(getProduct).filter(Boolean);

    return (
      <div className="min-h-[80vh] px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center animate-slide-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--accent)]">
              <Sparkles className="h-3 w-3" /> Your Guardian Archetype
            </div>
            <h1 className="font-serif text-4xl font-bold text-[var(--text)]">{archetype.title}</h1>
            <p className="mt-2 text-sm font-medium text-[var(--accent)]">{archetype.theme}</p>
            <p className="mx-auto mt-6 max-w-xl text-[var(--text-secondary)] leading-relaxed">{archetype.description}</p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {products.map((product) => product && (
              <Link key={product.slug} href={`/products/${product.slug}`} className="group rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 transition hover:border-[var(--accent)]/50">
                <img src={product.image} alt={productDisplayName(product)} className="aspect-square w-full rounded-lg object-cover" />
                <h2 className="mt-3 line-clamp-1 font-serif text-base font-semibold text-[var(--text)]">{productDisplayName(product)}</h2>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{product.intention || "Everyday Intention"}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/collections/pearl-series" className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-8 py-3 text-sm font-semibold text-[var(--bg)] transition hover:bg-[var(--accent-hover)]">
              Shop The Pearl Edit <ArrowRight className="h-4 w-4" />
            </Link>
            <button onClick={reset} className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border)] px-8 py-3 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-[var(--text)]">
              <RotateCcw className="h-4 w-4" /> Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[step];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[var(--accent)] uppercase mb-4">
            Guardian Archetype Quiz - Question {step + 1}/3
          </span>
          <h1 className="font-serif text-3xl font-bold text-[var(--text)] mb-2">{question.text}</h1>
          <div className="flex justify-center gap-1 mt-4">
            {questions.map((_, index) => (
              <div key={index} className={`h-1 w-12 rounded-full ${index <= step ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`} />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.label}
              onClick={() => handleAnswer(option)}
              className="group w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 text-left transition-all hover:border-[var(--accent)] hover:bg-[var(--accent)]/5"
            >
              <span className="font-medium text-[var(--text)] transition-colors group-hover:text-[var(--accent)]">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
