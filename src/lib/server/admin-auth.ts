import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export type AdminDecision = "authenticated" | "unauthenticated" | "forbidden";

export interface AdminSessionLike {
  user?: {
    id?: string | null;
    role?: string | null;
  } | null;
}

export function getAdminDecision(
  session: AdminSessionLike | null | undefined,
): AdminDecision {
  if (!session?.user?.id) return "unauthenticated";
  return session.user.role === "ADMIN" ? "authenticated" : "forbidden";
}

export function isSameOriginRequest(
  requestUrl: string,
  originHeader: string | null,
): boolean {
  if (!originHeader) return false;
  try {
    return new URL(requestUrl).origin === new URL(originHeader).origin;
  } catch {
    return false;
  }
}

export async function requireAdminPage() {
  const session = await auth();
  const decision = getAdminDecision(session);
  if (decision === "unauthenticated") {
    redirect("/auth/signin?callbackUrl=/admin");
  }
  if (decision === "forbidden") {
    redirect("/");
  }
  return session;
}

export async function requireAdminApi(
  session?: AdminSessionLike | null,
): Promise<NextResponse | null> {
  const decision = getAdminDecision(session === undefined ? await auth() : session);
  if (decision === "unauthenticated") {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (decision === "forbidden") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  return null;
}

export async function requireAdminMutation(
  request: Request,
  session?: AdminSessionLike | null,
): Promise<NextResponse | null> {
  const unauthorized = await requireAdminApi(session);
  if (unauthorized) return unauthorized;
  if (!isSameOriginRequest(request.url, request.headers.get("origin"))) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }
  return null;
}
