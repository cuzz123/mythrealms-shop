import "server-only";

import { GoogleAuth } from "google-auth-library";

import type { OperationsGa4Config } from "./types";
import type { Ga4ReportSection } from "./report";

const GA4_READ_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const REQUIRED_EXCLUSIONS = ["internal", "test", "debug", "preview"] as const;

export type Ga4ExcludedTrafficClass = (typeof REQUIRED_EXCLUSIONS)[number];

export type Ga4QualificationEvidence = {
  productionHostname: string;
  excludedTraffic: readonly Ga4ExcludedTrafficClass[];
  evidenceReference: string;
};

type QualifiedGa4Metrics = {
  activeUsers: number;
  sessions: number;
  purchases: number;
};

function parseMetric(value: unknown): number | null {
  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    return null;
  }

  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

export function validateGa4QualificationEvidence(
  evidence: Ga4QualificationEvidence | undefined,
): string | null {
  if (!evidence) {
    return "not_available: production hostname and traffic-exclusion evidence are required.";
  }

  const hostname = evidence.productionHostname.trim();
  const hostnamePattern = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;
  if (
    hostname !== evidence.productionHostname ||
    !hostnamePattern.test(hostname) ||
    hostname.toLowerCase().endsWith(".vercel.app")
  ) {
    return "not_available: a valid production hostname is required.";
  }

  const exclusions = new Set(evidence.excludedTraffic);
  const missingExclusions = REQUIRED_EXCLUSIONS.filter(
    (trafficClass) => !exclusions.has(trafficClass),
  );
  if (missingExclusions.length > 0) {
    return `not_available: exclusion evidence is missing for ${missingExclusions.join(", ")}.`;
  }

  if (!evidence.evidenceReference.trim()) {
    return "not_available: an external traffic-exclusion evidence reference is required.";
  }

  return null;
}

export function buildQualifiedGa4Request(
  dateKey: string,
  evidence: Ga4QualificationEvidence,
) {
  return {
    dateRanges: [{ startDate: dateKey, endDate: dateKey }],
    dimensions: [{ name: "hostName" }],
    dimensionFilter: {
      filter: {
        fieldName: "hostName",
        stringFilter: {
          matchType: "EXACT",
          value: evidence.productionHostname,
          caseSensitive: false,
        },
      },
    },
    metrics: [
      { name: "activeUsers" },
      { name: "sessions" },
      { name: "ecommercePurchases" },
    ],
  };
}

export function parseQualifiedGa4Metrics(
  values: readonly unknown[],
): QualifiedGa4Metrics | null {
  const activeUsers = parseMetric(values[0]);
  const sessions = parseMetric(values[1]);
  const purchases = parseMetric(values[2]);

  if (activeUsers === null || sessions === null || purchases === null) {
    return null;
  }

  return { activeUsers, sessions, purchases };
}

export async function getGa4Snapshot(
  config: OperationsGa4Config,
  dateKey: string,
  evidence?: Ga4QualificationEvidence,
): Promise<Ga4ReportSection> {
  if (!config.configured) {
    return { configured: false, reason: config.reason };
  }

  // The caller-supplied reference gates report eligibility; it does not prove
  // that the GA4 property's internal/test/debug/preview filters actually ran.
  const evidenceError = validateGa4QualificationEvidence(evidence);
  if (!evidence || evidenceError) {
    return {
      configured: false,
      reason:
        evidenceError ??
        "not_available: production hostname and traffic-exclusion evidence are required.",
    };
  }

  try {
    const credentials = JSON.parse(config.serviceAccountJson) as Record<string, string>;
    const auth = new GoogleAuth({ credentials, scopes: [GA4_READ_SCOPE] });
    const client = await auth.getClient();
    const response = await client.request<{
      rows?: Array<{
        dimensionValues?: Array<{ value?: string }>;
        metricValues?: Array<{ value?: string }>;
      }>;
    }>({
      url: `https://analyticsdata.googleapis.com/v1beta/${config.propertyId}:runReport`,
      method: "POST",
      data: buildQualifiedGa4Request(dateKey, evidence),
    });
    const row = response.data.rows?.[0];

    if (row?.dimensionValues?.[0]?.value !== evidence.productionHostname) {
      return {
        configured: false,
        reason: "not_available: GA4 did not return the evidenced production hostname.",
      };
    }

    const metrics = parseQualifiedGa4Metrics(
      row.metricValues?.map(({ value }) => value) ?? [],
    );
    if (!metrics) {
      return {
        configured: false,
        reason: "not_available: GA4 returned missing or invalid qualified metrics.",
      };
    }

    return { configured: true, ...metrics };
  } catch {
    return {
      configured: false,
      reason: "not_available: GA4 metrics could not be read.",
    };
  }
}
