import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HOMEPAGE_MEDIA } from "@/lib/homepage-editorial";

export function HomepageHero() {
  const hero = HOMEPAGE_MEDIA.hero;

  return (
    <section
      className="relative -mt-16 [--homepage-category-reveal:10rem] lg:[--homepage-category-reveal:18rem] min-h-[calc(100svh-2.25rem-var(--homepage-category-reveal))] overflow-hidden bg-[#24312f] text-white"
      aria-labelledby="homepage-hero-title"
    >
      <Image
        src={hero.src}
        alt={hero.alt}
        fill
        preload
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: hero.objectPosition }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,22,21,.74)_0%,rgba(13,22,21,.28)_48%,rgba(13,22,21,.06)_72%)]" />
      <div className="relative mx-auto flex min-h-[calc(100svh-2.25rem-var(--homepage-category-reveal))] max-w-7xl items-end px-6 pb-10 pt-24 sm:pb-20 sm:pt-32">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase text-white/80">Editorial / Summer 2026</p>
          <h1 id="homepage-hero-title" className="mt-4 max-w-lg font-serif text-4xl font-medium leading-none sm:text-6xl lg:text-7xl">
            Pearls for sunlit days.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/85 md:text-base">
            Pearl jewelry selected for natural light, everyday movement, and the moments worth keeping.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-5 sm:mt-8">
            <Link href="/collections/pearl-series" className="inline-flex items-center gap-2 bg-white px-5 py-3 text-sm font-semibold text-[#1d2423] transition-colors hover:bg-[#e9e8df]">
              Shop the Pearl Edit <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/pearls" className="border-b border-white/70 pb-1 text-sm font-semibold text-white transition-colors hover:border-white">
              Read the Pearl Guide
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
