import assert from "node:assert/strict";
import test from "node:test";

import {
  SupportEmailError,
  deliverSupportEmail,
} from "../src/lib/server/support-email";

const message = {
  to: "support@example.com",
  subject: "Support request",
  html: "<p>Hello</p>",
};

test("returns a service-unavailable error when email is not configured", async () => {
  await assert.rejects(
    deliverSupportEmail(message, {
      apiKey: "",
      from: "MythRealms <support@example.com>",
      fetcher: async () => new Response(),
    }),
    (error: unknown) => error instanceof SupportEmailError && error.status === 503,
  );
});

test("returns a service-unavailable error when the verified sender is missing", async () => {
  await assert.rejects(
    deliverSupportEmail(message, {
      apiKey: "resend-key",
      from: "",
      fetcher: async () => {
        throw new Error("provider must not be called");
      },
    }),
    (error: unknown) =>
      error instanceof SupportEmailError &&
      error.status === 503 &&
      /RESEND_FROM_EMAIL/.test(error.message),
  );
});

test("returns a bad-gateway error when the email provider rejects delivery", async () => {
  await assert.rejects(
    deliverSupportEmail(message, {
      apiKey: "resend-key",
      from: "MythRealms <support@example.com>",
      fetcher: async () => new Response("provider failed", { status: 500 }),
    }),
    (error: unknown) => error instanceof SupportEmailError && error.status === 502,
  );
});

test("returns a bad-gateway error when the provider network request rejects", async () => {
  await assert.rejects(
    deliverSupportEmail(message, {
      apiKey: "resend-key",
      from: "MythRealms <support@example.com>",
      fetcher: async () => {
        throw new TypeError("network unavailable");
      },
    }),
    (error: unknown) => error instanceof SupportEmailError && error.status === 502,
  );
});

test("reports success only after the provider accepts delivery", async () => {
  let request: RequestInit | undefined;
  await deliverSupportEmail(message, {
    apiKey: "resend-key",
    from: "MythRealms <support@example.com>",
    fetcher: async (_input, init) => {
      request = init;
      return new Response(JSON.stringify({ id: "email-123" }), {
        headers: { "Content-Type": "application/json" },
      });
    },
  });

  assert.equal(request?.method, "POST");
  assert.match(String(request?.headers && JSON.stringify(request.headers)), /Bearer resend-key/);
  assert.match(String(request?.body), /MythRealms <support@example\.com>/);
});
