import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function HeroCarousel() {
  return (
    <section className="grid min-h-[660px] grid-cols-1 bg-[var(--surface-alt)] md:grid-cols-[.9fr_1.1fr]" aria-label="Pearl collection">
      <div className="flex items-center px-6 py-20 md:px-12 lg:pl-[max(3rem,calc((100vw-1200px)/2))] lg:pr-16">
        <div className="max-w-xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">The Pearl Edit / Summer 2026</p>
          <h1 className="font-serif text-5xl font-medium leading-[0.96] text-[var(--text)] sm:text-6xl lg:text-7xl">Jewelry that catches the light, not the noise.</h1>
          <p className="mt-7 max-w-md text-sm leading-7 text-[var(--text-secondary)] md:text-base">Pearl pieces with an easy, lived-in point of view. Made for the days you want to remember.</p>
          <Link href="/collections/pearl-series" className="mt-8 inline-flex items-center gap-2 bg-[#18201f] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent)]">
            Shop the Pearl Edit <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div className="relative min-h-[500px] overflow-hidden bg-[#b5b3a8]">
        <Image src="/images/brand/hero/pearl-earrings-editorial.png" alt="Model wearing pearl earrings in warm daylight" fill sizes="(max-width: 768px) 100vw, 58vw" priority className="object-cover object-center" />
        <span className="absolute bottom-4 right-4 bg-[var(--surface)]/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text)]">Editorial / Summer 2026</span>
      </div>
    </section>
  );
}
