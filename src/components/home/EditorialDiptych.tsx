import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { EditorialImage } from "@/lib/homepage-editorial";

export type EditorialDiptychProps = Readonly<{
  primaryImage: EditorialImage;
  detailImage: EditorialImage;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}>;

export function EditorialDiptych({
  primaryImage,
  detailImage,
  eyebrow,
  title,
  description,
  href,
  linkLabel,
}: EditorialDiptychProps) {
  return (
    <section
      data-homepage-section="homepage-editorial-diptych"
      className="bg-[var(--surface-alt)] py-16 md:py-24"
      aria-labelledby="homepage-diptych-title"
    >
      <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-[minmax(0,58fr)_minmax(0,42fr)] lg:gap-10">
        <div className="relative aspect-[2/3] overflow-hidden bg-[var(--border-light)]">
          <Image src={primaryImage.src} alt={primaryImage.alt} fill sizes="(max-width: 1023px) 100vw, 58vw" className="object-cover" style={{ objectPosition: primaryImage.objectPosition }} />
        </div>
        <div className="flex flex-col gap-8 lg:pt-16">
          <div className="max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">{eyebrow}</p>
            <h2 id="homepage-diptych-title" className="mt-3 font-serif text-3xl font-medium text-[var(--text)] md:text-4xl">{title}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)] md:text-base">{description}</p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden bg-[var(--border-light)]">
            <Image src={detailImage.src} alt={detailImage.alt} fill sizes="(max-width: 1023px) 100vw, 42vw" className="object-cover" style={{ objectPosition: detailImage.objectPosition }} />
          </div>
          <Link href={href} className="inline-flex w-fit items-center gap-2 border-b border-[var(--text)] pb-1 text-sm font-semibold text-[var(--text)]">
            {linkLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
