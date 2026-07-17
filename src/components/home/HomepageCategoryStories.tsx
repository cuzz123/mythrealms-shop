import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HOMEPAGE_CATEGORY_LINKS } from "@/lib/homepage-editorial";

export function HomepageCategoryStories() {
  const featureLinks = HOMEPAGE_CATEGORY_LINKS.slice(0, 3);
  const indexLinks = HOMEPAGE_CATEGORY_LINKS.slice(3);

  return (
    <section className="bg-[var(--surface-alt)] py-16 md:py-24" aria-labelledby="shop-by-style-title">
      <div className="mx-auto max-w-7xl px-6">
        <p className="text-xs font-semibold uppercase text-[var(--accent)]">Shop by Style</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
          <h2 id="shop-by-style-title" className="max-w-xl font-serif text-3xl font-medium text-[var(--text)] md:text-4xl">
            Choose your starting point
          </h2>
          <Link href="/collections/pearl-series" className="inline-flex items-center gap-2 border-b border-[var(--text)] pb-1 text-sm font-semibold text-[var(--text)]">
            View all pearls <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {featureLinks.map(({ label, href, image }) => (
            <Link key={label} href={href} className="block">
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--border-light)]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 767px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
                <h3 className="font-serif text-xl font-medium text-[var(--text)]">{label}</h3>
                <ArrowRight className="h-4 w-4 shrink-0 text-[var(--accent)]" />
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 grid border-t border-[var(--border)] sm:grid-cols-2">
          {indexLinks.map(({ label, href }) => (
            <Link key={label} href={href} className="flex items-center justify-between gap-4 border-b border-[var(--border)] py-4 text-sm font-semibold text-[var(--text)] transition-colors hover:text-[var(--accent)] sm:first:border-r sm:first:pr-6 sm:last:pl-6">
              {label}
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
