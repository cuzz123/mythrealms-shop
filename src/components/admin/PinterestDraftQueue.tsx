"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react";
import {
  CalendarClock,
  Check,
  CircleAlert,
  Loader2,
  RefreshCw,
  Send,
  Sparkles,
  X,
} from "lucide-react";

type DraftStatus = "DRAFT" | "APPROVED" | "PUBLISHING" | "PUBLISHED" | "REJECTED" | "FAILED";

type Draft = {
  id: string;
  status: DraftStatus;
  productSlug: string;
  productName: string;
  imageUrl: string;
  link: string;
  title: string;
  description: string;
  tags: string[];
  scheduledFor: string | null;
  publishedAt: string | null;
  remotePinId: string | null;
  error: string | null;
  updatedAt: string;
};

type DraftEdits = Record<string, { title: string; description: string; scheduledFor: string }>;

const statusLabel: Record<DraftStatus, string> = {
  DRAFT: "待审核",
  APPROVED: "已通过",
  PUBLISHING: "发布中",
  PUBLISHED: "已发布",
  REJECTED: "已拒绝",
  FAILED: "发布失败",
};

const statusClass: Record<DraftStatus, string> = {
  DRAFT: "bg-amber-500/10 text-amber-700",
  APPROVED: "bg-sky-500/10 text-sky-700",
  PUBLISHING: "bg-violet-500/10 text-violet-700",
  PUBLISHED: "bg-emerald-500/10 text-emerald-700",
  REJECTED: "bg-neutral-500/10 text-neutral-600",
  FAILED: "bg-red-500/10 text-red-700",
};

function getEdits(draft: Draft) {
  return {
    title: draft.title,
    description: draft.description,
    scheduledFor: asLocalInput(draft.scheduledFor),
  };
}

function asLocalInput(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function formatDate(value: string | null) {
  if (!value) return "未排期";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "未排期";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function PinterestDraftQueue() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [edits, setEdits] = useState<DraftEdits>({});
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const applyDraft = useCallback((nextDraft: Draft) => {
    setDrafts((current) => {
      const present = current.some((draft) => draft.id === nextDraft.id);
      const next = present
        ? current.map((draft) => (draft.id === nextDraft.id ? nextDraft : draft))
        : [nextDraft, ...current];
      return next.sort((a, b) => {
        const first = a.scheduledFor || a.updatedAt;
        const second = b.scheduledFor || b.updatedAt;
        return new Date(first).getTime() - new Date(second).getTime();
      });
    });
    setEdits((current) => ({ ...current, [nextDraft.id]: getEdits(nextDraft) }));
  }, []);

  const loadDrafts = useCallback(async () => {
    setLoading(true);
    setNotice(null);
    try {
      const response = await fetch("/api/admin/pinterest-drafts", { cache: "no-store" });
      const data = (await response.json()) as { drafts?: Draft[]; error?: string };
      if (!response.ok) throw new Error(data.error || "无法加载 Pinterest 草稿");

      const nextDrafts = data.drafts || [];
      setDrafts(nextDrafts);
      setEdits(Object.fromEntries(nextDrafts.map((draft) => [draft.id, getEdits(draft)])));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "无法加载 Pinterest 草稿");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDrafts();
  }, [loadDrafts]);

  async function createDraft() {
    setBusyKey("create");
    setNotice(null);
    try {
      const response = await fetch("/api/admin/pinterest-drafts", { method: "POST" });
      const data = (await response.json()) as { draft?: Draft; error?: string };
      if (!response.ok || !data.draft) throw new Error(data.error || "生成草稿失败");
      applyDraft(data.draft);
      setNotice("已生成一条新的 Pinterest 草稿。");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "生成草稿失败");
    } finally {
      setBusyKey(null);
    }
  }

  function updateEdit(id: string, patch: Partial<DraftEdits[string]>) {
    setEdits((current) => ({
      ...current,
      [id]: { ...current[id], ...patch },
    }));
  }

  async function runAction(draft: Draft, action: "save" | "approve" | "reject" | "publish" | "retry") {
    const key = `${draft.id}:${action}`;
    setBusyKey(key);
    setNotice(null);

    const edit = edits[draft.id] || getEdits(draft);
    const withEdits = action === "save" || action === "approve";
    const body = withEdits
      ? {
          action,
          title: edit.title,
          description: edit.description,
          scheduledFor: edit.scheduledFor ? new Date(edit.scheduledFor).toISOString() : null,
        }
      : { action };

    try {
      const response = await fetch(`/api/admin/pinterest-drafts/${draft.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await response.json()) as { draft?: Draft; error?: string };
      if (!response.ok || !data.draft) throw new Error(data.error || "操作失败");

      applyDraft(data.draft);
      if (action === "approve") setNotice("草稿已通过审核，下一次每日调度会发布到期内容。");
      if (action === "publish" || action === "retry") setNotice("Pinterest 发布请求已完成。");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "操作失败");
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <section className="mb-8 border-y border-[var(--border)] py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)]">Pinterest 内容审核</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">生成、编辑、排期并审核自动发布内容。</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void loadDrafts()}
            disabled={loading || busyKey !== null}
            aria-label="刷新草稿列表"
            title="刷新草稿列表"
            className="inline-flex h-9 w-9 items-center justify-center border border-[var(--border)] text-[var(--text)] transition hover:bg-[var(--bg)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => void createDraft()}
            disabled={busyKey !== null}
            className="inline-flex h-9 items-center gap-2 bg-[var(--accent)] px-3 text-sm font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busyKey === "create" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            生成草稿
          </button>
        </div>
      </div>

      {notice && (
        <div className="mt-4 flex items-start gap-2 border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)]">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
          <span>{notice}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-10 text-sm text-[var(--text-muted)]">
          <Loader2 className="h-4 w-4 animate-spin" /> 正在加载草稿
        </div>
      ) : drafts.length === 0 ? (
        <div className="py-10 text-sm text-[var(--text-muted)]">还没有 Pinterest 草稿。</div>
      ) : (
        <div className="mt-5 space-y-4">
          {drafts.map((draft) => {
            const edit = edits[draft.id] || getEdits(draft);
            const editable = ["DRAFT", "APPROVED", "FAILED"].includes(draft.status);
            const pending = busyKey?.startsWith(`${draft.id}:`);

            return (
              <article key={draft.id} className="grid gap-4 border border-[var(--border)] bg-[var(--surface)] p-4 md:grid-cols-[132px_minmax(0,1fr)]">
                <a href={draft.link} target="_blank" rel="noreferrer" className="block aspect-[2/3] overflow-hidden bg-[var(--bg)]">
                  <img src={draft.imageUrl} alt={draft.productName} className="h-full w-full object-cover" />
                </a>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-semibold ${statusClass[draft.status]}`}>{statusLabel[draft.status]}</span>
                    <a href={draft.link} target="_blank" rel="noreferrer" className="truncate text-sm font-medium text-[var(--text)] hover:text-[var(--accent)]">
                      {draft.productName}
                    </a>
                    {draft.remotePinId && <span className="text-xs text-[var(--text-muted)]">Pin {draft.remotePinId}</span>}
                  </div>

                  {editable ? (
                    <div className="mt-3 grid gap-3">
                      <label className="grid gap-1 text-xs font-medium text-[var(--text-muted)]">
                        标题
                        <input
                          value={edit.title}
                          maxLength={100}
                          onChange={(event) => updateEdit(draft.id, { title: event.target.value })}
                          className="h-9 border border-[var(--border)] bg-[var(--bg)] px-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
                        />
                      </label>
                      <label className="grid gap-1 text-xs font-medium text-[var(--text-muted)]">
                        描述
                        <textarea
                          value={edit.description}
                          maxLength={500}
                          rows={3}
                          onChange={(event) => updateEdit(draft.id, { description: event.target.value })}
                          className="resize-y border border-[var(--border)] bg-[var(--bg)] px-2 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
                        />
                      </label>
                      <label className="grid gap-1 text-xs font-medium text-[var(--text-muted)]">
                        自动发布时间（每日检查一次）
                        <input
                          type="datetime-local"
                          value={edit.scheduledFor}
                          onChange={(event) => updateEdit(draft.id, { scheduledFor: event.target.value })}
                          className="h-9 border border-[var(--border)] bg-[var(--bg)] px-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <h3 className="text-sm font-semibold text-[var(--text)]">{draft.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{draft.description}</p>
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                    <span className="inline-flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5" />{formatDate(draft.scheduledFor)}</span>
                    {draft.tags.map((tag) => <span key={tag}>#{tag}</span>)}
                  </div>

                  {draft.error && <p className="mt-3 text-sm text-red-700">{draft.error}</p>}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {editable && (
                      <button
                        type="button"
                        onClick={() => void runAction(draft, "save")}
                        disabled={Boolean(pending)}
                        className="inline-flex h-8 items-center gap-1.5 border border-[var(--border)] px-2.5 text-xs font-medium text-[var(--text)] hover:bg-[var(--bg)] disabled:opacity-50"
                      >
                        {pending && busyKey === `${draft.id}:save` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                        保存
                      </button>
                    )}
                    {(draft.status === "DRAFT" || draft.status === "FAILED") && (
                      <button
                        type="button"
                        onClick={() => void runAction(draft, "approve")}
                        disabled={Boolean(pending)}
                        className="inline-flex h-8 items-center gap-1.5 bg-emerald-600 px-2.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {pending && busyKey === `${draft.id}:approve` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        通过审核
                      </button>
                    )}
                    {draft.status === "APPROVED" && (
                      <button
                        type="button"
                        onClick={() => void runAction(draft, "publish")}
                        disabled={Boolean(pending)}
                        className="inline-flex h-8 items-center gap-1.5 bg-[var(--accent)] px-2.5 text-xs font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-50"
                      >
                        {pending && busyKey === `${draft.id}:publish` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                        立即发布
                      </button>
                    )}
                    {draft.status === "FAILED" && (
                      <button
                        type="button"
                        onClick={() => void runAction(draft, "retry")}
                        disabled={Boolean(pending)}
                        className="inline-flex h-8 items-center gap-1.5 bg-[var(--accent)] px-2.5 text-xs font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-50"
                      >
                        {pending && busyKey === `${draft.id}:retry` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                        重试发布
                      </button>
                    )}
                    {["DRAFT", "APPROVED", "FAILED"].includes(draft.status) && (
                      <button
                        type="button"
                        onClick={() => void runAction(draft, "reject")}
                        disabled={Boolean(pending)}
                        className="inline-flex h-8 w-8 items-center justify-center border border-[var(--border)] text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-700 disabled:opacity-50"
                        aria-label="拒绝草稿"
                        title="拒绝草稿"
                      >
                        {pending && busyKey === `${draft.id}:reject` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
