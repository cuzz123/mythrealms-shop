import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Camera, ScanSearch, ShieldCheck, Sparkles } from "lucide-react";

import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About MythRealms | The Pearl Edit",
  description:
    "Meet MythRealms, an edited pearl jewelry shop focused on clear product imagery, everyday styling, and a concise pearl-led collection.",
  alternates: { canonical: absoluteUrl("/about") },
};

const productTypes = [
  {
    name: "Pearl Rings",
    href: "/collections/pearl-series?type=rings",
    image: "/images/products/1688-shop/pearl-series/pearl-series-01-main.webp",
    description: "Light-catching ring designs for solo wear or simple stacks.",
  },
  {
    name: "Pearl Bracelets",
    href: "/collections/pearl-series?type=bracelets",
    image: "/images/products/1688-shop/pearl-series/pearl-series-12-main.webp",
    description: "Easy wrist pieces with movement, texture, and everyday scale.",
  },
  {
    name: "Pearl Earrings",
    href: "/collections/pearl-series?type=earrings",
    image: "/images/products/1688-shop/pearl-series/pearl-series-13-main.webp",
    description: "Earring designs ranging from quiet detail to fuller drops.",
  },
  {
    name: "Pearl Necklaces",
    href: "/collections/pearl-series?type=necklaces",
    image: "/images/products/1688-shop/pearl-series/pearl-series-19-main.webp",
    description: "Necklaces and lariats designed for clean, easy layering.",
  },
  {
    name: "Pearl Eyewear Chains",
    href: "/collections/pearl-series?type=eyewear-chains",
    image: "/images/products/new-series/new-series-pearl-glasses-chain/main.jpg",
    description: "Pearl-led chains that keep glasses close while adding a jewelry detail.",
  },
];

const principles = [
  {
    icon: ScanSearch,
    title: "An Edited Catalog",
    text: "The public shop contains only the approved Pearl Edit. Retired collections stay out of search, navigation, and product feeds.",
  },
  {
    icon: Camera,
    title: "Product-True Images",
    text: "Each gallery is anchored to the source product photography so the structure, proportions, and finish stay recognizable.",
  },
  {
    icon: Sparkles,
    title: "Everyday Styling",
    text: "The Pearl Edit is built around rings, bracelets, earrings, and necklaces that work across ordinary days and dressier moments.",
  },
  {
    icon: ShieldCheck,
    title: "Clear Expectations",
    text: "Prices, shipping, returns, care, and available product details are stated directly, without therapeutic or guaranteed outcome claims.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative min-h-[560px] overflow-hidden">
        <Image
          src="/images/brand/hero/pearl-earrings-editorial.png"
          alt="Close view of pearl earrings worn in warm daylight"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto flex min-h-[560px] max-w-6xl items-end px-6 pb-14 md:pb-20">
          <div className="max-w-2xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
              About MythRealms
            </p>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight md:text-6xl">
              One clear collection, centered on pearls.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
              MythRealms is building a focused pearl wardrobe: a small edit, honest product
              imagery, and pieces that earn their place through wearability.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            The Point of View
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-[var(--text)] md:text-4xl">
            The Pearl Edit is the whole storefront, not one collection among many.
          </h2>
        </div>
        <div className="space-y-5 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
          <p>
            We keep the public shop focused on a pearl-led edit so every page, image, and product
            path tells the same story. Customers can browse by product type without passing
            through discontinued collections or unrelated styles.
          </p>
          <p>
            Product structure matters more than invented perfection. The gallery is the visual
            reference for shape, setting, scale, and finish, while editorial imagery helps show
            how a piece can sit within a real outfit.
          </p>
          <p>
            Names and guardian archetypes add a story layer. They are styling prompts, not
            medical, spiritual, or guaranteed emotional claims.
          </p>
        </div>
      </section>

      <section className="bg-[var(--surface-alt)] py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                Shop by Type
              </p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-[var(--text)]">
                Four ways into The Pearl Edit
              </h2>
            </div>
            <Link
              href="/collections/pearl-series"
              className="hidden items-center gap-2 text-sm font-semibold text-[var(--accent)] sm:inline-flex"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {productTypes.map((type) => (
              <Link
                key={type.name}
                href={type.href}
                className="group overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--border-light)]">
                  <Image
                    src={type.image}
                    alt={`${type.name} from The Pearl Edit`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-lg font-bold text-[var(--text)]">{type.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                    {type.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-4 md:grid-cols-4">
          {principles.map((principle) => (
            <div key={principle.title} className="border-t border-[var(--border)] pt-5">
              <principle.icon className="h-6 w-6 text-[var(--accent)]" strokeWidth={1.5} />
              <h3 className="mt-4 font-serif text-lg font-bold text-[var(--text)]">
                {principle.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                {principle.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 border-y border-[var(--border)] py-12 text-center">
          <h2 className="font-serif text-3xl font-bold text-[var(--text)]">
            Start with the piece you would wear this week.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">
            Browse the full edit, compare the complete galleries, and choose by product type or
            the way a piece fits your own wardrobe.
          </p>
          <Link
            href="/collections/pearl-series"
            className="mt-7 inline-flex items-center gap-2 bg-[var(--accent)] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]"
          >
            Shop The Pearl Edit <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
