import { db } from "@/lib/db";
import Link from "next/link";

export async function HomeBlogAsync() {
  const posts = await db.blogPost.findMany({
    take: 3,
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  if (posts.length === 0) return null;

  return (
    <section className="py-20 bg-[var(--surface)] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-[0.08em] text-[#D4A84B] uppercase mb-4">
            From the Archives
          </span>
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold text-[#E8E0D5] mb-4">
            Stone Stories
          </h2>
          <p className="text-[1.0625rem] text-[#A89880] max-w-[580px] mx-auto leading-relaxed">
            Crystal wellness, intention practices, stone meanings, and spiritual lifestyle inspiration.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-[var(--bg)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--accent)]/30 transition-all"
            >
              {post.image && (
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-5">
                <span className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-semibold">{post.category}</span>
                <h3 className="font-serif text-lg font-bold mt-1 mb-2 group-hover:text-[var(--accent)] transition-colors">{post.title}</h3>
                <p className="text-sm text-[var(--text-muted)] line-clamp-2">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeBlogFallback() {
  return (
    <section className="py-20 bg-[var(--surface)] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 animate-pulse">
          <div className="h-4 w-40 bg-[var(--border)] rounded mx-auto mb-4" />
          <div className="h-8 w-64 bg-[var(--border)] rounded mx-auto mb-2" />
          <div className="h-5 w-96 bg-[var(--border)] rounded mx-auto" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[16/9] bg-[var(--border)] rounded-t-xl" />
              <div className="p-5 space-y-2">
                <div className="h-3 w-20 bg-[var(--border)] rounded" />
                <div className="h-5 w-full bg-[var(--border)] rounded" />
                <div className="h-4 w-3/4 bg-[var(--border)] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
