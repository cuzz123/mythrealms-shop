import { NextRequest, NextResponse } from "next/server";

import { requireAdminApi, requireAdminMutation } from "@/lib/server/admin-auth";
import { createOAuthState, isValidOAuthState } from "@/lib/server/oauth-state";
import { absoluteUrl } from "@/lib/site";

const STATE_COOKIE = "pinterest_oauth_state";
const TOKEN_COOKIE = "pinterest_access_token";
const PINTEREST_AUTHORIZE_URL = "https://www.pinterest.com/oauth/";

function secureCookie() {
  return process.env.NODE_ENV === "production";
}

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const clientId = process.env.PINTEREST_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "Pinterest OAuth is not configured" },
      { status: 503 },
    );
  }

  const state = createOAuthState();
  const authorizationUrl = new URL(PINTEREST_AUTHORIZE_URL);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("client_id", clientId);
  authorizationUrl.searchParams.set("redirect_uri", absoluteUrl("/pinterest/callback"));
  authorizationUrl.searchParams.set("scope", "boards:read,pins:read,pins:write");
  authorizationUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: secureCookie(),
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });
  return response;
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminMutation(request);
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as { code?: unknown; state?: unknown };
    const code = typeof body.code === "string" ? body.code : "";
    const state = typeof body.state === "string" ? body.state : "";
    const expectedState = request.cookies.get(STATE_COOKIE)?.value;
    if (!code || !isValidOAuthState(state, expectedState)) {
      return NextResponse.json({ error: "Invalid OAuth callback state" }, { status: 400 });
    }

    const clientId = process.env.PINTEREST_CLIENT_ID;
    const clientSecret = process.env.PINTEREST_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Pinterest OAuth is not configured" },
        { status: 503 },
      );
    }

    const authorization = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const providerResponse = await fetch("https://api.pinterest.com/v5/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${authorization}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: absoluteUrl("/pinterest/callback"),
      }).toString(),
    });
    const payload = (await providerResponse.json().catch(() => ({}))) as {
      access_token?: unknown;
      expires_in?: unknown;
    };
    if (!providerResponse.ok || typeof payload.access_token !== "string") {
      return NextResponse.json(
        { error: "Pinterest token exchange failed" },
        { status: 502 },
      );
    }

    const expiresIn =
      typeof payload.expires_in === "number" && Number.isSafeInteger(payload.expires_in)
        ? Math.min(payload.expires_in, 30 * 24 * 60 * 60)
        : 24 * 60 * 60;
    const response = NextResponse.json({ connected: true, expiresIn });
    response.cookies.set(STATE_COOKIE, "", {
      httpOnly: true,
      secure: secureCookie(),
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    response.cookies.set(TOKEN_COOKIE, payload.access_token, {
      httpOnly: true,
      secure: secureCookie(),
      sameSite: "strict",
      path: "/",
    });
    return response;
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid OAuth request" }, { status: 400 });
    }
    console.error("Pinterest token exchange failed:", error);
    return NextResponse.json({ error: "Pinterest token exchange failed" }, { status: 502 });
  }
}
