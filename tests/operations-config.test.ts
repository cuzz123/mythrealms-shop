import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import * as Module from "node:module";
import { join } from "node:path";
import test from "node:test";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";

type RegisterHooks = (options: {
  resolve(
    specifier: string,
    context: unknown,
    nextResolve: (specifier: string, context: unknown) => unknown,
  ): unknown;
}) => void;

const registerHooks = (Module as unknown as {
  registerHooks: RegisterHooks;
}).registerHooks;

function createEnv(
  overrides: Partial<NodeJS.ProcessEnv> = {},
): NodeJS.ProcessEnv {
  return {
    NODE_ENV: "test",
    OPERATIONS_REPORT_RECIPIENT: "ops@mythrealms.shop",
    ...overrides,
  };
}

let hooksRegistered = false;
const serverOnlyStubUrl = (() => {
  const directory = mkdtempSync(join(tmpdir(), "operations-config-test-"));
  const filePath = join(directory, "server-only-stub.mjs");
  writeFileSync(filePath, "export {};\n", "utf8");
  return pathToFileURL(filePath).href;
})();

async function loadConfigModule() {
  if (!hooksRegistered) {
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
    hooksRegistered = true;
  }

  return import("../src/lib/operations/config");
}

test("marks the operations config module as server-only before exposing secrets", () => {
  const source = readFileSync(
    new URL("../src/lib/operations/config.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /^import "server-only";\r?\n/);
});

test("uses default exchange rate and gross margin while marking GA4 as unconfigured", async () => {
  const { getOperationsConfig } = await loadConfigModule();
  const config = getOperationsConfig(createEnv());

  assert.equal(config.sourcing.enabled, true);
  assert.equal(config.sourcing.cnyToUsdRate, 0.14);
  assert.equal(config.sourcing.targetGrossMargin, 0.7);
  assert.equal(config.reporting.recipient, "ops@mythrealms.shop");
  assert.equal(config.ga4.configured, false);
  assert.match(config.ga4.reason, /not configured/i);
});

test("keeps manual sourcing available when the report recipient is not configured", async () => {
  const { getOperationsSourcingConfig } = await loadConfigModule();
  const sourcing = getOperationsSourcingConfig({ NODE_ENV: "production" });

  assert.equal(sourcing.enabled, true);
  assert.equal(sourcing.cnyToUsdRate, 0.14);
  assert.equal(sourcing.targetGrossMargin, 0.7);
});

test("rejects exchange rates that are not positive numbers", async () => {
  const { OperationsConfigError, getOperationsConfig } = await loadConfigModule();
  assert.throws(
    () =>
      getOperationsConfig(
        createEnv({ OPERATIONS_CNY_USD_RATE: "0" }),
      ),
    OperationsConfigError,
  );

  assert.throws(
    () =>
      getOperationsConfig(
        createEnv({ OPERATIONS_CNY_USD_RATE: "-1" }),
      ),
    OperationsConfigError,
  );
});

test("rejects gross margins outside the open interval between zero and one", async () => {
  const { OperationsConfigError, getOperationsConfig } = await loadConfigModule();
  assert.throws(
    () =>
      getOperationsConfig(
        createEnv({ OPERATIONS_TARGET_GROSS_MARGIN: "0" }),
      ),
    OperationsConfigError,
  );

  assert.throws(
    () =>
      getOperationsConfig(
        createEnv({ OPERATIONS_TARGET_GROSS_MARGIN: "1" }),
      ),
    OperationsConfigError,
  );
});

test("marks GA4 as configured only when both optional GA4 values are present", async () => {
  const { getOperationsConfig } = await loadConfigModule();
  const missingServiceAccount = getOperationsConfig(
    createEnv({ GOOGLE_ANALYTICS_PROPERTY_ID: "properties/123456789" }),
  );
  assert.equal(missingServiceAccount.ga4.configured, false);

  const configured = getOperationsConfig(
    createEnv({
      GOOGLE_ANALYTICS_PROPERTY_ID: "properties/123456789",
      GOOGLE_SERVICE_ACCOUNT_JSON: '{"client_email":"ops@service-account"}',
    }),
  );

  assert.equal(configured.ga4.configured, true);
  assert.equal(configured.ga4.propertyId, "properties/123456789");
});

test("disables Outlook in production when Graph credentials are incomplete without blocking sourcing", async () => {
  const { getOperationsConfig } = await loadConfigModule();
  const config = getOperationsConfig(
    createEnv({
      NODE_ENV: "production",
      MICROSOFT_GRAPH_CLIENT_ID: "client-id",
      MICROSOFT_GRAPH_TENANT_ID: "tenant-id",
      MICROSOFT_GRAPH_REDIRECT_URI: "https://mythrealms.shop/api/admin/operations/outlook/callback",
      MICROSOFT_GRAPH_WEBHOOK_CLIENT_STATE: "webhook-client-state",
    }),
  );

  assert.equal(config.sourcing.enabled, true);
  assert.equal(config.outlook.configured, false);
  assert.equal(config.outlook.enabled, false);
  assert.match(config.outlook.reason, /disabled/i);
});
