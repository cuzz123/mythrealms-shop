import type React from "react";

export type SectionHeadingProps = Readonly<{
  eyebrow?: string;
  title: string;
  description?: string;
}>;

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps): React.JSX.Element {
  return (
    <header className="max-w-[var(--content-reading)] border-t border-[var(--signature-rule)] pt-5">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">{eyebrow}</p>
      )}
      <h2 className="mt-3 font-serif text-3xl font-medium text-[var(--text)] sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">{description}</p>}
    </header>
  );
}
