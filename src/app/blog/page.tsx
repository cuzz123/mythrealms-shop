import type { Metadata } from "next";
import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { absoluteUrl } from "@/lib/site";
import { isPearlEditorialPost } from "@/lib/seo/blog";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Pearl Jewelry Journal | MythRealms",
  description: "Pearl jewelry guidance on styling, care, gifting, fit, and shipping from MythRealms.",
  alternates: { canonical: absoluteUrl("/blog") },
  openGraph: {
    type: "website",
    url: absoluteUrl("/blog"),
    title: "Pearl Jewelry Journal | MythRealms",
    description: "Pearl jewelry guidance on styling, care, gifting, fit, and shipping from MythRealms.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pearl Jewelry Journal | MythRealms",
    description: "Pearl jewelry guidance on styling, care, gifting, fit, and shipping from MythRealms.",
  },
};

export default async function BlogPage() {
  const posts = (await db.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  })).filter(isPearlEditorialPost);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <Link href="/" className="hover:text-[var(--text)]">Home</Link><span>/</span><span className="text-[var(--text)]">Blog</span>
      </nav>

      <div className="text-center mb-12">
        <h1 className="font-serif text-5xl font-bold mb-3">Pearl Jewelry Journal</h1>
        <p className="text-[var(--text-muted)] max-w-lg mx-auto">Practical guides for styling, caring for, gifting, and shopping pearl jewelry.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="aspect-[3/2] overflow-hidden bg-[var(--border-light)] relative">
              {post.image ? (
                <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized={post.image.startsWith("http")} />
              ) : (
                <div className="w-full h-full bg-[var(--border-light)] flex items-center justify-center">
                  <span className="text-[var(--text-muted)] text-sm">MythRealms</span>
                </div>
              )}
            </div>
            <div className="p-6 bg-[var(--surface)]">
              <span className="text-[11px] uppercase tracking-widest text-[var(--accent)] font-semibold">{post.category}</span>
              <h2 className="font-serif text-xl font-bold mt-2 mb-2 leading-tight group-hover:text-[var(--primary)] transition-colors">{post.title}</h2>
              <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-4">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] pt-4 border-t border-[var(--border-light)]">
                <span className="font-medium text-[var(--text-secondary)]">{post.author?.name || "MythRealms"}</span>
                <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[var(--text-muted)]">New pearl jewelry guidance is on the way.</p>
        </div>
      )}
    </div>
  );
}
