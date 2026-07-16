"use client";

import { useState, FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
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

export default function NewBlogPostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [preview, setPreview] = useState(false);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !slug || !category || !excerpt || !content) {
      setError("Please fill in all required fields.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
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
        throw new Error(data.error || "Failed to create blog post");
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Something went wrong."));
    } finally {
      setSaving(false);
    }
  };

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
          <h1 className="font-serif text-3xl font-bold">New Blog Post</h1>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setPreview(!preview)}
        >
          <Eye className="w-4 h-4" /> {preview ? "Edit" : "Preview"}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main editor */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Title <span className="text-[var(--accent)]">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                  placeholder="The Healing Power of Amethyst"
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
                  className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                  placeholder="healing-power-of-amethyst"
                  required
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Auto-generated from title. Edit manually if needed.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Excerpt <span className="text-[var(--accent)]">*</span>
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-y"
                  placeholder="A brief summary of the post (shown in cards and previews)..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Content (Markdown) <span className="text-[var(--accent)]">*</span>
                </label>
                {preview ? (
                  <div className="min-h-[400px] p-4 rounded-lg border border-[var(--border)] bg-[var(--bg)] overflow-auto prose prose-sm max-w-none">
                    {content ? (
                      <div className="prose prose-sm max-w-none prose-invert text-[var(--text)]">
                        <ReactMarkdown>{content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-[var(--text-muted)] italic">
                        Nothing to preview yet. Start writing in the editor...
                      </p>
                    )}
                  </div>
                ) : (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={20}
                    className="w-full px-3 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-y"
                    placeholder={`## Introduction\n\nWrite your blog post content here using Markdown...\n\n## Key Points\n\n- Point one\n- Point two\n\n## Conclusion\n\nWrap up your thoughts...`}
                    required
                  />
                )}
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Write in Markdown format. Use ## for headings, **bold**, *italic*, - for lists, etc.
                </p>
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
                  className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                  required
                >
                  <option value="">Select category...</option>
                  {BLOG_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                {image.trim() && (
                  <div className="mt-3">
                    <img
                      src={image.trim()}
                      alt="Featured preview"
                      className="w-full aspect-video object-cover rounded-lg border border-[var(--border)]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </section>

            <section className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
              <Button
                type="submit"
                variant="accent"
                className="w-full"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Publish Post
                  </>
                )}
              </Button>
              <Link href="/admin/blog" className="block mt-3">
                <Button type="button" variant="ghost" className="w-full">
                  Cancel
                </Button>
              </Link>
            </section>
          </div>
        </div>
      </form>
    </div>
  );
}
