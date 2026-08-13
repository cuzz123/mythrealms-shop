import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

function source(relativePath: string): string {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

test("dialog focus invokes the latest close callback without render-time ref mutation", () => {
  const hook = source("src/lib/client/use-dialog-focus.ts");
  assert.match(hook, /import \{ useEffect, useEffectEvent, type RefObject \} from "react"/);
  assert.match(hook, /const onCloseEvent = useEffectEvent\(onClose\);/);
  assert.match(hook, /onCloseEvent\(\);/);
  assert.doesNotMatch(hook, /closeRef\.current\s*=/);
});
