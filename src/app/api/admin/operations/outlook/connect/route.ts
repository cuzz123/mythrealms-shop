import { randomBytes } from "node:crypto";

import { NextResponse } from "next/server";

import { getOperationsOutlookConfig } from "@/lib/operations/config";
import { createGraphAuthorizationUrl } from "@/lib/operations/microsoft-graph";
import { requireAdminApi } from "@/lib/server/admin-auth";

const OAUTH_STATE_COOKIE = "operations_outlook_oauth_state";
const OAUTH_STATE_TTL_SECONDS = 10 * 60;

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const outlook = getOperationsOutlookConfig();
  if (!outlook.enabled) {
    return NextResponse.json(
      { error: "Outlook automation is not configured." },
      { status: 503 },
    );
  }

  const state = randomBytes(32).toString("base64url");
  const response = NextResponse.redirect(createGraphAuthorizationUrl(outlook, state));
  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    maxAge: OAUTH_STATE_TTL_SECONDS,
    path: "/api/admin/operations/outlook",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
