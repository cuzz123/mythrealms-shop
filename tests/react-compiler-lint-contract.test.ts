import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

function source(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

test("blog editor declares its post hydrator before the loading effect captures it", () => {
  const editor = source("src/app/admin/blog/[id]/page.tsx");

  assert.ok(editor.indexOf("function fillPost") < editor.indexOf("useEffect(() =>"));
});
