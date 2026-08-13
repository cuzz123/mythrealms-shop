import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("eslint skips generated media and local execution workspaces", () => {
  const config = readFileSync("eslint.config.mjs", "utf8");

  for (const ignoredPath of [
    ".claude/**",
    ".impeccable/**",
    ".superpowers/**",
    ".vercel/**",
    ".worktrees/**",
    "assets/**",
    "huanyuan_model/**",
    "public/**",
    "test-results/**",
    "tmp/**",
    "tools/**",
    "video-pipeline/**",
  ]) {
    const quotedPath = `"${ignoredPath}"`;
    assert.equal(config.includes(quotedPath), true, `missing ignore: ${ignoredPath}`);
  }
});
