"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { PRODUCTS } from "@/lib/1688-products";

const questions = [
  {
    id: 1,
    text: "What do you need most right now?",
    options: [
      { label: "Protection. I'm holding too much and need a boundary.", intentions: ["protection"] },
      { label: "Love. I'm learning to be softer with myself.", intentions: ["self-love"] },
      { label: "Clarity. I need to hear my own voice over the noise.", intentions: ["intuition", "confidence"] },
    ],
  },
  {
    id: 2,
    text: "How do you want to feel when you wake up tomorrow?",
    options: [
      { label: "Grounded. Steady. Like nothing can shake me.", intentions: ["protection", "grounding"] },
      { label: "Renewed. Like I've turned a page and started fresh.", intentions: ["renewal", "self-love"] },
      { label: "Powerful. Ready to take action and own my space.", intentions: ["confidence", "abundance"] },
    ],
  },
  {
    id: 3,
    text: "Which statement is most true right now?",
    options: [
      { label: "\"I've been through something and I'm still standing.\"", intentions: ["protection", "renewal"] },
      { label: "\"I'm at the start of something new and I need courage.\"", intentions: ["renewal", "confidence", "abundance"] },
      { label: "\"I'm ready to receive — love, opportunities, whatever comes.\"", intentions: ["self-love", "abundance", "intuition"] },
    ],
  },
];

const results: Record<string, { archetype: string; intention: string; triplet: string; slug: string; description: string }> = {
  protection: {
    archetype: "The Watchman",
    intention: "Protection",
    triplet: "Protection — Grounding — Clarity",
    slug: "/products/curated-singles-01",
    description: "You carry more than anyone knows — the weight of other people's expectations, the residue of hard conversations, the invisible labor of holding everything together. The Watchman is black obsidian, the stone that absorbs what you cannot carry and returns only strength. Hold it each morning. Set your perimeter. Nothing enters unless you permit it. This is not jewelry. This is armor you chose.",
  },
  "self-love": {
    archetype: "The Heart Opener",
    intention: "Self-Love",
    triplet: "Love — Healing — Softness",
    slug: "/products/curated-singles-02",
    description: "You are learning to let people in again. Or learning to let yourself be enough — without anyone else's permission. The Heart Opener is rose quartz, the stone of unconditional self-love. Wear it on your left wrist, the receiving side. Let it teach you this: softness is not surrender. Softness is the hardest thing you will ever learn — and the most important.",
  },
  intuition: {
    archetype: "The Seer",
    intention: "Intuition",
    triplet: "Calm — Vision — Connection",
    slug: "/products/curated-singles-03",
    description: "You already know. You have always known. The answer arrived weeks ago — you just haven't trusted yourself enough to act on it. The Seer is amethyst, the stone of the third eye, of dreams that arrive fully formed, of clarity that comes when you stop chasing it. Wear it to bed. Let it work while you sleep. When you wake, trust what you already knew.",
  },
  renewal: {
    archetype: "The Phoenix",
    intention: "Renewal",
    triplet: "Renewal — Intuition — Feminine Power",
    slug: "/products/curated-singles-04",
    description: "You have ended things — jobs, relationships, versions of yourself that no longer fit. You have stood in the ashes of what was and decided, again and again, to become. The Phoenix is moonstone, the stone of new moons and clean slates and the courage to begin again before you feel ready. Put it on after the ending. Wear it into the beginning.",
  },
  confidence: {
    archetype: "The Strategist",
    intention: "Confidence",
    triplet: "Focus — Courage — Will",
    slug: "/products/curated-singles-05",
    description: "Confidence is not the loudest voice in the room. It is the quiet decision — made in private, tested in silence — to trust yourself before the evidence shows up. The Strategist is tiger's eye, the stone of steady nerve and focused will. Wear it into the meeting. Wear it onto the stage. Wear it when the moment arrives and you need to be the version of yourself that acts.",
  },
  abundance: {
    archetype: "The Lion's Share",
    intention: "Abundance",
    triplet: "Luck — Opportunity — Prosperity",
    slug: "/products/curated-singles-06",
    description: "You are not greedy for wanting more. You are not taking anything from anyone. You are simply awake — awake to what is already yours, to the opportunities you used to walk past, to the abundance that was always there but that you were too tired or too polite or too unsure to reach for. The Lion's Share is green aventurine, the stone of luck and opportunity. Wear it with open hands. Say yes more than you say no.",
  },
};

function getProductImage(slug: string): string {
  const product = PRODUCTS.find(p => p.slug === slug);
  return product?.image || "/images/products/1688-shop/curated-singles/curated-singles-01-main.jpg";
}

export function GuardianQuizClient() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [result, setResult] = useState<string | null>(null);

  function handleAnswer(option: (typeof questions)[0]["options"][0]) {
    const newScores = { ...scores };
    option.intentions.forEach((int) => {
      newScores[int] = (newScores[int] || 0) + 1;
    });
    setScores(newScores);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const winner = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0];
      setResult(winner);
    }
  }

  function reset() {
    setStep(0);
    setScores({});
    setResult(null);
  }

  if (result && results[result]) {
    const r = results[result];
    const image = getProductImage(r.slug);
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-lg w-full text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-xs text-[var(--accent)] font-semibold">
            <Sparkles className="w-3 h-3" /> Your Intention Has Been Found
          </div>

          <img src={image} alt={r.archetype} className="w-48 h-48 rounded-full object-cover mx-auto mb-6 border-2 border-[var(--accent)] shadow-[0_0_40px_rgba(212,168,75,0.2)]" />

          <h1 className="font-serif text-3xl font-bold text-[var(--text)] mb-1">{r.archetype}</h1>
          <p className="text-sm text-[var(--accent)] mb-1 font-medium">{r.triplet}</p>
          <p className="text-xs text-[var(--text-muted)] mb-6">Intention: {r.intention}</p>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-8 max-w-md mx-auto">{r.description}</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={r.slug} className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[var(--accent)] text-white rounded-full font-semibold text-sm hover:bg-[var(--accent-hover)] transition">
              Wear Your Intention <ArrowRight className="w-4 h-4" />
            </Link>
            <button onClick={reset} className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-[var(--border)] text-[var(--text-secondary)] rounded-full font-semibold text-sm hover:border-[var(--text)] transition">
              Retake Quiz
            </button>
          </div>

          <p className="mt-8 text-xs text-[var(--text-muted)]">
            Share your result — tag <span className="text-[var(--accent)]">@mythrealms.shop</span>
          </p>
        </div>
      </div>
    );
  }

  const q = questions[step];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[var(--accent)] uppercase mb-4">
            Crystal Intention Quiz · Question {step + 1}/3
          </span>
          <h1 className="font-serif text-3xl font-bold text-[var(--text)] mb-2">
            {q.text}
          </h1>
          <div className="flex justify-center gap-1 mt-4">
            {questions.map((_, i) => (
              <div key={i} className={`h-1 w-12 rounded-full ${i <= step ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`} />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="w-full text-left p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all group"
            >
              <span className="text-[var(--text)] font-medium group-hover:text-[var(--accent)] transition-colors">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
