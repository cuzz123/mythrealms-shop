import { NextRequest, NextResponse } from "next/server";
import { requireCron } from "@/lib/automation-auth";
import { publishDuePinterestDrafts } from "@/lib/pinterest-drafts";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET(request: NextRequest) {
  const unauthorized = requireCron(request);
  if (unauthorized) return unauthorized;

  try {
    const result = await publishDuePinterestDrafts();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Pinterest publishing scan failed" },
      { status: 500 }
    );
  }
}
