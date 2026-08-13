import Image from "next/image";

export interface EditorialDividerProps {
  image: { src: string; alt: string };
  eyebrow: string;
  title: string;
  description: string;
}

export function EditorialDivider({
  image,
  eyebrow,
  title,
  description,
}: EditorialDividerProps) {
  return (
    <section
      className="col-span-2 grid overflow-hidden border-y border-[var(--border)] bg-[var(--surface)] sm:grid-cols-2 md:col-span-3 lg:col-span-4"
      data-editorial-divider="true"
    >
      <div className="relative aspect-[4/3] sm:aspect-auto">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 40rem"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-center px-6 py-10 sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-serif text-2xl font-medium text-[var(--text)]">{title}</h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-[var(--text-muted)]">{description}</p>
      </div>
    </section>
  );
}
