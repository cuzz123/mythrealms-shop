"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const questions = [
  {
    id: 1,
    text: "When life knocks you down, you...",
    options: [
      { label: "Get up and fight harder", beasts: ["white-tiger", "azure-dragon", "yinglong"] },
      { label: "Go quiet, strategize, then come back stronger", beasts: ["nine-tailed-fox", "bai-ze", "black-tortoise"] },
      { label: "Burn the old version and start completely new", beasts: ["phoenix", "kun-peng", "taotie"] },
    ],
  },
  {
    id: 2,
    text: "Others would describe you as...",
    options: [
      { label: "Powerful. Intense. A force of nature.", beasts: ["azure-dragon", "white-tiger", "yinglong"] },
      { label: "Mysterious. Wise. Hard to read.", beasts: ["nine-tailed-fox", "bai-ze", "black-tortoise"] },
      { label: "Resilient. Ever-evolving. Never the same person twice.", beasts: ["phoenix", "kun-peng", "qilin"] },
    ],
  },
  {
    id: 3,
    text: "What do you seek most right now?",
    options: [
      { label: "Strength. I need to carry what's on my shoulders.", beasts: ["azure-dragon", "white-tiger", "black-tortoise"] },
      { label: "Wisdom. I need to see clearly what others miss.", beasts: ["nine-tailed-fox", "bai-ze", "qilin"] },
      { label: "Transformation. I'm ready to become someone new.", beasts: ["phoenix", "kun-peng", "yinglong"] },
    ],
  },
];

const results: Record<string, { beast: string; slug: string; subtitle: string; description: string; image: string }> = {
  "nine-tailed-fox": {
    beast: "Nine-Tailed Fox · 九尾狐",
    slug: "/products/nine-tailed-fox-pendant",
    subtitle: "Your Guardian Is the One Who's Been Underestimated",
    description: "You are not what they said you were. You never were. The Nine-Tailed Fox appears when peace is coming — and so do you. Quiet power. Ancient wisdom. The ability to see through any mask. You don't need to prove anything. You just need to remember who you are.",
    image: "/images/hero/nine-tailed-fox.webp",
  },
  "azure-dragon": {
    beast: "Azure Dragon · 青龙",
    slug: "/products/azure-dragon-ring",
    subtitle: "Your Guardian Is the One Who Carries the Sky",
    description: "You are the one everyone leans on. The pillar. The storm-chaser. The Azure Dragon has guarded the eastern sky alone for 2000 years — and so have you carried your world. But even dragons need to rest. Wear him and remember: you don't have to do this alone.",
    image: "/images/hero/azure-dragon.webp",
  },
  phoenix: {
    beast: "Phoenix · 凤凰",
    slug: "/products/phoenix-rebirth-necklace",
    subtitle: "Your Guardian Is the One Who Rises from Ashes",
    description: "You have died more times than anyone knows. And every time, you came back. Different. Stronger. More yourself. The Phoenix of the South does not wait for permission to burn. Neither do you. This is not a comeback story. This is a becoming story.",
    image: "/images/hero/phoenix.webp",
  },
  "white-tiger": {
    beast: "White Tiger · 白虎",
    slug: "/products/white-tiger-guardian-cuff",
    subtitle: "Your Guardian Is the One Holding the Line",
    description: "You protect. It's what you do. Not for recognition. Not for gratitude. Because someone has to. The White Tiger has guarded the western sky alone for millennia — in silence, in snow, without complaint. He sees you. And he salutes you.",
    image: "/images/hero/white-tiger.webp",
  },
  "black-tortoise": {
    beast: "Black Tortoise · 玄武",
    slug: "/products/black-tortoise-endurance-bracelet",
    subtitle: "Your Guardian Is the One Still Standing",
    description: "You have been through things that would have broken anyone else. But you're still here. The Black Tortoise has held up the heavens for 2000 years without asking how much longer. Endurance is not flashy. But it wins every war. You are living proof.",
    image: "/images/hero/black-tortoise.webp",
  },
  "kun-peng": {
    beast: "Kun Peng · 鲲鹏",
    slug: "/products/kun-peng-transformation-set",
    subtitle: "Your Guardian Is the One Who Becomes",
    description: "You are not who you were last year. Or last month. You are in the middle of the greatest transformation of your life. The Kun Peng starts as a fish in the deepest ocean — and becomes a bird that darkens the sky. You're not stuck. You're in the chrysalis. This is your season.",
    image: "/images/hero/kun-peng.webp",
  },
  qilin: {
    beast: "Qilin · 麒麟",
    slug: "/products/qilin-protection-bracelet",
    subtitle: "Your Guardian Is the One Who Brings Peace",
    description: "You walk softly. But your presence changes rooms. The Qilin refuses to step on living grass — and you refuse to win at someone else's expense. That is not weakness. It is the rarest form of power. Keep choosing peace. The world needs more of you.",
    image: "/images/hero/qilin.webp",
  },
  "bai-ze": {
    beast: "Bai Ze · 白泽",
    slug: "/products/bai-ze-wisdom-talisman",
    subtitle: "Your Guardian Is the One Who Knows",
    description: "You see things others don't. Patterns. Truths. The hidden architecture of situations. The Bai Ze knew 11,520 species — and you know what no one else around you seems to know. Trust your intuition. It has never been wrong. Wear him and sharpen the gift.",
    image: "/images/hero/bai-ze.webp",
  },
  yinglong: {
    beast: "Yinglong · 应龙",
    slug: "/products/yinglong-winged-dragon-cufflinks",
    subtitle: "Your Guardian Is the One Who Commands the Sky",
    description: "You were not born to blend in. The Yinglong is the only dragon with wings. When he flies, kings kneel. When he roars, heaven answers. You have authority you haven't fully claimed yet. This is your sign. Take your place. The sky is yours.",
    image: "/images/hero/yinglong.webp",
  },
  taotie: {
    beast: "Taotie · 饕餮",
    slug: "/products/taotie-bronze-amulet",
    subtitle: "Your Guardian Is the One Who Warns Against Excess",
    description: "You know the cost of wanting too much. The Taotie is not a monster — it is a boundary. Cast into ancient bronze to remind kings: take what you need, leave what you must. You have learned to say enough. That wisdom will save you more than any ambition.",
    image: "/images/hero/taotie.webp",
  },
};

export function GuardianQuizClient() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [result, setResult] = useState<string | null>(null);

  function handleAnswer(option: (typeof questions)[0]["options"][0]) {
    const newScores = { ...scores };
    option.beasts.forEach((b) => {
      newScores[b] = (newScores[b] || 0) + 1;
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
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-lg w-full text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-xs text-[var(--accent)] font-semibold">
            <Sparkles className="w-3 h-3" /> Your Guardian Has Been Found
          </div>

          <img src={r.image} alt={r.beast} className="w-48 h-48 rounded-full object-cover mx-auto mb-6 border-2 border-[var(--accent)] shadow-[0_0_40px_rgba(212,168,75,0.2)]" />

          <h1 className="font-serif text-3xl font-bold text-[var(--text)] mb-2">{r.beast}</h1>
          <p className="text-sm text-[var(--accent)] mb-6">{r.subtitle}</p>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-8 max-w-md mx-auto">{r.description}</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={r.slug} className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[var(--accent)] text-white rounded-full font-semibold text-sm hover:bg-[var(--accent-hover)] transition">
              Wear Your Guardian <ArrowRight className="w-4 h-4" />
            </Link>
            <button onClick={reset} className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-[var(--border)] text-[var(--text-secondary)] rounded-full font-semibold text-sm hover:border-[var(--text)] transition">
              Retake Quiz
            </button>
          </div>

          <p className="mt-8 text-xs text-[var(--text-muted)]">
            Share your result — tag <span className="text-[var(--accent)]">@mythrealms</span>
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
            Guardian Quiz · Question {step + 1}/3
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
