import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HOMEPAGE_MEDIA } from "@/lib/homepage-editorial";

const MOMENT_LINKS = [
  { label: "For Everyday", href: "/collections/pearl-series", image: HOMEPAGE_MEDIA.everyday },
  { label: "For a New Chapter", href: "/gifts", image: HOMEPAGE_MEDIA.courtyard },
  { label: "Just Because", href: "/collections/new-arrivals", image: HOMEPAGE_MEDIA.earrings },
  { label: "Small Gifts", href: "/gifts#under-50", image: HOMEPAGE_MEDIA.seaside },
] as const;

export function HomepageOccasionEdit() {
  return (
    <section className="bg-[var(--surface-alt)] py-16 md:py-24" aria-labelledby="occasion-edit-title">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase text-[var(--accent)]">Everyday moments</p>
          <h2 id="occasion-edit-title" className="mt-3 font-serif text-3xl font-medium text-[var(--text)] md:text-4xl">
            Shop by moment
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)] md:text-base">
            A few considered starting points for the pieces that stay close through ordinary plans and special tables.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MOMENT_LINKS.map(({ label, href, image }) => (
            <Link key={label} href={href} aria-label={label} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--border-light)]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 767px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 motion-reduce:transition-none group-hover:scale-[1.02] group-focus-visible:scale-[1.02]"
                />
              </div>
              <div className="mt-4 flex items-center justify-between gap-4 border-b border-[var(--border)] pb-3">
                <div>
                  <h3 className="font-serif text-xl font-medium text-[var(--text)]">{label}</h3>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
