import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const connectRoute = join(
  root,
  "src/app/api/admin/operations/outlook/connect/route.ts",
);
const callbackRoute = join(
  root,
  "src/app/api/admin/operations/outlook/callback/route.ts",
);

test("the Outlook connection routes keep OAuth state, tokens, and subscription creation on the server", () => {
  const connectSource = readFileSync(connectRoute, "utf8");
  const callbackSource = readFileSync(callbackRoute, "utf8");
  const source = `${connectSource}\n${callbackSource}`;

  assert.match(source, /requireAdminApi/);
  assert.match(connectSource, /httpOnly:\s*true/);
  assert.match(connectSource, /sameSite:\s*["']lax["']/);
  assert.match(callbackSource, /state\s*!==\s*expectedState/);
  assert.match(callbackSource, /encryptSecret/);
  assert.match(callbackSource, /createInboxSubscription/);
  assert.match(callbackSource, /status:\s*["']ERROR["']/);
  assert.doesNotMatch(callbackSource, /NextResponse\.json\([^)]*refreshToken/);
});
