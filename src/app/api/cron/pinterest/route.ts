import { NextRequest, NextResponse } from "next/server";
import { requireCron } from "@/lib/automation-auth";
import {
  getPinterestPublishBlock,
  PINTEREST_PUBLISHING_DISABLED_STATUS,
} from "@/lib/pinterest-publisher";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET(request: NextRequest) {
  const unauthorized = requireCron(request);
  if (unauthorized) return unauthorized;

  return NextResponse.json(
    getPinterestPublishBlock("pinterest_cron"),
    { status: PINTEREST_PUBLISHING_DISABLED_STATUS },
  );
}
