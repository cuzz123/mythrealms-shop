import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import * as Module from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

type RegisterHooks = (options: {
  resolve(
    specifier: string,
    context: unknown,
    nextResolve: (specifier: string, context: unknown) => unknown,
  ): unknown;
}) => void;

const registerHooks = (Module as unknown as { registerHooks: RegisterHooks })
  .registerHooks;
const serverOnlyStubUrl = (() => {
  const directory = mkdtempSync(join(tmpdir(), "operations-ga4-test-"));
  const filePath = join(directory, "server-only-stub.mjs");
  writeFileSync(filePath, "export {};\n", "utf8");
  return pathToFileURL(filePath).href;
})();

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only") {
      return {
        shortCircuit: true,
        url: serverOnlyStubUrl,
      };
    }

    return nextResolve(specifier, context);
  },
});

const ga4Module = import("../src/lib/operations/ga4");

type Ga4QualificationEvidence = import("../src/lib/operations/ga4").Ga4QualificationEvidence;

const completeEvidence: Ga4QualificationEvidence = {
  productionHostname: "www.maverenne.com",
  excludedTraffic: ["internal", "test", "debug", "preview"],
  evidenceReference: "GA4 property-filter review 2026-08-11",
};

test("qualification evidence requires a production hostname and all four exclusion classes", async () => {
  const { validateGa4QualificationEvidence } = await ga4Module;
  assert.match(validateGa4QualificationEvidence(undefined) ?? "", /not_available/i);
  assert.match(
    validateGa4QualificationEvidence({
      ...completeEvidence,
      excludedTraffic: ["internal", "test", "debug"],
    }) ?? "",
    /preview/i,
  );
  assert.match(
    validateGa4QualificationEvidence({
      ...completeEvidence,
      productionHostname: "candidate.vercel.app",
    }) ?? "",
    /production hostname/i,
  );
  assert.equal(validateGa4QualificationEvidence(completeEvidence), null);
});

test("qualified request filters exactly to the evidenced production hostname", async () => {
  const { buildQualifiedGa4Request } = await ga4Module;
  assert.deepEqual(buildQualifiedGa4Request("2026-08-11", completeEvidence), {
    dateRanges: [{ startDate: "2026-08-11", endDate: "2026-08-11" }],
    dimensions: [{ name: "hostName" }],
    dimensionFilter: {
      filter: {
        fieldName: "hostName",
        stringFilter: {
          matchType: "EXACT",
          value: "www.maverenne.com",
          caseSensitive: false,
        },
      },
    },
    metrics: [
      { name: "activeUsers" },
      { name: "sessions" },
      { name: "ecommercePurchases" },
    ],
  });
});

test("metric parsing preserves an explicit zero but rejects missing or invalid values", async () => {
  const { parseQualifiedGa4Metrics } = await ga4Module;
  assert.deepEqual(parseQualifiedGa4Metrics(["0", "12", "3"]), {
    activeUsers: 0,
    sessions: 12,
    purchases: 3,
  });

  for (const values of [
    [],
    ["", "12", "3"],
    [undefined, "12", "3"],
    ["1", "not-a-number", "3"],
    ["1", "12.5", "3"],
    ["1", "12", "-1"],
  ]) {
    assert.equal(parseQualifiedGa4Metrics(values), null);
  }
});

test("snapshot remains not_available before authentication when evidence is absent", async () => {
  const { getGa4Snapshot } = await ga4Module;
  const result = await getGa4Snapshot(
    {
      configured: true,
      propertyId: "properties/123",
      serviceAccountJson: "not-json-and-must-not-be-read",
    },
    "2026-08-11",
  );

  assert.equal(result.configured, false);
  assert.match(result.reason, /not_available/i);
  assert.match(result.reason, /hostname|exclusion|evidence/i);
});
