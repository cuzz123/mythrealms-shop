import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/server/admin-auth";
import { generateSeoArticle, getSeoQueueStatus } from "@/lib/seo-content-engine";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const queue = await getSeoQueueStatus();
    return NextResponse.json({ queue });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load SEO queue" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const body = await readJson(req);
    const keyword = typeof body.keyword === "string" ? body.keyword.trim() : undefined;
    const result = await generateSeoArticle(keyword || undefined);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate SEO article" },
      { status: 500 }
    );
  }
}

async function readJson(req: NextRequest): Promise<Record<string, unknown>> {
  try {
    const value = await req.json();
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}
