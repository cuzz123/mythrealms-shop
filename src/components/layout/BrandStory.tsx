import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function BrandStory() {
  return (
    <section className="py-16 bg-[var(--bg)]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-serif text-3xl font-bold text-[var(--text)] mb-6">
          About MythRealms
        </h2>
        <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
          More than jewelry, MythRealms creates intention pieces — wearable reminders
          of who you are becoming. Each stone carries a singular purpose: protection,
          clarity, love, confidence, or abundance. You choose the intention. You wear
          the practice.
        </p>
        <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
          We craft stones with intention for those who believe that what you wear
          shapes how you move through the world —{" "}
          <strong className="text-[var(--text)]">INTENTIONAL, GROUNDED, LUMINOUS and TRUE.</strong>
        </p>
        <Link href="/about">
          <Button variant="outline" size="md">
            Read Our Story
          </Button>
        </Link>
      </div>
    </section>
  );
}
