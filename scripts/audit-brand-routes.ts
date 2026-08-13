import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export type BrandRouteEvidence = {
  path: string;
  clicks: number | "not_available";
  backlinks: number | "not_available";
  replacement: string;
  brandConflict: boolean;
};

export type BrandRouteDecision = {
  path: string;
  action: "keep" | "rewrite" | "redirect";
  destination: string;
  evidence: string;
};

export function auditBrandRoutes(input: readonly BrandRouteEvidence[]): BrandRouteDecision[] {
  return input.map((route) => {
    if (route.clicks === "not_available" || route.backlinks === "not_available") {
      return keep(route.path, "evidence-not-available-review-after-30-days");
    }

    if (route.clicks > 0 || route.backlinks > 0) {
      return route.brandConflict
        ? rewrite(route.path)
        : keep(route.path, "search-or-backlink-evidence-no-brand-conflict");
    }

    if (route.clicks === 0 && route.backlinks === 0 && isSpecificInternalPath(route.replacement)) {
      return {
        path: route.path,
        action: "redirect",
        destination: route.replacement,
        evidence: "zero-clicks-zero-backlinks-specific-replacement",
      };
    }

    return keep(route.path, "zero-clicks-zero-backlinks-no-specific-replacement");
  });
}

function keep(path: string, evidence: string): BrandRouteDecision {
  return { path, action: "keep", destination: path, evidence };
}

function rewrite(path: string): BrandRouteDecision {
  return {
    path,
    action: "rewrite",
    destination: path,
    evidence: "search-or-backlink-evidence-rewrite-in-place",
  };
}

function isSpecificInternalPath(path: string): boolean {
  return path.startsWith("/") && path !== "/" && !path.startsWith("//");
}

function parseMetric(value: string): number | "not_available" {
  if (value === "not_available") return value;
  const metric = Number(value);
  if (!Number.isFinite(metric) || metric < 0) {
    throw new Error(`Invalid audit metric: ${value}`);
  }
  return metric;
}

function readAuditEvidence(csvPath: string): BrandRouteEvidence[] {
  const [header, ...rows] = readFileSync(csvPath, "utf8").trim().split(/\r?\n/);
  const columns = header.split(",");
  const index = (name: string) => {
    const position = columns.indexOf(name);
    if (position < 0) throw new Error(`Missing CSV column: ${name}`);
    return position;
  };
  const pathIndex = index("path");
  const clicksIndex = index("gsc_clicks");
  const backlinksIndex = index("external_backlinks");
  const conflictIndex = index("brand_conflict");
  const destinationIndex = index("destination");

  return rows.filter(Boolean).map((row) => {
    const fields = row.split(",");
    return {
      path: fields[pathIndex],
      clicks: parseMetric(fields[clicksIndex]),
      backlinks: parseMetric(fields[backlinksIndex]),
      replacement: fields[destinationIndex],
      brandConflict: fields[conflictIndex] === "true",
    };
  });
}

function runAudit(): void {
  const evidence = readAuditEvidence(resolve(process.cwd(), "docs/company/maverenne-url-migration.csv"));
  const decisions = auditBrandRoutes(evidence);

  for (const decision of decisions) {
    if (decision.action === "redirect" && !isSpecificInternalPath(decision.destination)) {
      throw new Error(`Unsafe redirect destination for ${decision.path}: ${decision.destination}`);
    }
    console.log(`${decision.path}: ${decision.action} -> ${decision.destination} (${decision.evidence})`);
  }
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("scripts/audit-brand-routes.ts")) {
  runAudit();
}
