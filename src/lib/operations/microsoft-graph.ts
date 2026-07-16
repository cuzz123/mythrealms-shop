const MICROSOFT_LOGIN_ORIGIN = "https://login.microsoftonline.com";
const GRAPH_ORIGIN = "https://graph.microsoft.com/v1.0";
const GRAPH_SCOPES = ["offline_access", "User.Read", "Mail.Read", "Mail.Send"];
const INBOX_SUBSCRIPTION_DURATION_MS =
  6 * 24 * 60 * 60 * 1000 - 5 * 60 * 1000;

function getInboxSubscriptionExpiration(now: Date): Date {
  return new Date(now.getTime() + INBOX_SUBSCRIPTION_DURATION_MS);
}

export type MicrosoftGraphOAuthConfig = {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  redirectUri: string;
};

export type GraphFetch = (
  input: string | URL,
  init?: RequestInit,
) => Promise<Response>;

export class MicrosoftGraphError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "MicrosoftGraphError";
  }
}

export type MicrosoftGraphToken = {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
};

function tokenEndpoint(tenantId: string): string {
  return `${MICROSOFT_LOGIN_ORIGIN}/${encodeURIComponent(tenantId)}/oauth2/v2.0/token`;
}

function readRequiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value) {
    throw new MicrosoftGraphError(`Microsoft Graph response is missing ${field}.`);
  }

  return value;
}

async function readGraphError(response: Response): Promise<MicrosoftGraphError> {
  try {
    const body = await response.json() as { error?: { message?: unknown }; error_description?: unknown };
    const message =
      typeof body.error?.message === "string"
        ? body.error.message
        : typeof body.error_description === "string"
          ? body.error_description
          : "Microsoft Graph request failed.";
    return new MicrosoftGraphError(message, response.status);
  } catch {
    return new MicrosoftGraphError("Microsoft Graph request failed.", response.status);
  }
}

function parseTokenResponse(value: unknown): MicrosoftGraphToken {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new MicrosoftGraphError("Microsoft Graph token response is invalid.");
  }

  const body = value as Record<string, unknown>;
  const expiresIn = body.expires_in;

  if (typeof expiresIn !== "number" || !Number.isFinite(expiresIn) || expiresIn <= 0) {
    throw new MicrosoftGraphError("Microsoft Graph response is missing expires_in.");
  }

  return {
    accessToken: readRequiredString(body.access_token, "access_token"),
    refreshToken: readRequiredString(body.refresh_token, "refresh_token"),
    expiresInSeconds: expiresIn,
  };
}

async function requestToken(
  parameters: URLSearchParams,
  config: MicrosoftGraphOAuthConfig,
  fetchImplementation: GraphFetch,
): Promise<MicrosoftGraphToken> {
  parameters.set("client_id", config.clientId);
  parameters.set("client_secret", config.clientSecret);
  parameters.set("redirect_uri", config.redirectUri);
  parameters.set("scope", GRAPH_SCOPES.join(" "));

  const response = await fetchImplementation(tokenEndpoint(config.tenantId), {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: parameters.toString(),
  });

  if (!response.ok) {
    throw await readGraphError(response);
  }

  return parseTokenResponse(await response.json());
}

export function createGraphAuthorizationUrl(
  config: MicrosoftGraphOAuthConfig,
  state: string,
): string {
  const url = new URL(
    `${MICROSOFT_LOGIN_ORIGIN}/${encodeURIComponent(config.tenantId)}/oauth2/v2.0/authorize`,
  );
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("response_mode", "query");
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("scope", GRAPH_SCOPES.join(" "));
  url.searchParams.set("state", state);

  return url.toString();
}

export function exchangeGraphAuthorizationCode(
  code: string,
  config: MicrosoftGraphOAuthConfig,
  fetchImplementation: GraphFetch = fetch,
): Promise<MicrosoftGraphToken> {
  const parameters = new URLSearchParams({
    grant_type: "authorization_code",
    code,
  });

  return requestToken(parameters, config, fetchImplementation);
}

export function refreshGraphAccessToken(
  refreshToken: string,
  config: MicrosoftGraphOAuthConfig,
  fetchImplementation: GraphFetch = fetch,
): Promise<MicrosoftGraphToken> {
  const parameters = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  return requestToken(parameters, config, fetchImplementation);
}

export async function createInboxSubscription(
  input: {
    accessToken: string;
    notificationUrl: string;
    clientState: string;
  },
  fetchImplementation: GraphFetch = fetch,
  now = new Date(),
): Promise<{ id: string; expiresAt: Date }> {
  const expirationDateTime = getInboxSubscriptionExpiration(now);
  const response = await fetchImplementation(`${GRAPH_ORIGIN}/subscriptions`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${input.accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      changeType: "created",
      notificationUrl: input.notificationUrl,
      resource: "me/mailFolders('inbox')/messages",
      expirationDateTime: expirationDateTime.toISOString(),
      clientState: input.clientState,
      latestSupportedTlsVersion: "v1_2",
    }),
  });

  if (!response.ok) {
    throw await readGraphError(response);
  }

  const body = await response.json() as Record<string, unknown>;
  const expiresAt = new Date(readRequiredString(body.expirationDateTime, "expirationDateTime"));

  if (Number.isNaN(expiresAt.getTime())) {
    throw new MicrosoftGraphError("Microsoft Graph response has an invalid expirationDateTime.");
  }

  return {
    id: readRequiredString(body.id, "subscription id"),
    expiresAt,
  };
}

export async function renewInboxSubscription(
  subscriptionId: string,
  accessToken: string,
  fetchImplementation: GraphFetch = fetch,
  now = new Date(),
): Promise<{ id: string; expiresAt: Date }> {
  const response = await fetchImplementation(
    `${GRAPH_ORIGIN}/subscriptions/${encodeURIComponent(subscriptionId)}`,
    {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        expirationDateTime: getInboxSubscriptionExpiration(now).toISOString(),
      }),
    },
  );

  if (!response.ok) {
    throw await readGraphError(response);
  }

  const body = await response.json() as Record<string, unknown>;
  const expiresAt = new Date(
    readRequiredString(body.expirationDateTime, "expirationDateTime"),
  );

  if (Number.isNaN(expiresAt.getTime())) {
    throw new MicrosoftGraphError("Microsoft Graph response has an invalid expirationDateTime.");
  }

  return {
    id: readRequiredString(body.id, "subscription id"),
    expiresAt,
  };
}

export async function getGraphAccountEmail(
  accessToken: string,
  fetchImplementation: GraphFetch = fetch,
): Promise<string> {
  const response = await fetchImplementation(
    `${GRAPH_ORIGIN}/me?$select=mail,userPrincipalName`,
    { headers: { authorization: `Bearer ${accessToken}` } },
  );

  if (!response.ok) {
    throw await readGraphError(response);
  }

  const body = await response.json() as Record<string, unknown>;
  const email = typeof body.mail === "string" && body.mail
    ? body.mail
    : body.userPrincipalName;

  return readRequiredString(email, "mail or userPrincipalName").toLowerCase();
}

export type GraphInboxMessage = {
  id: string;
  subject: string;
  bodyPreview: string;
  body: string;
  bodyContentType: string;
  fromEmail: string;
  fromName: string | null;
  receivedAt: string | null;
};

export async function getGraphMessage(
  messageId: string,
  accessToken: string,
  fetchImplementation: GraphFetch = fetch,
): Promise<GraphInboxMessage> {
  const response = await fetchImplementation(
    `${GRAPH_ORIGIN}/me/messages/${encodeURIComponent(messageId)}?$select=id,subject,bodyPreview,body,from,receivedDateTime`,
    { headers: { authorization: `Bearer ${accessToken}` } },
  );

  if (!response.ok) {
    throw await readGraphError(response);
  }

  const payload = await response.json();
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new MicrosoftGraphError("Microsoft Graph message response is invalid.");
  }

  const body = payload as Record<string, unknown>;
  const messageBody = body.body;
  const from = body.from;
  if (!messageBody || typeof messageBody !== "object" || Array.isArray(messageBody)) {
    throw new MicrosoftGraphError("Microsoft Graph message response is missing body.");
  }
  if (!from || typeof from !== "object" || Array.isArray(from)) {
    throw new MicrosoftGraphError("Microsoft Graph message response is missing sender.");
  }

  const bodyRecord = messageBody as Record<string, unknown>;
  const fromRecord = from as Record<string, unknown>;
  const emailAddress = fromRecord.emailAddress;
  if (!emailAddress || typeof emailAddress !== "object" || Array.isArray(emailAddress)) {
    throw new MicrosoftGraphError("Microsoft Graph message response is missing sender address.");
  }

  const sender = emailAddress as Record<string, unknown>;
  const bodyContentType = readRequiredString(bodyRecord.contentType, "body content type");

  return {
    id: readRequiredString(body.id, "message id"),
    subject: typeof body.subject === "string" ? body.subject : "",
    bodyPreview: typeof body.bodyPreview === "string" ? body.bodyPreview : "",
    body: readRequiredString(bodyRecord.content, "body content"),
    bodyContentType,
    fromEmail: readRequiredString(sender.address, "sender address").toLowerCase(),
    fromName: typeof sender.name === "string" ? sender.name : null,
    receivedAt: typeof body.receivedDateTime === "string" ? body.receivedDateTime : null,
  };
}

export async function replyToGraphMessage(
  messageId: string,
  accessToken: string,
  comment: string,
  fetchImplementation: GraphFetch = fetch,
): Promise<void> {
  const response = await fetchImplementation(
    `${GRAPH_ORIGIN}/me/messages/${encodeURIComponent(messageId)}/reply`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ comment }),
    },
  );

  if (!response.ok) {
    throw await readGraphError(response);
  }
}
