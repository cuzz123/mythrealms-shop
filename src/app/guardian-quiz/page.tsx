import type { Metadata } from "next";
import { GuardianQuizClient } from "./quiz-client";

export const metadata: Metadata = {
  title: "Find Your Crystal Intention — MythRealms Quiz",
  description: "Which crystal intention is calling to you right now? A 3-question quiz to find the stone that matches your path.",
  openGraph: { title: "Which Crystal Intention Calls to You?", description: "Take the 3-question quiz and discover the stone that names what you are becoming." },
};

export default function GuardianQuizPage() {
  return <GuardianQuizClient />;
}
