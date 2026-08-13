import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const repositoryRoot = path.resolve(import.meta.dirname, "..");

const credentialConsumers = [
  { file: "scripts/gen-covers.py", variable: "AGNES_API_KEY" },
  { file: "scripts/generate_product_images.py", variable: "AGNES_API_KEY" },
  { file: "scripts/regenerate_luxury.py", variable: "AGNES_API_KEY" },
  { file: "scripts/publish-pins.py", variable: "PINTEREST_ACCESS_TOKEN" },
] as const;

test("tracked automation scripts never ship credential literals", () => {
  for (const { file } of credentialConsumers) {
    const source = readFileSync(path.join(repositoryRoot, file), "utf8");

    assert.equal(
      /sk-[A-Za-z0-9_-]{20,}/.test(source),
      false,
      `${file} must not contain an OpenAI-compatible credential literal`,
    );
    assert.equal(
      /(?:API_KEY|AGNES_KEY|TOKEN)\s*=\s*["'][A-Za-z0-9_+/=-]{32,}["']/.test(
        source,
      ),
      false,
      `${file} must not contain a hardcoded opaque credential`,
    );
  }
});

test("credential consumers declare their exact environment dependency", () => {
  for (const { file, variable } of credentialConsumers) {
    const source = readFileSync(path.join(repositoryRoot, file), "utf8");

    assert.equal(
      new RegExp(`require_env\\(["']${variable}["']\\)`).test(source),
      true,
      `${file} must obtain its credential through require_env(${variable})`,
    );
  }
});

test("require_env fails closed without echoing a missing credential", () => {
  const python = process.platform === "win32" ? "python.exe" : "python3";
  const sanitizedEnv: NodeJS.ProcessEnv = { ...process.env };
  delete sanitizedEnv.SECURITY_TEST_MISSING_SECRET;
  const result = spawnSync(
    python,
    [
      "-c",
      [
        "from scripts.required_env import require_env",
        "require_env('SECURITY_TEST_MISSING_SECRET')",
      ].join("; "),
    ],
    {
      cwd: repositoryRoot,
      encoding: "utf8",
      env: sanitizedEnv,
    },
  );

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /SECURITY_TEST_MISSING_SECRET is required/);
  assert.doesNotMatch(result.stderr, /sk-|Bearer\s+|access[_-]?token/i);
});
