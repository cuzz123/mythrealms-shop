import type { DatabaseCheck } from "@/lib/launch/database-preflight";
import { readResendConfig } from "@/lib/server/resend-config";

export type CheckStatus = "pass" | "fail" | "skipped";

export interface ReadinessCheck {
  id:
    | "environment"
    | "app-url"
    | "database"
    | "paypal-webhook"
    | "resend-sender";
  status: CheckStatus;
  message: string;
  remediation?: string;
}

export interface ReadinessReport {
  ok: boolean;
  checks: ReadinessCheck[];
}

export interface ReadinessDependencies {
  inspectDatabase(): Promise<DatabaseCheck>;
  fetch: typeof fetch;
}

const REQUIRED = [
  "DATABASE_URL",
  "NEXT_PUBLIC_APP_URL",
  "AUTH_URL",
  "PAYPAL_API_BASE",
  "NEXT_PUBLIC_PAYPAL_CLIENT_ID",
  "PAYPAL_CLIENT_SECRET",
  "PAYPAL_WEBHOOK_ID",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
] as const;

function configured(value: string | undefined): value is string {
  const trimmed = value?.trim();
  return Boolean(
    trimmed &&
      !/your-|placeholder|postgresql:\/\/user:password|\.example\b/i.test(
        trimmed,
      ),
  );
}

function safeOrigin(
  value: string | undefined,
  allowKnownTemporaryOrigin = false,
): URL | null {
  try {
    if (!configured(value)) return null;
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash ||
      ["localhost", "127.0.0.1", "::1", "[::1]"].includes(url.hostname)
    ) {
      return null;
    }
    if (
      url.hostname.endsWith(".vercel.app") &&
      !(
        allowKnownTemporaryOrigin &&
        url.hostname === "mythrealms-shop.vercel.app"
      )
    ) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

function addCheck(
  checks: ReadinessCheck[],
  id: ReadinessCheck["id"],
  ok: boolean,
  message: string,
  remediation: string,
): void {
  checks.push({
    id,
    status: ok ? "pass" : "fail",
    message,
    ...(!ok ? { remediation } : {}),
  });
}

export async function runLaunchReadiness(
  env: NodeJS.ProcessEnv,
  dependencies: ReadinessDependencies,
): Promise<ReadinessReport> {
  const checks: ReadinessCheck[] = [];
  const missing = REQUIRED.filter((key) => !configured(env[key]));
  addCheck(
    checks,
    "environment",
    missing.length === 0,
    missing.length === 0
      ? "Required launch environment is present."
      : "Required launch environment is incomplete.",
    "Set every required launch variable to a non-placeholder value.",
  );

  const allowKnownTemporaryOrigin =
    env.LAUNCH_ALLOW_VERCEL_APP_URL === "true";
  const appUrl = safeOrigin(
    env.NEXT_PUBLIC_APP_URL,
    allowKnownTemporaryOrigin,
  );
  const authUrl = safeOrigin(env.AUTH_URL, allowKnownTemporaryOrigin);
  const appUrlsMatch =
    Boolean(appUrl && authUrl) && appUrl?.origin === authUrl?.origin;
  addCheck(
    checks,
    "app-url",
    appUrlsMatch,
    appUrlsMatch
      ? "Public and authentication origins match."
      : "Public and authentication origins are unsafe or inconsistent.",
    "Use the same approved HTTPS origin for the public app and authentication.",
  );

  try {
    const database = await dependencies.inspectDatabase();
    addCheck(
      checks,
      "database",
      database.ok,
      database.ok
        ? "Payment schema is ready."
        : "Payment schema is missing required additive columns.",
      "Apply the reviewed additive SQL, then rerun this check.",
    );
  } catch {
    addCheck(
      checks,
      "database",
      false,
      "Payment schema could not be inspected.",
      "Verify database connectivity without printing the connection string.",
    );
  }

  let resendReady = true;
  try {
    readResendConfig({
      RESEND_API_KEY: env.RESEND_API_KEY,
      RESEND_FROM_EMAIL: env.RESEND_FROM_EMAIL,
    });
  } catch {
    resendReady = false;
  }
  addCheck(
    checks,
    "resend-sender",
    resendReady,
    resendReady
      ? "Order-confirmation sender is configured."
      : "Order-confirmation sender is missing or unsafe.",
    "Configure a sender verified by the email provider.",
  );

  const paypalBase = safeOrigin(env.PAYPAL_API_BASE);
  const paypalStaticReady =
    appUrlsMatch &&
    paypalBase?.origin === "https://api-m.paypal.com" &&
    [
      env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      env.PAYPAL_CLIENT_SECRET,
      env.PAYPAL_WEBHOOK_ID,
    ].every(configured);

  if (!paypalStaticReady || !appUrl) {
    addCheck(
      checks,
      "paypal-webhook",
      false,
      "PayPal live configuration is incomplete or unsafe.",
      "Use live API credentials and matching approved public callback origins.",
    );
  } else {
    try {
      const tokenResponse = await dependencies.fetch(
        "https://api-m.paypal.com/v1/oauth2/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              Buffer.from(
                `${env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`,
              ).toString("base64"),
          },
          body: "grant_type=client_credentials",
        },
      );
      const tokenPayload = tokenResponse.ok
        ? ((await tokenResponse.json()) as Record<string, unknown>)
        : {};
      const token =
        typeof tokenPayload.access_token === "string" &&
        tokenPayload.access_token.length > 0
          ? tokenPayload.access_token
          : null;
      if (!token) throw new Error("provider-auth");

      const webhookResponse = await dependencies.fetch(
        `https://api-m.paypal.com/v1/notifications/webhooks/${encodeURIComponent(
          env.PAYPAL_WEBHOOK_ID!,
        )}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!webhookResponse.ok) throw new Error("provider-webhook");
      const webhook = (await webhookResponse.json()) as Record<string, unknown>;
      const events = Array.isArray(webhook.event_types)
        ? webhook.event_types
            .map((event) =>
              typeof event === "object" &&
              event !== null &&
              typeof (event as Record<string, unknown>).name === "string"
                ? String((event as Record<string, unknown>).name)
                : "",
            )
            .filter(Boolean)
        : [];
      const expectedUrl = new URL("/api/webhooks/paypal", appUrl).href;
      const webhookReady =
        webhook.id === env.PAYPAL_WEBHOOK_ID &&
        webhook.url === expectedUrl &&
        events.includes("PAYMENT.CAPTURE.COMPLETED") &&
        events.includes("PAYMENT.CAPTURE.REFUNDED");
      addCheck(
        checks,
        "paypal-webhook",
        webhookReady,
        webhookReady
          ? "PayPal webhook ID, URL, and required events match."
          : "PayPal webhook ID, URL, or required events do not match.",
        "Correct the live webhook only after receiving explicit authorization.",
      );
    } catch {
      addCheck(
        checks,
        "paypal-webhook",
        false,
        "PayPal webhook could not be verified.",
        "Verify live credentials and webhook ownership without printing provider responses.",
      );
    }
  }

  return {
    ok: checks.every((item) => item.status === "pass"),
    checks,
  };
}

export function formatReadinessReport(report: ReadinessReport): string {
  return report.checks
    .map(
      (item) =>
        `[${item.status.toUpperCase()}] ${item.id}: ${item.message}` +
        (item.remediation ? ` ${item.remediation}` : ""),
    )
    .join("\n");
}

export function readinessExitCode(report: ReadinessReport): 0 | 1 {
  return report.ok ? 0 : 1;
}
