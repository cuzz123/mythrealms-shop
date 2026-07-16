export type Ga4ReportSection =
  | { configured: false; reason: string }
  | {
      configured: true;
      activeUsers: number;
      sessions: number;
      purchases: number;
    };

export type OperationsReportInput = {
  dateKey: string;
  sales: { orders: number; paidOrders: number; revenueCents: number };
  sourcing: { created: number; approved: number; dropshipping: number };
  inbox: { autoReplied: number; drafts: number; failed: number };
  ga4: Ga4ReportSection;
  issues: string[];
};

export type OperationsReportDocument = {
  dateKey: string;
  sections: OperationsReportInput;
  text: string;
  html: string;
};

function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatGa4Text(ga4: Ga4ReportSection): string {
  if (!ga4.configured) return `GA4: ${ga4.reason}`;
  return `GA4: ${ga4.activeUsers} active users, ${ga4.sessions} sessions, ${ga4.purchases} purchases.`;
}

export function buildOperationsReport(
  input: OperationsReportInput,
): OperationsReportDocument {
  const lines = [
    `MythRealms operations report - ${input.dateKey}`,
    "",
    `Sales: ${input.sales.orders} orders, ${input.sales.paidOrders} paid, ${formatUsd(input.sales.revenueCents)} paid revenue.`,
    `Sourcing: ${input.sourcing.created} candidates, ${input.sourcing.approved} approved, ${input.sourcing.dropshipping} support dropshipping.`,
    `Inbox: ${input.inbox.autoReplied} auto-replied, ${input.inbox.drafts} awaiting review, ${input.inbox.failed} failed.`,
    formatGa4Text(input.ga4),
    "",
    "Issues:",
    ...(input.issues.length > 0 ? input.issues.map((issue) => `- ${issue}`) : ["- None"]),
  ];
  const ga4Html = input.ga4.configured
    ? `${input.ga4.activeUsers} active users, ${input.ga4.sessions} sessions, ${input.ga4.purchases} purchases`
    : escapeHtml(input.ga4.reason);
  const issuesHtml = input.issues.length > 0
    ? input.issues.map((issue) => `<li>${escapeHtml(issue)}</li>`).join("")
    : "<li>None</li>";

  return {
    dateKey: input.dateKey,
    sections: input,
    text: lines.join("\n"),
    html: `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#201e1a"><h1>MythRealms Operations Report</h1><p>${escapeHtml(input.dateKey)}</p><ul><li><strong>Sales:</strong> ${input.sales.orders} orders, ${input.sales.paidOrders} paid, ${formatUsd(input.sales.revenueCents)} paid revenue</li><li><strong>Sourcing:</strong> ${input.sourcing.created} candidates, ${input.sourcing.approved} approved, ${input.sourcing.dropshipping} support dropshipping</li><li><strong>Inbox:</strong> ${input.inbox.autoReplied} auto-replied, ${input.inbox.drafts} awaiting review, ${input.inbox.failed} failed</li><li><strong>GA4:</strong> ${ga4Html}</li></ul><h2>Issues</h2><ul>${issuesHtml}</ul></body></html>`,
  };
}
