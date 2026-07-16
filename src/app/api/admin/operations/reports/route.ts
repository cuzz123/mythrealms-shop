import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { requireAdminApi } from "@/lib/server/admin-auth";

function parseJson(value: string | null): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const reports = await db.operationsReport.findMany({
    orderBy: { reportDate: "desc" },
    take: 30,
  });
  return NextResponse.json(reports.map((report) => ({
    ...report,
    sections: parseJson(report.sectionsJson),
    delivery: parseJson(report.deliveryResult),
  })));
}
