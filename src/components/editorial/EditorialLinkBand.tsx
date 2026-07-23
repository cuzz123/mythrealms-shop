import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type EditorialLinkItem = Readonly<{
  label: string;
  title: string;
  copy: string;
  href: string;
  image: Readonly<{
    src: string;
    alt: string;
    objectPosition?: string;
  }>;
  links?: readonly Readonly<{ label: string; href: string }>[];
}>;

export type EditorialLinkBandProps = Readonly<{
  items: readonly [EditorialLinkItem, EditorialLinkItem];
}>;

export function EditorialLinkBand({ items }: EditorialLinkBandProps) {
  return (
    <section className="bg-[var(--bg)] py-16 sm:py-20" aria-label="Editorial guides">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:gap-6">
        {items.map((item) => (
          <article key={item.href} className="min-w-0 border-t border-[var(--border)] pt-5">
            <Link href={item.href} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden bg-[var(--border-light)]">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  style={{ objectPosition: item.image.objectPosition ?? "center" }}
                />
              </div>
            </Link>
            <p className="mt-5 text-xs font-semibold uppercase text-[var(--accent)]">
              {item.label}
            </p>
            <h2 className="mt-2 max-w-xl font-serif text-2xl font-medium text-[var(--text)] sm:text-3xl">
              <Link href={item.href} className="transition-colors hover:text-[var(--accent)]">
                {item.title}
              </Link>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--text-secondary)]">
              {item.copy}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href={item.href}
                className="inline-flex items-center gap-2 border-b border-[var(--text)] pb-1 text-sm font-semibold text-[var(--text)]"
              >
                Explore
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              {item.links?.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
