import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HOMEPAGE_MEDIA } from "@/lib/homepage-editorial";

const guardians = ["Phoenix / Renewal", "Moon Rabbit / Softness", "White Tiger / Boundaries", "Nine-Tailed Fox / Magnetism"];

export function HomepageGuardian() {
  const courtyard = HOMEPAGE_MEDIA.courtyard;

  return (
    <section className="relative overflow-hidden bg-[#24312f] text-white" aria-labelledby="guardian-title">
      <Image src={courtyard.src} alt={courtyard.alt} fill sizes="100vw" className="object-cover opacity-45" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 md:py-24 lg:grid-cols-[1fr_.8fr] lg:items-end">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase text-white/75">Find Your Guardian</p>
          <h2 id="guardian-title" className="mt-3 font-serif text-3xl font-medium md:text-5xl">A pearl point of view.</h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-white/85 md:text-base">
            Take a short, thoughtful pause and discover the archetype and pearl pieces that feel most like this chapter.
          </p>
          <Link href="/guardian-quiz" className="mt-8 inline-flex items-center gap-2 bg-white px-5 py-3 text-sm font-semibold text-[#1d2423] transition-colors hover:bg-[#e9e8df]">
            Find your guardian <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="border-t border-white/35">
          {guardians.map((guardian) => (
            <div key={guardian} className="flex items-center justify-between gap-4 border-b border-white/35 py-4 font-serif text-lg">
              <span>{guardian}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-white/70" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
