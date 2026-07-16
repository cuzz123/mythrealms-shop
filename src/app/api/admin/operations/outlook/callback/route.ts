import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getOperationsOutlookConfig } from "@/lib/operations/config";
import { encryptSecret } from "@/lib/operations/token-crypto";
import {
  createInboxSubscription,
  exchangeGraphAuthorizationCode,
  getGraphAccountEmail,
} from "@/lib/operations/microsoft-graph";
import { requireAdminApi } from "@/lib/server/admin-auth";

const OAUTH_STATE_COOKIE = "operations_outlook_oauth_state";

function getWebhookUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const deployedUrl = process.env.VERCEL_URL?.trim();
  const appUrl = configuredUrl || (deployedUrl ? `https://${deployedUrl}` : undefined);

  if (!appUrl) {
    throw new Error("A public HTTPS app URL is required before connecting Outlook.");
  }

  const webhookUrl = new URL("/api/webhooks/outlook", appUrl);
  if (webhookUrl.protocol !== "https:") {
    throw new Error("A public HTTPS app URL is required before connecting Outlook.");
  }

  return webhookUrl.toString();
}

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const cookieStore = await cookies();
  const expectedState = cookieStore.get(OAUTH_STATE_COOKIE)?.value;
  const state = request.nextUrl.searchParams.get("state");
  const code = request.nextUrl.searchParams.get("code");
  const providerError = request.nextUrl.searchParams.get("error");
  const redirectUrl = new URL("/admin/operations", request.url);
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.delete(OAUTH_STATE_COOKIE);

  if (providerError || !code || !state || state !== expectedState) {
    redirectUrl.searchParams.set("outlook", "authorization-failed");
    return NextResponse.redirect(redirectUrl, { headers: response.headers });
  }

  const outlook = getOperationsOutlookConfig();
  if (!outlook.enabled) {
    redirectUrl.searchParams.set("outlook", "not-configured");
    return NextResponse.redirect(redirectUrl, { headers: response.headers });
  }

  try {
    const token = await exchangeGraphAuthorizationCode(code, outlook);
    const email = await getGraphAccountEmail(token.accessToken);
    const accessTokenExpiresAt = new Date(Date.now() + token.expiresInSeconds * 1000);
    const encryptedRefreshToken = encryptSecret(token.refreshToken, outlook.encryptionKey);
    const connection = await db.mailboxConnection.upsert({
      where: { email },
      create: {
        email,
        refreshTokenEncrypted: encryptedRefreshToken,
        accessTokenExpiresAt,
        status: "CONNECTED",
      },
      update: {
        refreshTokenEncrypted: encryptedRefreshToken,
        accessTokenExpiresAt,
        status: "CONNECTED",
      },
    });

    try {
      const subscription = await createInboxSubscription({
        accessToken: token.accessToken,
        notificationUrl: getWebhookUrl(),
        clientState: outlook.webhookClientState,
      });
      await db.mailboxConnection.update({
        where: { id: connection.id },
        data: {
          subscriptionId: subscription.id,
          subscriptionExpiresAt: subscription.expiresAt,
          status: "CONNECTED",
        },
      });
    } catch (error) {
      await db.mailboxConnection.update({
        where: { id: connection.id },
        data: { status: "ERROR" },
      });
      throw error;
    }

    redirectUrl.searchParams.set("outlook", "connected");
  } catch {
    redirectUrl.searchParams.set("outlook", "connection-failed");
  }

  return NextResponse.redirect(redirectUrl, { headers: response.headers });
}
