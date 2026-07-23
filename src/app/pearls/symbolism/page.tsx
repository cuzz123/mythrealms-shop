import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { BreadcrumbJsonLd } from "@/components/ui/JsonLd";
import { HOMEPAGE_MEDIA } from "@/lib/homepage-editorial";
import { PEARL_EDITS } from "@/lib/storefront/pearl-edits";
import { absoluteUrl } from "@/lib/site";

const title = "Pearl Symbolism in Style and Gifting | MythRealms";
const description = "A neutral look at how pearls can carry personal style, memory, and occasion in a gift or an everyday jewelry choice.";
const canonical = absoluteUrl("/pearls/symbolism");
const image = HOMEPAGE_MEDIA.everyday;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  openGraph: {
    title,
    description,
    url: canonical,
    type: "article",
    images: [{ url: absoluteUrl(image.src), alt: image.alt }],
  },
  twitter: { card: "summary_large_image", title, description, images: [absoluteUrl(image.src)] },
};

export default function PearlSymbolismPage() {
  return (
    <div className="bg-[var(--bg)]">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: absoluteUrl("/") },
          { name: "Pearl Knowledge", url: absoluteUrl("/pearls") },
          { name: "Pearl Symbolism", url: canonical },
        ]}
      />
      <section className="grid min-h-[34rem] border-b border-[var(--border)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="relative min-h-[22rem] bg-[var(--surface-alt)] lg:min-h-full">
          <Image src={image.src} alt={image.alt} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="flex items-end bg-[var(--surface)] px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase text-[var(--accent)]">Pearl guide</p>
            <h1 className="mt-4 font-serif text-4xl font-medium text-[var(--text)] sm:text-5xl">Pearls as a personal detail.</h1>
            <p className="mt-5 text-lg leading-8 text-[var(--text-secondary)]">Pearls often appear in personal style because they can feel familiar, restrained, or deliberately dressed up. In gifting, the meaning comes from the relationship, the occasion, and the note you choose to attach to the piece.</p>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <div className="space-y-14">
          <section>
            <h2 className="font-serif text-3xl font-medium text-[var(--text)]">Choose the story that is already there.</h2>
            <p className="mt-5 text-base leading-8 text-[var(--text-secondary)]">A pearl piece can mark an ordinary change of pace, a birthday dinner, a shared trip, or a new role. It does not need a universal message. A useful starting point is simply what the person wears now and the moment you want the gift to recall.</p>
          </section>
          <section>
            <h2 className="font-serif text-3xl font-medium text-[var(--text)]">Let placement set the tone.</h2>
            <p className="mt-5 text-base leading-8 text-[var(--text-secondary)]">Earrings bring the detail close to the face. A necklace follows a neckline, while a bracelet or ring appears with daily hand movement. Choosing one focal placement makes the piece easier to fold into a personal style rather than treating it as a costume.</p>
          </section>
          <section>
            <h2 className="font-serif text-3xl font-medium text-[var(--text)]">For a gift, leave room for their interpretation.</h2>
            <p className="mt-5 text-base leading-8 text-[var(--text-secondary)]">A short note can explain why you noticed a particular shape, metal tone, or pearl detail. Keep it specific to the person and the occasion, then let them make the piece their own through how they wear it.</p>
          </section>
        </div>
      </article>

      <section className="border-y border-[var(--border)] bg-[var(--surface-alt)] py-14 sm:py-16" aria-labelledby="symbolism-edits-title">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase text-[var(--accent)]">Explore by feeling</p>
          <h2 id="symbolism-edits-title" className="mt-3 font-serif text-3xl font-medium text-[var(--text)]">A focused place to begin</h2>
          <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {PEARL_EDITS.map((edit) => (
              <Link key={edit.slug} href={edit.route} className="border-t border-[var(--border)] pt-5 hover:border-[var(--accent)]">
                <h3 className="font-serif text-2xl font-medium text-[var(--text)]">{edit.title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--text-secondary)]">{edit.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
