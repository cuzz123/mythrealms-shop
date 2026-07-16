import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import { GuardianQuizClient } from "./quiz-client";

export const metadata: Metadata = {
  title: "Find Your Guardian Archetype | MythRealms Quiz",
  description: "Take the 3-question MythRealms quiz to discover a guardian archetype and a path into The Pearl Edit.",
  alternates: { canonical: absoluteUrl("/guardian-quiz") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/guardian-quiz"),
    title: "Which Guardian Archetype Matches You?",
    description: "Take the 3-question quiz and discover the intention that fits this season of you.",
  },
};

export default function GuardianQuizPage() {
  return <GuardianQuizClient />;
}
