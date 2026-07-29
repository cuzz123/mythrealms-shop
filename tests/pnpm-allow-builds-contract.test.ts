import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const workspaceConfig = fs.readFileSync("pnpm-workspace.yaml", "utf8");

function readAllowBuilds(config: string): Record<string, boolean | string> {
  const lines = config.replace(/\r\n/g, "\n").split("\n");
  const headerIndex = lines.findIndex((line) => /^\s*allowBuilds\s*:\s*(?:#.*)?$/.test(line));
  assert.notEqual(headerIndex, -1, "pnpm-workspace.yaml must define allowBuilds");

  const headerIndent = lines[headerIndex].match(/^\s*/)?.[0].length ?? 0;
  const policies: Record<string, boolean> = {};
  let entryIndent: number | undefined;

  for (const line of lines.slice(headerIndex + 1)) {
    if (/^\s*(?:#.*)?$/.test(line)) continue;

    const indent = line.match(/^\s*/)?.[0].length ?? 0;
    if (indent <= headerIndent) break;
    if (entryIndent === undefined) entryIndent = indent;
    assert.equal(indent, entryIndent, `allowBuilds must be a flat mapping: ${line}`);

    const entry = line.trim().match(/^(?:'([^']+)'|"([^"]+)"|([^:\s][^:]*?))\s*:\s*(.*?)\s*$/);
    assert.ok(entry, `allowBuilds entry must be a YAML mapping: ${line}`);
    const packageName = entry[1] ?? entry[2] ?? entry[3];
    const value = entry[4].replace(/\s+#.*$/, "");

    assert.ok(value === "true" || value === "false", `allowBuilds policy must be boolean: ${packageName}`);
    assert.ok(!(packageName in policies), `duplicate allowBuilds key: ${packageName}`);
    policies[packageName] = value === "true";
  }

  return policies;
}

test("allowBuilds contains reviewed boolean policies for every lifecycle package", () => {
  assert.deepEqual(readAllowBuilds(workspaceConfig), {
    "@prisma/client": false,
    "@prisma/engines": true,
    prisma: false,
    esbuild: true,
    sharp: false,
  });
});

const reviewedPolicies = {
  "@prisma/client": false,
  "@prisma/engines": true,
  prisma: false,
  esbuild: true,
  sharp: false,
};

function assertReviewedPolicies(config: string) {
  assert.deepEqual(readAllowBuilds(config), reviewedPolicies);
}

test("allowBuilds accepts equivalent YAML indentation and double-quoted keys", () => {
  assertReviewedPolicies(`allowBuilds:
    "@prisma/client": false
    "@prisma/engines": true
    prisma: false
    esbuild: true
    sharp: false
`);
});

test("allowBuilds rejects literal placeholders and other non-boolean values", () => {
  assert.throws(
    () =>
      readAllowBuilds(`allowBuilds:
  '@prisma/client': set this to true or false
`),
    /boolean/i,
  );
});

test("allowBuilds contract rejects missing and additional lifecycle policies", () => {
  assert.throws(
    () =>
      assertReviewedPolicies(`allowBuilds:
  '@prisma/client': false
  '@prisma/engines': true
  prisma: false
  esbuild: true
`),
  );
  assert.throws(
    () =>
      assertReviewedPolicies(`allowBuilds:
  '@prisma/client': false
  '@prisma/engines': true
  prisma: false
  esbuild: true
  sharp: false
  unexpected: false
`),
  );
});

test("allowBuilds rejects duplicate YAML keys", () => {
  assert.throws(
    () =>
      readAllowBuilds(`allowBuilds:
  '@prisma/client': false
  '@prisma/client': true
`),
    /duplicate/i,
  );
});
