import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export async function HomeBlogSection() {
  const posts = await db.blogPost.findMany({
    take: 3,
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  if (posts.length === 0) return null;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-3xl font-bold text-[var(--text)]">
            Mythology & Lore
          </h2>
          <Link
            href="/blog"
            className="text-sm font-medium text-[var(--accent)] hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:shadow-lg transition hover:-translate-y-1"
            >
              <div className="aspect-[3/2] overflow-hidden bg-[var(--border-light)]">
                <img
                  src={post.image || ""}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <span className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-semibold">
                  {post.category}
                </span>
                <h3 className="font-serif text-lg font-bold mt-1.5 leading-snug text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
