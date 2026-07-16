import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  formatReadinessReport,
  readinessExitCode,
  runLaunchReadiness,
  type ReadinessDependencies,
  type ReadinessReport,
} from "../src/lib/launch/readiness";

const env = {
  NODE_ENV: "test",
  DATABASE_URL: "postgresql://sentinel-db",
  NEXT_PUBLIC_APP_URL: "https://mythrealms-shop.vercel.app",
  AUTH_URL: "https://mythrealms-shop.vercel.app",
  LAUNCH_ALLOW_VERCEL_APP_URL: "true",
  PAYPAL_API_BASE: "https://api-m.paypal.com",
  NEXT_PUBLIC_PAYPAL_CLIENT_ID: "sentinel-client",
  PAYPAL_CLIENT_SECRET: "sentinel-secret",
  PAYPAL_WEBHOOK_ID: "sentinel-webhook",
  RESEND_API_KEY: "sentinel-resend",
  RESEND_FROM_EMAIL: "MythRealms <orders@mythrealms.shop>",
} satisfies NodeJS.ProcessEnv;

function dependencies(
  webhook: Record<string, unknown> = {
    id: "sentinel-webhook",
    url: "https://mythrealms-shop.vercel.app/api/webhooks/paypal",
    event_types: [
      { name: "PAYMENT.CAPTURE.COMPLETED" },
      { name: "PAYMENT.CAPTURE.REFUNDED" },
    ],
  },
  options: {
    inspectDatabase?: ReadinessDependencies["inspectDatabase"];
    tokenResponse?: Response;
    webhookResponse?: Response;
    throwOnCall?: 1 | 2;
    errorMessage?: string;
  } = {},
) {
  const calls: Array<{ url: string; method: string }> = [];
  const value: ReadinessDependencies = {
    inspectDatabase:
      options.inspectDatabase ?? (async () => ({ ok: true, missing: [] })),
    fetch: async (input, init) => {
      const url = String(input);
      const method = init?.method ?? "GET";
      calls.push({ url, method });
      if (options.throwOnCall === calls.length) {
        throw new Error(options.errorMessage ?? "sentinel-provider-error");
      }
      if (url.endsWith("/v1/oauth2/token")) {
        return (
          options.tokenResponse ??
          new Response(JSON.stringify({ access_token: "sentinel-token" }))
        );
      }
      return options.webhookResponse ?? new Response(JSON.stringify(webhook));
    },
  };
  return { value, calls };
}

test("passes only with live matching configuration and required events", async () => {
  const deps = dependencies();
  const report = await runLaunchReadiness(env, deps.value);
  assert.equal(report.ok, true);
  assert.equal(readinessExitCode(report), 0);
  assert.deepEqual(deps.calls.map((call) => call.method), ["POST", "GET"]);
  assert.match(
    deps.calls[1].url,
    /\/v1\/notifications\/webhooks\/sentinel-webhook$/,
  );
});

test("every required environment variable fails closed when missing", async (t) => {
  for (const key of [
    "DATABASE_URL",
    "NEXT_PUBLIC_APP_URL",
    "AUTH_URL",
    "PAYPAL_API_BASE",
    "NEXT_PUBLIC_PAYPAL_CLIENT_ID",
    "PAYPAL_CLIENT_SECRET",
    "PAYPAL_WEBHOOK_ID",
    "RESEND_API_KEY",
    "RESEND_FROM_EMAIL",
  ]) {
    await t.test(key, async () => {
      const next = { ...env, [key]: "" };
      const report = await runLaunchReadiness(next, dependencies().value);
      assert.equal(report.ok, false);
      assert.equal(readinessExitCode(report), 1);
    });
  }
});

test("every required environment variable rejects placeholders", async (t) => {
  for (const [key, value] of Object.entries({
    DATABASE_URL: "postgresql://user:password@database.example/db",
    NEXT_PUBLIC_APP_URL: "https://placeholder.invalid",
    AUTH_URL: "https://your-auth-host.invalid",
    PAYPAL_API_BASE: "placeholder",
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: "your-paypal-client-id",
    PAYPAL_CLIENT_SECRET: "placeholder-secret",
    PAYPAL_WEBHOOK_ID: "your-webhook-id",
    RESEND_API_KEY: "placeholder-resend-key",
    RESEND_FROM_EMAIL: "placeholder",
  })) {
    await t.test(key, async () => {
      const report = await runLaunchReadiness(
        { ...env, [key]: value },
        dependencies().value,
      );
      assert.equal(report.ok, false);
      assert.equal(readinessExitCode(report), 1);
    });
  }
});

test("rejects unsafe origins without making provider calls", async (t) => {
  const cases: Array<[string, Partial<NodeJS.ProcessEnv>]> = [
    ["PayPal sandbox", { PAYPAL_API_BASE: "https://api-m.sandbox.paypal.com" }],
    ["PayPal HTTP", { PAYPAL_API_BASE: "http://api-m.paypal.com" }],
    [
      "PayPal credentials",
      { PAYPAL_API_BASE: "https://user:password@api-m.paypal.com" },
    ],
    ["PayPal path", { PAYPAL_API_BASE: "https://api-m.paypal.com/v1" }],
    ["PayPal query", { PAYPAL_API_BASE: "https://api-m.paypal.com?live=1" }],
    ["PayPal hash", { PAYPAL_API_BASE: "https://api-m.paypal.com#live" }],
    ["public HTTP", { NEXT_PUBLIC_APP_URL: "http://mythrealms.shop" }],
    ["localhost", { NEXT_PUBLIC_APP_URL: "https://localhost" }],
    ["loopback IPv4", { NEXT_PUBLIC_APP_URL: "https://127.0.0.1" }],
    ["loopback IPv6", { NEXT_PUBLIC_APP_URL: "https://[::1]" }],
    ["public path", { NEXT_PUBLIC_APP_URL: "https://mythrealms.shop/store" }],
    ["public query", { NEXT_PUBLIC_APP_URL: "https://mythrealms.shop?preview=1" }],
    ["known Vercel host without approval", { LAUNCH_ALLOW_VERCEL_APP_URL: "false" }],
    [
      "other Vercel host even with approval",
      {
        NEXT_PUBLIC_APP_URL: "https://other.vercel.app",
        AUTH_URL: "https://other.vercel.app",
      },
    ],
    ["split callback origins", { AUTH_URL: "https://different.invalid" }],
  ];

  for (const [name, override] of cases) {
    await t.test(name, async () => {
      const deps = dependencies();
      const report = await runLaunchReadiness(
        { ...env, ...override },
        deps.value,
      );
      assert.equal(report.ok, false);
      assert.deepEqual(deps.calls, []);
    });
  }
});

test("fails independently on webhook ID, URL, or event mismatch", async (t) => {
  for (const [name, webhook] of [
    ["ID", {
      id: "other",
      url: "https://mythrealms-shop.vercel.app/api/webhooks/paypal",
      event_types: [
        { name: "PAYMENT.CAPTURE.COMPLETED" },
        { name: "PAYMENT.CAPTURE.REFUNDED" },
      ],
    }],
    ["URL", {
      id: "sentinel-webhook",
      url: "https://wrong.example.com/api/webhooks/paypal",
      event_types: [
        { name: "PAYMENT.CAPTURE.COMPLETED" },
        { name: "PAYMENT.CAPTURE.REFUNDED" },
      ],
    }],
    ["refunded event", {
      id: "sentinel-webhook",
      url: "https://mythrealms-shop.vercel.app/api/webhooks/paypal",
      event_types: [{ name: "PAYMENT.CAPTURE.COMPLETED" }],
    }],
    ["completed event", {
      id: "sentinel-webhook",
      url: "https://mythrealms-shop.vercel.app/api/webhooks/paypal",
      event_types: [{ name: "PAYMENT.CAPTURE.REFUNDED" }],
    }],
  ] as const) {
    await t.test(name, async () => {
      const report = await runLaunchReadiness(
        env,
        dependencies(webhook).value,
      );
      assert.equal(report.ok, false);
    });
  }
});

test("database and provider failures are generic and secrets never print", async () => {
  const deps = dependencies();
  deps.value.inspectDatabase = async () => {
    throw new Error("postgresql://user:password@private-host");
  };
  deps.value.fetch = async () => {
    throw new Error("sentinel-token");
  };
  const report = await runLaunchReadiness(env, deps.value);
  const output = formatReadinessReport(report);
  for (const secret of [
    "sentinel-db",
    "sentinel-client",
    "sentinel-secret",
    "sentinel-webhook",
    "sentinel-resend",
    "sentinel-token",
    "private-host",
  ]) {
    assert.doesNotMatch(output, new RegExp(secret));
  }
  assert.equal(report.ok, false);
});

test("database failure does not suppress the PayPal fake", async () => {
  const deps = dependencies(undefined, {
    inspectDatabase: async () => {
      throw new Error("postgresql://user:password@database-private.invalid");
    },
  });

  const report = await runLaunchReadiness(env, deps.value);

  assert.equal(
    report.checks.find((item) => item.id === "database")?.status,
    "fail",
  );
  assert.equal(
    report.checks.find((item) => item.id === "paypal-webhook")?.status,
    "pass",
  );
  assert.deepEqual(deps.calls.map((call) => call.method), ["POST", "GET"]);
});

test("PayPal failures stay generic and do not suppress the database fake", async (t) => {
  const cases = [
    {
      name: "OAuth 401",
      options: {
        tokenResponse: new Response("sentinel-oauth-body", { status: 401 }),
      },
    },
    {
      name: "webhook 404",
      options: {
        webhookResponse: new Response("sentinel-webhook-404-body", {
          status: 404,
        }),
      },
    },
    {
      name: "webhook 500",
      options: {
        webhookResponse: new Response("sentinel-webhook-500-body", {
          status: 500,
        }),
      },
    },
    {
      name: "OAuth network error",
      options: { throwOnCall: 1 as const, errorMessage: "sentinel-network-error" },
    },
    {
      name: "webhook network error",
      options: { throwOnCall: 2 as const, errorMessage: "sentinel-network-error" },
    },
  ];

  for (const { name, options } of cases) {
    await t.test(name, async () => {
      let databaseCalls = 0;
      const deps = dependencies(undefined, {
        ...options,
        inspectDatabase: async () => {
          databaseCalls += 1;
          return { ok: true, missing: [] };
        },
      });

      const report = await runLaunchReadiness(env, deps.value);
      const output = formatReadinessReport(report);

      assert.equal(databaseCalls, 1);
      assert.equal(
        report.checks.find((item) => item.id === "database")?.status,
        "pass",
      );
      assert.equal(
        report.checks.find((item) => item.id === "paypal-webhook")?.status,
        "fail",
      );
      assert.doesNotMatch(
        output,
        /sentinel-oauth-body|sentinel-webhook-404-body|sentinel-webhook-500-body|sentinel-network-error|401|404|500/,
      );
    });
  }
});

test("uses only the OAuth POST and the exact webhook GET", async () => {
  const deps = dependencies();

  const report = await runLaunchReadiness(env, deps.value);

  assert.equal(report.ok, true);
  assert.deepEqual(deps.calls, [
    {
      url: "https://api-m.paypal.com/v1/oauth2/token",
      method: "POST",
    },
    {
      url: "https://api-m.paypal.com/v1/notifications/webhooks/sentinel-webhook",
      method: "GET",
    },
  ]);
  assert.equal(
    deps.calls.some((call) =>
      ["PATCH", "DELETE", "PUT"].includes(call.method.toUpperCase()),
    ),
    false,
  );
});

test("static PayPal rejection still inspects the database", async () => {
  let databaseCalls = 0;
  const deps = dependencies(undefined, {
    inspectDatabase: async () => {
      databaseCalls += 1;
      return { ok: true, missing: [] };
    },
  });

  const report = await runLaunchReadiness(
    { ...env, PAYPAL_API_BASE: "https://api-m.paypal.com/v1" },
    deps.value,
  );

  assert.equal(report.ok, false);
  assert.equal(databaseCalls, 1);
  assert.deepEqual(deps.calls, []);
});

test("Resend uses the shared parser without claiming remote verification", async () => {
  const passing = await runLaunchReadiness(env, dependencies().value);
  const failing = await runLaunchReadiness(
    { ...env, RESEND_FROM_EMAIL: "onboarding@resend.dev" },
    dependencies().value,
  );
  const passingCheck = passing.checks.find(
    (item) => item.id === "resend-sender",
  );

  assert.equal(passingCheck?.status, "pass");
  assert.doesNotMatch(passingCheck?.message ?? "", /verified/i);
  assert.equal(
    failing.checks.find((item) => item.id === "resend-sender")?.status,
    "fail",
  );
});

test("formats only status, check name, generic message, and remediation", () => {
  const report: ReadinessReport = {
    ok: false,
    checks: [
      { id: "environment", status: "pass", message: "Safe pass." },
      {
        id: "database",
        status: "fail",
        message: "Safe failure.",
        remediation: "Take a safe action.",
      },
      { id: "paypal-webhook", status: "skipped", message: "Safe skip." },
    ],
  };

  assert.equal(
    formatReadinessReport(report),
    [
      "[PASS] environment: Safe pass.",
      "[FAIL] database: Safe failure. Take a safe action.",
      "[SKIPPED] paypal-webhook: Safe skip.",
    ].join("\n"),
  );
  assert.equal(readinessExitCode(report), 1);
  assert.equal(readinessExitCode({ ok: true, checks: [] }), 0);
});

test("the report never contains environment, provider, database, or response secrets", async () => {
  const deps = dependencies(undefined, {
    inspectDatabase: async () => {
      throw new Error("sentinel-caught-database-error");
    },
    webhookResponse: new Response("sentinel-private-response-body", {
      status: 500,
    }),
  });
  const report = await runLaunchReadiness(env, deps.value);
  const visible = `${JSON.stringify(report)}\n${formatReadinessReport(report)}`;

  for (const secret of [
    ...Object.values(env),
    "sentinel-token",
    "sentinel-caught-database-error",
    "sentinel-private-response-body",
  ]) {
    assert.doesNotMatch(visible, new RegExp(secret.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("CLI is raw-read-only, uses global fetch, disconnects, and sets exitCode", () => {
  const source = readFileSync(
    path.join(process.cwd(), "scripts/launch-check.ts"),
    "utf8",
  );

  assert.match(source, /inspectPaymentSchema\(/);
  assert.match(source, /db\.\$queryRaw\.bind\(db\)/);
  assert.match(source, /\bfetch,?\s*\n?\s*}/);
  assert.match(source, /\.finally\(async \(\) =>/);
  assert.match(source, /await db\.\$disconnect\(\)/);
  assert.match(source, /process\.exitCode\s*=/);
  assert.doesNotMatch(source, /process\.exit\s*\(/);
  assert.doesNotMatch(source, /\.message\b|PATCH|DELETE|\/v1\/notifications\/webhooks\s*["'`]/);
});

test("launch command is manual-only and absent from Vercel build configuration", () => {
  const packageJson = JSON.parse(
    readFileSync(path.join(process.cwd(), "package.json"), "utf8"),
  ) as { scripts?: Record<string, string> };
  const vercel = readFileSync(path.join(process.cwd(), "vercel.json"), "utf8");

  assert.equal(
    packageJson.scripts?.["launch:check"],
    "node --env-file-if-exists=.env --import tsx scripts/launch-check.ts",
  );
  assert.doesNotMatch(vercel, /launch:check|launch-check/);
});

test("environment example has one live PayPal block and explicit temporary-host approval", () => {
  const example = readFileSync(
    path.join(process.cwd(), ".env.example"),
    "utf8",
  );

  for (const key of [
    "DATABASE_URL",
    "NEXT_PUBLIC_APP_URL",
    "AUTH_URL",
    "PAYPAL_API_BASE",
    "NEXT_PUBLIC_PAYPAL_CLIENT_ID",
    "PAYPAL_CLIENT_SECRET",
    "PAYPAL_WEBHOOK_ID",
    "RESEND_API_KEY",
    "RESEND_FROM_EMAIL",
  ]) {
    assert.match(example, new RegExp(`^${key}=`, "m"));
  }
  assert.match(example, /^PAYPAL_API_BASE=https:\/\/api-m\.paypal\.com$/m);
  assert.match(example, /^LAUNCH_ALLOW_VERCEL_APP_URL="false"$/m);
  assert.equal(
    (example.match(/^NEXT_PUBLIC_PAYPAL_CLIENT_ID=/gm) ?? []).length,
    1,
  );
});
