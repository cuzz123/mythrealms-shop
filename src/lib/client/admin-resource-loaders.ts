type Fetcher = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

export type OperationsSnapshot<Candidate, Inbox, Report> = {
  candidates?: Candidate;
  inbox?: Inbox;
  reports?: Report;
};

export async function loadOperationsSnapshot<Candidate = unknown, Inbox = unknown, Report = unknown>(
  fetcher: Fetcher = fetch,
): Promise<OperationsSnapshot<Candidate, Inbox, Report>> {
  const [candidateResponse, inboxResponse, reportResponse] = await Promise.all([
    fetcher("/api/admin/operations/candidates"),
    fetcher("/api/admin/operations/inbox"),
    fetcher("/api/admin/operations/reports"),
  ]);
  const snapshot: OperationsSnapshot<Candidate, Inbox, Report> = {};
  if (candidateResponse.ok) snapshot.candidates = (await candidateResponse.json()) as Candidate;
  if (inboxResponse.ok) snapshot.inbox = (await inboxResponse.json()) as Inbox;
  if (reportResponse.ok) snapshot.reports = (await reportResponse.json()) as Report;
  return snapshot;
}

export async function loadPinterestDrafts<Draft = unknown>(
  fetcher: Fetcher = fetch,
): Promise<Draft[]> {
  const response = await fetcher("/api/admin/pinterest-drafts", { cache: "no-store" });
  const data = (await response.json()) as { drafts?: Draft[]; error?: string };
  if (!response.ok) throw new Error(data.error || "无法加载 Pinterest 草稿");
  return data.drafts || [];
}
