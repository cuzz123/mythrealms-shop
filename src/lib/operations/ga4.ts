import "server-only";

import { GoogleAuth } from "google-auth-library";

import type { OperationsGa4Config } from "./types";
import type { Ga4ReportSection } from "./report";

const GA4_READ_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";

function parseMetric(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function getGa4Snapshot(
  config: OperationsGa4Config,
  dateKey: string,
): Promise<Ga4ReportSection> {
  if (!config.configured) {
    return { configured: false, reason: config.reason };
  }

  try {
    const credentials = JSON.parse(config.serviceAccountJson) as Record<string, string>;
    const auth = new GoogleAuth({ credentials, scopes: [GA4_READ_SCOPE] });
    const client = await auth.getClient();
    const response = await client.request<{
      rows?: Array<{ metricValues?: Array<{ value?: string }> }>;
    }>({
      url: `https://analyticsdata.googleapis.com/v1beta/${config.propertyId}:runReport`,
      method: "POST",
      data: {
        dateRanges: [{ startDate: dateKey, endDate: dateKey }],
        metrics: [
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "ecommercePurchases" },
        ],
      },
    });
    const values = response.data.rows?.[0]?.metricValues ?? [];

    return {
      configured: true,
      activeUsers: parseMetric(values[0]?.value),
      sessions: parseMetric(values[1]?.value),
      purchases: parseMetric(values[2]?.value),
    };
  } catch {
    return {
      configured: false,
      reason: "GA4 metrics are temporarily unavailable.",
    };
  }
}
