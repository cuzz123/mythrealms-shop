import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { NextRequest } from "next/server";

import { PATCH as mutatePinterestDraft } from "../src/app/api/admin/pinterest-drafts/[id]/route";
import { GET as runDailyPinterest } from "../src/app/api/automation/daily-pinterest/route";
import { GET as runLowStockAlert } from "../src/app/api/automation/low-stock-alert/route";
import { GET as runDailyReport } from "../src/app/api/automation/send-daily-report/route";
import { GET as runPinterestCron } from "../src/app/api/cron/pinterest/route";
import { GET as runDirectPinterestPublish } from "../src/app/api/pinterest/publish/route";
import { db } from "../src/lib/db";

const PINTEREST_CREDENTIAL_ENV = {
  CRON_SECRET: "route-gate-test-secret",
  PINTEREST_API_TOKEN: "test-api-token",
  PINTEREST_BOARD_ID: "test-board-id",
  PINTEREST_CLIENT_ID: "test-client-id",
  PINTEREST_CLIENT_SECRET: "test-client-secret",
} as const;

function cronRequest(pathname: string) {
  return new NextRequest(`https://www.maverenne.com${pathname}`, {
    headers: { authorization: `Bearer ${PINTEREST_CREDENTIAL_ENV.CRON_SECRET}` },
  });
}

async function assertPinterestNoGo(response: Response, entrypoint: string) {
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    error: "Pinterest external publishing is disabled for this internal-only local candidate.",
    status: "internal_only_publish_blocked",
    entrypoint,
    attempted: 0,
    published: 0,
  });
}

test("real Pinterest route handlers return 503 NO-GO with credentials present and no fetch", async () => {
  const originalEnv = new Map<string, string | undefined>();
  for (const [key, value] of Object.entries(PINTEREST_CREDENTIAL_ENV)) {
    originalEnv.set(key, process.env[key]);
    process.env[key] = value;
  }
  originalEnv.set("PINTEREST_ACCESS_TOKEN", process.env.PINTEREST_ACCESS_TOKEN);
  delete process.env.PINTEREST_ACCESS_TOKEN;
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;
  globalThis.fetch = (async () => {
    fetchCalls += 1;
    throw new Error("external fetch must not be reached");
  }) as typeof fetch;

  try {
    await assertPinterestNoGo(
      await runDirectPinterestPublish(cronRequest("/api/pinterest/publish")),
      "direct_publish",
    );
    await assertPinterestNoGo(
      await runDailyPinterest(cronRequest("/api/automation/daily-pinterest")),
      "daily_automation",
    );
    await assertPinterestNoGo(
      await runPinterestCron(cronRequest("/api/cron/pinterest")),
      "pinterest_cron",
    );
    assert.equal(fetchCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of originalEnv) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test("real admin draft publish and retry actions return 503 before auth, database, or fetch", async () => {
  const originalFetch = globalThis.fetch;
  const draftDelegate = db.pinterestContentDraft;
  const originalFindUnique = draftDelegate.findUnique;
  const originalUpdateMany = draftDelegate.updateMany;
  let fetchCalls = 0;
  let dbCalls = 0;
  globalThis.fetch = (async () => {
    fetchCalls += 1;
    throw new Error("external fetch must not be reached");
  }) as typeof fetch;
  draftDelegate.findUnique = (async () => {
    dbCalls += 1;
    throw new Error("database must not be reached");
  }) as typeof draftDelegate.findUnique;
  draftDelegate.updateMany = (async () => {
    dbCalls += 1;
    throw new Error("database must not be reached");
  }) as typeof draftDelegate.updateMany;

  try {
    for (const action of ["publish", "retry"] as const) {
      const request = new NextRequest("https://www.maverenne.com/api/admin/pinterest-drafts/draft-1", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          origin: "https://www.maverenne.com",
        },
        body: JSON.stringify({ action }),
      });
      await assertPinterestNoGo(
        await mutatePinterestDraft(request, { params: Promise.resolve({ id: "draft-1" }) }),
        action === "publish" ? "admin_publish" : "admin_retry",
      );
    }
    assert.equal(dbCalls, 0);
    assert.equal(fetchCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
    draftDelegate.findUnique = originalFindUnique;
    draftDelegate.updateMany = originalUpdateMany;
  }
});

test("inactive n8n and retired Python adapters execute the production NO-GO without publishing", () => {
  const workflowPath = path.join(process.cwd(), "content/n8n-workflows/daily-pinterest-pin.json");
  const workflow = JSON.parse(readFileSync(workflowPath, "utf8")) as {
    active: boolean;
    nodes: Array<{ type: string; parameters?: { command?: string } }>;
  };
  assert.equal(workflow.active, false);
  const commandNode = workflow.nodes.find((node) => node.type === "n8n-nodes-base.executeCommand");
  assert.ok(commandNode?.parameters?.command);

  const n8nAdapter = spawnSync(commandNode.parameters.command, {
    cwd: process.cwd(),
    encoding: "utf8",
    env: { ...process.env, ...PINTEREST_CREDENTIAL_ENV },
    shell: true,
  });
  assert.notEqual(n8nAdapter.status, 0);
  assert.deepEqual(JSON.parse(n8nAdapter.stdout), {
    error: "Pinterest external publishing is disabled for this internal-only local candidate.",
    status: "internal_only_publish_blocked",
    entrypoint: "n8n_adapter",
    attempted: 0,
    published: 0,
  });

  const retiredPython = spawnSync("python", ["scripts/publish-pins.py"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: { ...process.env, ...PINTEREST_CREDENTIAL_ENV },
  });
  assert.notEqual(retiredPython.status, 0);
  assert.match(`${retiredPython.stdout}\n${retiredPython.stderr}`, /external publishing is disabled/i);
});

test("real automation email handlers return 503 before database or fetch for each missing input", async () => {
  const originalEnv = {
    CRON_SECRET: process.env.CRON_SECRET,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  };
  const originalFetch = globalThis.fetch;
  const originalVariantFindMany = db.variant.findMany;
  const originalOrderCount = db.order.count;
  const originalOrderAggregate = db.order.aggregate;
  const originalVariantCount = db.variant.count;
  const originalProductCount = db.product.count;
  let fetchCalls = 0;
  let dbCalls = 0;
  const failDb = async () => {
    dbCalls += 1;
    throw new Error("database must not be reached");
  };
  globalThis.fetch = (async () => {
    fetchCalls += 1;
    throw new Error("external fetch must not be reached");
  }) as typeof fetch;
  db.variant.findMany = failDb as typeof db.variant.findMany;
  db.order.count = failDb as typeof db.order.count;
  db.order.aggregate = failDb as typeof db.order.aggregate;
  db.variant.count = failDb as typeof db.variant.count;
  db.product.count = failDb as typeof db.product.count;
  process.env.CRON_SECRET = "route-gate-test-secret";

  const missingCases = [
    { ADMIN_EMAIL: undefined, RESEND_API_KEY: "key", RESEND_FROM_EMAIL: "Maverenne <sender@example.net>" },
    { ADMIN_EMAIL: "ops@example.net", RESEND_API_KEY: undefined, RESEND_FROM_EMAIL: "Maverenne <sender@example.net>" },
    { ADMIN_EMAIL: "ops@example.net", RESEND_API_KEY: "key", RESEND_FROM_EMAIL: undefined },
  ];

  try {
    for (const env of missingCases) {
      for (const key of ["ADMIN_EMAIL", "RESEND_API_KEY", "RESEND_FROM_EMAIL"] as const) {
        const value = env[key];
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
      for (const [pathname, handler] of [
        ["/api/automation/low-stock-alert", runLowStockAlert],
        ["/api/automation/send-daily-report", runDailyReport],
      ] as const) {
        const response = await handler(cronRequest(pathname));
        assert.equal(response.status, 503);
        assert.deepEqual(await response.json(), { error: "Automation email is not configured" });
      }
    }
    assert.equal(dbCalls, 0);
    assert.equal(fetchCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
    db.variant.findMany = originalVariantFindMany;
    db.order.count = originalOrderCount;
    db.order.aggregate = originalOrderAggregate;
    db.variant.count = originalVariantCount;
    db.product.count = originalProductCount;
    for (const [key, value] of Object.entries(originalEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
