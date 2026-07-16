import {
  ResendConfigError,
  readResendConfig,
} from "./resend-config";

export interface SupportEmailMessage {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

type Fetcher = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

export interface SupportEmailOptions {
  apiKey?: string;
  from?: string;
  fetcher?: Fetcher;
}

export class SupportEmailError extends Error {
  constructor(
    message: string,
    readonly status: 502 | 503,
  ) {
    super(message);
    this.name = "SupportEmailError";
  }
}

export async function deliverSupportEmail(
  message: SupportEmailMessage,
  options: SupportEmailOptions = {},
): Promise<void> {
  let apiKey: string;
  let from: string;
  try {
    ({ apiKey, from } = readResendConfig({
      RESEND_API_KEY: options.apiKey ?? process.env.RESEND_API_KEY,
      RESEND_FROM_EMAIL: options.from ?? process.env.RESEND_FROM_EMAIL,
    }));
  } catch (error) {
    if (error instanceof ResendConfigError) {
      throw new SupportEmailError(error.message, error.status);
    }
    throw error;
  }

  let response: Response;
  try {
    response = await (options.fetcher ?? fetch)(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from,
          to: message.to,
          subject: message.subject,
          html: message.html,
          ...(message.replyTo ? { reply_to: message.replyTo } : {}),
        }),
      },
    );
  } catch {
    throw new SupportEmailError("Email provider could not be reached", 502);
  }

  if (!response.ok) {
    throw new SupportEmailError("Email provider rejected the request", 502);
  }
}
