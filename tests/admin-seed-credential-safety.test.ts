import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { resolveSeedAdminConfig } from "../prisma/seed-admin-config";

const repositoryRoot = path.resolve(import.meta.dirname, "..");

const publiclyExposedOrOperatorFacingFiles = [
  "docs/company/archive/legacy-public-static-2026-08-10/public/guides/orders.html",
  "README.md",
  "prisma/seed.ts",
];

test("shipped artifacts do not expose or create the legacy default admin credential", () => {
  for (const relativePath of publiclyExposedOrOperatorFacingFiles) {
    const contents = readFileSync(path.join(repositoryRoot, relativePath), "utf8");

    assert.doesNotMatch(
      contents,
      /admin123/i,
      `${relativePath} must not contain the legacy default password`,
    );
    assert.doesNotMatch(
      contents,
      /admin@mythrealms\.com/i,
      `${relativePath} must not contain the legacy default admin identity`,
    );
  }
});

test("seed creates no administrator when explicit credentials are absent", () => {
  assert.equal(resolveSeedAdminConfig({}), null);
});

test("seed requires the administrator identity and password together", () => {
  assert.throws(
    () => resolveSeedAdminConfig({ SEED_ADMIN_EMAIL: "admin@example.test" }),
    /must be provided together/,
  );
  assert.throws(
    () => resolveSeedAdminConfig({ SEED_ADMIN_PASSWORD: "a-unique-password" }),
    /must be provided together/,
  );
});

test("seed rejects administrator passwords shorter than twelve characters", () => {
  assert.throws(
    () =>
      resolveSeedAdminConfig({
        SEED_ADMIN_EMAIL: "admin@example.test",
        SEED_ADMIN_PASSWORD: "too-short",
      }),
    /at least 12 characters/,
  );
});

test("seed accepts an explicit administrator without logging or defaulting it", () => {
  assert.deepEqual(
    resolveSeedAdminConfig({
      SEED_ADMIN_EMAIL: " admin@example.test ",
      SEED_ADMIN_PASSWORD: "a-unique-password",
    }),
    {
      email: "admin@example.test",
      password: "a-unique-password",
    },
  );
});

test("seed validates administrator configuration before destructive fixture reset", () => {
  const seedSource = readFileSync(
    path.join(repositoryRoot, "prisma/seed.ts"),
    "utf8",
  );
  const validationIndex = seedSource.indexOf("resolveSeedAdminConfig(process.env)");
  const firstDeleteIndex = seedSource.indexOf("deleteMany()");

  assert.notEqual(validationIndex, -1, "seed must resolve administrator config");
  assert.notEqual(firstDeleteIndex, -1, "seed must retain fixture reset behavior");
  assert.ok(
    validationIndex < firstDeleteIndex,
    "seed must validate administrator config before deleting fixture data",
  );
});

test("seed cannot replace the removed default with another hardcoded administrator", () => {
  const seedSource = readFileSync(
    path.join(repositoryRoot, "prisma/seed.ts"),
    "utf8",
  );

  assert.match(
    seedSource,
    /const admin = seedAdminConfig\s*\?\s*await db\.user\.create/,
    "administrator creation must be conditional on explicit seed configuration",
  );
  assert.match(
    seedSource,
    /email:\s*seedAdminConfig\.email/,
    "administrator identity must come from explicit seed configuration",
  );
  assert.match(
    seedSource,
    /bcrypt\.hash\(seedAdminConfig\.password,\s*12\)/,
    "administrator password must come from explicit seed configuration",
  );
  assert.equal(
    (seedSource.match(/db\.user\.create/g) ?? []).length,
    1,
    "seed must have exactly one audited administrator creation path",
  );
});
