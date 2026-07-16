import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();

test("inbox routes are admin-only and keep manual send inside the server worker", () => {
  const listRoute = readFileSync(
    join(root, "src/app/api/admin/operations/inbox/route.ts"),
    "utf8",
  );
  const detailRoute = readFileSync(
    join(root, "src/app/api/admin/operations/inbox/[id]/route.ts"),
    "utf8",
  );
  const source = `${listRoute}\n${detailRoute}`;

  assert.match(source, /requireAdminApi/);
  assert.match(detailRoute, /sendMailboxDraft/);
  assert.match(detailRoute, /action:\s*["']IGNORED["']/);
  assert.doesNotMatch(source, /refreshTokenEncrypted/);
});
