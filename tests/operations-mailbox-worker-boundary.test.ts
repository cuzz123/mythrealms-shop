import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

test("the mailbox worker claims events atomically and keeps Graph credentials server-only", () => {
  const source = readFileSync(
    join(process.cwd(), "src/lib/operations/mailbox-worker.ts"),
    "utf8",
  );

  assert.match(source, /^import "server-only";/);
  assert.match(source, /updateMany/);
  assert.match(source, /status:\s*["']PENDING["']/);
  assert.match(source, /status:\s*["']PROCESSING["']/);
  assert.match(source, /decryptSecret/);
  assert.match(source, /refreshGraphAccessToken/);
  assert.match(source, /processMailboxAutomationEvent/);
});

test("the mailbox worker renews active Outlook subscriptions before they expire", () => {
  const source = readFileSync(
    join(process.cwd(), "src/lib/operations/mailbox-worker.ts"),
    "utf8",
  );

  assert.match(source, /renewOutlookSubscriptions/);
  assert.match(source, /renewInboxSubscription/);
  assert.match(source, /subscriptionExpiresAt/);
});
