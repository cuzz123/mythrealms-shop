import "server-only";

import type {
  OperationsConfig,
  OperationsGa4Config,
  OperationsOutlookConfig,
  OperationsSourcingConfig,
} from "./types";

const DEFAULT_CNY_USD_RATE = 0.14;
const DEFAULT_TARGET_GROSS_MARGIN = 0.7;

const OUTLOOK_FIELDS = [
  "MICROSOFT_GRAPH_CLIENT_ID",
  "MICROSOFT_GRAPH_CLIENT_SECRET",
  "MICROSOFT_GRAPH_TENANT_ID",
  "MICROSOFT_GRAPH_REDIRECT_URI",
  "MICROSOFT_GRAPH_WEBHOOK_CLIENT_STATE",
  "AUTOMATION_ENCRYPTION_KEY",
] as const;

export class OperationsConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OperationsConfigError";
  }
}

function readOptionalString(
  env: NodeJS.ProcessEnv,
  name: string,
): string | undefined {
  const value = env[name]?.trim();

  return value ? value : undefined;
}

function readRequiredString(env: NodeJS.ProcessEnv, name: string): string {
  const value = readOptionalString(env, name);

  if (!value) {
    throw new OperationsConfigError(`${name} is required.`);
  }

  return value;
}

function readPositiveNumber(
  env: NodeJS.ProcessEnv,
  name: string,
  fallback: number,
): number {
  const rawValue = readOptionalString(env, name);

  if (!rawValue) {
    return fallback;
  }

  const parsedValue = Number(rawValue);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    throw new OperationsConfigError(`${name} must be a positive number.`);
  }

  return parsedValue;
}

function readMargin(
  env: NodeJS.ProcessEnv,
  name: string,
  fallback: number,
): number {
  const rawValue = readOptionalString(env, name);

  if (!rawValue) {
    return fallback;
  }

  const parsedValue = Number(rawValue);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0 || parsedValue >= 1) {
    throw new OperationsConfigError(
      `${name} must be greater than 0 and less than 1.`,
    );
  }

  return parsedValue;
}

function readGa4Config(env: NodeJS.ProcessEnv): OperationsGa4Config {
  const propertyId = readOptionalString(env, "GOOGLE_ANALYTICS_PROPERTY_ID");
  const serviceAccountJson = readOptionalString(
    env,
    "GOOGLE_SERVICE_ACCOUNT_JSON",
  );

  if (!propertyId && !serviceAccountJson) {
    return {
      configured: false,
      reason: "GA4 is not configured.",
    };
  }

  if (!propertyId || !serviceAccountJson) {
    return {
      configured: false,
      reason: "GA4 is not configured because one or more required values are missing.",
    };
  }

  return {
    configured: true,
    propertyId,
    serviceAccountJson,
  };
}

function readOutlookConfig(env: NodeJS.ProcessEnv): OperationsOutlookConfig {
  const values = Object.fromEntries(
    OUTLOOK_FIELDS.map((name) => [name, readOptionalString(env, name)]),
  ) as Record<(typeof OUTLOOK_FIELDS)[number], string | undefined>;
  const missingFields = OUTLOOK_FIELDS.filter((name) => !values[name]);
  const isProduction = env.NODE_ENV === "production";

  if (missingFields.length > 0) {
    return {
      configured: false,
      enabled: false,
      reason: isProduction
        ? "Outlook automation is disabled in production until Microsoft Graph settings are complete."
        : "Outlook automation is not configured.",
      missingFields: [...missingFields],
    };
  }

  return {
    configured: true,
    enabled: true,
    clientId: values.MICROSOFT_GRAPH_CLIENT_ID!,
    clientSecret: values.MICROSOFT_GRAPH_CLIENT_SECRET!,
    tenantId: values.MICROSOFT_GRAPH_TENANT_ID!,
    redirectUri: values.MICROSOFT_GRAPH_REDIRECT_URI!,
    webhookClientState: values.MICROSOFT_GRAPH_WEBHOOK_CLIENT_STATE!,
    encryptionKey: values.AUTOMATION_ENCRYPTION_KEY!,
  };
}

export function getOperationsSourcingConfig(
  env: NodeJS.ProcessEnv = process.env,
): OperationsSourcingConfig {
  return {
    enabled: true,
    cnyToUsdRate: readPositiveNumber(
      env,
      "OPERATIONS_CNY_USD_RATE",
      DEFAULT_CNY_USD_RATE,
    ),
    targetGrossMargin: readMargin(
      env,
      "OPERATIONS_TARGET_GROSS_MARGIN",
      DEFAULT_TARGET_GROSS_MARGIN,
    ),
  };
}

export function getOperationsOutlookConfig(
  env: NodeJS.ProcessEnv = process.env,
): OperationsOutlookConfig {
  return readOutlookConfig(env);
}

export function getOperationsConfig(
  env: NodeJS.ProcessEnv = process.env,
): OperationsConfig {
  return {
    sourcing: getOperationsSourcingConfig(env),
    reporting: {
      recipient: readRequiredString(env, "OPERATIONS_REPORT_RECIPIENT"),
    },
    ga4: readGa4Config(env),
    outlook: readOutlookConfig(env),
  };
}
