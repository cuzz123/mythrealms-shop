import type { Metadata } from "next";
import { GuardianQuizClient } from "./quiz-client";

export const metadata: Metadata = {
  title: "Find Your Guardian Beast — MythRealms Quiz",
  description: "Which mythical beast from the Classic of Mountains and Seas guards your soul? Take the 3-question quiz.",
  openGraph: { title: "Which Mythical Beast Guards Your Soul?", description: "Take the 3-question quiz and discover your guardian from the Shan Hai Jing." },
};

export default function GuardianQuizPage() {
  return <GuardianQuizClient />;
}
