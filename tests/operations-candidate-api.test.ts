import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const collectionRoute = join(
  root,
  "src/app/api/admin/operations/candidates/route.ts",
);
const detailRoute = join(
  root,
  "src/app/api/admin/operations/candidates/[id]/route.ts",
);

test("candidate management routes enforce admin access and use the candidate service", () => {
  const collectionSource = readFileSync(collectionRoute, "utf8");
  const detailSource = readFileSync(detailRoute, "utf8");
  const source = `${collectionSource}\n${detailSource}`;

  assert.match(source, /requireAdminApi/);
  assert.match(source, /createSupplierCandidate/);
  assert.match(source, /reviewSupplierCandidate/);
  assert.doesNotMatch(source, /\b(?:db\.)?product\b/i);
});

test("candidate creation distinguishes invalid input from duplicate source links", () => {
  const source = readFileSync(collectionRoute, "utf8");

  assert.match(source, /CandidateConflictError/);
  assert.match(source, /status:\s*400/);
  assert.match(source, /status:\s*409/);
});

test("candidate review routes require notes for final approval decisions", () => {
  const source = readFileSync(detailRoute, "utf8");

  assert.match(source, /Review notes are required/);
  assert.match(source, /!body\.reviewNotes\?\.trim\(\)/);
});
