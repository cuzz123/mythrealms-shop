import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Markdown from "react-markdown"
import { ArrowLeft } from "lucide-react";
import { absoluteImageUrl } from "@/lib/images";
import { absoluteUrl } from "@/lib/site";
import { BlogPostingJsonLd } from "@/components/ui/JsonLd";
import { buildBlogMetadata, isPearlEditorialPost } from "@/lib/seo/blog";

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({
    where: { slug },
    select: {
      title: true,
      excerpt: true,
      image: true,
      content: true,
      category: true,
    },
  });

  if (!post || !isPearlEditorialPost({ slug, ...post })) {
    return { title: "Article Not Found | MythRealms", robots: { index: false, follow: false } };
  }

  return buildBlogMetadata({ slug, ...post });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  });

  if (!post || !isPearlEditorialPost(post)) notFound();

  return (
    <>
      <BlogPostingJsonLd
        headline={post.title}
        description={post.excerpt}
        url={absoluteUrl(`/blog/${post.slug}`)}
        image={post.image ? absoluteImageUrl(post.image) : undefined}
        datePublished={post.publishedAt}
        dateModified={post.updatedAt}
        authorName={post.author?.name || "MythRealms"}
      />
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
    </>
  );
}
