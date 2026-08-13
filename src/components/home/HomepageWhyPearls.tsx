import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HOMEPAGE_MEDIA } from "@/lib/homepage-editorial";

export function HomepageWhyPearls() {
  const image = HOMEPAGE_MEDIA.seaside;

  return (
    <section className="bg-[var(--surface)]" aria-labelledby="why-pearls-title">
      <div className="grid lg:grid-cols-2">
        <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[36rem]">
          <Image src={image.src} alt={image.alt} fill sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="flex items-center px-6 py-16 md:px-12 lg:px-16">
          <div className="max-w-md">
            <p className="text-xs font-semibold uppercase text-[var(--accent)]">Why Pearls</p>
            <h2 id="why-pearls-title" className="mt-3 font-serif text-3xl font-medium text-[var(--text)] md:text-4xl">
              Made for the life around them.
            </h2>
            <p className="mt-5 text-sm leading-7 text-[var(--text-secondary)] md:text-base">
              Pearls bring a soft point of light to familiar clothes and unfamiliar plans. A little care keeps their surface looking its best over time.
            </p>
            <Link href="/pearls/care" className="mt-8 inline-flex items-center gap-2 border-b border-[var(--text)] pb-1 text-sm font-semibold text-[var(--text)]">
              Read pearl care <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
