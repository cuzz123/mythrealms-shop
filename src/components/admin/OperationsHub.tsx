"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ExternalLink,
  Inbox,
  Link2,
  RefreshCw,
  Send,
  X,
} from "lucide-react";

type Candidate = {
  id: string;
  candidateUrl: string;
  supplierName: string;
  material: string;
  purchasePriceCents: number;
  estimatedShippingCents: number;
  moq: number;
  dropshipAvailable: boolean;
  score: number;
  suggestedRetailPriceCents: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  scoreReasons: Array<{ label: string; points: number; maxPoints: number }>;
};

type InboxEvent = {
  id: string;
  category: string;
  action: string;
  priority: string;
  status: string;
  senderEmail: string | null;
  senderName: string | null;
  subject: string | null;
  bodyPreview: string | null;
  draftBody: string | null;
  errorMessage: string | null;
  createdAt: string;
};

type Report = {
  id: string;
  reportDate: string;
  sections: {
    sales?: { orders: number; paidOrders: number; revenueCents: number };
    sourcing?: { created: number; approved: number; dropshipping: number };
    inbox?: { autoReplied: number; drafts: number; failed: number };
    ga4?: { configured: boolean; reason?: string; activeUsers?: number; sessions?: number };
  } | null;
  delivery: { status?: string; reason?: string } | null;
};

const initialForm = {
  "1688Url": "",
  supplierName: "",
  materialSpec: "",
  purchasePriceCny: "",
  moq: "1",
  estimatedShippingCny: "",
  supportsDropshipping: false,
};

function formatUsd(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatCny(cents: number) {
  return `¥${(cents / 100).toFixed(2)}`;
}

export function OperationsHub() {
  const [tab, setTab] = useState<"report" | "candidates" | "inbox">("report");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [events, setEvents] = useState<InboxEvent[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [outlookStatus, setOutlookStatus] = useState<string>("未连接");
  const [form, setForm] = useState(initialForm);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const refresh = useCallback(async () => {
    setBusy(true);
    try {
      const [candidateResponse, inboxResponse, reportResponse] = await Promise.all([
        fetch("/api/admin/operations/candidates"),
        fetch("/api/admin/operations/inbox"),
        fetch("/api/admin/operations/reports"),
      ]);
      if (candidateResponse.ok) setCandidates(await candidateResponse.json());
      if (inboxResponse.ok) {
        const inbox = await inboxResponse.json();
        setEvents(inbox.events ?? []);
        setOutlookStatus(inbox.connection?.status ?? "未连接");
      }
      if (reportResponse.ok) setReports(await reportResponse.json());
    } catch {
      setMessage("运营数据暂时无法读取，请稍后刷新。");
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function createCandidate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/operations/candidates", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "候选保存失败。");
      setForm(initialForm);
      setMessage("候选已加入审核队列。");
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "候选保存失败。");
    } finally {
      setBusy(false);
    }
  }

  async function reviewCandidate(id: string, status: Candidate["status"]) {
    const reviewNotes = window.prompt("请输入审核说明：");
    if (!reviewNotes?.trim()) {
      setMessage("审核说明不能为空。");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch(`/api/admin/operations/candidates/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status, reviewNotes }),
      });
      if (!response.ok) throw new Error("审核更新失败。");
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "审核更新失败。");
    } finally {
      setBusy(false);
    }
  }

  async function actOnDraft(id: string, action: "SEND" | "IGNORE") {
    setBusy(true);
    try {
      const event = events.find((item) => item.id === id);
      const response = await fetch(`/api/admin/operations/inbox/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action, draftBody: drafts[id] ?? event?.draftBody ?? "" }),
      });
      if (!response.ok) throw new Error("收件箱操作失败。");
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "收件箱操作失败。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[var(--text)]">运营中枢</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">选品审核、客户邮件与日报</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/api/admin/operations/outlook/connect" className="inline-flex h-10 items-center gap-2 rounded-md border border-[var(--border)] px-3 text-sm text-[var(--text)] hover:bg-[var(--surface)]">
            <Link2 className="h-4 w-4" /> Outlook：{outlookStatus}
          </a>
          <button type="button" onClick={() => void refresh()} disabled={busy} className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface)]" title="刷新运营数据">
            <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="inline-flex rounded-md border border-[var(--border)] p-1" role="tablist" aria-label="运营视图">
        {[
          ["report", "每日报告"],
          ["candidates", "1688 候选"],
          ["inbox", "收件箱队列"],
        ].map(([value, label]) => (
          <button key={value} type="button" role="tab" aria-selected={tab === value} onClick={() => setTab(value as typeof tab)} className={`h-9 rounded px-3 text-sm ${tab === value ? "bg-[var(--text)] text-white" : "text-[var(--text-muted)] hover:text-[var(--text)]"}`}>{label}</button>
        ))}
      </div>

      {message ? <p className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)]">{message}</p> : null}

      {tab === "report" ? (
        <section className="space-y-3">
          {reports.length === 0 ? <p className="border border-dashed border-[var(--border)] p-6 text-sm text-[var(--text-muted)]">暂无日报。每日北京时间 09:00 会自动生成并发送。</p> : reports.map((report) => (
            <article key={report.id} className="border border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-medium text-[var(--text)]">{new Date(report.reportDate).toLocaleDateString("zh-CN", { timeZone: "Asia/Shanghai" })} 日报</h2><span className="text-xs text-[var(--text-muted)]">投递：{report.delivery?.status ?? "未知"}</span></div>
              <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3"><p>销售：{report.sections?.sales?.paidOrders ?? 0} 笔已付款，{formatUsd(report.sections?.sales?.revenueCents ?? 0)}</p><p>选品：{report.sections?.sourcing?.created ?? 0} 个候选，{report.sections?.sourcing?.approved ?? 0} 个通过</p><p>邮件：{report.sections?.inbox?.autoReplied ?? 0} 自动回复，{report.sections?.inbox?.drafts ?? 0} 待审核</p></div>
              <p className="mt-3 text-xs text-[var(--text-muted)]">GA4：{report.sections?.ga4?.configured ? `${report.sections.ga4.activeUsers ?? 0} 活跃用户，${report.sections.ga4.sessions ?? 0} 会话` : report.sections?.ga4?.reason ?? "未配置"}</p>
            </article>
          ))}
        </section>
      ) : null}

      {tab === "candidates" ? (
        <section className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <form onSubmit={createCandidate} className="border border-[var(--border)] bg-[var(--surface)] p-4 space-y-3">
            <h2 className="font-medium text-[var(--text)]">录入候选</h2>
            {[
              ["1688Url", "1688 / Alibaba 链接", "url"],
              ["supplierName", "供应商名称", "text"],
              ["materialSpec", "材质 / 规格", "text"],
              ["purchasePriceCny", "采购单价（人民币）", "number"],
              ["moq", "MOQ", "number"],
              ["estimatedShippingCny", "预估运费（人民币）", "number"],
            ].map(([key, label, type]) => <label key={key} className="block text-sm text-[var(--text)]"><span className="mb-1 block">{label}</span><input required type={type} min={type === "number" ? "0" : undefined} step={key.includes("Cny") ? "0.01" : "1"} value={form[key as keyof typeof form] as string} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} className="h-10 w-full rounded-md border border-[var(--border)] bg-transparent px-3" /></label>)}
            <label className="flex items-center gap-2 text-sm text-[var(--text)]"><input type="checkbox" checked={form.supportsDropshipping} onChange={(event) => setForm((current) => ({ ...current, supportsDropshipping: event.target.checked }))} /> 支持一件代发</label>
            <button type="submit" disabled={busy} className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--text)] px-4 text-sm text-white disabled:opacity-50">加入审核队列</button>
          </form>
          <div className="space-y-3">
            {candidates.map((candidate) => <article key={candidate.id} className="border border-[var(--border)] bg-[var(--surface)] p-4"><div className="flex flex-wrap justify-between gap-3"><div><div className="flex items-center gap-2"><h2 className="font-medium text-[var(--text)]">{candidate.supplierName}</h2><a href={candidate.candidateUrl} target="_blank" rel="noreferrer" className="text-[var(--accent)]" title="打开供应商链接"><ExternalLink className="h-4 w-4" /></a></div><p className="mt-1 text-sm text-[var(--text-muted)]">{candidate.material} · MOQ {candidate.moq} · {candidate.dropshipAvailable ? "支持一件代发" : "不支持一件代发"}</p></div><div className="text-right"><p className="text-lg font-semibold text-[var(--text)]">{candidate.score} 分</p><p className="text-xs text-[var(--text-muted)]">到岸 {formatCny(candidate.purchasePriceCents + candidate.estimatedShippingCents)} · 建议 {formatUsd(candidate.suggestedRetailPriceCents)}</p></div></div><p className="mt-3 text-xs text-[var(--text-muted)]">{candidate.scoreReasons.map((reason) => `${reason.label} ${reason.points}/${reason.maxPoints}`).join(" · ")}</p><div className="mt-3 flex flex-wrap gap-2">{candidate.status !== "APPROVED" ? <button type="button" onClick={() => void reviewCandidate(candidate.id, "APPROVED")} className="h-8 rounded-md border border-[var(--border)] px-3 text-xs text-[var(--text)]">通过</button> : null}{candidate.status !== "REJECTED" ? <button type="button" onClick={() => void reviewCandidate(candidate.id, "REJECTED")} className="h-8 rounded-md border border-[var(--border)] px-3 text-xs text-[var(--text)]">退回</button> : null}{candidate.status !== "PENDING" ? <button type="button" onClick={() => void reviewCandidate(candidate.id, "PENDING")} className="h-8 rounded-md border border-[var(--border)] px-3 text-xs text-[var(--text)]">重新待定</button> : null}<span className="inline-flex h-8 items-center text-xs text-[var(--text-muted)]">状态：{candidate.status}</span></div></article>)}
            {candidates.length === 0 ? <p className="border border-dashed border-[var(--border)] p-6 text-sm text-[var(--text-muted)]">还没有候选链接。</p> : null}
          </div>
        </section>
      ) : null}

      {tab === "inbox" ? <section className="space-y-3">{events.map((event) => <article key={event.id} className="border border-[var(--border)] bg-[var(--surface)] p-4"><div className="flex flex-wrap justify-between gap-3"><div className="flex gap-3"><Inbox className="mt-0.5 h-4 w-4 text-[var(--accent)]" /><div><h2 className="font-medium text-[var(--text)]">{event.subject || "未命名邮件"}</h2><p className="mt-1 text-xs text-[var(--text-muted)]">{event.senderName || event.senderEmail || "未知发件人"} · {event.category} · {event.priority}</p></div></div><span className="text-xs text-[var(--text-muted)]">{event.action}</span></div><p className="mt-3 text-sm text-[var(--text-muted)]">{event.bodyPreview || event.errorMessage || "暂无摘要"}</p>{event.draftBody ? <div className="mt-3 space-y-2"><textarea value={drafts[event.id] ?? event.draftBody} onChange={(input) => setDrafts((current) => ({ ...current, [event.id]: input.target.value }))} className="min-h-32 w-full rounded-md border border-[var(--border)] bg-transparent p-3 text-sm text-[var(--text)]" /><div className="flex gap-2"><button type="button" onClick={() => void actOnDraft(event.id, "SEND")} className="inline-flex h-9 items-center gap-2 rounded-md bg-[var(--text)] px-3 text-xs text-white"><Send className="h-3.5 w-3.5" />发送</button><button type="button" onClick={() => void actOnDraft(event.id, "IGNORE")} className="inline-flex h-9 items-center gap-2 rounded-md border border-[var(--border)] px-3 text-xs text-[var(--text)]"><X className="h-3.5 w-3.5" />忽略</button></div></div> : null}</article>)}{events.length === 0 ? <p className="border border-dashed border-[var(--border)] p-6 text-sm text-[var(--text-muted)]">暂无邮件事件。连接 Outlook 后，新邮件会出现在这里。</p> : null}</section> : null}
    </div>
  );
}
