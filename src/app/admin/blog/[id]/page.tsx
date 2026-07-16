"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Save, ArrowLeft, Loader2, Eye } from "lucide-react";
import Link from "next/link";
import { slugify } from "@/lib/utils";
import { getErrorMessage } from "@/lib/error-message";
import ReactMarkdown from "react-markdown";

const BLOG_CATEGORIES = [
  "Crystal Guide",
  "Meditation",
  "Healing",
  "Wellness",
  "Astrology",
  "Lifestyle",
  "News",
];

type BlogPostPayload = {
  title?: string;
  slug?: string;
  category?: string;
  excerpt?: string;
  content?: string;
  image?: string;
};

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/blog/${postId}`);
        if (!res.ok) throw new Error("Post not found");
        const post = await res.json();
        fillPost(post);
      } catch {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [postId]);

  function fillPost(post: BlogPostPayload) {
    setTitle(post.title || "");
    setSlug(post.slug || "");
    setCategory(post.category || "");
    setExcerpt(post.excerpt || "");
    setContent(post.content || "");
    setImage(post.image || "");
    setSlugManuallyEdited(true); // edit mode: don't auto-slug on initial load
  }

  const handleTitleChange = useCallback(
    (value: string) => {
      setTitle(value);
      if (!slugManuallyEdited) {
        setSlug(slugify(value));
      }
    },
    [slugManuallyEdited]
  );

  const handleSlugChange = useCallback((value: string) => {
    setSlugManuallyEdited(true);
    setSlug(value);
  }, []);

  const handleSubmit = async () => {
    setError(null);

    if (!title || !slug || !category || !excerpt || !content) {
      setError("Please fill in all required fields.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/admin/blog/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          category,
          excerpt,
          content,
          image: image || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update blog post");
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Something went wrong."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="p-2 hover:bg-[var(--border-light)] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-serif text-3xl font-bold">Edit Post</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setPreview(!preview)}>
            <Eye className="w-4 h-4 mr-2" />
            {preview ? "Editor" : "Preview"}
          </Button>
          <Button variant="accent" onClick={handleSubmit} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main editor */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Title <span className="text-[var(--accent)]">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Slug <span className="text-[var(--accent)]">*</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg)] font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Excerpt <span className="text-[var(--accent)]">*</span>
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Content (Markdown) <span className="text-[var(--accent)]">*</span>
              </label>

              {preview ? (
                <div className="min-h-[400px] p-4 rounded-lg border border-[var(--border)] bg-[var(--bg)] overflow-auto">
                  {content ? (
                    <div className="prose prose-sm max-w-none prose-invert text-[var(--text)]">
                      <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-[var(--text-muted)] italic">
                      Nothing to preview yet.
                    </p>
                  )}
                </div>
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={20}
                  className="w-full px-3 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-y"
                  placeholder="## Introduction&#10;&#10;Write your blog post content here using Markdown...&#10;&#10;## Key Points&#10;- Point one&#10;- Point two"
                  required
                />
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <section className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 space-y-5">
            <h2 className="font-serif text-lg font-bold">Post Settings</h2>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Category <span className="text-[var(--accent)]">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                required
              >
                <option value="">Select category</option>
                {BLOG_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Cover Image URL</label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                placeholder="https://... or /images/blog/..."
              />
              {image && (
                <img
                  src={image}
                  alt="Cover preview"
                  className="mt-2 w-full h-40 object-cover rounded-lg border border-[var(--border)]"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
