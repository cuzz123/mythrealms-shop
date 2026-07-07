"use client";

import { useEffect, useState } from "react";
import { AlertCircle, BookOpen, Check, ChevronRight, Loader2, Sparkles } from "lucide-react";

interface SeoQueue {
  totalKeywords: number;
  todayIndex: number;
  today: string;
  tomorrow: string;
  existingPosts: number | null;
}

interface SeoResult {
  success: true;
  keyword: string;
  slug: string;
  title: string;
  excerpt: string;
  wordCount: number;
  imageUrl: string | null;
}

export default function AdminSEOPage() {
  const [queue, setQueue] = useState<SeoQueue | null>(null);
  const [keyword, setKeyword] = useState("");
  const [generating, setGenerating] = useState(false);
  const [loadingQueue, setLoadingQueue] = useState(true);
  const [result, setResult] = useState<SeoResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    fetch("/api/admin/seo")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load SEO queue");
        if (mounted) setQueue(data.queue);
      })
      .catch((e: unknown) => {
        if (mounted) setError(e instanceof Error ? e.message : "Failed to load SEO queue");
      })
      .finally(() => {
        if (mounted) setLoadingQueue(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function generateNow() {
    setGenerating(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(keyword.trim() ? { keyword: keyword.trim() } : {}),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unknown error");
      }
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate article");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/15">
          <Sparkles className="h-5 w-5 text-[var(--accent)]" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--text)]">SEO Content Engine</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Generate pearl and gemstone blog articles with admin approval.
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="mb-4 flex items-center gap-2 font-serif text-lg font-bold text-[var(--text)]">
          <BookOpen className="h-4 w-4 text-[var(--accent)]" />
          Keyword Queue
        </h2>
        {loadingQueue ? (
          <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading queue...
          </div>
        ) : queue ? (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[var(--text-muted)]">Total keywords</span>
              <p className="font-semibold text-[var(--text)]">{queue.totalKeywords}</p>
            </div>
            <div>
              <span className="text-[var(--text-muted)]">Existing posts</span>
              <p className="font-semibold text-[var(--text)]">{queue.existingPosts ?? "DB unavailable"}</p>
            </div>
            <div>
              <span className="text-[var(--text-muted)]">Today&apos;s keyword</span>
              <p className="text-sm font-semibold text-[var(--text)]">{queue.today}</p>
            </div>
            <div>
              <span className="text-[var(--text-muted)]">Tomorrow</span>
              <p className="text-xs text-[var(--text-muted)]">{queue.tomorrow}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">Queue unavailable.</p>
        )}
      </div>

      <div className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <label htmlFor="seo-keyword" className="mb-2 block text-sm font-semibold text-[var(--text)]">
          Optional keyword override
        </label>
        <input
          id="seo-keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={queue?.today || "how to clean freshwater pearl jewelry at home"}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]"
        />
        <p className="mt-2 text-xs text-[var(--text-muted)]">
          Leave blank to generate today&apos;s queued article.
        </p>
      </div>

      <button
        type="button"
        onClick={generateNow}
        disabled={generating}
        className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] py-4 text-lg font-semibold text-[var(--bg)] transition hover:bg-[var(--accent-hover)] disabled:opacity-60"
      >
        {generating ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Generating article...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" /> Generate Article <ChevronRight className="h-4 w-4" />
          </>
        )}
      </button>

      {result && (
        <div className="rounded-xl border border-[var(--success)]/20 bg-[var(--success)]/10 p-6">
          <div className="mb-3 flex items-center gap-2">
            <Check className="h-5 w-5 text-[var(--success)]" />
            <span className="font-semibold text-[var(--success)]">Article Generated</span>
          </div>
          <p className="mb-2 font-serif text-lg text-[var(--text)]">{result.title}</p>
          <div className="flex flex-wrap gap-4 text-xs text-[var(--text-muted)]">
            <span>Keyword: {result.keyword}</span>
            <span>Slug: {result.slug}</span>
            <span>Words: {result.wordCount}</span>
          </div>
          <a
            href={`/blog/${result.slug}`}
            target="_blank"
            className="mt-3 inline-flex items-center gap-1 text-sm text-[var(--accent)] hover:underline"
            rel="noreferrer"
          >
            View on Blog <ChevronRight className="h-3 w-3" />
          </a>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="font-semibold text-red-400">SEO Action Failed</span>
          </div>
          <p className="mt-1 text-sm text-red-300/80">{error}</p>
        </div>
      )}
    </div>
  );
}
