import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { getPinterestPublishBlock, publishPinterestPin } from "../src/lib/pinterest-publisher";

function source(relativePath: string): string {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

test("the Pinterest publisher fails closed without invoking an external request", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = (async () => {
    calls += 1;
    throw new Error("external fetch must not be reached");
  }) as typeof fetch;

  try {
    await assert.rejects(
      publishPinterestPin({
        title: "Internal draft",
        description: "Internal draft",
        link: "https://www.maverenne.com/products/example",
        imageUrl: "https://www.maverenne.com/images/example.png",
      }),
      /external publishing is disabled/i,
    );
    assert.equal(calls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("all Pinterest publishing entrypoints declare the local-candidate hard block", () => {
  for (const file of [
    "src/app/api/pinterest/publish/route.ts",
    "src/app/api/automation/daily-pinterest/route.ts",
    "src/app/api/cron/pinterest/route.ts",
    "src/app/api/admin/pinterest-drafts/[id]/route.ts",
    "src/components/admin/PinterestDraftQueue.tsx",
    "content/n8n-workflows/daily-pinterest-pin.json",
  ]) {
    assert.match(source(file), /getPinterestPublishBlock|publishing is disabled|publish(?:ing)?[_ -]disabled|internal_only_publish_blocked/i, file);
  }
});

test("every executable publishing adapter returns NO-GO with credentials present and zero fetches", () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = (async () => { calls += 1; throw new Error("must not fetch"); }) as typeof fetch;
  try {
    for (const entrypoint of [
      "direct_publish", "daily_automation", "pinterest_cron", "admin_publish",
      "admin_retry", "admin_ui", "n8n_adapter",
    ] as const) {
      const result = getPinterestPublishBlock(entrypoint);
      assert.equal(result.status, "internal_only_publish_blocked");
      assert.equal(result.entrypoint, entrypoint);
      assert.equal(result.attempted, 0);
      assert.equal(result.published, 0);
    }
    assert.equal(calls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("admin Pinterest surfaces are internal candidate review only", () => {
  const queue = source("src/components/admin/PinterestDraftQueue.tsx");
  const tasks = source("src/app/admin/social-tasks/page.tsx");

  assert.match(queue, /internal candidate review/i);
  assert.match(queue, /NO-GO/);
  assert.match(queue, /submitted\s*=\s*0/);
  assert.match(queue, /published\s*=\s*0/);
  assert.doesNotMatch(queue, /type=["']datetime-local["']/);
  assert.doesNotMatch(queue, /自动发布时间/);

  assert.match(tasks, /internal candidate review/i);
  assert.match(tasks, /NO-GO/);
  assert.doesNotMatch(tasks, /发布\s*1-3\s*条原创\s*Pin/);
  assert.doesNotMatch(tasks, /pinterest-batch/i);
});
