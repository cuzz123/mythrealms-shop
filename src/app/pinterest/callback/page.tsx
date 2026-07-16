import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { requireAdminPage } from "@/lib/server/admin-auth";
import { isValidOAuthState } from "@/lib/server/oauth-state";

import { PinterestOAuthCallback } from "./PinterestOAuthCallback";

export default async function OAuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; state?: string }>;
}) {
  await requireAdminPage();
  const { code, state } = await searchParams;
  const expectedState = (await cookies()).get("pinterest_oauth_state")?.value;
  if (!code || !state || !isValidOAuthState(state, expectedState)) notFound();

  return <PinterestOAuthCallback code={code} state={state} />;
}
