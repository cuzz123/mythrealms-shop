import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateSeoArticle, getSeoQueueStatus } from "@/lib/seo-content-engine";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

type AdminUser = {
  role?: string | null;
};

export async function GET() {
  const unauthorized = await requireAdmin();
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
  const unauthorized = await requireAdmin();
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

async function requireAdmin() {
  const session = await auth();
  const user = session?.user as AdminUser | undefined;
  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
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
