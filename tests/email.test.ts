import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { sendAbandonedCart, sendOrderConfirmation } from "../src/lib/email";
import {
  ResendConfigError,
  readResendConfig,
} from "../src/lib/server/resend-config";

test("requires both API key and verified sender", () => {
  assert.throws(
    () => readResendConfig({ RESEND_API_KEY: "", RESEND_FROM_EMAIL: "orders@example.com" }),
    (error: unknown) =>
      error instanceof ResendConfigError &&
      error.status === 503 &&
      /RESEND_API_KEY/.test(error.message),
  );
  assert.throws(
    () => readResendConfig({ RESEND_API_KEY: "key", RESEND_FROM_EMAIL: "" }),
    (error: unknown) =>
      error instanceof ResendConfigError && /RESEND_FROM_EMAIL/.test(error.message),
  );
  assert.throws(
    () =>
      readResendConfig({
        RESEND_API_KEY: "key",
        RESEND_FROM_EMAIL: "MythRealms <onboarding@resend.dev>",
      }),
    /verified sender/i,
  );
});

test("rejects malformed sender syntax", () => {
  assert.throws(
    () =>
      readResendConfig({
        RESEND_API_KEY: "key",
        RESEND_FROM_EMAIL: "MythRealms orders@example.com",
      }),
    /verified sender/i,
  );
});

test("rejects control characters and header injection in sender values", () => {
  for (const from of [
    "MythRealms\nInjected <orders@example.com>",
    "MythRealms\r\nBcc: attacker@example.com <orders@example.com>",
    "MythRealms\u0000 <orders@example.com>",
  ]) {
    assert.throws(
      () => readResendConfig({ RESEND_API_KEY: "key", RESEND_FROM_EMAIL: from }),
      (error: unknown) =>
        error instanceof ResendConfigError &&
        error.status === 503 &&
        /verified sender/i.test(error.message),
    );
  }
});

test("rejects leading, trailing, and consecutive dots in the local part", () => {
  for (const from of [
    ".orders@example.com",
    "orders.@example.com",
    "orders..team@example.com",
  ]) {
    assert.throws(
      () => readResendConfig({ RESEND_API_KEY: "key", RESEND_FROM_EMAIL: from }),
      /verified sender/i,
    );
  }
});

test("rejects punctuation outside unquoted ASCII dot-atom local parts", () => {
  for (const from of [
    "orders,team@example.com",
    "orders:team@example.com",
    'orders"team@example.com',
    '"orders.team"@example.com',
    "orders\\team@example.com",
  ]) {
    assert.throws(
      () => readResendConfig({ RESEND_API_KEY: "key", RESEND_FROM_EMAIL: from }),
      (error: unknown) =>
        error instanceof ResendConfigError &&
        error.status === 503 &&
        /verified sender/i.test(error.message),
    );
  }
});

test("accepts a valid plus-addressed dot-atom sender", () => {
  assert.deepEqual(
    readResendConfig({
      RESEND_API_KEY: "key",
      RESEND_FROM_EMAIL: "MythRealms <orders.team+receipts@example.com>",
    }),
    {
      apiKey: "key",
      from: "MythRealms <orders.team+receipts@example.com>",
    },
  );
});

test("rejects senders that exceed mailbox component length limits", () => {
  const overlongDomain = [63, 63, 63, 62]
    .map((length) => "d".repeat(length))
    .join(".");
  const mailboxOverflowDomain = [63, 63, 62]
    .map((length) => "d".repeat(length))
    .join(".");
  const senders = [
    `${"l".repeat(65)}@example.com`,
    `orders@${"d".repeat(64)}.com`,
    `orders@${overlongDomain}`,
    `${"l".repeat(64)}@${mailboxOverflowDomain}`,
  ];

  assert.equal(overlongDomain.length, 254);
  assert.equal(`${"l".repeat(64)}@${mailboxOverflowDomain}`.length, 255);
  for (const from of senders) {
    assert.throws(
      () => readResendConfig({ RESEND_API_KEY: "key", RESEND_FROM_EMAIL: from }),
      (error: unknown) =>
        error instanceof ResendConfigError &&
        error.status === 503 &&
        /verified sender/i.test(error.message),
    );
  }
});

test("rejects empty, invalid-character, and hyphen-bounded domain labels", () => {
  for (const from of [
    "orders@example..com",
    "orders@-example.com",
    "orders@example-.com",
    "orders@exa_mple.com",
  ]) {
    assert.throws(
      () => readResendConfig({ RESEND_API_KEY: "key", RESEND_FROM_EMAIL: from }),
      /verified sender/i,
    );
  }
});

test("reads the supplied environment on every call", () => {
  const env = {
    RESEND_API_KEY: "first-key",
    RESEND_FROM_EMAIL: "first@example.com",
  };
  assert.deepEqual(readResendConfig(env), {
    apiKey: "first-key",
    from: "first@example.com",
  });

  env.RESEND_API_KEY = "second-key";
  env.RESEND_FROM_EMAIL = "MythRealms <second@example.com>";
  assert.deepEqual(readResendConfig(env), {
    apiKey: "second-key",
    from: "MythRealms <second@example.com>",
  });
});

test("reads process.env at call time instead of module load", () => {
  const previousApiKey = process.env.RESEND_API_KEY;
  const previousFrom = process.env.RESEND_FROM_EMAIL;
  try {
    process.env.RESEND_API_KEY = "first-key";
    process.env.RESEND_FROM_EMAIL = "first@example.com";
    assert.deepEqual(readResendConfig(), {
      apiKey: "first-key",
      from: "first@example.com",
    });

    process.env.RESEND_API_KEY = "second-key";
    process.env.RESEND_FROM_EMAIL = "MythRealms <second@example.com>";
    assert.deepEqual(readResendConfig(), {
      apiKey: "second-key",
      from: "MythRealms <second@example.com>",
    });
  } finally {
    if (previousApiKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previousApiKey;
    if (previousFrom === undefined) delete process.env.RESEND_FROM_EMAIL;
    else process.env.RESEND_FROM_EMAIL = previousFrom;
  }
});

test("passes configured sender and idempotency key to the transport", async () => {
  let payload: Record<string, unknown> | undefined;
  let requestOptions: Record<string, unknown> | undefined;
  await sendOrderConfirmation(
    "buyer@example.com",
    "order-123",
    31.98,
    [],
    "order-confirmation/order-123",
    {
      apiKey: "resend-key",
      fromEmail: "MythRealms <orders@example.com>",
      transport: {
        async send(nextPayload, nextOptions) {
          payload = nextPayload as unknown as Record<string, unknown>;
          requestOptions = nextOptions as unknown as Record<string, unknown>;
          return { data: { id: "email-123" }, error: null, headers: null };
        },
      },
    },
  );
  assert.equal(payload?.from, "MythRealms <orders@example.com>");
  assert.equal(payload?.to, "buyer@example.com");
  assert.equal(requestOptions?.idempotencyKey, "order-confirmation/order-123");
});

test("throws when the order transport reports an error", async () => {
  await assert.rejects(
    sendOrderConfirmation(
      "buyer@example.com",
      "order-123",
      31.98,
      [],
      "order-confirmation/order-123",
      {
        apiKey: "resend-key",
        fromEmail: "MythRealms <orders@example.com>",
        transport: {
          async send() {
            return {
              data: null,
              error: {
                message: "provider rejected delivery",
                name: "validation_error",
                statusCode: 422,
              },
              headers: null,
            };
          },
        },
      },
    ),
    /Resend order confirmation failed: provider rejected delivery/,
  );
});

test("abandoned-cart delivery stays best-effort when config is missing", async () => {
  const previousApiKey = process.env.RESEND_API_KEY;
  const previousFrom = process.env.RESEND_FROM_EMAIL;
  delete process.env.RESEND_API_KEY;
  delete process.env.RESEND_FROM_EMAIL;
  try {
    await assert.doesNotReject(
      sendAbandonedCart("buyer@example.com", "https://example.com/cart"),
    );
  } finally {
    if (previousApiKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previousApiKey;
    if (previousFrom === undefined) delete process.env.RESEND_FROM_EMAIL;
    else process.env.RESEND_FROM_EMAIL = previousFrom;
  }
});

test("no storefront mailer uses the Resend testing sender", () => {
  for (const file of ["src/lib/email.ts", "src/lib/server/support-email.ts"]) {
    const source = readFileSync(path.join(process.cwd(), file), "utf8");
    assert.doesNotMatch(source, /onboarding@resend\.dev/);
  }
});
