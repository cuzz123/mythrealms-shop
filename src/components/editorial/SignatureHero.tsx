import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import type React from "react";

type ResponsiveObjectPosition =
  | string
  | Readonly<{
      base?: string;
      sm?: string;
      md?: string;
      lg?: string;
    }>;

type SignatureImage = Readonly<{
  src: ImageProps["src"];
  alt: string;
  objectPosition?: ResponsiveObjectPosition;
}>;

type SignatureAction = Readonly<{
  label: string;
  href: string;
}>;

export type SignatureHeroProps = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  image: SignatureImage;
  primaryAction?: SignatureAction;
  secondaryAction?: SignatureAction;
  indexLabel?: string;
}>;

function objectPositionStyle(objectPosition: ResponsiveObjectPosition | undefined): React.CSSProperties {
  if (typeof objectPosition === "string") {
    return { objectPosition };
  }

  return {
    "--signature-object-position": objectPosition?.base ?? "center",
    "--signature-object-position-sm": objectPosition?.sm ?? objectPosition?.base ?? "center",
    "--signature-object-position-md": objectPosition?.md ?? objectPosition?.sm ?? objectPosition?.base ?? "center",
    "--signature-object-position-lg": objectPosition?.lg ?? objectPosition?.md ?? objectPosition?.sm ?? objectPosition?.base ?? "center",
  } as React.CSSProperties;
}

export function SignatureHero({
  eyebrow,
  title,
  description,
  image,
  primaryAction,
  secondaryAction,
  indexLabel,
}: SignatureHeroProps): React.JSX.Element {
  const imageStyle = objectPositionStyle(image.objectPosition);

  return (
    <section
      className="relative isolate aspect-[4/5] min-h-[34rem] overflow-hidden bg-[var(--charcoal)] text-white sm:aspect-[16/10] sm:min-h-[42rem] lg:aspect-[2/1]"
      aria-labelledby="signature-hero-title"
    >
      <div className="absolute inset-0">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          preload
          sizes="100vw"
          className="signature-hero-image object-cover"
          style={imageStyle}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,32,31,0.84),rgba(24,32,31,0.36)_65%,rgba(24,32,31,0.18))]" />
      </div>

      <div className="relative mx-auto flex h-full max-w-[var(--content-wide)] items-end px-6 py-12 sm:py-16 lg:px-10">
        <div className="max-w-2xl">
          {indexLabel && (
            <span className="text-xs font-semibold tracking-[0.16em] text-white/70" aria-hidden="true">
              {indexLabel}
            </span>
          )}
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/80">{eyebrow}</p>
          <h1 id="signature-hero-title" className="mt-4 font-serif text-4xl font-medium sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/90 sm:text-lg">{description}</p>
          {(primaryAction || secondaryAction) && (
            <div className="mt-8 flex flex-wrap items-center gap-5">
              {primaryAction && (
                <Link
                  href={primaryAction.href}
                  className="border border-white bg-white px-5 py-3 text-sm font-semibold text-[var(--charcoal)] transition-colors hover:bg-transparent hover:text-white"
                >
                  {primaryAction.label}
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
