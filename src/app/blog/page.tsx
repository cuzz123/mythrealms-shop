import { db } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic"


export default async function BlogPage() {
  const posts = await db.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
        <a href="/" className="hover:text-[var(--text)]">Home</a><span>/</span><span className="text-[var(--text)]">Blog</span>
      </nav>

      <div className="text-center mb-12">
        <h1 className="font-serif text-5xl font-bold mb-3">MythRealms Blog</h1>
        <p className="text-[var(--text-muted)] max-w-lg mx-auto">Explore the wisdom of Taoist philosophy, Wu Xing elements, Bagua, and spiritual lifestyle inspiration</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white border border-[var(--border-light)] rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="aspect-[3/2] overflow-hidden bg-[var(--border-light)]">
              <img src={post.image || ""} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <span className="text-[11px] uppercase tracking-widest text-[var(--accent)] font-semibold">{post.category}</span>
              <h2 className="font-serif text-xl font-bold mt-2 mb-2 leading-tight group-hover:text-[var(--primary)] transition-colors">{post.title}</h2>
              <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-4">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] pt-4 border-t border-[var(--border-light)]">
                <span className="font-medium text-[var(--text-secondary)]">{post.author?.name || "Taoverse"}</span>
                <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[var(--text-muted)]">No blog posts yet. Check back soon for spiritual insights and crystal wisdom.</p>
        </div>
      )}
    </div>
  );
}
