import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PEARL_EDITS } from "@/lib/storefront/pearl-edits";

export function HomepageOccasionEdit() {
  return (
    <section className="bg-[var(--surface-alt)] py-16 md:py-24" aria-labelledby="occasion-edit-title">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase text-[var(--accent)]">Shop by Occasion</p>
          <h2 id="occasion-edit-title" className="mt-3 font-serif text-3xl font-medium text-[var(--text)] md:text-4xl">
            Follow the shape of the day.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)] md:text-base">
            A few considered starting points for the pieces that stay close through ordinary plans and special tables.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PEARL_EDITS.slice(0, 3).map((edit) => (
            <Link key={edit.slug} href={edit.route} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--border-light)]">
                <Image
                  src={edit.heroImage}
                  alt={`${edit.title} pearl jewelry edit`}
                  fill
                  sizes="(max-width: 767px) 100vw, 33vw"
                  className="object-cover transition-transform duration-300 motion-reduce:transition-none group-hover:scale-[1.02] group-focus-visible:scale-[1.02]"
                />
              </div>
              <div className="mt-4 flex items-center justify-between gap-4 border-b border-[var(--border)] pb-3">
                <div>
                  <h3 className="font-serif text-xl font-medium text-[var(--text)]">{edit.title}</h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{edit.description}</p>
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
