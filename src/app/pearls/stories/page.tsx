import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { BreadcrumbJsonLd } from "@/components/ui/JsonLd";
import { db } from "@/lib/db";
import { isPearlEditorialPost } from "@/lib/seo/blog";
import { absoluteUrl } from "@/lib/site";

const title = "Pearl Stories | MythRealms";
const description = "A focused reading list of current MythRealms stories about styling, care, gifting, and choosing pearl jewelry.";
const canonical = absoluteUrl("/pearls/stories");

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  openGraph: { title, description, url: canonical, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default async function PearlStoriesPage() {
  const posts = (await db.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  })).filter(isPearlEditorialPost);

  return (
    <div className="bg-[var(--bg)]">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: absoluteUrl("/") },
          { name: "Pearl Knowledge", url: absoluteUrl("/pearls") },
          { name: "Pearl Stories", url: canonical },
        ]}
      />
      <section className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
          <p className="text-xs font-semibold uppercase text-[var(--accent)]">Pearl journal</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-medium text-[var(--text)] sm:text-5xl">Pearl stories for the way you choose and wear.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">{description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16" aria-labelledby="current-stories-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--accent)]">Current reading</p>
            <h2 id="current-stories-title" className="mt-3 font-serif text-3xl font-medium text-[var(--text)]">From the MythRealms journal</h2>
          </div>
          <Link href="/blog" className="border-b border-[var(--accent)] pb-1 text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)]">View all journal posts</Link>
        </div>
        {posts.length > 0 ? (
          <div className="mt-9 grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="border-t border-[var(--border)] pt-5">
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="relative aspect-[3/2] overflow-hidden bg-[var(--surface-alt)]">
                    {post.image ? (
                      <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.02]" unoptimized={post.image.startsWith("http")} />
                    ) : null}
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase text-[var(--accent)]">{post.category}</p>
                  <h3 className="mt-2 font-serif text-2xl font-medium text-[var(--text)] group-hover:text-[var(--accent)]">{post.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{post.excerpt}</p>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-9 border-y border-[var(--border)] py-10 text-[var(--text-secondary)]">
            New pearl stories are being prepared. Explore the current practical guides in the meantime.
          </div>
        )}
      </section>
    </div>
  );
}
