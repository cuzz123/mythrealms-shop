import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HOMEPAGE_MEDIA } from "@/lib/homepage-editorial";

export function HomepageEditorialStory() {
  const seaside = HOMEPAGE_MEDIA.seaside;
  const everyday = HOMEPAGE_MEDIA.everyday;

  return (
    <section className="bg-[var(--surface)]" aria-labelledby="pearl-guide-title">
      <div className="grid lg:grid-cols-2">
        <div className="relative aspect-[4/3] min-h-[20rem] lg:aspect-auto lg:min-h-[38rem]">
          <Image src={seaside.src} alt={seaside.alt} fill sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="flex items-center px-6 py-16 md:px-12 lg:px-16">
          <div className="max-w-md">
            <p className="text-xs font-semibold uppercase text-[var(--accent)]">Pearl Guide</p>
            <h2 id="pearl-guide-title" className="mt-3 font-serif text-3xl font-medium text-[var(--text)] md:text-4xl">
              A little light, close to home.
            </h2>
            <p className="mt-5 text-sm leading-7 text-[var(--text-secondary)] md:text-base">
              Pearls are made to be worn: with sun-warmed linen, across a crowded table, and on the ordinary days that become part of your story.
            </p>
            <Link href="/pearls" className="mt-8 inline-flex items-center gap-2 border-b border-[var(--text)] pb-1 text-sm font-semibold text-[var(--text)]">
              Read the guide <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2">
        <div className="order-2 flex items-center bg-[#24312f] px-6 py-16 text-white md:px-12 lg:order-1 lg:px-16">
          <div className="max-w-md">
            <p className="text-xs font-semibold uppercase text-white/75">Our Story</p>
            <h3 className="mt-3 font-serif text-3xl font-medium md:text-4xl">A softer way to get dressed.</h3>
            <p className="mt-5 text-sm leading-7 text-white/80 md:text-base">
              MythRealms makes room for small rituals and pieces that hold their own without asking for the whole room.
            </p>
            <Link href="/about" className="mt-8 inline-flex items-center gap-2 border-b border-white/70 pb-1 text-sm font-semibold text-white">
              Meet MythRealms <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="relative order-1 aspect-[4/3] min-h-[20rem] lg:order-2 lg:aspect-auto lg:min-h-[38rem]">
          <Image src={everyday.src} alt={everyday.alt} fill sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}
