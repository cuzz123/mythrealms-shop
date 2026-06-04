import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Markdown from "react-markdown"
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic"


export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  });

  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>

      <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-semibold">{post.category}</span>
      <h1 className="font-serif text-4xl font-bold mt-2 mb-4 leading-tight text-[var(--text)]">{post.title}</h1>

      <div className="flex items-center gap-4 text-sm text-[var(--text-muted)] mb-8 pb-6 border-b border-[var(--border)]">
        <span>{post.author?.name || "MythRealms"}</span>
        <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
      </div>

      {post.image && (
        <img src={post.image} alt={post.title} className="w-full rounded-xl mb-8 object-cover max-h-[400px]" />
      )}

      <div className="prose prose-sm prose-invert max-w-none text-[var(--text-secondary)] leading-relaxed">
        <Markdown>{post.content}</Markdown>
      </div>
    </div>
  );
}
