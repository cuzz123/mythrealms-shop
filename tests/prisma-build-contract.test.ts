import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8")) as {
  scripts: Record<string, string>;
};
const vercelConfig = JSON.parse(fs.readFileSync("vercel.json", "utf8")) as {
  buildCommand: string;
};
const prismaSchema = fs.readFileSync("prisma/schema.prisma", "utf8");

test("Prisma generation uses the installed CLI without an npx wrapper", () => {
  assert.equal(packageJson.scripts["db:generate"], "prisma generate");
  assert.equal(packageJson.scripts.postinstall, "prisma generate");
  assert.equal(vercelConfig.buildCommand, "npm run db:generate && next build");
});

test("Prisma generates only for the build host and lets Vercel generate its Linux client", () => {
  assert.match(prismaSchema, /binaryTargets\s*=\s*\["native"\]/);
  assert.doesNotMatch(prismaSchema, /rhel-openssl-3\.0\.x|"windows"/);
});
