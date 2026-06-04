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
          More than just jewelry, MythRealms brings China's oldest legends to life.
          Drawing from the Classic of Mountains and Seas (Shan Hai Jing) — a text
          that predates Tolkien by two millennia — each piece tells a story of mythical
          beasts, celestial guardians, and ancient wisdom.
        </p>
        <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
          We craft wearable mythology for those who feel the pull of{" "}
          <strong className="text-[var(--text)]">LEGENDARY, MYSTICAL, POWERFUL, TIMELESS and EXTRAORDINARY.</strong>
        </p>
        <Link href="/about">
          <Button variant="outline" size="md">
            Read More About Our Story
          </Button>
        </Link>
      </div>
    </section>
  );
}
