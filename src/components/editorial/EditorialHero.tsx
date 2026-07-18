import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type EditorialHeroProps = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  image: Readonly<{
    src: string;
    alt: string;
    objectPosition?: string;
  }>;
  primaryAction?: Readonly<{ label: string; href: string }>;
  secondaryAction?: Readonly<{ label: string; href: string }>;
}>;

export function EditorialHero({
  eyebrow,
  title,
  description,
  image,
  primaryAction,
  secondaryAction,
}: EditorialHeroProps) {
  return (
    <section
      className="relative h-[min(680px,calc(100svh-7rem))] min-h-[480px] overflow-hidden bg-[#24312f] text-white"
      aria-labelledby="editorial-hero-title"
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        preload
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: image.objectPosition ?? "center" }}
      />
      <div className="absolute inset-0 bg-[#16211f]/60" />
      <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-10 pt-24 sm:pb-14 lg:pb-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase text-white/80">{eyebrow}</p>
          <h1
            id="editorial-hero-title"
            className="mt-4 max-w-2xl font-serif text-4xl font-medium sm:text-5xl lg:text-6xl"
          >
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/90 sm:text-lg">
            {description}
          </p>
          {(primaryAction || secondaryAction) && (
            <div className="mt-7 flex flex-wrap items-center gap-5">
              {primaryAction && (
                <Link
                  href={primaryAction.href}
                  className="inline-flex items-center gap-2 bg-white px-5 py-3 text-sm font-semibold text-[#1d2423] transition-colors hover:bg-[#e9e8df]"
                >
                  {primaryAction.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
              {secondaryAction && (
                <Link
                  href={secondaryAction.href}
                  className="border-b border-white/70 pb-1 text-sm font-semibold text-white transition-colors hover:border-white"
                >
                  {secondaryAction.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
