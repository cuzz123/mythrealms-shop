import { NextRequest, NextResponse } from "next/server";

import { requireCron } from "@/lib/automation-auth";
import {
  getPinterestPublishBlock,
  PINTEREST_PUBLISHING_DISABLED_STATUS,
} from "@/lib/pinterest-publisher";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const unauthorized = requireCron(request);
  if (unauthorized) return unauthorized;

  return NextResponse.json(
    getPinterestPublishBlock("direct_publish"),
    { status: PINTEREST_PUBLISHING_DISABLED_STATUS },
  );
}
