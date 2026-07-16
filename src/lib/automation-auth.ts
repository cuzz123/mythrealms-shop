import { NextRequest, NextResponse } from "next/server";

export function requireCron(request: NextRequest) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return process.env.NODE_ENV === "production"
      ? NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 })
      : null;
  }

  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
