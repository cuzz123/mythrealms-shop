import assert from "node:assert/strict";
import test from "node:test";

import {
  createGraphAuthorizationUrl,
  createInboxSubscription,
  exchangeGraphAuthorizationCode,
  getGraphAccountEmail,
  getGraphMessage,
  renewInboxSubscription,
  replyToGraphMessage,
} from "../src/lib/operations/microsoft-graph";

const oauth = {
  clientId: "client-id",
  clientSecret: "client-secret",
  tenantId: "consumers",
  redirectUri: "https://mythrealms.shop/api/admin/operations/outlook/callback",
};

test("creates a Microsoft account authorization URL with only delegated mail scopes", () => {
  const url = new URL(createGraphAuthorizationUrl(oauth, "csrf-state"));

  assert.equal(url.origin, "https://login.microsoftonline.com");
  assert.equal(url.pathname, "/consumers/oauth2/v2.0/authorize");
  assert.equal(url.searchParams.get("client_id"), "client-id");
  assert.equal(url.searchParams.get("state"), "csrf-state");
  assert.equal(url.searchParams.get("redirect_uri"), oauth.redirectUri);
  assert.equal(url.searchParams.get("response_type"), "code");
  assert.deepEqual(
    url.searchParams.get("scope")?.split(" ").sort(),
    ["Mail.Read", "Mail.Send", "User.Read", "offline_access"].sort(),
  );
});

test("exchanges an authorization code without exposing client credentials in the result", async () => {
  let requestUrl = "";
  let requestBody = "";
  const result = await exchangeGraphAuthorizationCode("auth-code", oauth, async (url, init) => {
    requestUrl = String(url);
    requestBody = String(init?.body);
    return new Response(
      JSON.stringify({
        access_token: "access-token",
        refresh_token: "refresh-token",
        expires_in: 3600,
      }),
      { status: 200 },
    );
  });

  assert.equal(requestUrl, "https://login.microsoftonline.com/consumers/oauth2/v2.0/token");
  assert.match(requestBody, /grant_type=authorization_code/);
  assert.match(requestBody, /client_secret=client-secret/);
  assert.deepEqual(result, {
    accessToken: "access-token",
    refreshToken: "refresh-token",
    expiresInSeconds: 3600,
  });
  assert.equal("clientSecret" in result, false);
});

test("creates a basic inbox subscription below Graph's seven-day expiration limit", async () => {
  let requestBody = "";
  const now = new Date("2026-07-14T00:00:00.000Z");

  const subscription = await createInboxSubscription(
    {
      accessToken: "access-token",
      notificationUrl: "https://mythrealms.shop/api/webhooks/outlook",
      clientState: "client-state",
    },
    async (_url, init) => {
      requestBody = String(init?.body);
      return new Response(
        JSON.stringify({
          id: "subscription-123",
          expirationDateTime: "2026-07-20T00:00:00.000Z",
        }),
        { status: 201 },
      );
    },
    now,
  );

  const body = JSON.parse(requestBody);
  assert.equal(body.changeType, "created");
  assert.equal(body.resource, "me/mailFolders('inbox')/messages");
  assert.equal(body.clientState, "client-state");
  assert.equal(body.latestSupportedTlsVersion, "v1_2");
  assert.equal(body.expirationDateTime, "2026-07-19T23:55:00.000Z");
  assert.deepEqual(subscription, {
    id: "subscription-123",
    expiresAt: new Date("2026-07-20T00:00:00.000Z"),
  });
});

test("renews an inbox subscription before the Graph expiration limit", async () => {
  let requestUrl = "";
  let requestBody = "";
  const now = new Date("2026-07-14T00:00:00.000Z");

  const renewed = await renewInboxSubscription(
    "subscription-123",
    "access-token",
    async (url, init) => {
      requestUrl = String(url);
      requestBody = String(init?.body);
      return new Response(
        JSON.stringify({
          id: "subscription-123",
          expirationDateTime: "2026-07-20T00:00:00.000Z",
        }),
        { status: 200 },
      );
    },
    now,
  );

  assert.equal(requestUrl, "https://graph.microsoft.com/v1.0/subscriptions/subscription-123");
  assert.deepEqual(JSON.parse(requestBody), {
    expirationDateTime: "2026-07-19T23:55:00.000Z",
  });
  assert.deepEqual(renewed, {
    id: "subscription-123",
    expiresAt: new Date("2026-07-20T00:00:00.000Z"),
  });
});

test("uses the primary mail address and falls back to user principal name", async () => {
  const primary = await getGraphAccountEmail(
    "access-token",
    async () =>
      new Response(
        JSON.stringify({
          mail: "mythrealms@outlook.com",
          userPrincipalName: "unused@outlook.com",
        }),
        { status: 200 },
      ),
  );
  const fallback = await getGraphAccountEmail(
    "access-token",
    async () =>
      new Response(
        JSON.stringify({ userPrincipalName: "mythrealms@outlook.com" }),
        { status: 200 },
      ),
  );

  assert.equal(primary, "mythrealms@outlook.com");
  assert.equal(fallback, "mythrealms@outlook.com");
});

test("reads a message from Graph with the sender and body needed for server-side classification", async () => {
  const message = await getGraphMessage(
    "message-123",
    "access-token",
    async (url) => {
      assert.match(String(url), /\/me\/messages\/message-123/);
      return new Response(
        JSON.stringify({
          id: "message-123",
          subject: "Tracking question",
          bodyPreview: "Can you check this order?",
          body: { contentType: "text", content: "Can you check this order?" },
          from: { emailAddress: { address: "buyer@example.com", name: "Buyer" } },
          receivedDateTime: "2026-07-14T09:00:00.000Z",
        }),
        { status: 200 },
      );
    },
  );

  assert.deepEqual(message, {
    id: "message-123",
    subject: "Tracking question",
    bodyPreview: "Can you check this order?",
    body: "Can you check this order?",
    bodyContentType: "text",
    fromEmail: "buyer@example.com",
    fromName: "Buyer",
    receivedAt: "2026-07-14T09:00:00.000Z",
  });
});

test("sends an automated reply only through the original Graph message thread", async () => {
  let requestUrl = "";
  let requestBody = "";

  await replyToGraphMessage(
    "message-123",
    "access-token",
    "Thanks for reaching out.",
    async (url, init) => {
      requestUrl = String(url);
      requestBody = String(init?.body);
      return new Response(null, { status: 202 });
    },
  );

  assert.equal(requestUrl, "https://graph.microsoft.com/v1.0/me/messages/message-123/reply");
  assert.deepEqual(JSON.parse(requestBody), { comment: "Thanks for reaching out." });
});
