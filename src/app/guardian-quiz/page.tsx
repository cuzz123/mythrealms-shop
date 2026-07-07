import type { Metadata } from "next";
import { GuardianQuizClient } from "./quiz-client";

export const metadata: Metadata = {
  title: "Find Your Guardian Archetype | MythRealms Quiz",
  description: "Take the 3-question MythRealms quiz to discover the guardian archetype and pearl or gemstone pieces that match this season of you.",
  openGraph: {
    title: "Which Guardian Archetype Matches You?",
    description: "Take the 3-question quiz and discover the intention that fits this season of you.",
  },
};

export default function GuardianQuizPage() {
  return <GuardianQuizClient />;
}
